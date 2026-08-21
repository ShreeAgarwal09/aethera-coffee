'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Package, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import type { Order, OrderItem } from '@/lib/types';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const { user } = useAuth();
  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data: orderData } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .maybeSingle<Order>();

      if (!orderData) {
        setLoading(false);
        return;
      }

      const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId)
        .returns<OrderItem[]>();

      setOrder({ ...orderData, items: items ?? [] });
      setLoading(false);
    })();
  }, [orderId, user]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm font-light text-muted-foreground">Loading your order...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-12 pt-24 lg:px-10">
        {/* Success animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10"
          >
            <Check className="h-10 w-10 text-primary" />
          </motion.div>

          <h1 className="mt-8 font-display text-4xl text-foreground md:text-5xl">
            Order Confirmed
          </h1>
          <p className="mt-4 text-sm font-light text-muted-foreground">
            Thank you for your order. Your coffee will be roasted to order and dispatched within 48 hours.
          </p>
          {order && (
            <p className="mt-2 text-xs font-light text-muted-foreground">
              Order #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </motion.div>

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 rounded-sm border border-border bg-card p-6"
          >
            <h2 className="flex items-center gap-2 font-serif text-2xl text-foreground">
              <Package className="h-5 w-5 text-primary" />
              Order Details
            </h2>

            <div className="mt-6 space-y-3 border-b border-border pb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="font-light text-foreground">{item.quantity}× {item.product_name}</span>
                  <span className="font-medium text-foreground">${((item.price * item.quantity) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="font-light text-primary">Discount</span>
                  <span className="font-medium text-primary">-${(order.discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm font-medium text-foreground">Total Paid</span>
                <span className="text-lg font-medium text-foreground">${(order.total / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping info */}
            <div className="mt-6 border-t border-border pt-6">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipping To</p>
              <p className="mt-2 text-sm text-foreground">{order.shipping_name}</p>
              <p className="text-xs font-light text-muted-foreground">
                {order.shipping_address}, {order.shipping_city}, {order.shipping_postal_code}, {order.shipping_country}
              </p>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                {order.status}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Payment: {order.payment_status}
              </span>
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/shop" className="group inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90">
            Continue Shopping
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link href="/account" className="inline-flex items-center justify-center rounded-sm border border-border px-6 py-3 text-sm font-light text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30">
            View Order History
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-sm text-muted-foreground">Loading...</p></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
