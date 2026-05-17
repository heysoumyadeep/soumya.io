import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

function escape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { slug, title, feedback, email } = body;

  if (!feedback?.trim() || feedback.trim().length < 5) {
    return NextResponse.json({ error: 'Feedback is too short.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const safeTitle = escape(title || slug || 'Unknown post');
  const safeSlug = escape(slug || '');
  const safeFeedback = escape(feedback.trim()).replace(/\n/g, '<br/>');
  const safeEmail = email ? escape(email.trim()) : null;

  try {
    await resend.emails.send({
      from: 'soumya.io <contact@soumya.io>',
      to: 'contact@soumya.io',
      replyTo: safeEmail || 'contact@soumya.io',
      subject: `Blog feedback on "${title || slug}"`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1c031b;color:#fdf6f0;border-radius:12px;">
          <h2 style="color:#ee4540;margin-top:0;">Blog post feedback</h2>
          <p><strong>Post:</strong> <a href="https://soumya.io/blog/${safeSlug}" style="color:#ee4540;">${safeTitle}</a></p>
          ${safeEmail ? `<p><strong>From:</strong> <a href="mailto:${safeEmail}" style="color:#ee4540;">${safeEmail}</a></p>` : '<p><em style="color:#a07890;">Anonymous feedback</em></p>'}
          <hr style="border-color:#3a0a2a;margin:16px 0;"/>
          <p style="white-space:pre-wrap;line-height:1.7;">${safeFeedback}</p>
          ${safeEmail ? `<a href="mailto:${safeEmail}?subject=Re: Your feedback on soumya.io"
            style="display:inline-block;margin-top:20px;padding:12px 24px;background:#c72c41;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
            Reply
          </a>` : ''}
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[feedback] Resend error:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Failed to send. Please try again.' },
      { status: 500 },
    );
  }
}
