'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function ReadingProgressBar() {
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 200, damping: 40 });
  const scaleX = useTransform(smooth, [0, 100], [0, 1]);

  useEffect(() => {
    const calculate = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      raw.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', calculate, { passive: true });
    calculate();
    return () => window.removeEventListener('scroll', calculate);
  }, [raw]);

  return (
    <div
      className="fixed top-14 left-0 right-0 h-[2px] z-[1019]"
      style={{ background: 'var(--color-border)' }}
      aria-hidden="true"
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX,
          background:
            'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary))',
        }}
      />
    </div>
  );
}
