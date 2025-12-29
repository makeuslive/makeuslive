import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

// Test email endpoint - GET /api/test-email?to=your@email.com
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const to = searchParams.get('to')

    if (!to) {
      return NextResponse.json({ error: 'Missing "to" parameter' }, { status: 400 })
    }

    console.log('🧪 Testing email to:', to)

    const result = await sendEmail({
      to,
      subject: 'Test Email from MakeUsLive',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from MakeUsLive.</p>
        <p>If you received this, your email configuration is working correctly!</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `,
    })

    return NextResponse.json({
      success: result.success,
      messageId: result.messageId,
      mocked: (result as any).mocked,
      message: result.success ? 'Email sent successfully!' : 'Email failed to send',
      error: result.error ? String(result.error) : undefined,
    })
  } catch (error: any) {
    console.error('Test email error:', error)
    return NextResponse.json({
      error: 'Failed to send test email',
      details: error.message,
    }, { status: 500 })
  }
}
