'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Twitter, ArrowUpRight, Mail, Check } from 'lucide-react';
import { useState } from 'react';
import { MagneticButton } from '@/components/site/magnetic-button';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubscribing(true);
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
    } catch {}
    setSubscribing(false);
  };

  return (
    <footer className="relative overflow-hidden bg-background grain">
      {/* CTA + Newsletter */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-border py-32 text-center lg:py-40"
        >
          <span className="eyebrow">Join the Circle</span>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-foreground text-balance">
            Begin your <span className="italic" style={{ color: 'hsl(var(--gold-soft))' }}>ritual.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base font-light leading-relaxed text-muted-foreground text-pretty">
            Join the Aethera circle for early access to Reserve releases, brewing guides, and stories from the estates.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 inline-flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-8 py-4 text-sm font-medium text-primary"
            >
              <Check className="h-4 w-4" />
              You&apos;re on the list. Welcome to the circle.
            </motion.div>
          ) : (
            <form onSubmit={subscribe} className="mx-auto mt-10 flex max-w-md gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-sm border border-border bg-card py-4 pl-12 pr-4 text-sm font-light text-foreground outline-none transition-colors focus:border-primary"
                />
              </div>
              <MagneticButton strength={0.2}>
                <button
                  type="submit"
                  disabled={subscribing}
                  className="btn-luxe group flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-all disabled:opacity-50"
                >
                  {subscribing ? '...' : <>Join <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>}
                </button>
              </MagneticButton>
            </form>
          )}
        </motion.div>
      </div>

      {/* Links */}
      <div className="border-t border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-20 md:grid-cols-5 lg:px-10">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-4xl text-foreground">Aethera</span>
              <span className="text-[10px] font-medium tracking-widest align-super" style={{ color: 'hsl(38 78% 52%)' }}>®</span>
            </Link>
            <p className="mt-6 max-w-xs text-sm font-light leading-[1.8] text-muted-foreground text-pretty">
              The art of coffee, distilled to its essence. Sourced at altitude, roasted with precision, delivered with intent.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary/30 hover:text-primary" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary/30 hover:text-primary" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {[
            {
              title: 'Shop',
              links: [
                { label: 'All Coffees', href: '/shop' },
                { label: 'Single Origin', href: '/shop?category=single-origin' },
                { label: 'Reserve', href: '/shop?category=reserve' },
                { label: 'Collections', href: '/collections' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'Our Story', href: '/story' },
                { label: 'Journal', href: '/journal' },
                { label: 'Contact', href: '/contact' },
                { label: 'About', href: '/about' },
              ],
            },
            {
              title: 'Account',
              links: [
                { label: 'Sign In', href: '/signin' },
                { label: 'Create Account', href: '/signup' },
                { label: 'My Orders', href: '/account' },
                { label: 'Wishlist', href: '/wishlist' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.3em] text-foreground">
                {col.title}
              </h4>
              <ul className="mt-6 space-y-4">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-light text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row lg:px-10">
          <p className="text-xs font-light tracking-wide text-muted-foreground">
            © {new Date().getFullYear()} Aethera®. All rights reserved.
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Crafted with intent</p>
        </div>
      </div>

      {/* Oversized brand text */}
      <div className="relative overflow-hidden border-t border-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="flex justify-center py-10"
        >
          <span className="font-display text-[clamp(4rem,18vw,16rem)] leading-none text-foreground/5 select-none">
            AETHERA
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
