'use client';

import Link from 'next/link';
import roadmapData from '@/content/metadata/roadmap.json';
import type { Module } from '@/types';

const modules = roadmapData as Module[];

const publishedModules = modules
  .map((m) => ({ ...m, days: m.days.filter((d) => d.published) }))
  .filter((m) => m.days.length > 0);

const firstLesson = publishedModules[0]?.days[0];



export default function LearnIndexPage() {
  return (
    <div style={{ maxWidth: '42rem', padding: 'clamp(2rem, 5vw, 3.5rem) 1.25rem 4rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--color-accent-primary)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
          Learning Path
        </p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', lineHeight: '1.15', letterSpacing: '-0.03em', color: 'var(--color-text-primary)', fontWeight: 700, marginBottom: '0.75rem' }}>
          AI from First Principles
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: '1.7', margin: 0 }}>
          Use the sidebar to navigate, or start from the beginning.
        </p>
      </div>

      {/* Start button */}
      {firstLesson && (
        <Link
          href={`/learn/${firstLesson.slug}`}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            marginBottom: '3rem', height: '2.5rem', padding: '0 1.25rem',
            borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600,
            background: 'var(--color-accent-primary)', color: '#fff',
            textDecoration: 'none', transition: 'background 150ms',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-accent-primary-hover)')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-accent-primary)')}
        >
          Start from Day 1 →
        </Link>
      )}

      {/* Module list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {publishedModules.map((mod) => (
          <section key={mod.number}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.5rem' }}>
              <span style={{ height: '8px', width: '8px', borderRadius: '50%', background: (mod as Module).color ?? 'var(--color-accent-primary)', flexShrink: 0, display: 'inline-block' }} />
              <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
                Module {mod.number} — {mod.title}
              </h2>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.65', marginBottom: '1rem', paddingLeft: '1.375rem' }}>
              {(mod as Module).description}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '1.375rem' }}>
              {mod.days.map((day) => (
                <li key={day.slug}>
                  <Link
                    href={`/learn/${day.slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.35rem 0.5rem', borderRadius: '0.375rem',
                      fontSize: '0.875rem', textDecoration: 'none',
                      color: 'var(--color-text-secondary)', transition: 'color 150ms, background 150ms',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = 'var(--color-text-primary)';
                      el.style.background = 'var(--color-surface)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.color = 'var(--color-text-secondary)';
                      el.style.background = 'transparent';
                    }}
                  >
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', fontVariantNumeric: 'tabular-nums', flexShrink: 0, minWidth: '1rem', textAlign: 'right' }}>
                      {day.number}.
                    </span>
                    <span style={{ flex: 1 }}>{day.title}</span>
                    {day.estimatedReadingTime && (
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', flexShrink: 0 }}>
                        {day.estimatedReadingTime}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem', height: '1px', background: 'var(--color-border)' }} />
          </section>
        ))}
      </div>
    </div>
  );
}
