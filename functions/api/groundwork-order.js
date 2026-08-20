// GroundWork Report order endpoint — brianward.com
//
// Flow: order form POSTs here → spam gate (honeypot, HMAC form token,
// Turnstile when configured) → order email to Brian via Resend → a Square
// payment link is created for THIS order via the Square Checkout API (the
// property address rides on the checkout name and payment note, so the
// payment matches the order without guesswork) → the visitor is redirected
// straight to Square's hosted payment page → after paying, Square returns
// them to /groundwork-thanks.
//
// Degrades gracefully: if Square is unreachable or unconfigured, the order
// email still goes out (marked PAYMENT LINK FAILED) and the visitor sees a
// "we'll email your payment link" message instead of an error.
//
// Env: SQUARE_ACCESS_TOKEN (required for checkout), SQUARE_LOCATION_ID
// (optional — first ACTIVE location is used otherwise), SQUARE_ENV=sandbox
// (optional), RESEND_API_KEY, RESEND_FROM, RESEND_TO, FORM_SECRET,
// TURNSTILE_SECRET_KEY[, _2], GROUNDWORK_FEE (dollars, default 99).

const DEFAULT_SOURCE = "brianward.com";
const DEFAULT_FROM = "Brian Ward Appraisal <contact@brianward.com>";
const DEFAULT_TO = "contact@brianward.com";
const SQUARE_VERSION = "2025-01-23";

const ALLOWED_RETURN_HOSTS = [
  "brianward.com", "www.brianward.com",
];

// ---------------------------------------------------------------- utilities
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function formSecret(env) {
  return env.FORM_SECRET || env.RESEND_API_KEY || "fallback-secret";
}

async function verifyToken(token, env) {
  if (!token || typeof token !== "string") return { valid: false, dwellMs: null };
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, dwellMs: null };
  const [ts, nonce, sig] = parts;
  const expected = await hmac(formSecret(env), `${ts}.${nonce}`);
  if (sig !== expected) return { valid: false, dwellMs: null };
  const age = Date.now() - Number(ts);
  if (!(age >= 0 && age < 7200000)) return { valid: false, dwellMs: age };
  return { valid: true, dwellMs: age };
}

async function verifyTurnstile(token, ip, env) {
  const secrets = [env.TURNSTILE_SECRET_KEY, env.TURNSTILE_SECRET_KEY_2].filter(Boolean);
  if (!secrets.length) return "unconfigured";
  if (!token) return "failed";
  for (const secret of secrets) {
    try {
      const body = new FormData();
      body.append("secret", secret);
      body.append("response", token);
      if (ip) body.append("remoteip", ip);
      const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",
        { method: "POST", body });
      const d = await r.json();
      if (d.success) return "passed";
    } catch (e) {
      console.error("Turnstile verify error:", e.message);
      return "unconfigured";
    }
  }
  return "failed";
}

function returnUrl(request, path) {
  const candidate = request.headers.get("Origin") || request.headers.get("Referer") || "";
  try {
    const u = new URL(candidate);
    if (ALLOWED_RETURN_HOSTS.includes(u.hostname)) return `${u.origin}${path}`;
  } catch (e) { /* fall through */ }
  return new URL(path, request.url).toString();
}

async function sendMail(env, payload) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ------------------------------------------------------------------- Square
async function squareBase(env) {
  return env.SQUARE_ENV === "sandbox"
    ? "https://connect.squareupsandbox.com"
    : "https://connect.squareup.com";
}

