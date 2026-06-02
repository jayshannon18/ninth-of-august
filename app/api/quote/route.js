import { NextResponse } from 'next/server';

export async function POST(request) {
  const { shootType, mediaType, duration, location, email } = await request.json();

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `You are a pricing assistant for 9th of August, a professional photography & videography studio based in Frisco, Texas (near Dallas).

Client request:
- Shoot type: ${shootType}
- Services needed: ${mediaType}
- Duration: ${duration}
- Client location: ${location}

Pricing guidelines:
- Photography only: $1,000–$2,500 per full day (8 hrs). Scale proportionally for shorter shoots.
- Videography only: $1,200–$2,500 per full day. Scale proportionally.
- Both photo + video: sum the rates then apply a 10–15% bundle discount.
- 2 hrs ≈ 30% of day rate. 4 hrs ≈ 60%. 8 hrs = 100%. 2 days = 1.8× day rate. 3+ days = 2.5× day rate.
- Adjust within the range based on complexity: brand campaigns and music videos skew higher; portraits skew lower.

Travel policy (base: Frisco, TX — 33.15°N, 96.82°W):
- Within 50 miles of Frisco: free travel, travelFee = 0, travelFreeZone = true.
- 50–200 miles: driving. Estimate round-trip miles × $0.70. Add $180 hotel if drive is over 3 hrs one-way.
- 200+ miles: estimate round-trip flight ($300–600) + hotel $200/night (1 night per shoot day) + $80 ground transport.
- Always be specific about the distance from Frisco to the client city.

Return ONLY valid JSON with no markdown fences:
{"creativeFeeMin":number,"creativeFeeMax":number,"travelFee":number,"travelFreeZone":boolean,"travelNote":"one clear sentence about travel situation","totalMin":number,"totalMax":number,"turnaround":"e.g. 5–7 business days for edited photos"}`,
      }],
    }),
  });

  const anthropicData = await anthropicRes.json();
  const text = anthropicData.content?.find(b => b.type === 'text')?.text || '{}';
  const quote = JSON.parse(text.replace(/```json|```/g, '').trim());

  let emailSent = false;
  let emailError = null;

  if (email && process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Your Custom Quote — 9th of August',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1a1a1a;">
            <div style="font-size:22px;font-weight:700;margin-bottom:4px;">9th of August</div>
            <div style="color:#888;font-size:13px;margin-bottom:32px;">Custom Quote · ${shootType} · ${duration}</div>
            <div style="font-size:40px;font-weight:300;margin-bottom:4px;font-family:Georgia,serif;">$${quote.totalMin?.toLocaleString()} – $${quote.totalMax?.toLocaleString()}</div>
            <div style="color:#888;font-size:13px;margin-bottom:32px;">Estimated total</div>
            <table style="width:100%;border-top:1px solid #eee;padding-top:20px;border-collapse:collapse;">
              <tr><td style="padding:12px 0;color:#555;font-size:14px;border-bottom:1px solid #f5f5f5;">Creative fee</td><td style="text-align:right;font-size:14px;border-bottom:1px solid #f5f5f5;">$${quote.creativeFeeMin?.toLocaleString()} – $${quote.creativeFeeMax?.toLocaleString()}</td></tr>
              <tr><td style="padding:12px 0;color:#555;font-size:14px;">Travel</td><td style="text-align:right;font-size:14px;">${quote.travelFreeZone ? 'No charge' : '$' + quote.travelFee?.toLocaleString()}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#f8f8f6;border-radius:8px;font-size:13px;color:#666;line-height:1.6;">${quote.travelNote || ''}</div>
            <div style="margin-top:20px;font-size:13px;color:#888;">Turnaround: ${quote.turnaround || '5–7 business days'}</div>
            <div style="margin-top:40px;padding-top:24px;border-top:1px solid #eee;font-size:12px;color:#aaa;">Reply to this email to book or ask any questions.</div>
          </div>
        `,
      });
      if (error) {
        emailError = error.message;
      } else {
        emailSent = true;
      }
    } catch (err) {
      emailError = err.message;
    }
  } else if (!process.env.RESEND_API_KEY) {
    emailError = 'RESEND_API_KEY not configured';
  }

  return NextResponse.json({ ...quote, emailSent, emailError });
}
