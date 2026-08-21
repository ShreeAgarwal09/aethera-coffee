import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, email, orderId, productName } = body as {
      amount: number;
      email?: string;
      orderId?: string;
      productName?: string;
    };

    if (!amount || amount < 50) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        orderId: orderId ?? '',
        productName: productName ?? 'Aethera Coffee Order',
      },
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment intent creation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
