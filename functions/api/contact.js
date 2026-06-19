export async function onRequestPost(context) {
  const { request, env } = context;

  // Parse form data
  const formData = await request.formData();
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const phone = formData.get("phone") || "";
  const streetAddress = formData.get("street-address") || "";
  const city = formData.get("city") || "";
  const zipcode = formData.get("zipcode") || "";
  const appraisalPurpose = formData.get("appraisal-purpose") || "";
  const appraisalType = formData.get("appraisal-type") || "";
  const message = formData.get("message") || "";
  const source = formData.get("source") || "brianward.com";

  // Build full address
  const fullAddress = [streetAddress, city, zipcode].filter(Boolean).join(", ");

  // Validate required fields
  if (!name || !email || !appraisalPurpose) {
    return Response.redirect(new URL("/contact?status=error", request.url), 303);
  }

  // Build email body
  const emailBody = `
New Appraisal Inquiry

Source: ${source}
Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Property Address: ${fullAddress || "Not provided"}
Appraisal Purpose: ${appraisalPurpose}
Appraisal Type: ${appraisalType || "Not selected"}
Message: ${message || "None"}
  `.trim();

  const htmlBody = `
<h2>New Appraisal Inquiry</h2>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;">
  <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Source</td><td style="padding:6px 12px;">${escapeHtml(source)}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${escapeHtml(name)}</td></tr>
  <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${escapeHtml(phone || "Not provided")}</td></tr>
  <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Property Address</td><td style="padding:6px 12px;">${escapeHtml(fullAddress || "Not provided")}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Appraisal Purpose</td><td style="padding:6px 12px;">${escapeHtml(appraisalPurpose)}</td></tr>
  <tr style="background:#f5f5f5;"><td style="padding:6px 12px;font-weight:bold;">Appraisal Type</td><td style="padding:6px 12px;">${escapeHtml(appraisalType || "Not selected")}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Message</td><td style="padding:6px 12px;">${escapeHtml(message || "None")}</td></tr>
</table>
  `.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.RESEND_FROM || "Brian Ward Appraisal <noreply@brianward.com>",
        to: [env.RESEND_TO || "contact@brianward.com"],
        reply_to: email,
        subject: `[${source}] New Appraisal Inquiry – ${appraisalPurpose} – ${name}`,
        text: emailBody,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return Response.redirect(new URL("/contact?status=error", request.url), 303);
    }

    return Response.redirect(new URL("/contact?status=success", request.url), 303);
  } catch (err) {
    console.error("Send failed:", err);
    return Response.redirect(new URL("/contact?status=error", request.url), 303);
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
