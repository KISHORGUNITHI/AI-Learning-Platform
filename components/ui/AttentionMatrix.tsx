'use client';

/**
 * AttentionMatrix — Premium visual component for Attention Matrices,
 * Score Tables, Causal Masks, and Probability Distributions.
 *
 * Usage in MDX:
 *   <AttentionMatrix
 *     title="Raw Scaled Scores (QKᵀ / √d)"
 *     queryLabel="Query (i)"
 *     keyLabel="Key (j)"
 *     columns={["I", "love", "AI"]}
 *     rows={[
 *       { label: "I",    values: [2.0, 5.0, 4.0] },
 *       { label: "love", values: [1.0, 3.0, 4.5] },
 *       { label: "AI",   values: [2.0, 4.0, 8.0] },
 *     ]}
 *   />
 */

import React from 'react';

export interface MatrixRow {
  label: string;
  values: (string | number)[];
  highlight?: boolean;
}

export interface AttentionMatrixProps {
  title?: string;
  queryLabel?: string;
  keyLabel?: string;
  columns: string[];
  rows: MatrixRow[];
  caption?: string;
  accent?: string;
}

export default function AttentionMatrix({
  title,
  queryLabel = 'Query',
  keyLabel = 'Key',
  columns = [],
  rows = [],
  caption,
  accent = 'var(--color-accent)',
}: AttentionMatrixProps) {
  // Helper to style cell contents based on value type
  const renderCellContent = (val: string | number) => {
    const s = String(val).trim();

    // Checkmark ✓
    if (s === '✓' || s.startsWith('✓')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(52, 211, 153, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            color: 'var(--color-success)',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          {s}
        </span>
      );
    }

    // Cross / Blocked ✗
    if (s === '✗' || s.startsWith('✗') || s === '✕') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px dashed rgba(239, 68, 68, 0.45)',
            color: 'var(--color-error)',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          {s}
        </span>
      );
    }

    // Negative Infinity -∞
    if (s.includes('-∞') || s.includes('-inf') || s.includes('-\\infty')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.14)',
            border: '1px dashed var(--color-error)',
            color: 'var(--color-error)',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
          }}
        >
          -∞
        </span>
      );
    }

    // Percentage probabilities e.g. "1.00 (100%)", "0.00 (0%)", "0.88 (88%)"
    if (s.includes('%')) {
      const isZero = s.includes('0%') || s.startsWith('0.00');
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--radius-md)',
            background: isZero
              ? 'rgba(255, 255, 255, 0.02)'
              : 'rgba(52, 211, 153, 0.12)',
            border: isZero
              ? '1px solid var(--color-border)'
              : '1px solid rgba(52, 211, 153, 0.4)',
            color: isZero
              ? 'var(--color-text-tertiary)'
              : 'var(--color-success)',
            fontWeight: isZero ? 500 : 700,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.825rem',
            whiteSpace: 'nowrap',
          }}
        >
          {s}
        </span>
      );
    }

    // Regular numerical score or text
    return (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: 'var(--color-text-primary)',
        }}
      >
        {s}
      </span>
    );
  };

  return (
    <figure
      style={{
        margin: '2rem 0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
      }}
      aria-label={title ?? 'Attention Matrix'}
    >
      {/* Header */}
      {title && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.625rem 1.25rem',
            background: 'var(--color-surface-2)',
            borderBottom: '1px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: accent,
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <p
              style={{
                margin: 0,
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: accent,
              }}
            >
              {title}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem' }}>
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              Rows: <strong style={{ color: 'var(--color-text-secondary)' }}>{queryLabel}</strong>
            </span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>
              Cols: <strong style={{ color: 'var(--color-text-secondary)' }}>{keyLabel}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div style={{ overflowX: 'auto', padding: '1rem 1.25rem' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '6px',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr>
              {/* Corner header */}
              <th
                style={{
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'left',
                  background: 'transparent',
                }}
              >
                {queryLabel} \ {keyLabel}
              </th>

              {/* Column Headers (Keys) */}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-accent-secondary)',
                    letterSpacing: '0.04em',
                    background: 'var(--color-surface-2)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {/* Row Header (Query) */}
                <th
                  scope="row"
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: row.highlight
                      ? 'var(--color-accent)'
                      : 'var(--color-text-primary)',
                    textAlign: 'left',
                    background: row.highlight
                      ? 'rgba(79, 140, 255, 0.08)'
                      : 'var(--color-surface-2)',
                    borderRadius: 'var(--radius-md)',
                    border: row.highlight
                      ? '1px solid var(--color-accent)'
                      : '1px solid var(--color-border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.label}
                </th>

                {/* Values */}
                {row.values.map((val, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: '0.55rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    {renderCellContent(val)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional Caption footer */}
      {caption && (
        <div
          style={{
            padding: '0.5rem 1.25rem 0.75rem',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.775rem',
            color: 'var(--color-text-tertiary)',
            lineHeight: 1.5,
          }}
        >
          {caption}
        </div>
      )}
    </figure>
  );
}
