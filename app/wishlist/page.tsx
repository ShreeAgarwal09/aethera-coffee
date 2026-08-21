'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowUpRight, Trash2 } from 'lucide-react';
import { useWishlist } from '@/contexts/wishlist-context';
import { useAuth } from '@/contexts/auth-context';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { getProductImage } from '@/lib/images';

export default function WishlistPage() {
  const { user, loading } = useAuth();
  const { items, loading: wishlistLoading, remove, moveToCart } = useWishlist();
  const [moving, setMoving] = useState<string | null>(null);

  if (loading || wishlistLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm font-light text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24">
          <Heart className="h-12 w-12 text-muted-foreground" />
          <h1 className="mt-6 font-display text-4xl text-foreground md:text-5xl">Your wishlist awaits</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">Sign in to save your favourite coffees.</p>
          <Link href="/signin?redirect=/wishlist" className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
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
          <Heart className="h-12 w-12 text-muted-foreground" />
          <h1 className="mt-6 font-display text-4xl text-foreground md:text-5xl">Your wishlist is empty</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">Save coffees you love by tapping the heart icon.</p>
          <Link href="/shop" className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Discover Coffees
          </Link>
        </div>
      </>
    );
  }

  const handleMoveToCart = async (productId: string) => {
    setMoving(productId);
    await moveToCart(productId);
    setMoving(null);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-12 pt-24 lg:px-10">
        <h1 className="font-display text-[clamp(2rem,4vw,4rem)] leading-tight text-foreground">Your Wishlist</h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          {items.length} saved {items.length === 1 ? 'coffee' : 'coffees'}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <div className="group relative">
                <Link href={`/shop/${item.product.slug}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card">
                    {item.product.image_url && (
                      <img
                        src={getProductImage(item.product.slug, item.product.image_url)}
                        alt={item.product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary">{item.product.origin}</span>
                      <h3 className="mt-1 font-display text-2xl text-foreground">{item.product.name}</h3>
                      <span className="mt-2 inline-block text-sm font-medium text-foreground">
                        ${(item.product.price / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(item.product_id)}
                    disabled={moving === item.product_id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary py-2.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    {moving === item.product_id ? 'Moving...' : 'Move to Cart'}
                  </button>
                  <button
                    onClick={() => remove(item.product_id)}
                    className="flex items-center justify-center rounded-sm border border-border px-3 text-muted-foreground transition-colors hover:text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
