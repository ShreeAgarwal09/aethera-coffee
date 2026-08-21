/*
# Aethera Coffee — Core E-commerce Schema

1. Overview
This migration creates the foundational schema for the Aethera luxury coffee e-commerce platform.
It includes user profiles, product categories, products, a shopping cart, orders, and order line items.
Public catalog data (categories, products) is readable by everyone (anon + authenticated) so the
storefront renders for guests. Cart and orders are owner-scoped to the authenticated user.

2. New Tables
- `profiles` — extends auth.users with customer details (full name, phone).
- `categories` — coffee categories (e.g. Single Origin, Blends, Decaf).
- `products` — sellable coffee products with editorial metadata (origin, roast, tasting notes).
- `cart_items` — per-user shopping cart entries.
- `orders` — customer orders with status and totals.
- `order_items` — line items belonging to an order.

3. Security (RLS)
- `profiles`: owner-scoped CRUD (authenticated only).
- `categories`: public read (anon + authenticated), no writes from the client.
- `products`: public read (anon + authenticated), no writes from the client.
- `cart_items`: owner-scoped CRUD (authenticated only).
- `orders`: owner-scoped SELECT/INSERT (authenticated only).
- `order_items`: owner-scoped SELECT via parent order ownership (authenticated only).

4. Seed Data
- 4 categories and 8 featured coffee products are seeded so the storefront has content immediately.
*/

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price integer NOT NULL, -- stored in cents
  compare_at_price integer,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  origin text,
  roast_level text,
  tasting_notes text,
  weight text,
  stock integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);

-- ============================================================
-- cart_items
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cart" ON cart_items;
CREATE POLICY "select_own_cart" ON cart_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cart" ON cart_items;
CREATE POLICY "insert_own_cart" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cart" ON cart_items;
CREATE POLICY "update_own_cart" ON cart_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cart" ON cart_items;
CREATE POLICY "delete_own_cart" ON cart_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  total integer NOT NULL, -- cents
  shipping_name text,
  shipping_address text,
  shipping_city text,
  shipping_postal_code text,
  shipping_country text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

-- ============================================================
-- order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price integer NOT NULL, -- cents at time of purchase
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_order_items" ON order_items;
CREATE POLICY "select_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);

-- ============================================================
-- Seed: categories
-- ============================================================
INSERT INTO categories (name, slug, description) VALUES
  ('Single Origin', 'single-origin', 'Single-origin coffees sourced from a single estate, capturing the purest expression of their terroir.'),
  ('Signature Blends', 'signature-blends', 'House-crafted blends engineered for balance, depth, and a persistent, lingering finish.'),
  ('Reserve', 'reserve', 'Limited micro-lot releases — rare cultivars, small batches, numbered and signed.'),
  ('Decaf', 'decaf', 'Swiss-water processed decaffeination that preserves the full aromatic complexity of the bean.')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Seed: products
-- ============================================================
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, origin, roast_level, tasting_notes, weight, stock, featured) VALUES
  ('Highland Mist', 'highland-mist',
   'A misty Ethiopian highland micro-lot, hand-picked above 2,100 metres. Bright, floral, and impossibly delicate — the coffee that taught us what elevation tastes like.',
   3200, 3600, (SELECT id FROM categories WHERE slug='single-origin'),
   'https://images.pexels.com/photos/4109743/pexels-photo-4109743.jpeg',
   'Yirgacheffe, Ethiopia', 'Light',
   'Jasmine, bergamot, white peach, honey', '250g', 80, true),
  ('Volcán Negro', 'volcan-negro',
   'Volcanic soil, shadow-grown, slow-ripened. A Guatemalan single origin with a dark, syrupy body and a smoky, cocoa-driven finish.',
   3400, NULL, (SELECT id FROM categories WHERE slug='single-origin'),
   'https://images.pexels.com/photos/3010/pexels-photo-3010.jpeg',
   'Antigua, Guatemala', 'Dark',
   'Dark chocolate, toasted hazelnut, brown sugar, smoke', '250g', 60, true),
  ('Aurora Blend', 'aurora-blend',
   'Our signature house blend. Three origins, one purpose: a luminous cup that opens with citrus, settles into caramel, and finishes clean.',
   2800, NULL, (SELECT id FROM categories WHERE slug='signature-blends'),
   'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
   'Multi-origin', 'Medium',
   'Orange zest, caramel, milk chocolate, almond', '250g', 120, true),
  ('Midnight Reserve', 'midnight-reserve',
   'A numbered micro-lot from the Geisha cultivar. 200 tins worldwide. Each is hand-numbered and sealed at the estate.',
   7800, NULL, (SELECT id FROM categories WHERE slug='reserve'),
   'https://images.pexels.com/photos/9052895/pexels-photo-9052895.jpeg',
   'Boquete, Panama', 'Medium-Light',
   'Bergamot, jasmine, lychee, cane sugar', '200g', 24, true),
  ('Coastal Decaf', 'coastal-decaf',
   'Swiss-water processed Colombian beans that retain their full character. A decaf that drinks like the real thing — sweet, rounded, never hollow.',
   2600, NULL, (SELECT id FROM categories WHERE slug='decaf'),
   'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg',
   'Huila, Colombia', 'Medium',
   'Milk chocolate, red apple, brown sugar', '250g', 90, true),
  ('Solstice Blend', 'solstice-blend',
   'A seasonal blend built for long mornings. Warm spice, baked fruit, and a body like cream — engineered for the slow pour.',
   2900, NULL, (SELECT id FROM categories WHERE slug='signature-blends'),
   'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg',
   'Multi-origin', 'Medium-Dark',
   'Cinnamon, baked apple, molasses, walnut', '250g', 100, false),
  ('Cerro Azul', 'cerro-azul',
   'A Colombian single origin from the Cerro Azul estate. Winemaking precision applied to coffee — structured, juicy, and luminous.',
   3600, NULL, (SELECT id FROM categories WHERE slug='single-origin'),
   'https://images.pexels.com/photos/4846436/pexels-photo-4846436.jpeg',
   'Cauca, Colombia', 'Light',
   'Red grape, plum, cane sugar, black tea', '250g', 50, false),
  ('Eclipse Reserve', 'eclipse-reserve',
   'A natural-process micro-lot from the highlands of Yemen. Deep, wild, and ancient — fermented in the cherry for an untamed, fermented-fruit intensity.',
   9200, NULL, (SELECT id FROM categories WHERE slug='reserve'),
   'https://images.pexels.com/photos/5814968/pexels-photo-5814968.jpeg',
   'Haraaz, Yemen', 'Medium',
   'Blueberry, wine, dark chocolate, date', '200g', 18, false)
ON CONFLICT (slug) DO NOTHING;
