'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react';
import { MagneticButton } from '@/components/site/magnetic-button';
import { useEffect, useState, useRef } from 'react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.6 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const backgroundImages = [
  'https://images.pexels.com/photos/36114144/pexels-photo-36114144.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/37641530/pexels-photo-37641530.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/32798950/pexels-photo-32798950.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/16682441/pexels-photo-16682441.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

export function Hero() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  useEffect(() => {
    const arr = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1.5 + Math.random() * 5,
      duration: 14 + Math.random() * 20,
      delay: Math.random() * 12,
      drift: Math.random() * 60 - 30,
    }));
    setParticles(arr);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-background grain vignette"
    >
      {/* Crossfading background slideshow — simulates cinematic video */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        {backgroundImages.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt="Coffee craftsmanship"
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: i === currentImage ? 1 : 0 }}
            transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
            loading={i === 0 ? 'eager' : 'lazy'}
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = i === currentImage ? '1' : '0'; }}
          />
        ))}
      </motion.div>

      {/* Dark espresso overlay with warm golden lighting */}
      <div className="absolute inset-0 z-[1]">
        {/* Base dark espresso wash */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, hsl(25 30% 8% / 0.75) 0%, hsl(25 30% 10% / 0.5) 40%, hsl(25 30% 6% / 0.85) 100%)' }}
        />
        {/* Warm golden light from top-right */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 75% 20%, hsl(38 70% 50% / 0.18) 0%, transparent 60%)',
          }}
        />
        {/* Left side darkening for text legibility */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, hsl(25 30% 6% / 0.7) 0%, hsl(25 30% 6% / 0.2) 50%, transparent 100%)' }}
        />
        {/* Bottom fade to background */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 60%, hsl(30 15% 6%) 100%)' }}
        />
      </div>

      {/* Floating coffee particles — warm bronze/gold embers */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              bottom: '-10px',
              width: p.size,
              height: p.size,
              backgroundColor: 'hsl(35 65% 55% / 0.5)',
              filter: 'blur(1.5px)',
              boxShadow: '0 0 8px hsl(35 70% 50% / 0.3)',
            }}
            animate={{
              y: [0, -window.innerHeight - 120],
              x: [0, p.drift],
              opacity: [0, 0.7, 0.4, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-10"
      >
        {/* Eyebrow with decorative line */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '3rem' }}
            transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px"
            style={{ background: 'linear-gradient(to right, transparent, hsl(38 55% 68%))' }}
          />
          <span className="eyebrow">Single-Origin · Reserve · Crafted</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="mt-10 max-w-4xl font-display text-[clamp(2.8rem,8.5vw,9rem)] leading-[0.9] text-foreground text-shadow-luxe text-balance"
        >
          The art of coffee,
          <br />
          <span className="italic gold-text">distilled</span> to its essence.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="mt-10 max-w-xl text-lg font-light leading-[1.8] text-foreground/70 text-pretty"
        >
          Aethera sources micro-lot coffees from the world&apos;s most extreme elevations.
          Each tin is roasted to order, numbered by hand, and delivered with the story of its origin.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center">
          <MagneticButton>
            <Link
              href="/shop"
              className="btn-luxe group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-sm px-12 py-5 text-sm font-medium tracking-[0.15em] text-primary-foreground"
              style={{
                background: 'linear-gradient(135deg, hsl(38 78% 52%), hsl(36 65% 45%))',
                boxShadow: '0 8px 40px hsl(38 78% 52% / 0.25)',
              }}
            >
              <span className="relative z-10">Explore the Collection</span>
              <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.15}>
            <Link
              href="/story"
              className="group inline-flex items-center gap-3 rounded-sm border border-foreground/15 bg-foreground/5 px-10 py-5 text-sm font-light tracking-[0.15em] text-foreground backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:bg-foreground/10"
            >
              <Plus className="h-4 w-4 text-primary transition-transform duration-500 group-hover:rotate-90" />
              <span className="link-underline pb-1">Our Story</span>
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={itemVariants}
          className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-4 text-xs font-light text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'hsl(38 78% 52%)' }} />
            Roasted within 48 hours
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'hsl(38 78% 52%)' }} />
            Altitude-sourced estates
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: 'hsl(38 78% 52%)' }} />
            Numbered by hand
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          <div
            className="h-14 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, hsl(38 78% 52% / 0.5))' }}
          />
          <ArrowDown className="h-4 w-4 text-primary" />
        </motion.div>
      </motion.div>

      {/* Side label — vertical */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 right-6 z-10 hidden lg:block"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground [writing-mode:vertical-rl]">
          Est. 2019 — Altitude Sourced
        </span>
      </motion.div>

      {/* Slide counter — bottom left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 left-6 z-10 hidden items-center gap-4 md:flex"
      >
        <span className="font-display text-3xl text-foreground/30">
          {String(currentImage + 1).padStart(2, '0')}
        </span>
        <span className="text-xs text-muted-foreground">/ {String(backgroundImages.length).padStart(2, '0')}</span>
        <div className="ml-2 flex gap-1.5">
          {backgroundImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImage(i)}
              className={`h-px transition-all duration-500 ${
                i === currentImage ? 'w-8 bg-primary' : 'w-4 bg-muted-foreground/30'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
