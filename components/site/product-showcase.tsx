'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';

export function ProductShowcase({ products }: { products: Product[] }) {
  const featured = products.slice(0, 4);

  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
              The Collection
            </span>
            <h2 className="mt-4 font-display text-4xl text-foreground sm:text-5xl md:text-6xl">
              Featured Origins
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
          >
            View all coffees
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/shop/${product.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card">
                  {product.image_url && (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url('${product.image_url}')` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  {product.compare_at_price && (
                    <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                      Limited
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary">
                      {product.origin}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-foreground">{product.name}</h3>
                    <p className="mt-1 text-xs font-light text-muted-foreground line-clamp-1">
                      {product.tasting_notes}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
