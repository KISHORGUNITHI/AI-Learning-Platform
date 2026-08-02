'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import roadmapData from '@/content/metadata/roadmap.json';
import type { Module, Day } from '@/types';

const modules = roadmapData as Module[];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger  = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const childFade = {
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function RoadmapPage() {
  const totalDays     = modules.reduce((n, m) => n + m.days.length, 0);
  const publishedDays = modules.flatMap((m) => m.days).filter((d) => d.published).length;

  return (
    <div className="mx-auto px-4 sm:px-6 py-12 sm:py-20" style={{ maxWidth: 'var(--page-max-width)' }}>

      {/* ── Page header ── */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-12 sm:mb-16 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase" style={{ color: 'var(--color-accent-primary)', letterSpacing: '0.1em' }}>
          Curriculum
        </p>
        <h1
          className="mb-4 font-semibold"
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
            lineHeight: '1.1',
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
          }}
        >
          Learning Roadmap
        </h1>
        <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
          A structured path from language representation to agentic AI.
          Each day builds on the last — no shortcuts.
        </p>

        {/* Stats pill */}
        <div
          className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-accent-success)' }} />
          {publishedDays} of {totalDays} days published · {modules.length} modules
        </div>
      </motion.div>

      {/* ── Modules ── */}
      <div className="flex flex-col gap-12 sm:gap-16">
        {modules.map((mod, modIndex) => {
          const publishedCount = mod.days.filter((d) => d.published).length;
          const progress = mod.days.length > 0 ? (publishedCount / mod.days.length) * 100 : 0;

          return (
            <motion.section
              key={mod.number}
              variants={fadeUp} initial="hidden"
              whileInView="show" viewport={{ once: true, margin: '-50px' }}
            >
              {/* Module header */}
              <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Module number badge */}
                  <div
                    className="mt-0.5 flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold"
                    style={{
                      background: modIndex === 0 ? (mod.color ?? 'var(--color-accent-primary)') : 'var(--color-surface-2)',
                      color: modIndex === 0 ? '#fff' : 'var(--color-text-tertiary)',
                      border: modIndex !== 0 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    {mod.number}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {mod.title}
                    </h2>
                    <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                      {mod.description}
                    </p>
                  </div>
                </div>
                <span className="flex-shrink-0 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {publishedCount}/{mod.days.length} days
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-5 h-1 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: mod.color ?? 'var(--color-accent-primary)' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>

              {/* Day grid */}
              <motion.div
                variants={stagger} initial="hidden" whileInView="show"
                viewport={{ once: true, margin: '-30px' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              >
                {mod.days.map((day: Day) => (
                  <DayCard key={day.slug} day={day} color={mod.color} />
                ))}
              </motion.div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}

/* ── Day card ──────────────────────────────────────────────── */
function DayCard({ day, color }: { day: Day; color?: string }) {
  const content = (
    <div
      className="flex flex-col gap-3 rounded-xl p-4 sm:p-5 h-full transition-all duration-150"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        opacity: day.published ? 1 : 0.5,
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--color-text-tertiary)' }}>
          Day {String(day.number).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2">
          {day.difficulty && (
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {day.difficulty}
            </span>
          )}
          {day.published
            ? <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-accent-success)' }} title="Available" />
            : <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Soon</span>
          }
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-snug" style={{ color: 'var(--color-text-primary)' }}>
        {day.title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
        {day.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t text-xs" style={{ borderColor: 'var(--color-border)' }}>
        {day.estimatedReadingTime ? (
          <span style={{ color: 'var(--color-text-tertiary)' }}>{day.estimatedReadingTime}</span>
        ) : <span />}
        {day.published && (
          <span className="font-medium" style={{ color: color ?? 'var(--color-accent-primary)' }}>
            Read →
          </span>
        )}
      </div>
    </div>
  );

  if (!day.published) return <motion.div variants={childFade}>{content}</motion.div>;

  return (
    <motion.div variants={childFade}>
      <Link
        href={`/learn/${day.slug}`}
        className="block h-full"
        onMouseEnter={(e) => {
          const card = e.currentTarget.querySelector('div') as HTMLElement;
          if (card) card.style.borderColor = 'var(--color-border-strong)';
        }}
        onMouseLeave={(e) => {
          const card = e.currentTarget.querySelector('div') as HTMLElement;
          if (card) card.style.borderColor = 'var(--color-border)';
        }}
      >
        {content}
      </Link>
    </motion.div>
  );
}
