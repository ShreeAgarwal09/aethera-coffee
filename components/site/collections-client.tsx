'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Category, Product } from '@/lib/types';
import { IMAGES, COLLECTION_IMAGES, getProductImage } from '@/lib/images';

export function CollectionsClient({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">
          Curated Selections
        </span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-foreground">
          Collections
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm font-light text-muted-foreground text-pretty">
          Four expressions of our craft. Each collection is sourced, roasted, and delivered with a distinct intention.
        </p>
      </motion.div>

      <div className="space-y-24">
        {categories.map((cat, i) => {
          const catProducts = products.filter((p) => p.category_id === cat.id).slice(0, 3);
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                {/* Collection image */}
                <Link href={`/shop?category=${cat.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-sm bg-card">
                  <img
                    src={COLLECTION_IMAGES[cat.slug] ?? IMAGES.coffeeBag}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                    onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h2 className="font-display text-4xl text-foreground md:text-5xl">{cat.name}</h2>
                    <p className="mt-2 max-w-sm text-sm font-light text-muted-foreground text-pretty">{cat.description}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                      Explore Collection <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>

                {/* Products in collection */}
                <div className="flex flex-col justify-center">
                  <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">
                    {catProducts.length} Coffees
                  </span>
                  <div className="mt-6 space-y-4">
                    {catProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="group flex items-center gap-4 rounded-sm border border-border bg-card p-4 transition-colors hover:border-primary/30"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-background">
                          <img
                            src={getProductImage(product.slug, product.image_url)}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-display text-xl text-foreground group-hover:text-primary">{product.name}</h3>
                          <p className="text-xs font-light text-muted-foreground">{product.origin} · {product.roast_level}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">${(product.price / 100).toFixed(2)}</span>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
                  >
                    View all {cat.name}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
