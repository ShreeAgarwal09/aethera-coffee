'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Minus, Plus, Heart, Star, ArrowLeft } from 'lucide-react';
import type { Product, Review } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { useRouter } from 'next/navigation';
import { getProductImage } from '@/lib/images';

export function ProductDetailClient({
  product,
  relatedProducts,
  reviews,
}: {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { has, toggle } = useWishlist();
  const { addRecent } = useRecentlyViewed();
  const router = useRouter();

  // Track recently viewed
  useEffect(() => {
    addRecent(product.id);
  }, [product.id, addRecent]);

  const handleAddToCart = async () => {
    setError(null);
    if (!user) {
      router.push('/signin?redirect=' + encodeURIComponent(`/shop/${product.slug}`));
      return;
    }
    setAdding(true);
    const { error: upsertError } = await supabase
      .from('cart_items')
      .upsert(
        { product_id: product.id, quantity },
        { onConflict: 'user_id,product_id' }
      );
    setAdding(false);
    if (upsertError) {
      setError('Could not add to cart. Please try again.');
      return;
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleWishlist = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    toggle(product.id);
  };

  const notes = product.tasting_notes?.split(',').map((n) => n.trim()) ?? [];
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-square overflow-hidden rounded-sm bg-card"
        >
          <img
            src={getProductImage(product.slug, product.image_url)}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          {product.compare_at_price && (
            <span className="absolute left-6 top-6 rounded-full bg-primary px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
              Limited Edition
            </span>
          )}
          <button
            onClick={handleWishlist}
            className={`absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
              has(product.id)
                ? 'border-primary bg-primary/20 text-primary'
                : 'border-border bg-background/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className={`h-5 w-5 ${has(product.id) ? 'fill-primary' : ''}`} />
          </button>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">
            {product.origin}
          </span>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,5rem)] leading-tight text-foreground">
            {product.name}
          </h1>

          {/* Rating */}
          {reviews.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(avgRating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-light text-muted-foreground">
                {avgRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-medium text-foreground">
              ${(product.price / 100).toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="text-base font-light text-muted-foreground line-through">
                ${(product.compare_at_price / 100).toFixed(2)}
              </span>
            )}
            <span className="text-sm font-light text-muted-foreground">/ {product.weight}</span>
          </div>

          <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Specs */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-border py-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Roast</span>
              <p className="mt-1 text-sm text-foreground">{product.roast_level}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Weight</span>
              <p className="mt-1 text-sm text-foreground">{product.weight}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Origin</span>
              <p className="mt-1 text-sm text-foreground">{product.origin}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Stock</span>
              <p className="mt-1 text-sm text-foreground">
                {product.stock > 0 ? `${product.stock} tins` : 'Sold out'}
              </p>
            </div>
          </div>

          {/* Tasting notes */}
          {notes.length > 0 && (
            <div className="mt-6">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Tasting Notes
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {notes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-border px-4 py-1.5 text-xs font-light text-foreground"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-sm border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-12 w-12 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="group flex h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-8 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {added ? (
                <><Check className="h-4 w-4" /> Added to cart</>
              ) : adding ? (
                'Adding...'
              ) : product.stock === 0 ? (
                'Sold Out'
              ) : (
                <>Add to Cart <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>
              )}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          {!user && (
            <p className="mt-3 text-xs font-light text-muted-foreground">
              <Link href="/signin" className="text-primary hover:underline">Sign in</Link> to add items to your cart.
            </p>
          )}
        </motion.div>
      </div>

      {/* Reviews section */}
      {reviews.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-4xl text-foreground">Customer Reviews</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-sm border border-border bg-card p-5">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                {review.title && <h3 className="text-sm font-medium text-foreground">{review.title}</h3>}
                {review.comment && <p className="mt-2 text-xs font-light text-muted-foreground">{review.comment}</p>}
                <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-4xl text-foreground">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <Link key={rp.id} href={`/shop/${rp.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card">
                  <img
                    src={getProductImage(rp.slug, rp.image_url)}
                    alt={rp.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl text-foreground">{rp.name}</h3>
                    <span className="text-sm font-medium text-foreground">${(rp.price / 100).toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
