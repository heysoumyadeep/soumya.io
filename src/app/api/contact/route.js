import { Resend } from 'resend';
import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Read once at module load so we're not hitting the filesystem on every request.
const confirmationHtml = fs.readFileSync(
  path.join(process.cwd(), 'src/features/contact/email-template.html'),
  'utf8',
);

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

  const { name, email, message } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }
  if (message.trim().length < 10) {
    return NextResponse.json({ error: 'Message is too short.' }, { status: 400 });
  }

  const safeName = escape(name.trim());
  const safeEmail = escape(email.trim());
  const safeMessage = escape(message.trim()).replace(/\n/g, '<br/>');

  try {
    await Promise.all([
      // Notification to Soumyadeep
      resend.emails.send({
        from: 'soumya.io <contact@soumya.io>',
        to: 'contact@soumya.io',
        replyTo: email.trim(),
        subject: `New message from ${name.trim()} via soumya.io`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#1c031b;color:#fdf6f0;border-radius:12px;">
            <h2 style="color:#ee4540;margin-top:0;">New contact message</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color:#ee4540;">${safeEmail}</a></p>
            <hr style="border-color:#3a0a2a;margin:16px 0;"/>
            <p style="white-space:pre-wrap;line-height:1.7;">${safeMessage}</p>
            <a href="mailto:${safeEmail}?subject=Re: Your message on soumya.io"
              style="display:inline-block;margin-top:20px;padding:12px 24px;background:#c72c41;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
              Reply to ${safeName}
            </a>
          </div>
        `,
      }),
      // Confirmation to sender
      resend.emails.send({
        from: 'Soumyadeep Pradhan <contact@soumya.io>',
        to: email.trim(),
        subject: 'Heard you loud and clear 🔥',
        html: confirmationHtml,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Resend error:', err?.message ?? err);
    return NextResponse.json(
      { error: 'Failed to send. Please try again.' },
      { status: 500 },
    );
  }
}
