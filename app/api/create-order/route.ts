import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      email,
      items,
      shipping,
      subtotal,
      discount,
      total,
      couponCode,
      paymentIntentId,
    } = body as {
      userId: string;
      email: string;
      items: { product_id: string; product_name: string; quantity: number; price: number }[];
      shipping: {
        name: string;
        address: string;
        city: string;
        postal_code: string;
        country: string;
      };
      subtotal: number;
      discount: number;
      total: number;
      couponCode?: string;
      paymentIntentId?: string;
    };

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        email,
        status: 'confirmed',
        total,
        discount,
        coupon_code: couponCode ?? null,
        payment_status: 'paid',
        stripe_payment_intent_id: paymentIntentId ?? null,
        shipping_name: shipping.name,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_postal_code: shipping.postal_code,
        shipping_country: shipping.country,
      })
      .select('id')
      .maybeSingle<{ id: string }>();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    await supabase.from('order_items').insert(orderItems);

    // Create payment record
    await supabase.from('payments').insert({
      order_id: order.id,
      user_id: userId,
      amount: total,
      status: 'paid',
      payment_method: 'stripe',
      stripe_payment_intent_id: paymentIntentId ?? null,
    });

    // Clear cart
    await supabase.from('cart_items').delete().eq('user_id', userId);

    // Increment coupon usage
    if (couponCode) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('id, used_count')
        .eq('code', couponCode)
        .maybeSingle<{ id: string; used_count: number }>();
      if (coupon) {
        await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('id', coupon.id);
      }
    }

    // Send order confirmation email (fire and forget)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      await fetch(`${supabaseUrl}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          type: 'order_confirmation',
          email,
          name: shipping.name,
          orderData: {
            orderId: order.id,
            total,
            items: items.map((i: { product_name: string; quantity: number; price: number }) => ({
              product_name: i.product_name,
              quantity: i.quantity,
              price: i.price,
            })),
          },
        }),
      });
    } catch {}

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Order creation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
