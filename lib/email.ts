import nodemailer from 'nodemailer'

// ============================================
// EMAIL CONFIGURATION
// ============================================
// GoDaddy SMTP: smtpout.secureserver.net:465 (SSL)
// Gmail SMTP: smtp.gmail.com:587 (TLS) - requires App Password

const createTransporter = () => {
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    
    if (!user || !pass) {
        console.warn('⚠️ Email: SMTP credentials not configured. Emails will be mocked.')
        return null
    }

    const host = process.env.SMTP_HOST || 'smtpout.secureserver.net'
    const port = parseInt(process.env.SMTP_PORT || '465')
    const secure = process.env.SMTP_SECURE !== 'false' // Default true for port 465

    console.log(`📧 Email: Configuring SMTP - ${host}:${port} (secure: ${secure}, user: ${user})`)

    return nodemailer.createTransport({
        host,
        port,
        secure, // true for 465 (SSL), false for 587 (TLS)
        auth: { user, pass },
        // GoDaddy and other providers may need these
        tls: {
            rejectUnauthorized: false, // Accept self-signed certs
            minVersion: 'TLSv1.2',
        },
        // Connection settings
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    })
}

// Lazy-loaded transporter
let transporter: nodemailer.Transporter | null = null
const getTransporter = () => {
    if (!transporter) {
        transporter = createTransporter()
    }
    return transporter
}

export interface EmailOptions {
    to: string | string[]
    subject: string
    html: string
    text?: string
    replyTo?: string
}

