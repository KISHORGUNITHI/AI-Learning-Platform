'use client';

import Link from 'next/link';

interface NavEntry {
  title: string;
  slug: string;
  module?: number;
  day?: number;
}

interface PrevNextNavProps {
  previous?: NavEntry;
  next?: NavEntry;
}

export default function PrevNextNav({ previous, next }: PrevNextNavProps) {
  if (!previous && !next) return null;

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '3rem',
    borderRadius: 'var(--radius-lg)',
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecoration: 'none',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    transition: 'border-color 150ms, background 150ms',
    width: '100%',
  } as React.CSSProperties;

  return (
    <nav
      aria-label="Article navigation"
      style={{
        marginTop: '3rem',
        paddingTop: '2rem',
        borderTop: '1px solid var(--color-border)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
      }}
    >
      {/* Previous */}
      {previous ? (
        <Link
          href={`/learn/${previous.slug}`}
          aria-label={`Previous: ${previous.title}`}
          style={{ ...cardStyle, color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--color-border-strong)';
            el.style.color = 'var(--color-text-primary)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--color-border)';
            el.style.color = 'var(--color-text-secondary)';
          }}
        >
          ← Previous
        </Link>
      ) : (
        <div /> /* keeps grid symmetry */
      )}

      {/* Next */}
      {next ? (
        <Link
          href={`/learn/${next.slug}`}
          aria-label={`Next: ${next.title}`}
          style={{ ...cardStyle, color: 'var(--color-accent)' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--color-accent-border)';
            el.style.background = 'var(--color-accent-subtle)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = 'var(--color-border)';
            el.style.background = 'var(--color-surface)';
          }}
        >
          Next →
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
