'use client';

import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/images';

const steps = [
  {
    number: '01',
    title: 'Sourcing',
    description:
      'We buy exclusively from estates above 1,800 metres. The thin air slows the cherry ripening, concentrating sugars and acids into a denser, more complex bean.',
    image: IMAGES.plantation,
    label: 'Altitude',
  },
  {
    number: '02',
    title: 'Roasting',
    description:
      'Each tin is roasted within 48 hours of dispatch. We refuse to warehouse roasted coffee — the flavour curve falls off a cliff after two weeks.',
    image: IMAGES.roasting,
    label: 'Precision',
  },
  {
    number: '03',
    title: 'Provenance',
    description:
      'Every Reserve tin carries a hand-written lot number. Enter it online and you see the estate, the farmer, the harvest date, and the cupping score.',
    image: IMAGES.coffeeBag,
    label: 'Transparency',
  },
];

export function CoffeeExperience() {
  return (
    <section className="relative bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 text-center"
        >
          <span className="eyebrow">The Process</span>
          <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-foreground text-balance">
            From cherry to <span className="italic" style={{ color: 'hsl(var(--gold-soft))' }}>cup</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base font-light leading-relaxed text-muted-foreground text-pretty">
            Three stages define the Aethera method. Each is non-negotiable, each is deliberate, each is what separates a commodity from a craft.
          </p>
        </motion.div>

        {/* Alternating editorial sections */}
        <div className="space-y-32 lg:space-y-40">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24"
            >
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={i % 2 === 1 ? 'lg:order-2' : ''}
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-display text-8xl text-primary/15">{step.number}</span>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                    {step.label}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-[clamp(2rem,3.5vw,3.5rem)] leading-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-6 max-w-md text-base font-light leading-[1.8] text-muted-foreground text-pretty">
                  {step.description}
                </p>
                <div className="mt-8 h-px w-16" style={{ background: 'hsl(38 78% 52% / 0.4)' }} />
              </motion.div>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`relative aspect-[4/5] overflow-hidden rounded-sm bg-card ${i % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="font-display text-2xl text-foreground/50">{step.number}</span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
