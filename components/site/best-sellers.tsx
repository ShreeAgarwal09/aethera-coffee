'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/site/product-card';

export function BestSellers({ products }: { products: Product[] }) {
  const featured = products.slice(0, 4);

  return (
    <section className="relative bg-card py-32 lg:py-40 grain">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="eyebrow">Most Loved</span>
            <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-foreground text-balance">
              Best <span className="italic" style={{ color: 'hsl(var(--gold-soft))' }}>Sellers</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="link-underline pb-1">View all coffees</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
