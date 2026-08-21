'use client';

import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/images';

const panels = [
  {
    eyebrow: 'Sourcing',
    title: 'Altitude defines character.',
    body: 'We buy exclusively from estates above 1,800 metres. The thin air slows the cherry ripening, concentrating sugars and acids into a denser, more complex bean. Every lot is cup-scored before it earns the Aethera seal.',
    image: IMAGES.plantation,
  },
  {
    eyebrow: 'Roasting',
    title: 'Roasted to order, never to stock.',
    body: 'Each tin is roasted within 48 hours of dispatch. We refuse to warehouse roasted coffee — the flavour curve falls off a cliff after two weeks, and we will not ship a product past its peak.',
    image: IMAGES.roasting,
  },
  {
    eyebrow: 'Provenance',
    title: 'Numbered, signed, traced.',
    body: 'Every Reserve tin carries a hand-written lot number. Enter it online and you see the estate, the farmer, the harvest date, the cupping score, and the altitude. We believe luxury is transparency, not secrecy.',
    image: IMAGES.coffeeBag,
  },
];

export function Philosophy() {
  return (
    <section className="bg-background">
      {panels.map((panel, i) => (
        <div
          key={i}
          className={`relative flex min-h-[90vh] items-center overflow-hidden ${
            i % 2 === 0 ? 'bg-card' : 'bg-background'
          }`}
        >
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-32">
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={i % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">
                {panel.eyebrow}
              </span>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,4rem)] leading-tight text-foreground text-balance">
                {panel.title}
              </h2>
              <p className="mt-6 max-w-md text-base font-light leading-relaxed text-muted-foreground text-pretty">
                {panel.body}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative aspect-[4/3] overflow-hidden rounded-sm ${i % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}
            >
              <img
                src={panel.image}
                alt={panel.eyebrow}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </motion.div>
          </div>
        </div>
      ))}
    </section>
  );
}
