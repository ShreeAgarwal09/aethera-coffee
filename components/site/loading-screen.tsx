'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
        >
          <div className="relative flex flex-col items-center">
            {/* Circular progress */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative h-20 w-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-border"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-t-2"
                style={{ borderColor: 'hsl(38 78% 52%)' }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-8 text-center"
            >
              <span className="font-display text-4xl tracking-tight text-foreground">
                Aethera
              </span>
              <span
                className="ml-0.5 text-xs font-medium tracking-widest align-super"
                style={{ color: 'hsl(38 78% 52%)' }}
              >
                ®
              </span>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-2 text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
              >
                The Art of Coffee
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom progress bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 left-0 h-px w-full origin-left"
            style={{ backgroundColor: 'hsl(38 78% 52% / 0.5)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
