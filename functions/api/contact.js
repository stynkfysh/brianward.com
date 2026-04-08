export async function onRequestPost(context) {
  const { request, env } = context;

  // Parse form data
  const formData = await request.formData();
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const phone = formData.get("phone") || "";
  const propertyAddress = formData.get("property-address") || "";
  const appraisalType = formData.get("appraisal-type") || "";
  const message = formData.get("message") || "";

  // Validate required fields
  if (!name || !email || !appraisalType) {
    return Response.redirect(new URL("/contact.html?status=error", request.url), 303);
  }

  // Build email body
  const emailBody = `
New Appraisal Inquiry from brianward.com

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Property Address: ${propertyAddress || "Not provided"}
Appraisal Type: ${appraisalType}
Message: ${message || "None"}
  `.trim();

  const htmlBody = `
<h2>New Appraisal Inquiry</h2>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;">
  <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${escapeHtml(name)}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Phone</td><td style="padding:6px 12px;">${escapeHtml(phone || "Not provided")}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Property Address</td><td style="padding:6px 12px;">${escapeHtml(propertyAddress || "Not provided")}</td></tr>
  <tr><td style="padding:6px 12px;font-weight:bold;">Appraisal Type</td><td style="padding:6px 12px;">${escapeHtml(appraisalType)}</td></tr>
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
        subject: `New Appraisal Inquiry – ${appraisalType} – ${name}`,
        text: emailBody,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return Response.redirect(new URL("/contact.html?status=error", request.url), 303);
    }

    return Response.redirect(new URL("/contact.html?status=success", request.url), 303);
  } catch (err) {
    console.error("Send failed:", err);
    return Response.redirect(new URL("/contact.html?status=error", request.url), 303);
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