async function createPaymentLink(env, { itemName, note, buyerEmail, redirect, amountCents }) {
  const token = env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN not configured");
  const base = await squareBase(env);
  const headers = {
    Authorization: `Bearer ${token}`,
    "Square-Version": SQUARE_VERSION,
    "Content-Type": "application/json",
  };

  let locationId = env.SQUARE_LOCATION_ID;
  if (!locationId) {
    const lr = await fetch(`${base}/v2/locations`, { headers });
    if (!lr.ok) throw new Error(`Square locations: ${await lr.text()}`);
    const ld = await lr.json();
    const active = (ld.locations || []).find(l => l.status === "ACTIVE");
    if (!active) throw new Error("no ACTIVE Square location");
    locationId = active.id;
  }

  const body = {
    idempotency_key: crypto.randomUUID(),
    quick_pay: {
      name: itemName.slice(0, 255),
      price_money: { amount: amountCents, currency: "USD" },
      location_id: locationId,
    },
    checkout_options: {
      redirect_url: redirect,
      ask_for_shipping_address: false,
      allow_tipping: false,
    },
    pre_populated_data: buyerEmail ? { buyer_email: buyerEmail } : undefined,
    payment_note: note.slice(0, 500),
  };

  const r = await fetch(`${base}/v2/online-checkout/payment-links`, {
    method: "POST", headers, body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Square payment link: ${await r.text()}`);
  const d = await r.json();
  return {
    url: d.payment_link && (d.payment_link.long_url || d.payment_link.url),
    linkId: d.payment_link && d.payment_link.id,
    orderId: d.payment_link && d.payment_link.order_id,
    locationId,
  };
}

// ------------------------------------------------------------------ handler
export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();

  const name = (formData.get("name") || "").trim();
  const email = (formData.get("email") || "").trim();
  const phone = (formData.get("phone") || "").trim();
  const street = (formData.get("street-address") || "").trim();
  const city = (formData.get("city") || "").trim();
  const zipcode = (formData.get("zipcode") || "").trim();
  const purpose = (formData.get("purpose") || "").trim();
  const effectiveDate = (formData.get("effective-date") || "").trim();
  const message = (formData.get("message") || "").trim();
  const honeypot = formData.get("website") || formData.get("company_url") || formData.get("fax") || "";

  let source = formData.get("source") || "";
  if (!source) {
    try {
      source = new URL(request.headers.get("Origin") || request.headers.get("Referer") || "")
        .hostname.replace(/^www\./, "") || DEFAULT_SOURCE;
    } catch (e) { source = DEFAULT_SOURCE; }
  }

  // Rule: no address, no product. Street AND (city or zip) are hard requirements.
  if (!name || !email || !street || !(city || zipcode)) {
    return Response.redirect(returnUrl(request, "/groundwork-report?status=error"), 303);
  }

  const fullAddress = [street, city, zipcode ? `CA ${zipcode}` : "CA"].filter(Boolean).join(", ");

  // ---- spam gate (compact version of the contact endpoint's defence)
  const turnstile = await verifyTurnstile(
    formData.get("cf-turnstile-response"),
    request.headers.get("CF-Connecting-IP"), env
  );
  const { valid: tokenValid, dwellMs } = await verifyToken(formData.get("form_token"), env);

  let score = 0;
  if (honeypot) score += 100;
  if (turnstile === "failed") score += 60;
  if (turnstile === "passed") score -= 40;
  if (!tokenValid && turnstile !== "passed" && turnstile !== "failed") score += 40;
  if (dwellMs != null && dwellMs < 3000) score += 40;
  if (/[Ѐ-ӿ؀-ۿ一-鿿]/.test([name, email, street, city, message].join(" "))) score += 50;
  if (/https?:\/\//i.test(message)) score += 30;

  if (score >= 90) {
    console.log(JSON.stringify({ blocked: true, endpoint: "groundwork-order", source, name, email, score }));
    // The bot sees a soft success; nothing is sent, no checkout is created.
    return Response.redirect(returnUrl(request, "/groundwork-report?status=pending"), 303);
  }
  const flagged = score >= 50;

  // ---- Square checkout for THIS order
  const fee = Number(env.GROUNDWORK_FEE || env.PRE_APPRAISAL_FEE || 99);
  let pay = null, payErr = null;
  try {
    pay = await createPaymentLink(env, {
      itemName: `GroundWork Report — ${fullAddress}`,
      note: `GroundWork Report — ${fullAddress}`,
      buyerEmail: email,
      redirect: returnUrl(request, "/groundwork-thanks"),
      amountCents: Math.round(fee * 100),
    });
  } catch (err) {
    payErr = err.message;
    console.error("Square checkout failed:", err.message);
  }

  // ---- order email to Brian
  const lines = [
    `GroundWork Report Order${flagged ? " [POSSIBLE SPAM]" : ""}`,
    "",
    `SUBMITTED FROM WEBSITE: ${source}`,
    flagged ? `FLAGGED (score ${score})` : "",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Property Address: ${fullAddress}`,
    `Purpose: ${purpose || "Not stated"}`,
    `Effective/valuation date: ${effectiveDate || "Current date"}`,
    `Message: ${message || "None"}`,
    "",
    `Fee: $${fee}`,
    pay
      ? `Square payment link: ${pay.url}\nPayment link id: ${pay.linkId}\nSquare order id: ${pay.orderId}\nLocation: ${pay.locationId}\nStatus: client redirected to checkout`
      : `PAYMENT LINK FAILED: ${payErr}\nStatus: NO checkout was started — send the client a payment link manually.`,
  ].filter(l => l !== "");
  const emailBody = lines.join("\n");

  const row = (k, v, alt) =>
    `<tr${alt ? ' style="background:#f5f5f5;"' : ""}><td style="padding:6px 12px;font-weight:bold;">${k}</td><td style="padding:6px 12px;">${v}</td></tr>`;
  const htmlBody = `
<h2>GroundWork Report Order</h2>
${flagged ? `<p style="font-size:14px;background:#fbe9e7;border:1px solid #d32f2f;color:#c62828;padding:10px 14px;border-radius:4px;">Possible spam (score ${score}) — delivered for your judgment.</p>` : ""}
<p style="font-size:15px;background:#1a5276;color:#fff;padding:10px 14px;border-radius:4px;">Submitted from: <strong>${escapeHtml(source)}</strong> · $${fee} GroundWork Report</p>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;">
${row("Name", escapeHtml(name), true)}
${row("Email", `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`)}
${row("Phone", escapeHtml(phone || "Not provided"), true)}
${row("Property Address", escapeHtml(fullAddress))}
${row("Purpose", escapeHtml(purpose || "Not stated"), true)}
${row("Effective date", escapeHtml(effectiveDate || "Current date"))}
${row("Message", escapeHtml(message || "None"), true)}
${pay
  ? row("Payment", `<a href="${escapeHtml(pay.url)}">Square checkout created</a> — link ${escapeHtml(pay.linkId || "")}, order ${escapeHtml(pay.orderId || "")}`)
  : row("Payment", `<strong style="color:#c62828;">FAILED to create checkout:</strong> ${escapeHtml(payErr || "unknown")}`)}
</table>`.trim();

  const fromAddress = env.RESEND_FROM || DEFAULT_FROM;
  try {
    await sendMail(env, {
      from: fromAddress,
      to: [env.RESEND_TO || DEFAULT_TO],
      reply_to: email,
      subject: `${flagged ? "[POSSIBLE SPAM] " : ""}[${source}] GroundWork Report Order – ${name}`,
      text: emailBody,
      html: htmlBody,
    });
  } catch (err) {
    console.error("Resend error:", err.message);
    // If BOTH the email and the checkout failed, surface a real error.
    if (!pay) return Response.redirect(returnUrl(request, "/groundwork-report?status=error"), 303);
  }

  // ---- confirmation to the client (clean submissions only), with the
  // payment link so an interrupted checkout can be finished later.
  if (!flagged && pay) {
    try {
      await sendMail(env, {
        from: fromAddress,
        to: [email],
        reply_to: "brian@brianward.com",
        subject: `Your GroundWork Report order — ${fullAddress}`,
        text: [
          `Hi ${name},`,
          "",
          `Thank you for ordering a GroundWork Report for ${fullAddress}.`,
          "",
          "You should be on the secure Square payment page now. If the payment",
          "didn't finish, you can complete it any time here:",
          pay.url,
          "",
          "Once payment is received, your report is prepared and delivered to",
          "this email address, typically within 1-2 business days.",
          "",
          "The GroundWork Report is a $99 market data report - not an appraisal",
          "and not an opinion of value. The full $99 is credited toward a",
          "Desktop Appraisal ($449) or Standard Appraisal ($699) if you upgrade.",
          "",
          "Questions? Just reply to this email or call (858) 242-8200.",
          "",
          "Brian Ward Appraisal",
        ].join("\n"),
      });
    } catch (err) {
      console.error("Client confirmation failed (order still received):", err.message);
    }
  }

  if (pay) return Response.redirect(pay.url, 303);
  return Response.redirect(returnUrl(request, "/groundwork-report?status=pending"), 303);
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get("Origin") || "";
  let allow = "https://www.brianward.com";
  try {
    const u = new URL(origin);
    if (ALLOWED_RETURN_HOSTS.includes(u.hostname)) allow = u.origin;
  } catch (e) { /* default */ }
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": allow,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
