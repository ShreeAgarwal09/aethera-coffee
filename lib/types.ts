export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  image_url: string | null;
  origin: string | null;
  roast_level: string | null;
  tasting_notes: string | null;
  weight: string | null;
  stock: number;
  featured: boolean;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product: Product;
};

export type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  shipping_name: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  email: string | null;
  created_at: string;
  coupon_code: string | null;
  discount: number;
  payment_status: string;
  stripe_payment_intent_id: string | null;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
};

export type Wishlist = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
};

export type Address = {
  id: string;
  user_id: string;
  full_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
};

export type Payment = {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
};

export type Newsletter = {
  id: string;
  email: string;
  name: string | null;
  subscribed: boolean;
  created_at: string;
};
