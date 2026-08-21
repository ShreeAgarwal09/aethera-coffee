'use client';

import { motion } from 'framer-motion';
import { IMAGES } from '@/lib/images';

const reasons = [
  {
    title: 'Altitude Sourced',
    description: 'Every lot is cup-scored before it earns the Aethera seal. We buy only from estates above 1,800 metres.',
  metric: '1,800m+',
  label: 'Min. elevation',
  },
  {
    title: 'Roasted To Order',
    description: 'No warehoused coffee. Every tin is roasted within 48 hours of dispatch, at its absolute peak.',
    metric: '48hr',
    label: 'Roast-to-dispatch',
  },
  {
    title: 'Numbered & Signed',
    description: 'Reserve tins carry a hand-written lot number. Full provenance, from estate to your kitchen.',
    metric: '100%',
    label: 'Traceable lots',
  },
  {
    title: 'Carbon Neutral',
    description: 'Every shipment is carbon-offset through verified reforestation programs at origin.',
    metric: '0',
    label: 'Net emissions',
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-32 lg:py-40 grain" style={{ backgroundColor: 'hsl(var(--charcoal))' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.beansDark}
          alt=""
          className="h-full w-full object-cover opacity-15"
          loading="lazy"
          onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '0.15'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" style={{ background: 'linear-gradient(to top, hsl(30 15% 6%), hsl(30 15% 6% / 0.8), hsl(30 15% 6% / 0.5))' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <span className="eyebrow">Why Aethera</span>
          <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-foreground text-balance">
            Four reasons<br />
            <span className="italic" style={{ color: 'hsl(var(--gold-soft))' }}>it&apos;s different</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border/50 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative p-10 transition-colors duration-500 hover:bg-card/50"
              style={{ backgroundColor: 'hsl(30 12% 9% / 0.4)' }}
            >
              <div className="flex flex-col">
                <span className="font-display text-6xl text-primary/20 transition-colors duration-500 group-hover:text-primary/40">
                  {`0${i + 1}`}
                </span>
                <div className="mt-8">
                  <h3 className="font-display text-3xl text-foreground">{reason.title}</h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-muted-foreground text-pretty">
                    {reason.description}
                  </p>
                </div>
                <div className="mt-10 flex items-baseline gap-3 border-t border-border/50 pt-6">
                  <span className="font-display text-3xl text-primary">{reason.metric}</span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{reason.label}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
