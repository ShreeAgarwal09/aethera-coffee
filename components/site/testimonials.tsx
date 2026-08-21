'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'The Highland Mist changed my understanding of what coffee can be. I didn\'t know coffee could taste like jasmine and peach. I\'ll never go back.',
    author: 'Eleanor V.',
    role: 'Subscriber since 2021',
    location: 'London',
  },
  {
    quote: 'I\'ve been a coffee professional for 15 years. Aethera\'s Reserve series is the only subscription I haven\'t cancelled. The lot cards are meticulous.',
    author: 'Marcus K.',
    role: 'Q-Grader, Melbourne',
    location: 'Melbourne',
  },
  {
    quote: 'It arrives, I open it, I brew it, and for ten minutes the world stops. That\'s what Aethera does. It\'s not coffee. It\'s a ritual.',
    author: 'Sophie L.',
    role: 'Architect, Copenhagen',
    location: 'Copenhagen',
  },
];

export function Testimonials() {
  return (
    <section className="relative bg-background py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <span className="eyebrow">Voices</span>
          <h2 className="mt-5 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-foreground text-balance">
            What they&apos;re <span className="italic" style={{ color: 'hsl(var(--gold-soft))' }}>saying</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group relative glass-card rounded-sm p-10 transition-all duration-500 hover:border-primary/20"
            >
              <Quote className="h-10 w-10 text-primary/15 transition-colors duration-500 group-hover:text-primary/30" />

              <div className="mt-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                ))}
              </div>

              <p className="mt-8 font-display text-2xl leading-[1.5] text-foreground text-pretty">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="mt-10 flex items-center justify-between border-t border-border/50 pt-6">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.author}</p>
                  <p className="mt-1 text-xs font-light text-muted-foreground">{t.role}</p>
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {t.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
