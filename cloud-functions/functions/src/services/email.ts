import * as nodemailer from "nodemailer"
import { UserInvite } from "../types/inviteType";
import { config } from "../config";

export function createInviteLink(invite: UserInvite) {
  const domain = process.env.FUNCTIONS_EMULATOR === "true" ? "localhost:5173" : config.siteDomain.value()

  return `https://${domain}/register/${invite.id}`
}

export function inviteTemplate(invite: UserInvite) {
  const inviteLink = createInviteLink(invite);
  const expirationDays = config.inviteExpirationDays.value();
  const logoUrl = `https://${config.siteDomain.value()}/bcgw-logo.png`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f2f2;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="min-height: 100vh;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #05182a; padding: 32px 40px; text-align: center;">
              <img src="${logoUrl}" alt="BCGW Logo" width="80" height="80" style="display: block; margin: 0 auto 16px auto; border-radius: 50%;">
              <h1 style="margin: 0; color: #f5bb47; font-size: 22px; font-weight: 600; font-family: 'Montserrat', 'Segoe UI', sans-serif;">
                Breastfeeding Center for Greater Washington
              </h1>
              <p style="margin: 8px 0 0 0; color: #ffeac1; font-size: 14px;">
                Data Dashboard
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px 0; color: #05182a; font-size: 22px; font-weight: 600;">
                Welcome, ${invite.firstName}!
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #6d6d6d; font-size: 16px; line-height: 1.6;">
                You have been invited to create your <strong style="color: #0F4374;">${invite.role}</strong> account on the Breastfeeding Center for Greater Washington data dashboard.
              </p>
              
              <p style="margin: 0 0 30px 0; color: #6d6d6d; font-size: 16px; line-height: 1.6;">
                Click the button below to complete your registration and get started.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px auto;">
                <tr>
                  <td style="border-radius: 8px; background-color: #f5bb47;">
                    <a href="${inviteLink}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #05182a; text-decoration: none; font-size: 16px; font-weight: 600; letter-spacing: 0.5px;">
                      Create Your Account
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Link fallback -->
              <p style="margin: 0 0 12px 0; color: #6d6d6d; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px 0; padding: 12px 16px; background-color: #f2f2f2; border-radius: 6px; border: 1px solid #d9d9d9;">
                <a href="${inviteLink}" style="color: #0F4374; text-decoration: none; word-break: break-all; font-size: 14px;">
                  ${inviteLink}
                </a>
              </p>
              
              <!-- Expiration notice -->
              <table role="presentation" cellspacing="0" cellpadding="0" width="100%">
                <tr>
                  <td style="padding: 16px; background-color: #ffeac1; border-radius: 8px; border-left: 4px solid #f5bb47;">
                    <p style="margin: 0; color: #05182a; font-size: 14px;">
                      <strong>Please note:</strong> This invitation link will expire in <strong>${expirationDays} days</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #05182a; border-top: 3px solid #f5bb47;">
              <p style="margin: 0 0 8px 0; color: #d9d9d9; font-size: 14px; text-align: center;">
                If you did not expect this invitation, you can safely ignore this email.
              </p>
              <p style="margin: 0; color: #6d6d6d; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} Breastfeeding Center for Greater Washington. All rights reserved.
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
}

export async function sendTestEmail(from: string, to: string, subject: string, body: string) {
  const testAcct = await nodemailer.createTestAccount();

  console.log("Test account created:");
  console.log("  User: %s", testAcct.user);
  console.log("  Pass: %s", testAcct.pass);

  const transporter = nodemailer.createTransport({
    host: testAcct.smtp.host,
    port: testAcct.smtp.port,
    secure: testAcct.smtp.secure,
    auth: {
      user: testAcct.user,
      pass: testAcct.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"${from}" <${testAcct.user}>`,
    to: to,
    subject: subject,
    html: body,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview: %s", nodemailer.getTestMessageUrl(info));
}

