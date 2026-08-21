'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export function StoryClient() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">
          Our Story
        </span>
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-foreground text-balance">
          We chase the altitude
          <br />
          where flavour lives.
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-base font-light leading-relaxed text-muted-foreground text-pretty">
          Aethera began with a single question: what if coffee were treated like fine wine?
          Sourced from a single estate, harvested at peak ripeness, roasted to order, and
          numbered by hand. Not a commodity. A craft.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative mt-16 aspect-[16/9] overflow-hidden rounded-sm"
      >
        <img
          src={IMAGES.plantation}
          alt="Coffee plantation"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
      </motion.div>

      <div className="mt-20 space-y-16">
        {[
          {
            year: '2019',
            title: 'The first trip.',
            body: 'Our founder travelled to the Yirgacheffe highlands and tasted a coffee that changed everything. Misty, floral, impossibly delicate — it tasted like elevation itself. Aethera was born on that mountainside.',
          },
          {
            year: '2021',
            title: 'The Reserve series.',
            body: 'We launched our numbered Reserve micro-lots: 200 tins per release, each hand-numbered and sealed at the estate. The first release sold out in 72 hours. We have not looked back.',
          },
          {
            year: '2024',
            title: 'Roasted to order.',
            body: 'We eliminated warehoused roasted coffee entirely. Every tin is now roasted within 48 hours of dispatch. Two days of patience for coffee at its absolute peak.',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 gap-6 border-l-2 border-primary/30 pl-8 md:grid-cols-4"
          >
            <span className="font-display text-3xl text-primary">{item.year}</span>
            <div className="md:col-span-3">
              <h3 className="font-display text-3xl text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground text-pretty">{item.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-24 border-t border-border pt-16 text-center"
      >
        <h2 className="font-display text-[clamp(2rem,4vw,4rem)] leading-tight text-foreground">
          Taste the difference.
        </h2>
        <Link
          href="/shop"
          className="group mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90"
        >
          Explore the Collection
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>
    </div>
  );
}
