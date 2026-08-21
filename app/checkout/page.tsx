'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Check, ChevronRight, CreditCard, MapPin, ShoppingBag, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import type { CartItem, Product, Address, Coupon } from '@/lib/types';
import { Navbar } from '@/components/site/navbar';

type CartRow = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: Product;
};

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? 'pk_test_placeholder';
const stripePromise = stripePublishableKey.startsWith('pk_') ? loadStripe(stripePublishableKey) : null;

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<CartRow[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [fetching, setFetching] = useState(true);
  const [step, setStep] = useState(1);

  // Shipping form
  const [shipping, setShipping] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'United States',
  });
  const [billingSame, setBillingSame] = useState(true);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Payment
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const fetchCart = useCallback(async () => {
    if (!user) {
      setFetching(false);
      return;
    }
    const [{ data: cartData }, { data: addrData }] = await Promise.all([
      supabase.from('cart_items').select('*, product:products(*)').eq('user_id', user.id).returns<CartRow[]>(),
      supabase.from('addresses').select('*').eq('user_id', user.id).returns<Address[]>(),
    ]);
    setItems(cartData ?? []);
    setAddresses(addrData ?? []);

    // Pre-fill from default address
    const defaultAddr = addrData?.find((a) => a.is_default);
    if (defaultAddr) {
      setShipping({
        name: defaultAddr.full_name,
        address: defaultAddr.address_line1,
        city: defaultAddr.city,
        postal_code: defaultAddr.postal_code,
        country: defaultAddr.country,
      });
    } else if (user.email) {
      setShipping((s) => ({ ...s, name: s.name || '' }));
    }

    setFetching(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? Math.round((subtotal * appliedCoupon.discount_value) / 100)
      : appliedCoupon.discount_value
    : 0;
  const shipping_cost = subtotal > 5000 ? 0 : 595;
  const total = Math.max(0, subtotal - discount) + shipping_cost;

  const applyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) return;
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('active', true)
      .maybeSingle<Coupon>();
    if (error || !data) { setCouponError('Invalid coupon code.'); return; }
    if (data.expires_at && new Date(data.expires_at) < new Date()) { setCouponError('Coupon expired.'); return; }
    if (data.max_uses && data.used_count >= data.max_uses) { setCouponError('Coupon usage limit reached.'); return; }
    if (subtotal < data.min_order) { setCouponError(`Minimum order $${(data.min_order / 100).toFixed(2)} required.`); return; }
    setAppliedCoupon(data);
  };

  const handlePayment = async () => {
    setPaymentError(null);
    setProcessing(true);

    try {
      // Create payment intent
      const piResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          email: user?.email,
          productName: `Aethera Order - ${items.length} items`,
        }),
      });

      if (!piResponse.ok) {
        const err = await piResponse.json();
        throw new Error(err.error ?? 'Payment failed');
      }

      const { clientSecret } = await piResponse.json();
      const paymentIntentId = clientSecret?.split('_secret')[0];

      // In a real Stripe integration, we'd confirm the card payment here.
      // Since we're using placeholder keys, we'll simulate a successful payment
      // and create the order directly.
      if (!stripePromise) {
        // Placeholder mode — simulate payment success
        await new Promise((r) => setTimeout(r, 1500));
      }

      // Create order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          items: items.map((i) => ({
            product_id: i.product_id,
            product_name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
          shipping,
          subtotal,
          discount,
          total,
          couponCode: appliedCoupon?.code,
          paymentIntentId,
        }),
      });

      if (!orderResponse.ok) {
        const err = await orderResponse.json();
        throw new Error(err.error ?? 'Order creation failed');
      }

      const { orderId } = await orderResponse.json();
      router.push(`/checkout/confirmation?order=${orderId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment processing failed';
      setPaymentError(message);
      setProcessing(false);
    }
  };

  if (loading || fetching) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
          <h1 className="mt-6 font-display text-3xl text-foreground">Sign in to checkout</h1>
          <Link href="/signin?redirect=/checkout" className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
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
          <h1 className="mt-6 font-display text-3xl text-foreground">Your cart is empty</h1>
          <Link href="/shop" className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Shop Coffees
          </Link>
        </div>
      </>
    );
  }

  const steps = [
    { num: 1, label: 'Shipping', icon: MapPin },
    { num: 2, label: 'Payment', icon: CreditCard },
    { num: 3, label: 'Review', icon: Check },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-12 pt-24 lg:px-10">
        <Link href="/cart" className="mb-8 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>

        <h1 className="font-display text-4xl text-foreground md:text-5xl">Checkout</h1>

        {/* Step indicator */}
        <div className="mt-8 flex items-center gap-4">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${step >= s.num ? 'border-primary bg-primary/10' : 'border-border'}`}>
                  {step > s.num ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
              </div>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-serif text-2xl text-foreground">Shipping Address</h2>

                  {addresses.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Saved Addresses</p>
                      {addresses.map((addr) => (
                        <button
                          key={addr.id}
                          onClick={() => setShipping({
                            name: addr.full_name,
                            address: addr.address_line1,
                            city: addr.city,
                            postal_code: addr.postal_code,
                            country: addr.country,
                          })}
                          className="block w-full rounded-sm border border-border bg-card p-4 text-left transition-colors hover:border-primary"
                        >
                          <p className="text-sm font-medium text-foreground">{addr.full_name}</p>
                          <p className="text-xs font-light text-muted-foreground">{addr.address_line1}, {addr.city}, {addr.postal_code}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <input type="text" value={shipping.name} onChange={(e) => setShipping({ ...shipping, name: e.target.value })} required
                      className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Address</label>
                    <input type="text" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required
                      className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">City</label>
                      <input type="text" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required
                        className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Postal Code</label>
                      <input type="text" value={shipping.postal_code} onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })} required
                        className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Country</label>
                    <input type="text" value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} required
                      className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                  </div>

                  <label className="flex items-center gap-2 text-sm font-light text-muted-foreground">
                    <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="accent-primary" />
                    Billing address same as shipping
                  </label>

                  <button
                    onClick={() => {
                      if (shipping.name && shipping.address && shipping.city && shipping.postal_code) setStep(2);
                    }}
                    disabled={!shipping.name || !shipping.address || !shipping.city || !shipping.postal_code}
                    className="w-full rounded-sm bg-primary py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-serif text-2xl text-foreground">Payment Details</h2>

                  {!stripePromise && (
                    <div className="rounded-sm border border-primary/30 bg-primary/10 p-4">
                      <p className="text-xs font-light text-foreground">
                        Demo mode: Stripe is configured with placeholder keys. Payment will be simulated — no real charge will be made.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Card Number</label>
                    <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242"
                      className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Expiry</label>
                      <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM/YY"
                        className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CVC</label>
                      <input type="text" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} placeholder="123"
                        className="mt-2 w-full rounded-sm border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                    </div>
                  </div>

                  {paymentError && <p className="text-sm text-destructive">{paymentError}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="rounded-sm border border-border px-6 py-3.5 text-sm font-light text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 rounded-sm bg-primary py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90">
                      Review Order
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-serif text-2xl text-foreground">Review Your Order</h2>

                  {/* Shipping summary */}
                  <div className="rounded-sm border border-border bg-card p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipping To</p>
                    <p className="mt-2 text-sm text-foreground">{shipping.name}</p>
                    <p className="text-xs font-light text-muted-foreground">{shipping.address}, {shipping.city}, {shipping.postal_code}, {shipping.country}</p>
                  </div>

                  {/* Items */}
                  <div className="rounded-sm border border-border bg-card p-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Items</p>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="font-light text-foreground">{item.quantity}× {item.product.name}</span>
                          <span className="font-medium text-foreground">${((item.product.price * item.quantity) / 100).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {paymentError && <p className="text-sm text-destructive">{paymentError}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} disabled={processing} className="rounded-sm border border-border px-6 py-3.5 text-sm font-light text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30 disabled:opacity-50">
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={processing}
                      className="group flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                    >
                      {processing ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                      ) : (
                        <>Pay ${(total / 100).toFixed(2)}</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-sm border border-border bg-card p-6">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Order Summary</h2>

              {/* Coupon */}
              <div className="mt-4 border-b border-border pb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-sm border border-primary/30 bg-primary/10 px-3 py-2">
                    <span className="text-xs font-medium text-primary">{appliedCoupon.code}</span>
                    <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-muted-foreground hover:text-destructive">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code"
                      className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary" />
                    <button onClick={applyCoupon} className="rounded-sm border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary">Apply</button>
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
                  <span className="font-light text-muted-foreground">{shipping_cost === 0 ? 'Free' : `$${(shipping_cost / 100).toFixed(2)}`}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-lg font-medium text-foreground">${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
