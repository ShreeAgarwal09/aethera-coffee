'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { IMAGES } from '@/lib/images';

const posts = [
  { image: IMAGES.insta1, caption: 'Morning ritual' },
  { image: IMAGES.insta2, caption: 'Layered perfection' },
  { image: IMAGES.insta3, caption: 'Slow pour' },
  { image: IMAGES.insta4, caption: 'The extraction' },
  { image: IMAGES.insta5, caption: 'Latte art' },
  { image: IMAGES.insta6, caption: 'Golden hour' },
];

export function InstagramGallery() {
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
            <span className="eyebrow">@aethera.coffee</span>
            <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-foreground text-balance">
              Follow the <span className="italic" style={{ color: 'hsl(var(--gold-soft))' }}>ritual</span>
            </h2>
          </div>
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="link-underline pb-1">@aethera.coffee</span>
            <Instagram className="h-4 w-4" />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, i) => (
            <motion.a
              key={i}
              href="#"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-square overflow-hidden rounded-sm bg-background"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110"
                loading="lazy"
                onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-foreground" />
                <span className="mt-3 text-xs font-light text-muted-foreground">{post.caption}</span>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-primary/0 transition-all duration-500 group-hover:ring-primary/20" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
