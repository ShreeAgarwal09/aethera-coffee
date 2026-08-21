'use client';

import { motion } from 'framer-motion';

export function Marquee() {
  const words = [
    'Single Origin',
    'Reserve Micro-Lots',
    'Roasted To Order',
    'Altitude Sourced',
    'Numbered & Signed',
    'Swiss Water Decaf',
    'Carbon Neutral',
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-card py-6 grain">
      <div className="flex">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex shrink-0 items-center gap-12 pr-12"
        >
          {[...words, ...words, ...words, ...words].map((word, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="font-display text-2xl italic whitespace-nowrap text-muted-foreground/70 md:text-3xl">
                {word}
              </span>
              <span className="text-primary/60 text-lg" style={{ color: 'hsl(38 78% 52% / 0.5)' }}>✦</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
