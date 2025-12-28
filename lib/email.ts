import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
})

export interface EmailOptions {
    to: string | string[]
    subject: string
    html: string
    text?: string
}

// Send a single email
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `"MakeUsLive" <${process.env.SMTP_FROM || 'team@makeuslive.com'}>`,
            to: Array.isArray(to) ? to.join(', ') : to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''),
        })
        console.log('Email sent:', info.messageId)
        return { success: true, messageId: info.messageId }
    } catch (error) {
        console.error('Failed to send email:', error)
        return { success: false, error }
    }
}

// Email Templates
export const emailTemplates = {
    // Welcome email for new subscribers
    welcome: (email: string) => ({
        subject: 'Welcome to MakeUsLive Newsletter 🚀',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
            <td align="center" style="padding-bottom: 30px;">
                <h1 style="color: #D4AF37; font-size: 28px; margin: 0; font-weight: bold;">MakeUsLive</h1>
            </td>
        </tr>
        <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a14 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">Welcome to the crew! 🎉</h2>
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Thanks for subscribing to the MakeUsLive newsletter. You've just joined a community of creators, founders, and tech enthusiasts who care about building things that matter.
                </p>
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Here's what you can expect from us:
                </p>
                <ul style="color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                    <li>Insights on AI, web development, and design</li>
                    <li>Behind-the-scenes of projects we're building</li>
                    <li>Tips and resources for digital products</li>
                    <li>Early access to our tools and updates</li>
                </ul>
                <a href="https://makeuslive.com/blog" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%); color: #030014; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                    Read Our Latest Posts →
                </a>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding-top: 30px;">
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 0;">
                    You received this email because you subscribed at makeuslive.com
                </p>
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 10px 0 0 0;">
                    © 2025 MakeUsLive • Bhopal, India
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    }),

    // Newsletter broadcast template
    newsletter: (content: { title: string; preheader: string; body: string; ctaText?: string; ctaUrl?: string }) => ({
        subject: content.title,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <span style="display: none; max-height: 0; overflow: hidden;">${content.preheader}</span>
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
            <td align="center" style="padding-bottom: 30px;">
                <a href="https://makeuslive.com" style="text-decoration: none;">
                    <h1 style="color: #D4AF37; font-size: 28px; margin: 0; font-weight: bold;">MakeUsLive</h1>
                </a>
            </td>
        </tr>
        <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a14 100%); border-radius: 16px; padding: 40px; border: 1px solid rgba(212, 175, 55, 0.2);">
                <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">${content.title}</h2>
                <div style="color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.8;">
                    ${content.body}
                </div>
                ${content.ctaText && content.ctaUrl ? `
                <div style="margin-top: 30px;">
                    <a href="${content.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%); color: #030014; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                        ${content.ctaText} →
                    </a>
                </div>
                ` : ''}
            </td>
        </tr>
        <tr>
            <td align="center" style="padding-top: 30px;">
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 0;">
                    You're receiving this because you subscribed to MakeUsLive updates.
                </p>
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 10px 0 0 0;">
                    © 2025 MakeUsLive • Bhopal, India
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    }),

    // New blog post notification
    newBlogPost: (post: { title: string; excerpt: string; slug: string; featuredImage?: string }) => ({
        subject: `New Post: ${post.title}`,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #030014; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <tr>
            <td align="center" style="padding-bottom: 30px;">
                <a href="https://makeuslive.com" style="text-decoration: none;">
                    <h1 style="color: #D4AF37; font-size: 28px; margin: 0; font-weight: bold;">MakeUsLive</h1>
                </a>
            </td>
        </tr>
        <tr>
            <td style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a14 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(212, 175, 55, 0.2);">
                ${post.featuredImage ? `
                <img src="${post.featuredImage}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover;">
                ` : ''}
                <div style="padding: 30px;">
                    <span style="color: #D4AF37; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">New on the blog</span>
                    <h2 style="color: #ffffff; font-size: 24px; margin: 10px 0 15px 0;">${post.title}</h2>
                    <p style="color: rgba(255, 255, 255, 0.7); font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        ${post.excerpt}
                    </p>
                    <a href="https://makeuslive.com/blog/${post.slug}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%); color: #030014; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                        Read Article →
                    </a>
                </div>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding-top: 30px;">
                <p style="color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 0;">
                    You're receiving this because you subscribed to MakeUsLive updates.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    }),
}

// Helper to send welcome email
export async function sendWelcomeEmail(email: string) {
    const template = emailTemplates.welcome(email)
    return sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
    })
}

// Helper to broadcast newsletter to all subscribers
export async function broadcastNewsletter(
    subscribers: string[],
    content: { title: string; preheader: string; body: string; ctaText?: string; ctaUrl?: string }
) {
    const template = emailTemplates.newsletter(content)
    const results = []
    
    // Send in batches to avoid rate limits
    const batchSize = 50
    for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize)
        const promises = batch.map(email => 
            sendEmail({ to: email, subject: template.subject, html: template.html })
        )
        const batchResults = await Promise.allSettled(promises)
        results.push(...batchResults)
        
        // Small delay between batches
        if (i + batchSize < subscribers.length) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }
    
    return {
        total: subscribers.length,
        sent: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
    }
}

// Helper to notify subscribers of new blog post
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
