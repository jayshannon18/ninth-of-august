import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email, phone, projectType, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  let sent = false;
  let error = null;

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const toEmail = process.env.CONTACT_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

      const { error: sendError } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: `New Inquiry: ${projectType || 'General'} — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a;">
            <div style="font-size:20px;font-weight:700;margin-bottom:4px;font-family:Georgia,serif;">9th of August</div>
            <div style="color:#888;font-size:13px;margin-bottom:28px;">New Contact Form Submission</div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:12px 0;color:#555;font-size:14px;border-bottom:1px solid #eee;width:130px;">Name</td><td style="padding:12px 0;font-size:14px;border-bottom:1px solid #eee;font-weight:500;">${name}</td></tr>
              <tr><td style="padding:12px 0;color:#555;font-size:14px;border-bottom:1px solid #eee;">Email</td><td style="padding:12px 0;font-size:14px;border-bottom:1px solid #eee;"><a href="mailto:${email}" style="color:#1a1a1a;">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:12px 0;color:#555;font-size:14px;border-bottom:1px solid #eee;">Phone</td><td style="padding:12px 0;font-size:14px;border-bottom:1px solid #eee;">${phone}</td></tr>` : ''}
              <tr><td style="padding:12px 0;color:#555;font-size:14px;">Project Type</td><td style="padding:12px 0;font-size:14px;">${projectType || 'Not specified'}</td></tr>
            </table>
            <div style="font-size:14px;color:#555;margin-bottom:8px;">Message</div>
            <div style="padding:18px;background:#f8f8f6;border-radius:8px;font-size:14px;line-height:1.7;color:#333;">${message.replace(/\n/g, '<br>')}</div>
            <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#aaa;">Reply directly to this email to respond to ${name}.</div>
          </div>
        `,
      });

      if (sendError) {
        error = sendError.message;
      } else {
        sent = true;
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "We got your message — 9th of August",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a;">
              <div style="font-size:22px;font-weight:700;margin-bottom:4px;font-family:Georgia,serif;">9th of August</div>
              <div style="color:#888;font-size:13px;margin-bottom:32px;">Frisco, TX · Nationwide</div>
              <p style="font-size:16px;line-height:1.7;margin-bottom:16px;">Hi ${name},</p>
              <p style="font-size:16px;line-height:1.7;color:#444;margin-bottom:16px;">Thanks for reaching out. We've received your inquiry and will get back to you within 24 hours.</p>
              <p style="font-size:16px;line-height:1.7;color:#444;margin-bottom:32px;">In the meantime, feel free to use our instant pricing tool to get a custom quote for your project.</p>
              <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee;font-size:12px;color:#aaa;">9th of August · Frisco, TX · Professional Video Production & Photography</div>
            </div>
          `,
        });
      }
    } catch (err) {
      error = err.message;
    }
  } else {
    error = 'RESEND_API_KEY not configured';
  }

  return NextResponse.json({ sent, error });
}
