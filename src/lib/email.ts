import { Resend } from "resend";

interface ContactNotificationParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactNotificationEmail({
  name,
  email,
  message,
}: ContactNotificationParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      "⚠️ [Resend] RESEND_API_KEY belum disetel di environment variables. Notifikasi email dilewati."
    );
    return {
      success: false,
      skipped: true,
      error: "RESEND_API_KEY not configured",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const recipientEmail =
      process.env.NOTIFICATION_EMAIL || "ramadanrahmad1910@gmail.com";
    const fromSender =
      process.env.RESEND_FROM_EMAIL || "Portfolio Alert <onboarding@resend.dev>";

    const dateFormatted = new Intl.DateTimeFormat("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Jakarta",
    }).format(new Date());

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pesan Kontak Baru</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2e8f0;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 560px; background: linear-gradient(180deg, #111827 0%, #0d131f 100%); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(90deg, #06b6d4 0%, #6366f1 100%); padding: 24px 32px;">
              <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #ffffff; font-weight: 700;">Portfolio Notification</p>
              <h1 style="margin: 6px 0 0 0; font-size: 20px; font-weight: 800; color: #ffffff;">Ada Pesan Baru dari Formulir Kontak!</h1>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 32px;">
              
              <!-- Sender Info Card -->
              <table role="presentation" width="100%" style="background-color: rgba(15, 23, 42, 0.8); border: 1px solid #1e293b; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <table role="presentation" width="100%">
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; width: 100px; padding: 4px 0;">Pengirim:</td>
                        <td style="font-size: 14px; color: #f8fafc; font-weight: 600; padding: 4px 0;">${name}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; padding: 4px 0;">Email:</td>
                        <td style="font-size: 14px; color: #38bdf8; font-weight: 500; padding: 4px 0;">
                          <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; padding: 4px 0;">Waktu:</td>
                        <td style="font-size: 12px; color: #cbd5e1; padding: 4px 0;">${dateFormatted} WIB</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Block -->
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #06b6d4;">Isi Pesan:</p>
              <div style="background-color: #07090e; border-left: 3px solid #06b6d4; border-radius: 6px; padding: 16px; margin-bottom: 28px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${message}</p>
              </div>

              <!-- Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re:%20Pesan%20dari%20Portofolio%20Rahmad%20Ramadan" style="display: inline-block; background: linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);">
                      Balas Pesan via Email
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <a href="https://portorahmad.vercel.app/admin/messages" style="color: #94a3b8; font-size: 11px; text-decoration: underline;">
                      Buka Kotak Pesan di Dashboard Admin →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #1e293b; padding: 16px 32px; background-color: #07090e; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                Email otomatis dari sistem Portofolio Rahmad Ramadan &bull; Ditenagai oleh Resend API
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: fromSender,
      to: [recipientEmail],
      replyTo: email,
      subject: `🔔 Pesan Baru dari ${name} - Portofolio`,
      html: htmlContent,
    });

    if (error) {
      console.error("❌ [Resend] Gagal mengirim email:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ [Resend] Email notifikasi berhasil dikirim:", data?.id);
    return { success: true, data };
  } catch (err: any) {
    console.error("❌ [Resend] Exception saat kirim email:", err.message);
    return { success: false, error: err.message };
  }
}
