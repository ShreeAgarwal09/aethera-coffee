'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { IMAGES } from '@/lib/images';

const values = [
  { title: 'Transparency', description: 'Every lot number traces back to the farmer. We believe luxury is knowing where your coffee comes from.' },
  { title: 'Precision', description: 'Roasting profiles are calibrated to the second. We treat coffee like a science and a craft.' },
  { title: 'Patience', description: 'We refuse to rush. Slow ripening, slow roasting, slow brewing. Good things take time.' },
  { title: 'Respect', description: 'Fair prices to farmers, fair wages to roasters, fair coffee to you. The chain is only as strong as its weakest link.' },
];

const team = [
  { name: 'Mira Okonkwo', role: 'Founder & Head Roaster', image: IMAGES.farmer },
  { name: 'Daniel Reyes', role: 'Director of Sourcing', image: IMAGES.harvest },
  { name: 'Yuki Tanaka', role: 'Master Q-Grader', image: IMAGES.cooling },
];

export function AboutClient() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] overflow-hidden bg-background grain">
        <div className="absolute inset-0">
          <img
            src={IMAGES.mistyPlantation}
            alt="Coffee plantation"
            className="h-full w-full object-cover"
            loading="eager"
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary"
          >
            About Aethera
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-6 font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-foreground text-shadow-luxe text-balance"
          >
            We chase the altitude
            <br />
            where flavour lives.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 max-w-xl text-base font-light leading-relaxed text-muted-foreground text-pretty"
          >
            Aethera began with a single question: what if coffee were treated like fine wine? Sourced from a single estate, harvested at peak ripeness, roasted to order, and numbered by hand.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">Our Values</span>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,4rem)] leading-tight text-foreground">
              What we stand for
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="glass-card rounded-sm p-8"
              >
                <span className="font-display text-5xl text-primary/20">{`0${i + 1}`}</span>
                <h3 className="mt-4 font-display text-2xl text-foreground">{value.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground text-pretty">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-card py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">The Team</span>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,4rem)] leading-tight text-foreground">
              Hands behind the craft
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: i * 0.12 }}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-background">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                    onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-foreground">{member.name}</h3>
                    <p className="text-xs font-light text-primary">{member.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
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
      </section>
    </div>
  );
}
