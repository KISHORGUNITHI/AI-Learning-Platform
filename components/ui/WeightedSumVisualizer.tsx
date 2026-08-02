'use client';

/**
 * WeightedSumVisualizer — shows how Attention Weights combine Value vectors
 * into a single contextual representation.
 *
 * Usage: <WeightedSumVisualizer />
 */

import { useState } from 'react';

const TOKENS  = ['I', 'Love', 'AI'];
const COLORS  = ['var(--color-accent)', 'var(--color-accent-secondary)', 'var(--color-success)'];
const WEIGHTS = [0.20, 0.60, 0.20];

// Simulated value vector snippets (first 5 dims for display)
const VALUES = [
  [0.31, -0.14,  0.52,  0.08, -0.27],
  [0.85,  0.42, -0.11,  0.73,  0.19],
  [-0.22, 0.61,  0.38, -0.45,  0.54],
];

function weightedSum(vals: number[][], weights: number[]): number[] {
  return vals[0].map((_, di) =>
    parseFloat(vals.reduce((sum, v, i) => sum + weights[i] * v[di], 0).toFixed(2))
  );
}

const OUTPUT = weightedSum(VALUES, WEIGHTS);

export default function WeightedSumVisualizer() {
  const [step, setStep] = useState<number | null>(null);
  const isComplete = step === TOKENS.length;

  const visibleWeights = step !== null ? WEIGHTS.slice(0, step + 1) : [];
  const progressLabel  = step === null ? 'Press a step to animate'
    : isComplete ? 'Context vector computed ✓'
    : `Collecting from ${TOKENS[step]}...`;

  return (
    <figure style={{
      margin: '2rem 0', borderRadius: 'var(--radius-xl)',
      overflow: 'hidden', border: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.25rem',
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
          Gathering Information from Value Vectors
        </p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Step buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {TOKENS.map((t, i) => (
            <button key={i} onClick={() => setStep(i)}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', border: 'none',
                background: step !== null && step >= i ? COLORS[i] : 'var(--color-surface-2)',
                color: step !== null && step >= i ? '#fff' : 'var(--color-text-secondary)',
                opacity: step !== null && step >= i ? 1 : 0.6,
                transition: 'all 200ms',
              }}>
              {i + 1}. Collect from {t} ({(WEIGHTS[i] * 100).toFixed(0)}%)
            </button>
          ))}
          <button onClick={() => setStep(TOKENS.length)}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', border: 'none',
              background: isComplete ? 'var(--color-success)' : 'var(--color-surface-2)',
              color: isComplete ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all 200ms',
            }}>
            ✦ Final Output
          </button>
          <button onClick={() => setStep(null)}
            style={{
              padding: '0.375rem 0.875rem', borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem', cursor: 'pointer', border: '1px solid var(--color-border)',
              background: 'transparent', color: 'var(--color-text-tertiary)',
            }}>
            Reset
          </button>
        </div>

        {/* Status */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', textAlign: 'center', fontStyle: 'italic' }}>
          {progressLabel}
        </p>

        {/* Value vectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {TOKENS.map((token, i) => {
            const active = step !== null && step >= i;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-lg)',
                border: `1px solid ${active ? COLORS[i] : 'var(--color-border)'}`,
                background: active ? `${COLORS[i]}12` : 'var(--color-surface-2)',
                transition: 'all 250ms',
                opacity: step !== null && step < i ? 0.35 : 1,
              }}>
                {/* Weight badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: '3rem', height: '1.75rem', borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  background: active ? COLORS[i] : 'var(--color-surface)',
                  color: active ? '#fff' : 'var(--color-text-tertiary)',
                  border: `1px solid ${active ? COLORS[i] : 'var(--color-border)'}`,
                  transition: 'all 250ms',
                  flexShrink: 0,
                }}>
                  {(WEIGHTS[i] * 100).toFixed(0)}%
                </span>

                {/* Token label */}
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? COLORS[i] : 'var(--color-text-secondary)', minWidth: '2.5rem', transition: 'color 200ms' }}>
                  {token}
                </span>

                {/* Multiplication symbol */}
                <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}>×</span>

                {/* Value vector snippet */}
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.775rem',
                  color: active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  transition: 'color 200ms',
                }}>
                  [{VALUES[i].join(', ')}, ...]
                </span>
              </div>
            );
          })}
        </div>

        {/* Output */}
        {isComplete && (
          <div style={{
            padding: '0.875rem 1rem', borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--color-success)',
            background: 'var(--color-success-bg)',
          }}>
            <p style={{ margin: '0 0 0.375rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-success-text)' }}>
              Contextual Representation for "Love"
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-success-text)' }}>
              [{OUTPUT.join(', ')}, ...]
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
              This vector now contains information from all three tokens, weighted by attention.
            </p>
          </div>
        )}

        <p style={{ marginTop: '1rem', fontSize: '0.8125rem', fontStyle: 'italic', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          Attention decides how much information to collect. The Value vectors provide the information being collected.
        </p>
      </div>
    </figure>
  );
}
