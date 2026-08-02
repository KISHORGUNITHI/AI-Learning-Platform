'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import roadmapData from '@/content/metadata/roadmap.json';
import type { Module } from '@/types';

const publishedModules = (roadmapData as Module[])
  .map((m) => ({ ...m, days: m.days.filter((d) => d.published) }))
  .filter((m) => m.days.length > 0)
  .slice(0, 3);

const firstLesson = publishedModules[0]?.days[0];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16,1,0.3,1], delay: d } }),
};
const stagger   = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const childFade = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16,1,0.3,1] } } };

const PRINCIPLES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'First Principles',
    description: 'Every concept built from the ground up. No hand-waving, no shortcuts.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
      </svg>
    ),
    title: 'Visual Learning',
    description: 'Diagrams and worked examples that make abstract ideas concrete.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
    title: 'Structured Path',
    description: 'A deliberate sequence — each lesson builds directly on the last.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
      </svg>
    ),
    title: 'Deep Understanding',
    description: 'Not just how to use it — why it works and when it breaks.',
  },
];

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', padding: 'clamp(5rem,10vw,8rem) 1.25rem clamp(4rem,8vw,7rem)', textAlign: 'center', overflow: 'hidden' }}>
        {/* Glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(79,140,255,0.1) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '42rem', margin: '0 auto' }}>

          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              marginBottom: '1.75rem', padding: '0.375rem 0.875rem',
              borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.01em',
              background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span style={{
              height: '6px', width: '6px', borderRadius: '50%',
              background: 'var(--color-accent)',
              boxShadow: '0 0 8px var(--color-accent-glow)',
              display: 'inline-block', flexShrink: 0,
            }} />
            Version 1 — Foundation Release
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={0.08}
            style={{
              fontSize: 'clamp(2.5rem, 9vw, 5rem)', lineHeight: 1.04,
              letterSpacing: '-0.045em', fontWeight: 700,
              color: 'var(--color-text-primary)', marginBottom: '1.25rem',
            }}
          >
            Understand AI
            <br />
            <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              from first principles.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0.16}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', lineHeight: 1.75,
              color: 'var(--color-text-secondary)',
              maxWidth: '32rem', marginLeft: 'auto', marginRight: 'auto',
              marginBottom: '2.25rem',
            }}
          >
            A structured path through AI — clear language, honest mathematics,
            and visuals that make the abstract tangible.
          </motion.p>

          {/* CTA */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0.23}>
            {firstLesson && (
              <Link href={`/learn/${firstLesson.slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  height: '2.75rem', padding: '0 1.75rem',
                  borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', fontWeight: 600,
                  letterSpacing: '-0.01em', background: 'var(--color-accent)', color: '#fff',
                  textDecoration: 'none', transition: 'background 150ms, transform 150ms, box-shadow 150ms',
                  boxShadow: '0 2px 12px var(--color-accent-glow)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'var(--color-accent-hover)';
                  el.style.transform = 'translateY(-1px)';
                  el.style.boxShadow = '0 4px 20px var(--color-accent-glow)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'var(--color-accent)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 2px 12px var(--color-accent-glow)';
                }}
              >
                Start Learning
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4"/>
                </svg>
              </Link>
            )}
          </motion.div>

        </div>
      </section>

      <Divider />

      {/* ── Principles ── */}
      <section style={{ padding: 'clamp(4rem,8vw,6rem) 1.25rem' }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto' }}>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            style={{ marginBottom: 'clamp(2.5rem,5vw,3.5rem)' }}
          >
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.6rem' }}>
              Philosophy
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.25rem)', lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Built for real understanding,
              <br />
              <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>not just familiarity.</span>
            </h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,14rem), 1fr))', gap: '0.875rem' }}
          >
            {PRINCIPLES.map((p) => (
              <motion.div key={p.title} variants={childFade}
                style={{
                  borderRadius: 'var(--radius-xl)', padding: '1.375rem 1.5rem',
                  background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                  transition: 'border-color 200ms, box-shadow 200ms',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--color-border-strong)';
                  el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--color-border)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '2.25rem', height: '2.25rem', borderRadius: 'var(--radius-md)',
                  background: 'var(--color-accent-subtle)', color: 'var(--color-accent)',
                  marginBottom: '1rem',
                }}>
                  {p.icon}
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                  {p.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Divider />

      {/* ── Published modules ── */}
      {publishedModules.length > 0 && (
        <section style={{ padding: 'clamp(4rem,8vw,6rem) 1.25rem' }}>
          <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto' }}>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
              style={{ marginBottom: 'clamp(2.5rem,5vw,3.5rem)' }}
            >
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.6rem' }}>
                Curriculum
              </p>
              <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.25rem)', lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Start here.
              </h2>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,18rem), 1fr))', gap: '0.875rem' }}
            >
              {publishedModules.map((mod) => (
                <motion.div key={mod.number} variants={childFade}>
                  <Link href={`/learn/${mod.days[0].slug}`}
                    style={{
                      display: 'flex', flexDirection: 'column', gap: '1rem',
                      borderRadius: 'var(--radius-xl)', padding: '1.375rem 1.5rem', height: '100%',
                      background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                      textDecoration: 'none',
                      transition: 'border-color 200ms, transform 200ms, box-shadow 200ms',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--color-border-strong)';
                      el.style.transform = 'translateY(-3px)';
                      el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--color-border)';
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ height: '7px', width: '7px', borderRadius: '50%', background: mod.color ?? 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                        Module {mod.number}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.015em', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                        {mod.title}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                        {(mod as unknown as Module).description}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8125rem' }}>
                      <span style={{ color: 'var(--color-text-tertiary)' }}>
                        {mod.days.length} {mod.days.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>Begin →</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section style={{ padding: '0 1.25rem clamp(4rem,8vw,6rem)' }}>
        <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            style={{
              borderRadius: 'var(--radius-2xl)', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,6vw,5rem)',
              textAlign: 'center',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            }}
          >
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
              Ready to start?
            </p>
            <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2.25rem)', lineHeight: 1.15, letterSpacing: '-0.03em', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
              Day 1 is waiting.
            </h2>
            <p style={{ fontSize: '1.0625rem', lineHeight: 1.75, color: 'var(--color-text-secondary)', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto', marginBottom: '2rem' }}>
              No prerequisites beyond curiosity. Start from tokens and embeddings and work your way through transformers and beyond.
            </p>
            {firstLesson && (
              <Link href={`/learn/${firstLesson.slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  height: '2.75rem', padding: '0 2rem',
                  borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', fontWeight: 600,
                  background: 'var(--color-accent)', color: '#fff', textDecoration: 'none',
                  transition: 'background 150ms, transform 150ms, box-shadow 150ms',
                  boxShadow: '0 2px 12px var(--color-accent-glow)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'var(--color-accent-hover)';
                  el.style.transform = 'translateY(-1px)';
                  el.style.boxShadow = '0 4px 20px var(--color-accent-glow)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'var(--color-accent)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 2px 12px var(--color-accent-glow)';
                }}
              >
                Start Learning →
              </Link>
            )}
          </motion.div>
        </div>
      </section>

    </div>
  );
}

function Divider() {
  return (
    <div style={{ maxWidth: 'var(--page-max-width)', margin: '0 auto', padding: '0 var(--page-gutter)' }}>
      <div style={{ height: '1px', background: 'var(--color-border)' }} />
    </div>
  );
}
