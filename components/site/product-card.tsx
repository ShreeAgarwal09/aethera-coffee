'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Heart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useWishlist } from '@/contexts/wishlist-context';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { getProductImage } from '@/lib/images';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="group relative">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card">
            {/* Image with zoom */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={getProductImage(product.slug, product.image_url)}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
                loading="lazy"
                onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/15 to-transparent" />

            {/* Limited badge */}
            {product.compare_at_price && (
              <span className="absolute left-5 top-5 z-10 rounded-full border border-primary/30 bg-background/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                Limited
              </span>
            )}

            {/* Quick view overlay */}
            <div className="absolute inset-0 flex items-end justify-center bg-background/0 transition-all duration-500 group-hover:bg-background/20">
              <span className="mb-24 translate-y-4 text-xs font-medium uppercase tracking-[0.25em] text-primary opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                Quick View
              </span>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                {product.origin}
              </span>
              <h3 className="mt-2 font-display text-3xl text-foreground">{product.name}</h3>
              <p className="mt-1 text-sm font-light text-muted-foreground line-clamp-1">
                {product.tasting_notes}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-medium text-foreground">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  {product.compare_at_price && (
                    <span className="text-sm font-light text-muted-foreground line-through">
                      ${(product.compare_at_price / 100).toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Ring on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-primary/0 transition-all duration-500 group-hover:ring-primary/15" />
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            if (!user) { router.push('/signin'); return; }
            toggle(product.id);
          }}
          className={`absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-400 ${
            has(product.id)
              ? 'border-primary/40 bg-primary/20 text-primary'
              : 'border-foreground/10 bg-background/40 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground'
          }`}
          aria-label="Toggle wishlist"
        >
          <motion.div
            animate={has(product.id) ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Heart className={`h-4 w-4 ${has(product.id) ? 'fill-primary' : ''}`} />
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}
