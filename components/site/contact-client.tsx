'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send, Check } from 'lucide-react';
import { useState } from 'react';
import { IMAGES } from '@/lib/images';

export function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@aethera.com' },
    { icon: Phone, label: 'Phone', value: '+1 (415) 555-0192' },
    { icon: MapPin, label: 'Roastery', value: '842 Valencia St, San Francisco, CA 94110' },
    { icon: Clock, label: 'Hours', value: 'Mon–Fri 7am–5pm PT' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[50vh] overflow-hidden bg-background grain">
        <div className="absolute inset-0">
          <img
            src={IMAGES.cafeInterior}
            alt="Aethera roastery"
            className="h-full w-full object-cover"
            loading="eager"
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[50vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary"
          >
            Get in Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-foreground text-shadow-luxe text-balance"
          >
            Let&apos;s talk coffee.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 max-w-lg text-base font-light text-muted-foreground text-pretty"
          >
            Questions about an order, a brewing method, or a wholesale enquiry? We respond within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-4xl text-foreground md:text-5xl">Visit the roastery</h2>
              <p className="mt-4 max-w-md text-sm font-light text-muted-foreground text-pretty">
                Our San Francisco roastery is open for tastings every Friday. Book a session or just drop by — the espresso is always on.
              </p>
              <div className="mt-8 space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                      <info.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{info.label}</p>
                      <p className="mt-1 text-sm font-light text-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8 }}
            >
              {sent ? (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-sm border border-primary/30 bg-primary/5 p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl text-foreground">Message sent</h3>
                  <p className="mt-2 text-sm font-light text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 rounded-sm border border-border bg-card p-8">
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Subject</label>
                    <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Message</label>
                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary resize-none" />
                  </div>
                  <button type="submit" disabled={sending}
                    className="group flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-3.5 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50">
                    {sending ? 'Sending...' : <>Send Message <Send className="h-4 w-4" /></>}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
