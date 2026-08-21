'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowUpRight, ShoppingBag, Tag, X, Heart, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import type { CartItem, Product, Coupon } from '@/lib/types';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { getProductImage } from '@/lib/images';

type CartRow = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: Product;
};

export default function CartPage() {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<CartRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setFetching(false);
      return;
    }
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .returns<CartRow[]>();
    setItems(data ?? []);
    setFetching(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1) return;
    setUpdating(id);
    await supabase.from('cart_items').update({ quantity: qty }).eq('id', id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
    setUpdating(null);
  };

  const removeItem = async (id: string) => {
    await supabase.from('cart_items').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const applyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('active', true)
      .maybeSingle<Coupon>();

    setCouponLoading(false);

    if (error || !data) {
      setCouponError('Invalid coupon code.');
      return;
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponError('This coupon has expired.');
      return;
    }
    if (data.max_uses && data.used_count >= data.max_uses) {
      setCouponError('This coupon has reached its usage limit.');
      return;
    }
    if (subtotal < data.min_order) {
      setCouponError(`Minimum order of $${(data.min_order / 100).toFixed(2)} required.`);
      return;
    }
    setAppliedCoupon(data);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.round((subtotal * appliedCoupon.discount_value) / 100)
      : appliedCoupon.discount_value
    : 0;
  const total = Math.max(0, subtotal - discount);

  if (loading || fetching) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm font-light text-muted-foreground">Loading your cart...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <h1 className="mt-6 font-display text-4xl text-foreground md:text-5xl">Your cart is waiting</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">Sign in to view and checkout your items.</p>
          <Link href="/signin?redirect=/cart" className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Sign In
          </Link>
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          <h1 className="mt-6 font-display text-4xl text-foreground md:text-5xl">Your cart is empty</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">Explore our collection of single-origin and reserve coffees.</p>
          <Link href="/shop" className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Shop Coffees
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 pt-24 lg:px-10">
        <h1 className="font-display text-[clamp(2rem,4vw,4rem)] leading-tight text-foreground">Your Cart</h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-4 rounded-sm border border-border bg-card p-4"
              >
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-background"
                >
                  {item.product.image_url && (
                    <img
                      src={getProductImage(item.product.slug, item.product.image_url)}
                      alt={item.product.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                    />
                  )}
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/shop/${item.product.slug}`} className="font-display text-xl text-foreground hover:text-primary">
                      {item.product.name}
                    </Link>
                    <p className="text-xs font-light text-muted-foreground">
                      {item.product.origin} · {item.product.weight}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-sm border border-border">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium text-foreground">
                        {updating === item.id ? '...' : item.quantity}
                      </span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">
                        ${((item.product.price * item.quantity) / 100).toFixed(2)}
                      </span>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground transition-colors hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-sm border border-border bg-card p-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Summary</h2>

              {/* Coupon */}
              <div className="mt-4 border-b border-border pb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-sm border border-primary/30 bg-primary/10 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium text-primary">{appliedCoupon.code}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && <p className="mt-2 text-xs text-destructive">{couponError}</p>}
              </div>

              <div className="mt-4 space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span className="font-light text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">${(subtotal / 100).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="font-light text-primary">Discount</span>
                    <span className="font-medium text-primary">-${(discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="font-light text-muted-foreground">Shipping</span>
                  <span className="font-light text-muted-foreground">Calculated at checkout</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-lg font-medium text-foreground">${(total / 100).toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                className="group mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90"
              >
                Proceed to Checkout
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <p className="mt-3 text-center text-xs font-light text-muted-foreground">
                Roasted to order within 48 hours.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
