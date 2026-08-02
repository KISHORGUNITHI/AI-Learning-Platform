'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 'var(--content-width)', margin: '0 auto', padding: 'clamp(2.5rem, 6vw, 5rem) 1.25rem' }}>

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <p style={{ color: 'var(--color-accent-primary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          About
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', lineHeight: '1.1', letterSpacing: '-0.035em', color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: '2.5rem' }}>
          Why this exists.
        </h1>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }}>

        <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '1.4rem' }}>
          Most AI learning resources fall into one of two traps: they either hand-wave
          through the mathematics with "don't worry about the details," or they dump
          notation without ever explaining what it's trying to say.
        </p>

        <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '1.4rem' }}>
          Neither builds understanding. They build the <em>illusion</em> of understanding — which
          is worse, because it stops you from asking the right questions.
        </p>

        <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>
          This platform exists to do it differently. Every concept is explained from
          first principles, in plain language, with the mathematics shown honestly and
          with real worked examples. The goal is not to make you <em>feel</em> like you
          understand AI. The goal is to make you actually understand it.
        </p>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '0.875rem', padding: '1.5rem 1.75rem', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '1.0625rem', fontWeight: 500, fontStyle: 'italic', color: 'var(--color-text-primary)', lineHeight: '1.65', margin: 0 }}>
            "Understanding, not familiarity. Depth, not breadth. Clarity, not simplification."
          </p>
        </div>

        <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', marginBottom: '1.4rem' }}>
          The curriculum is deliberately sequenced. You cannot understand attention
          without understanding embeddings. You cannot understand embeddings without
          understanding what a vector actually means. The path is not arbitrary — every
          lesson was designed to sit exactly where it does.
        </p>

        <p style={{ fontSize: '1.0625rem', lineHeight: '1.8', color: 'var(--color-text-secondary)', margin: 0 }}>
          No backend. No login. No paywall. Just the content and the concepts,
          as clearly as they can be expressed.
        </p>

      </motion.div>
    </div>
  );
}