// ============================================
// SEND EMAIL
// ============================================
export async function sendEmail({ to, subject, html, text, replyTo }: EmailOptions) {
    const transport = getTransporter()
    
    if (!transport) {
        console.log('📧 Email (mock):', { to, subject })
        return { success: true, messageId: 'mock-' + Date.now(), mocked: true }
    }

    try {
        // Parse SMTP_FROM to extract email if it has format "Name <email@domain.com>"
        const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER || ''
        const fromEmail = smtpFrom.includes('<') 
            ? smtpFrom.match(/<(.+)>/)?.[1] || process.env.SMTP_USER
            : smtpFrom || process.env.SMTP_USER

        console.log('📧 Attempting to send email:', {
            from: fromEmail,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
        })

        const info = await transport.sendMail({
            from: `"MakeUsLive" <${fromEmail}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''),
            replyTo: replyTo || fromEmail,
        })
        
        console.log('✅ Email sent successfully!', {
            messageId: info.messageId,
            accepted: info.accepted,
            rejected: info.rejected,
            response: info.response,
        })
        
        return { success: true, messageId: info.messageId }
    } catch (error: any) {
        console.error('❌ Email sending failed!', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack,
        })
        return { success: false, error }
    }
}

// ============================================
// EMAIL TEMPLATES - Professional Dark Theme
// ============================================
const baseStyles = {
    body: 'margin: 0; padding: 0; background-color: #030014; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;',
    container: 'max-width: 600px; margin: 0 auto; padding: 40px 20px;',
    card: 'background: linear-gradient(135deg, #1a1a2e 0%, #0a0a14 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.2);',
    heading: 'color: #ffffff; font-size: 24px; margin: 0 0 20px 0; font-weight: bold;',
    text: 'color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.8; margin: 0 0 16px 0;',
    button: 'display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%); color: #030014; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px;',
    footer: 'color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 10px 0 0 0;',
    gold: '#D4AF37',
}

const emailWrapper = (content: string, preheader?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MakeUsLive</title>
</head>
<body style="${baseStyles.body}">
    ${preheader ? `<span style="display: none; max-height: 0; overflow: hidden;">${preheader}</span>` : ''}
    <table cellpadding="0" cellspacing="0" width="100%" style="${baseStyles.container}">
        <tr>
            <td align="center" style="padding-bottom: 30px;">
                <a href="https://www.makeuslive.com" style="text-decoration: none;">
                    <h1 style="color: ${baseStyles.gold}; font-size: 28px; margin: 0; font-weight: bold;">MakeUsLive</h1>
                </a>
            </td>
        </tr>
        <tr>
            <td style="${baseStyles.card}">
                ${content}
            </td>
        </tr>
        <tr>
            <td align="center" style="padding-top: 30px;">
                <p style="${baseStyles.footer}">
                    <a href="https://www.makeuslive.com" style="color: ${baseStyles.gold}; text-decoration: none;">Website</a> • 
                    <a href="https://twitter.com/makeuslivee" style="color: ${baseStyles.gold}; text-decoration: none;">Twitter</a> • 
                    <a href="https://linkedin.com/company/makeuslivee" style="color: ${baseStyles.gold}; text-decoration: none;">LinkedIn</a>
                </p>
                <p style="${baseStyles.footer}">
                    MakeUsLive • Bhopal, Madhya Pradesh 462001, India
                </p>
                <p style="${baseStyles.footer}">
                    © 2025 MakeUsLive. All rights reserved.
                </p>
                <p style="${baseStyles.footer}">
                    <a href="https://www.makeuslive.com/unsubscribe" style="color: rgba(255,255,255,0.3); text-decoration: underline;">Unsubscribe</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`

export const emailTemplates = {
    // ============================================
    // NEWSLETTER WELCOME
    // ============================================
    welcome: (email: string) => ({
        subject: 'Welcome to MakeUsLive Newsletter 🚀',
        html: emailWrapper(`
            <h2 style="${baseStyles.heading}">Welcome to the crew! 🎉</h2>
            <p style="${baseStyles.text}">
                Thanks for subscribing to the MakeUsLive newsletter. You've just joined a community of creators, founders, and tech enthusiasts who care about building things that matter.
            </p>
            <p style="${baseStyles.text}">Here's what you can expect:</p>
            <ul style="${baseStyles.text} padding-left: 20px; margin: 0 0 24px 0;">
                <li>Insights on AI, web development, and design</li>
                <li>Behind-the-scenes of projects we're building</li>
                <li>Tips and resources for digital products</li>
                <li>Early access to our tools and updates</li>
            </ul>
            <div style="margin-top: 24px;">
                <a href="https://www.makeuslive.com/blog" style="${baseStyles.button}">Read Our Latest Posts →</a>
            </div>
        `, 'Welcome to MakeUsLive! Here\'s what you can expect...'),
    }),

    // ============================================
    // NEWSLETTER BROADCAST
    // ============================================
    newsletter: (content: { title: string; preheader: string; body: string; ctaText?: string; ctaUrl?: string }) => ({
        subject: content.title,
        html: emailWrapper(`
            <h2 style="${baseStyles.heading}">${content.title}</h2>
            <div style="${baseStyles.text}">${content.body}</div>
            ${content.ctaText && content.ctaUrl ? `
            <div style="margin-top: 24px;">
                <a href="${content.ctaUrl}" style="${baseStyles.button}">${content.ctaText} →</a>
            </div>
            ` : ''}
        `, content.preheader),
    }),

    // ============================================
    // NEW BLOG POST
    // ============================================
    newBlogPost: (post: { title: string; excerpt: string; slug: string; featuredImage?: string }) => ({
        subject: `New Post: ${post.title}`,
        html: emailWrapper(`
            ${post.featuredImage ? `<img src="${post.featuredImage}" alt="${post.title}" style="width: 100%; border-radius: 8px; margin-bottom: 20px;">` : ''}
            <span style="color: ${baseStyles.gold}; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">New on the blog</span>
            <h2 style="${baseStyles.heading} margin-top: 8px;">${post.title}</h2>
            <p style="${baseStyles.text}">${post.excerpt}</p>
            <div style="margin-top: 24px;">
                <a href="https://www.makeuslive.com/blog/${post.slug}" style="${baseStyles.button}">Read Article →</a>
            </div>
        `, post.excerpt),
    }),

    // ============================================
    // CONTACT REPLY
    // ============================================
    contactReply: (data: { name: string; message: string; originalMessage?: string }) => ({
        subject: 'Message from MakeUsLive',
        html: emailWrapper(`
            <p style="${baseStyles.text}">Hi ${data.name || 'there'},</p>
            <div style="${baseStyles.text}">${data.message.replace(/\n/g, '<br>')}</div>
            ${data.originalMessage ? `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <p style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your original message:</p>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 14px; line-height: 1.6; margin: 0; font-style: italic;">${data.originalMessage}</p>
            </div>
            ` : ''}
            <p style="${baseStyles.text} margin-top: 24px;">Best,<br><strong style="color: #fff;">The MakeUsLive Team</strong></p>
        `, 'Reply from MakeUsLive'),
    }),

    // ============================================
    // NEW CONTACT NOTIFICATION (Internal)
    // ============================================
    contactNotification: (contact: { name: string; email: string; phone?: string; website?: string; message: string }) => ({
        subject: `🔔 New Contact: ${contact.name}`,
        html: emailWrapper(`
            <h2 style="${baseStyles.heading}">New Contact Submission</h2>
            <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td style="color: rgba(255,255,255,0.5); font-size: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">Name</td>
                        <td style="color: #fff; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${contact.name}</td>
                    </tr>
                    <tr>
                        <td style="color: rgba(255,255,255,0.5); font-size: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">Email</td>
                        <td style="color: ${baseStyles.gold}; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <a href="mailto:${contact.email}" style="color: ${baseStyles.gold};">${contact.email}</a>
                        </td>
                    </tr>
                    ${contact.phone ? `
                    <tr>
                        <td style="color: rgba(255,255,255,0.5); font-size: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">Phone</td>
                        <td style="color: #fff; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${contact.phone}</td>
                    </tr>
                    ` : ''}
                    ${contact.website ? `
                    <tr>
                        <td style="color: rgba(255,255,255,0.5); font-size: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">Website</td>
                        <td style="color: #fff; font-size: 14px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">${contact.website}</td>
                    </tr>
                    ` : ''}
                </table>
            </div>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin-bottom: 8px;">MESSAGE:</p>
            <p style="${baseStyles.text}">${contact.message.replace(/\n/g, '<br>')}</p>
            <div style="margin-top: 24px;">
                <a href="mailto:${contact.email}?subject=Re: Your inquiry to MakeUsLive" style="${baseStyles.button}">Reply to ${contact.name} →</a>
            </div>
        `, `New contact from ${contact.name}: ${contact.message.substring(0, 50)}...`),
    }),
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export async function sendWelcomeEmail(email: string) {
    const template = emailTemplates.welcome(email)
    return sendEmail({ to: email, subject: template.subject, html: template.html })
}

export async function sendContactReply(
    to: string,
    data: { name: string; message: string; originalMessage?: string }
) {
    const template = emailTemplates.contactReply(data)
    return sendEmail({ to, subject: template.subject, html: template.html })
}

export async function notifyNewContact(
    contact: { name: string; email: string; phone?: string; website?: string; message: string }
) {
    const template = emailTemplates.contactNotification(contact)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_FROM || 'team@makeuslive.com'
    return sendEmail({ to: adminEmail, subject: template.subject, html: template.html })
}

export async function broadcastNewsletter(
    subscribers: string[],
    content: { title: string; preheader: string; body: string; ctaText?: string; ctaUrl?: string }
) {
    const template = emailTemplates.newsletter(content)
    const results = []
    
    // Send in batches to avoid rate limits
    const batchSize = 10
    for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize)
        const promises = batch.map(email => 
            sendEmail({ to: email, subject: template.subject, html: template.html })
        )
        const batchResults = await Promise.allSettled(promises)
        results.push(...batchResults)
        
        // Delay between batches
        if (i + batchSize < subscribers.length) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }
    
    return {
        total: subscribers.length,
        sent: results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length,
        failed: results.filter(r => r.status === 'rejected' || !(r.value as any).success).length,
    }
}

export async function notifyNewBlogPost(
    subscribers: string[],
    post: { title: string; excerpt: string; slug: string; featuredImage?: string }
) {
    const template = emailTemplates.newBlogPost(post)
    return broadcastNewsletter(subscribers, {
        title: template.subject,
        preheader: post.excerpt,
        body: template.html,
    })
}
