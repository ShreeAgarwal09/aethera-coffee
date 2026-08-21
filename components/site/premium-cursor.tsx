'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function PremiumCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 30, stiffness: 500, mass: 0.3 });
  const springY = useSpring(cursorY, { damping: 30, stiffness: 500, mass: 0.3 });

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };

    const overInteractive = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a, button, input, textarea, [role="button"], [data-cursor="hover"]')
      ) {
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mousemove', overInteractive);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousemove', overInteractive);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Outer ring */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: hovering ? 56 : 32,
            height: hovering ? 56 : 32,
            borderColor: hovering ? 'hsl(38 78% 52% / 0.6)' : 'hsl(40 28% 95% / 0.3)',
            scale: clicking ? 0.85 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-full border"
        />
      </motion.div>
      {/* Inner dot */}
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        className="absolute -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            width: hovering ? 0 : 6,
            height: hovering ? 0 : 6,
            opacity: hovering ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full bg-gold"
          style={{ backgroundColor: 'hsl(38 78% 52%)' }}
        />
      </motion.div>
    </div>
  );
}
