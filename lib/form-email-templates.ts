/**
 * Email templates for form submission notifications
 */

interface AdminNotificationData {
  formTitle: string
  formSlug: string
  submissionData: Record<string, unknown>
  submittedAt: string
  ip?: string
}

interface UserConfirmationData {
  formTitle: string
  userName?: string
}

/**
 * Generate admin notification email HTML
 */
export function getFormSubmissionEmailTemplate(data: AdminNotificationData): string {
  const { formTitle, formSlug, submissionData, submittedAt, ip } = data

  // Format submission data as HTML table rows
  const dataRows = Object.entries(submissionData)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      // Clean up field ID to readable label
      const label = key
        .replace(/^field_\d+_\w+$/, key)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())

      let displayValue: string
      if (Array.isArray(value)) {
        displayValue = value.join(', ')
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value, null, 2)
      } else {
        displayValue = String(value)
      }

      return `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; font-weight: 500; color: #374151; width: 35%; vertical-align: top;">${label}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #E5E7EB; color: #1F2937; white-space: pre-wrap;">${displayValue}</td>
        </tr>
      `
    })
    .join('')

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); border-radius: 12px 12px 0 0; padding: 32px;">
          <tr>
            <td align="center">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">New Form Submission</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">${formTitle}</p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #FFFFFF; border-radius: 0 0 12px 12px; padding: 0;">
          <tr>
            <td style="padding: 24px;">
              <!-- Meta info -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #F9FAFB; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">
                      <strong>Submitted:</strong> ${submittedAt}
                    </p>
                    <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 14px;">
                      <strong>Form:</strong> ${formSlug}
                    </p>
                    ${ip ? `<p style="margin: 0; color: #6B7280; font-size: 14px;"><strong>IP:</strong> ${ip}</p>` : ''}
                  </td>
                </tr>
              </table>

              <!-- Submission Data -->
              <h2 style="margin: 0 0 16px 0; color: #1F2937; font-size: 18px; font-weight: 600;">Response Details</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
                ${dataRows || '<tr><td style="padding: 16px; color: #6B7280;">No data submitted</td></tr>'}
              </table>

              <!-- Action Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://makeuslive.com/admin/forms" style="display: inline-block; padding: 12px 24px; background: #2563EB; color: #FFFFFF; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">View All Submissions</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                This email was sent automatically by MakeUsLive Form System
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * Generate user confirmation email HTML (optional - for thanking the submitter)
 */
export function getFormUserConfirmationTemplate(data: UserConfirmationData): string {
  const { formTitle, userName } = data
  const greeting = userName ? `Hi ${userName}` : 'Hello'

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border-radius: 12px 12px 0 0; padding: 32px;">
          <tr>
            <td align="center">
              <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 32px;">✓</span>
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700;">Submission Received!</h1>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #FFFFFF; border-radius: 0 0 12px 12px;">
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; color: #1F2937; font-size: 16px; line-height: 1.6;">
                ${greeting},
              </p>
              <p style="margin: 0 0 16px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                Thank you for submitting the <strong>"${formTitle}"</strong> form. We have received your response and will get back to you soon if needed.
              </p>
              <p style="margin: 0 0 24px 0; color: #4B5563; font-size: 16px; line-height: 1.6;">
                If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:hello@makeuslive.com" style="color: #D4AF37; text-decoration: none;">hello@makeuslive.com</a>.
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top: 1px solid #E5E7EB; padding-top: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #6B7280; font-size: 14px;">Best regards,</p>
                    <p style="margin: 4px 0 0 0; color: #1F2937; font-size: 14px; font-weight: 500;">The MakeUsLive Team</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 24px;">
          <tr>
            <td align="center">
              <p style="margin: 0 0 8px 0; color: #9CA3AF; font-size: 12px;">
                <a href="https://makeuslive.com" style="color: #6B7280; text-decoration: none;">makeuslive.com</a>
              </p>
              <p style="margin: 0; color: #9CA3AF; font-size: 11px;">
                You received this email because you submitted a form on our website.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
