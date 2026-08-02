'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/navigation/Breadcrumb';
import type { ArticleMetadata, Difficulty } from '@/types';

interface ArticleHeaderProps {
  metadata: ArticleMetadata;
}

const DIFFICULTY_STYLES: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Beginner:     { bg: 'var(--color-success-bg)',  text: 'var(--color-success-text)',  border: 'var(--color-success-border)' },
  Intermediate: { bg: 'var(--color-warning-bg)',  text: 'var(--color-warning-text)',  border: 'var(--color-warning-border)' },
  Advanced:     { bg: 'var(--color-error-bg)',     text: 'var(--color-error-text)',     border: 'var(--color-error-border)' },
};

export default function ArticleHeader({ metadata }: ArticleHeaderProps) {
  const {
    title, module, day, description,
    difficulty, estimatedReadingTime, computedReadingTime, estimatedStudyTime,
    tags, learningObjectives, prerequisites,
  } = metadata;

  const difficultyStyle = difficulty ? DIFFICULTY_STYLES[difficulty] : null;
  const readDisplay = estimatedReadingTime ?? (computedReadingTime ? `${computedReadingTime} min` : null);

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: '3.5rem' }}
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: '2rem' }}>
        <Breadcrumb
          items={[
            { label: 'Learn', href: '/learn' },
            ...(module !== undefined ? [{ label: `Module ${module}`, href: '/learn' }] : []),
            { label: title },
          ]}
        />
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {module !== undefined && day !== undefined && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              borderRadius: '9999px', padding: '0.25rem 0.75rem',
              fontSize: '0.75rem', fontWeight: 500,
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
          >
            <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: 'var(--color-accent-primary)', display: 'inline-block' }} />
            Module {module} · Day {day}
          </span>
        )}

        {difficultyStyle && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center',
              borderRadius: '9999px', padding: '0.25rem 0.75rem',
              fontSize: '0.75rem', fontWeight: 500,
              background: difficultyStyle.bg, color: difficultyStyle.text,
            }}
          >
            {difficulty}
          </span>
        )}

        {readDisplay && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
            {readDisplay} read
          </span>
        )}

        {estimatedStudyTime && (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
            · {estimatedStudyTime} to study
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 'clamp(1.875rem, 5vw, 2.75rem)',
          lineHeight: '1.15',
          letterSpacing: '-0.03em',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: '1.25rem',
        }}
      >
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.75',
            marginBottom: '1.5rem',
            maxWidth: '60ch',
          }}
        >
          {description}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                borderRadius: '9999px', padding: '0.25rem 0.75rem',
                fontSize: '0.75rem', fontWeight: 500,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', width: '100%', background: 'var(--color-border)', marginBottom: '2.5rem' }} />

      {/* Learning Objectives */}
      {learningObjectives && learningObjectives.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }} aria-labelledby="objectives-heading">
          <p
            id="objectives-heading"
            style={{
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--color-accent-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Learning Objectives
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {learningObjectives.map((obj, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <span
                  style={{
                    marginTop: '0.1rem',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '1.375rem', width: '1.375rem',
                    borderRadius: '50%',
                    fontSize: '0.7rem', fontWeight: 700,
                    background: 'var(--color-info-bg)',
                    border: '1px solid var(--color-info-border)',
                    color: 'var(--color-info-text)',
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ color: 'var(--color-text-secondary)', lineHeight: '1.7', fontSize: '0.9375rem' }}>
                  {obj}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prerequisites */}
      {prerequisites && prerequisites.length > 0 && (
        <section aria-labelledby="prereqs-heading">
          <p
            id="prereqs-heading"
            style={{
              fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              marginBottom: '1.25rem',
            }}
          >
            Prerequisites
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {prerequisites.map((pre, i) => {
              const card = (
                <div
                  style={{
                    display: 'flex', flexDirection: 'column', gap: '0.375rem',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.875rem 1.125rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    transition: 'border-color 150ms',
                    minWidth: '10rem',
                  }}
                >
                  {(pre.module !== undefined || pre.day !== undefined) && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', letterSpacing: '0.04em' }}>
                      {pre.module !== undefined && pre.day !== undefined
                        ? `Module ${pre.module} · Day ${pre.day}`
                        : ''}
                    </span>
                  )}
                  <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: '1.4' }}>
                    {pre.topic}
                  </span>
                </div>
              );

              return pre.slug ? (
                <Link
                  key={i}
                  href={`/learn/${pre.slug}`}
                  style={{ textDecoration: 'none' }}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget.querySelector('div') as HTMLElement;
                    if (card) card.style.borderColor = 'var(--color-accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget.querySelector('div') as HTMLElement;
                    if (card) card.style.borderColor = 'var(--color-border)';
                  }}
                >
                  {card}
                </Link>
              ) : (
                <div key={i}>{card}</div>
              );
            })}
          </div>
        </section>
      )}
    </motion.header>
  );
}
