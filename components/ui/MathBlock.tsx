import React from 'react';

/**
 * MathBlock — Math Card for important equations.
 *
 * Renders equations inside a visually distinct, high-contrast card.
 * Supports:
 * - Children (e.g. MDX LaTeX blocks $$...$$)
 * - formula prop (fallback if formula is passed as a string attribute)
 * - caption prop (optional explanatory text displayed below equation)
 *
 * Usage:
 *   <MathBlock title="Cross Entropy Loss" caption="Measures prediction error">
 *     $$L = -\log(P(\text{correct token}))$$
 *   </MathBlock>
 */

interface MathBlockProps {
  children?: React.ReactNode;
  /** Short label shown above the equation e.g. "Softmax Function" */
  title?: string;
  /** Optional string formula fallback */
  formula?: string;
  /** Optional explanatory caption displayed below the equation */
  caption?: string;
}

export default function MathBlock({ children, title, formula, caption }: MathBlockProps) {
  return (
    <figure
      aria-label={title ?? 'Mathematical equation'}
      style={{
        margin: '2.25rem 0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.625rem 1.375rem',
          background: 'var(--color-surface-2)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {/* Accent dot */}
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--color-accent)',
            flexShrink: 0,
            display: 'inline-block',
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}
        >
          {title ?? 'Equation'}
        </p>
      </div>

      {/* Equation body */}
      <div
        style={{
          padding: '1.75rem 1.5rem',
          textAlign: 'center',
          overflowX: 'auto',
          color: 'var(--color-text-primary)',
          fontSize: '1.0625rem',
          lineHeight: 1.6,
        }}
      >
        {children ?? (formula ? <div style={{ fontFamily: 'var(--font-mono)' }}>{formula}</div> : null)}
      </div>

      {/* Optional Caption */}
      {caption && (
        <div
          style={{
            padding: '0.625rem 1.25rem',
            background: 'var(--color-surface-2)',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center',
            lineHeight: 1.5,
          }}
        >
          {caption}
        </div>
      )}
    </figure>
  );
}
