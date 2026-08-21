import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

type EmailRequest = {
  type: 'welcome' | 'order_confirmation' | 'password_reset' | 'newsletter_welcome';
  email: string;
  name?: string;
  orderData?: {
    orderId: string;
    total: number;
    items: { product_name: string; quantity: number; price: number }[];
  };
  resetLink?: string;
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json() as EmailRequest;
    const { type, email, name, orderData, resetLink } = body;

    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? '';
    const fromEmail = 'Aethera <orders@aethera.com>';

    let subject = '';
    let html = '';

    switch (type) {
      case 'welcome': {
        subject = 'Welcome to Aethera®';
        html = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1410; color: #ebe5d9; padding: 40px;">
            <h1 style="font-size: 32px; color: #d4a052; margin-bottom: 30px;">Aethera®</h1>
            <h2 style="font-size: 24px; margin-bottom: 20px;">Welcome${name ? `, ${name}` : ''}.</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #a8a09a; margin-bottom: 20px;">
              You've joined a circle of coffee enthusiasts who believe that every cup should be an experience.
              Explore our single-origin and reserve micro-lot coffees, each roasted to order within 48 hours of dispatch.
            </p>
            <a href="https://aethera.com/shop" style="display: inline-block; background: #d4a052; color: #1a1410; padding: 12px 32px; text-decoration: none; font-weight: 500; margin-top: 20px;">Explore the Collection</a>
            <p style="font-size: 14px; color: #6b6358; margin-top: 40px;">© Aethera®. The art of coffee, distilled.</p>
          </div>
        `;
        break;
      }
      case 'order_confirmation': {
        const itemsHtml = (orderData?.items ?? []).map((item) =>
          `<tr><td style="padding: 8px 0; color: #a8a09a;">${item.quantity}× ${item.product_name}</td><td style="padding: 8px 0; text-align: right; color: #a8a09a;">$${((item.price * item.quantity) / 100).toFixed(2)}</td></tr>`
        ).join('');
        subject = `Order Confirmed — #${orderData?.orderId.slice(0, 8) ?? ''}`;
        html = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1410; color: #ebe5d9; padding: 40px;">
            <h1 style="font-size: 32px; color: #d4a052; margin-bottom: 30px;">Aethera®</h1>
            <h2 style="font-size: 24px; margin-bottom: 20px;">Your order is confirmed${name ? `, ${name}` : ''}.</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #a8a09a; margin-bottom: 20px;">
              Thank you for your order. Your coffee will be roasted to order and dispatched within 48 hours.
              Order #${orderData?.orderId.slice(0, 8)}
            </p>
            <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
              ${itemsHtml}
              <tr style="border-top: 1px solid #3a3228;"><td style="padding: 12px 0; font-weight: 600; color: #ebe5d9;">Total</td><td style="padding: 12px 0; text-align: right; font-weight: 600; color: #d4a052;">$${((orderData?.total ?? 0) / 100).toFixed(2)}</td></tr>
            </table>
            <p style="font-size: 14px; color: #6b6358; margin-top: 40px;">© Aethera®. The art of coffee, distilled.</p>
          </div>
        `;
        break;
      }
      case 'password_reset': {
        subject = 'Reset your Aethera password';
        html = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1410; color: #ebe5d9; padding: 40px;">
            <h1 style="font-size: 32px; color: #d4a052; margin-bottom: 30px;">Aethera®</h1>
            <h2 style="font-size: 24px; margin-bottom: 20px;">Password reset request</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #a8a09a; margin-bottom: 20px;">
              We received a request to reset your password. Click the link below to set a new one.
              If you didn't make this request, you can safely ignore this email.
            </p>
            <a href="${resetLink ?? '#'}" style="display: inline-block; background: #d4a052; color: #1a1410; padding: 12px 32px; text-decoration: none; font-weight: 500; margin-top: 20px;">Reset Password</a>
            <p style="font-size: 14px; color: #6b6358; margin-top: 40px;">© Aethera®. The art of coffee, distilled.</p>
          </div>
        `;
        break;
      }
      case 'newsletter_welcome': {
        subject = 'Welcome to the Aethera circle';
        html = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #1a1410; color: #ebe5d9; padding: 40px;">
            <h1 style="font-size: 32px; color: #d4a052; margin-bottom: 30px;">Aethera®</h1>
            <h2 style="font-size: 24px; margin-bottom: 20px;">You're in.</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #a8a09a; margin-bottom: 20px;">
              You'll now receive early access to Reserve releases, brewing guides, and stories from the estates.
              Watch your inbox — we only write when we have something worth saying.
            </p>
            <a href="https://aethera.com/shop" style="display: inline-block; background: #d4a052; color: #1a1410; padding: 12px 32px; text-decoration: none; font-weight: 500; margin-top: 20px;">Shop Now</a>
            <p style="font-size: 14px; color: #6b6358; margin-top: 40px;">© Aethera®. The art of coffee, distilled.</p>
          </div>
        `;
        break;
      }
      default:
        return new Response(JSON.stringify({ error: 'Invalid email type' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // Send via Resend API
    if (resendApiKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject,
          html,
        }),
      });

      if (!resendResponse.ok) {
        const errText = await resendResponse.text();
        return new Response(JSON.stringify({ error: 'Failed to send email', details: errText }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email sending failed';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
