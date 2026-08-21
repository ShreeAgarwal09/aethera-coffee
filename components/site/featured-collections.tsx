'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const collections = [
  {
    number: '01',
    title: 'Single Origin',
    description: 'Pure expressions of terroir from a single estate.',
    image: '/images/collections/single-origin.jpg',
    href: '/shop?category=single-origin',
    span: 'lg:col-span-7',
    aspect: 'aspect-[4/5]',
  },
  {
    number: '02',
    title: 'Reserve',
    description: 'Numbered micro-lots. Rare cultivars. Limited releases.',
    image: '/images/collections/reserve.jpg',
    href: '/shop?category=reserve',
    span: 'lg:col-span-5',
    aspect: 'aspect-[4/5]',
  },
  {
    number: '03',
    title: 'Signature Blends',
    description: 'House-crafted for balance, depth, and a lingering finish.',
    image: '/images/collections/signature-blends.jpg',
    href: '/shop?category=signature-blends',
    span: 'lg:col-span-5',
    aspect: 'aspect-[4/5]',
  },
  {
    number: '04',
    title: 'Decaf',
    description: 'Swiss Water processed. All the character, none of the caffeine.',
    image: '/images/collections/decaf.jpg',
    href: '/shop?category=decaf',
    span: 'lg:col-span-7',
    aspect: 'aspect-[4/5]',
  },
];

export function FeaturedCollections() {
  return (
    <section className="relative bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="eyebrow">Curated Selections</span>
            <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-foreground text-balance">
              Featured<br />
              <span className="italic" style={{ color: 'hsl(var(--gold-soft))' }}>Collections</span>
            </h2>
          </div>
          <p className="max-w-sm text-base font-light leading-relaxed text-muted-foreground text-pretty">
            Four expressions of our craft, each sourced and roasted with a distinct intention.
            Explore by character, by origin, or by ritual.
          </p>
        </motion.div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {collections.map((col, i) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: (i % 2) * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={col.span}
            >
              <Link href={col.href} className="group block">
                <div className={`relative ${col.aspect} overflow-hidden rounded-sm bg-card`}>
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src={col.image}
                      alt={col.title}
                      className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                      loading="lazy"
                      onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/15 to-transparent" />

                  {/* Number badge */}
                  <span className="absolute left-6 top-6 font-display text-2xl text-foreground/30">
                    {col.number}
                  </span>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="font-display text-4xl text-foreground lg:text-5xl">{col.title}</h3>
                    <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-muted-foreground text-pretty">
                      {col.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:gap-3">
                      Explore Collection
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>

                  {/* Hover border glow */}
                  <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-primary/0 transition-all duration-500 group-hover:ring-primary/20" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
