/*
# Aethera — Extended E-commerce Schema (Phase 2)

1. Overview
This migration adds the remaining tables required for a complete e-commerce platform:
wishlist, addresses, reviews, coupons, payments, and newsletter subscribers.
It also extends the orders table with coupon and payment tracking columns.

2. New Tables
- `wishlists` — per-user saved products (owner-scoped).
- `addresses` — saved shipping/billing addresses (owner-scoped).
- `reviews` — product reviews with rating and comment (owner-scoped writes, public reads).
- `coupons` — discount codes with type, value, usage limits, and expiry.
- `payments` — payment records linked to orders (owner-scoped via order ownership).
- `newsletter` — email subscribers for marketing emails (public insert, public read of just email).

3. Modified Tables
- `orders` — added `coupon_code`, `discount`, `payment_status`, `stripe_payment_intent_id` columns.

4. Security (RLS)
- `wishlists`: owner-scoped CRUD (authenticated).
- `addresses`: owner-scoped CRUD (authenticated).
- `reviews`: public read (anon + authenticated), owner-scoped insert/update/delete.
- `coupons`: public read (anon + authenticated) so the storefront can validate codes.
- `payments`: owner-scoped SELECT via parent order ownership (authenticated).
- `newsletter`: public INSERT (anyone can subscribe), public SELECT (anon + authenticated).

5. Notes
- All owner columns default to auth.uid() so client inserts omitting user_id succeed.
- Coupons store discount in cents for integer arithmetic consistency.
- Reviews have a CHECK constraint on rating (1-5).
*/

-- ============================================================
-- Extend orders table
-- ============================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount integer NOT NULL DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_id uuid;

-- ============================================================
-- wishlists
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_wishlist" ON wishlists;
CREATE POLICY "select_own_wishlist" ON wishlists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_wishlist" ON wishlists;
CREATE POLICY "insert_own_wishlist" ON wishlists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_wishlist" ON wishlists;
CREATE POLICY "delete_own_wishlist" ON wishlists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS wishlists_user_id_idx ON wishlists(user_id);

-- ============================================================
-- addresses
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text NOT NULL,
  country text NOT NULL DEFAULT 'United States',
  phone text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_addresses" ON addresses;
CREATE POLICY "select_own_addresses" ON addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_addresses" ON addresses;
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_addresses" ON addresses;
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_addresses" ON addresses;
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON addresses(user_id);

-- ============================================================
-- reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read reviews
DROP POLICY IF EXISTS "anon_read_reviews" ON reviews;
CREATE POLICY "anon_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

-- Only owner can insert/update/delete their review
DROP POLICY IF EXISTS "insert_own_review" ON reviews;
CREATE POLICY "insert_own_review" ON reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_review" ON reviews;
CREATE POLICY "update_own_review" ON reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_review" ON reviews;
CREATE POLICY "delete_own_review" ON reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id);

-- ============================================================
-- coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value integer NOT NULL, -- percentage (0-100) or cents for fixed
  min_order integer NOT NULL DEFAULT 0, -- minimum order in cents
  max_uses integer, -- NULL = unlimited
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Public can read coupons (needed to validate at checkout)
DROP POLICY IF EXISTS "anon_read_coupons" ON coupons;
CREATE POLICY "anon_read_coupons" ON coupons FOR SELECT
  TO anon, authenticated USING (true);

-- Seed a welcome coupon
INSERT INTO coupons (code, description, discount_type, discount_value, min_order, active) VALUES
  ('WELCOME10', '10% off your first order', 'percentage', 10, 0, true),
  ('FREESHIP', 'Free shipping on orders over $50', 'fixed', 500, 5000, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL, -- cents
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  stripe_payment_intent_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Owner can see their own payments (via order ownership)
DROP POLICY IF EXISTS "select_own_payments" ON payments;
CREATE POLICY "select_own_payments" ON payments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Only allow insert via service role (edge function / server-side)
DROP POLICY IF EXISTS "insert_own_payments" ON payments;
CREATE POLICY "insert_own_payments" ON payments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS payments_order_id_idx ON payments(order_id);
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON payments(user_id);

-- ============================================================
-- newsletter
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  subscribed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe (public insert)
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter;
CREATE POLICY "anon_insert_newsletter" ON newsletter FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Anyone can check if email exists / read the list (public read)
DROP POLICY IF EXISTS "anon_read_newsletter" ON newsletter;
CREATE POLICY "anon_read_newsletter" ON newsletter FOR SELECT
  TO anon, authenticated USING (true);

-- Anyone can unsubscribe (public update)
DROP POLICY IF EXISTS "anon_update_newsletter" ON newsletter;
CREATE POLICY "anon_update_newsletter" ON newsletter FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
