'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Home } from 'lucide-react';
import { IMAGES } from '@/lib/images';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background grain">
      <div className="absolute inset-0">
        <img
          src={IMAGES.beansDark}
          alt=""
          className="h-full w-full object-cover opacity-20"
          loading="eager"
          onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary"
        >
          Lost in the highlands
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-6 font-display text-[clamp(5rem,15vw,12rem)] leading-none text-foreground text-shadow-luxe"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 max-w-md text-base font-light text-muted-foreground text-pretty"
        >
          The page you&apos;re looking for has been roasted, packed, and shipped to a different dimension. Let&apos;s get you back.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="group inline-flex items-center justify-center gap-2 rounded-sm border border-border px-8 py-4 text-sm font-light text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Browse the Collection
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
