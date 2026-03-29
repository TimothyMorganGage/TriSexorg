import nodemailer from "nodemailer";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

function createTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactMessage): Promise<{ success: boolean; error?: string }> {
  const transporter = createTransporter();

  if (!transporter) {
    console.error("[email] SMTP not configured — SMTP_USER/SMTP_PASS missing");
    return { success: false, error: "Email service not configured" };
  }

  if (!CONTACT_EMAIL) {
    console.error("[email] CONTACT_EMAIL env var not set");
    return { success: false, error: "Contact destination not configured" };
  }

  try {
    await transporter.sendMail({
      from: `"TriSex.org Contact Form" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `[TriSex.org] ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\n${data.message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="border-bottom:2px solid #000;padding-bottom:8px;">New Contact Inquiry</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;width:80px;">Name</td><td>${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;">Email</td><td>${escapeHtml(data.email)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;">Subject</td><td>${escapeHtml(data.subject)}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f5f5f5;border-radius:4px;">
            <strong>Message:</strong>
            <p style="white-space:pre-wrap;margin-top:8px;">${escapeHtml(data.message)}</p>
          </div>
          <p style="font-size:12px;color:#666;margin-top:16px;">Sent via TriSex.org contact form. Reply directly to respond to ${escapeHtml(data.name)}.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (err: any) {
    console.error("[email] Send failed:", err.message);
    return { success: false, error: err.message };
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
