
// Basic styles for the email template
const styles = {
  container: `
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    color: #333333;
    line-height: 1.6;
  `,
  header: `
    background-color: #000000;
    padding: 30px 40px;
    text-align: center;
  `,
  logoText: `
    color: #D4AF37;
    font-size: 24px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
  `,
  body: `
    padding: 40px;
    background-color: #fafafa;
  `,
  heading: `
    color: #111111;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
  `,
  goldDivider: `
    width: 50px;
    height: 3px;
    background-color: #D4AF37;
    margin: 0 auto 30px;
  `,
  text: `
    font-size: 16px;
    color: #555555;
    margin-bottom: 20px;
  `,
  card: `
    background-color: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `,
  label: `
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    color: #999999;
    letter-spacing: 1px;
    margin-bottom: 5px;
    font-weight: 600;
  `,
  value: `
    display: block;
    font-size: 16px;
    color: #111111;
    margin-bottom: 15px;
    word-break: break-word;
  `,
  footer: `
    background-color: #000000;
    padding: 30px;
    text-align: center;
    color: #666666;
    font-size: 12px;
  `,
  footerLink: `
    color: #D4AF37;
    text-decoration: none;
  `
}

export function getAdminEmailTemplate(data: {
  name: string
  email: string
  phone?: string
  website?: string
  message: string
  ip: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Submission</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="${styles.container}">
          <!-- Header -->
          <div style="${styles.header}">
            <h1 style="${styles.logoText}">MakeUsLive</h1>
          </div>

          <!-- Body -->
          <div style="${styles.body}">
            <h2 style="${styles.heading}">New Inquiry Received</h2>
            <div style="${styles.goldDivider}"></div>
            
            <p style="${styles.text}">
              A new contact form submission has been received from your website.
            </p>

            <div style="${styles.card}">
              <span style="${styles.label}">Name</span>
              <span style="${styles.value}">${data.name}</span>

              <span style="${styles.label}">Email</span>
              <a href="mailto:${data.email}" style="${styles.value}; color: #D4AF37; text-decoration: none;">${data.email}</a>

              ${data.phone ? `
                <span style="${styles.label}">Phone</span>
                <span style="${styles.value}">${data.phone}</span>
              ` : ''}

              ${data.website ? `
                <span style="${styles.label}">Website</span>
                <a href="${data.website}" target="_blank" style="${styles.value}; color: #D4AF37; text-decoration: none;">${data.website}</a>
              ` : ''}
            </div>

            <div style="${styles.card}">
              <span style="${styles.label}">Message Content</span>
              <p style="${styles.value}; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
            </div>
            
            <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
              Submitted from IP: ${data.ip} on ${new Date().toLocaleString()}
            </p>
          </div>

          <!-- Footer -->
          <div style="${styles.footer}">
            <p>&copy; ${new Date().getFullYear()} MakeUsLive. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function getUserConfirmationEmailTemplate(data: {
  name: string
  message: string
}) {
  const firstName = data.name.split(' ')[0]
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>We received your message</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="${styles.container}">
          <!-- Header -->
          <div style="${styles.header}">
            <h1 style="${styles.logoText}">MakeUsLive</h1>
          </div>

          <!-- Body -->
          <div style="${styles.body}">
            <h2 style="${styles.heading}">Thank You, ${firstName}</h2>
            <div style="${styles.goldDivider}"></div>
            
            <p style="${styles.text}">
              Thank you for reaching out to us. We have received your message and our team will review it shortly.
            </p>

            <p style="${styles.text}">
              Here is a copy of what you sent:
            </p>

            <div style="${styles.card}; border-left: 3px solid #D4AF37;">
              <p style="${styles.value}; white-space: pre-wrap; margin-bottom: 0;">${data.message}</p>
            </div>

            <p style="${styles.text}">
              We aim to respond to all inquiries within 24 hours.
            </p>

            <div style="text-align: center; margin-top: 40px;">
              <a href="https://makeuslive.com" style="display: inline-block; background-color: #000; color: #D4AF37; padding: 12px 25px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px;">Return to Website</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="${styles.footer}">
            <p>MakeUsLive Agency</p>
            <p style="margin-top: 10px;">
              <a href="https://makeuslive.com" style="${styles.footerLink}">www.makeuslive.com</a>
            </p>
            <p style="margin-top: 20px; opacity: 0.5;">
              This is an automated message. Please do not reply directly to this email.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}
