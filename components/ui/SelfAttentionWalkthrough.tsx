'use client';

/**
 * SelfAttentionWalkthrough — fully interactive step-by-step pipeline
 * covering the complete Self-Attention computation.
 *
 * Usage: <SelfAttentionWalkthrough />
 */

import { useState } from 'react';

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 1,
    label: 'Input Embeddings',
    short: 'X',
    shape: 'n × d',
    color: '#94A3B8',
    description: 'Token embeddings + positional information. Each row is one token.',
    formula: 'X = TokenEmb + PosEmb',
  },
  {
    id: 2,
    label: 'Generate Q, K, V',
    short: 'Q  K  V',
    shape: 'n × d  each',
    color: '#4F8CFF',
    description: 'Three separate linear projections of the input. Q asks, K describes, V shares.',
    formula: 'Q = XWQ   K = XWK   V = XWV',
  },
  {
    id: 3,
    label: 'Attention Scores',
    short: 'QKᵀ',
    shape: 'n × n',
    color: '#818CF8',
    description: 'Every Query compared against every Key using the Dot Product. Larger = more relevant.',
    formula: 'Scores = QKᵀ',
  },
  {
    id: 4,
    label: 'Scale by √d',
    short: '÷ √d',
    shape: 'n × n',
    color: '#F59E0B',
    description: 'Dividing by √dₖ prevents Softmax saturation and keeps gradients flowing.',
    formula: 'Scaled = QKᵀ / √dₖ',
  },
  {
    id: 5,
    label: 'Softmax',
    short: 'Softmax',
    shape: 'n × n',
    color: '#EF4444',
    description: 'Each row becomes a probability distribution summing to 1. Now we have attention weights.',
    formula: 'A = Softmax(QKᵀ / √dₖ)',
  },
  {
    id: 6,
    label: 'Context Matrix',
    short: 'A × V',
    shape: 'n × d',
    color: '#34D399',
    description: 'Weighted average of Value vectors. Every token now contains contextual information from the full sentence.',
    formula: 'Context = Softmax(QKᵀ / √dₖ) · V',
  },
];

const FULL_FORMULA = 'Attention(Q,K,V) = Softmax( QKᵀ / √dₖ ) · V';

// ─── Component ────────────────────────────────────────────────────────────────

export default function SelfAttentionWalkthrough() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const current = STEPS[active];

  return (
    <figure style={{
      margin: '2rem 0', borderRadius: 'var(--radius-xl)',
      overflow: 'hidden', border: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.375rem',
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
          Complete Self-Attention Pipeline
        </p>
      </div>

      <div style={{ padding: '1.5rem' }}>

        {/* ── Pipeline flow (all steps, click to navigate) ── */}
        <div style={{
          display: 'flex', alignItems: 'center', flexWrap: 'wrap',
          gap: '0', marginBottom: '1.5rem', justifyContent: 'center',
        }}>
          {STEPS.map((step, i) => (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Node */}
              <button
                onClick={() => setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                title={step.description}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '0.25rem', padding: '0.5rem 0.625rem',
                  borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                  border: active === i
                    ? `2px solid ${step.color}`
                    : '2px solid transparent',
                  background: active === i
                    ? `${step.color}18`
                    : hovered === i
                      ? 'var(--color-surface-2)'
                      : 'transparent',
                  transition: 'all 150ms',
                  minWidth: '4.5rem',
                  textAlign: 'center',
                }}
              >
                {/* Step number bubble */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '1.625rem', height: '1.625rem', borderRadius: '50%',
                  fontSize: '0.75rem', fontWeight: 700,
                  background: i <= active ? step.color : 'var(--color-surface-2)',
                  color: i <= active ? '#fff' : 'var(--color-text-tertiary)',
                  border: `1px solid ${i <= active ? step.color : 'var(--color-border)'}`,
                  transition: 'all 200ms',
                }}>
                  {step.id}
                </span>
                {/* Short label */}
                <span style={{
                  fontSize: '0.7rem', fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  color: i <= active ? step.color : 'var(--color-text-tertiary)',
                  whiteSpace: 'nowrap',
                  transition: 'color 200ms',
                }}>
                  {step.short}
                </span>
                {/* Shape badge */}
                <span style={{
                  fontSize: '0.6rem', color: 'var(--color-text-tertiary)',
                  background: 'var(--color-surface-2)',
                  borderRadius: '999px', padding: '0 0.375rem',
                  border: '1px solid var(--color-border)',
                  whiteSpace: 'nowrap',
                }}>
                  {step.shape}
                </span>
              </button>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <span style={{
                  color: i < active ? 'var(--color-accent)' : 'var(--color-border)',
                  fontSize: '1rem', margin: '0 0.125rem', lineHeight: 1,
                  transition: 'color 200ms',
                }}>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ── Active step detail card ── */}
        <div style={{
          borderRadius: 'var(--radius-xl)', overflow: 'hidden',
          border: `1px solid ${current.color}`,
          background: `${current.color}0D`,
          marginBottom: '1.5rem',
        }}>
          {/* Card header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1.125rem',
            background: `${current.color}18`,
            borderBottom: `1px solid ${current.color}40`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '1.875rem', height: '1.875rem', borderRadius: '50%',
                fontSize: '0.875rem', fontWeight: 700,
                background: current.color, color: '#fff',
              }}>
                {current.id}
              </span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: current.color }}>
                {current.label}
              </span>
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              padding: '0.2rem 0.625rem', borderRadius: '999px',
              background: `${current.color}22`, color: current.color,
              border: `1px solid ${current.color}44`,
            }}>
              {current.shape}
            </span>
          </div>

          {/* Card body */}
          <div style={{ padding: '1rem 1.125rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              {current.description}
            </p>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.875rem',
              padding: '0.5rem 0.875rem', borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
              color: current.color, fontWeight: 600,
            }}>
              {current.formula}
            </div>
          </div>
        </div>

        {/* ── Step navigation buttons ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setActive(Math.max(0, active - 1))}
            disabled={active === 0}
            style={{
              padding: '0.5rem 1.125rem', borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem', fontWeight: 500, cursor: active === 0 ? 'not-allowed' : 'pointer',
              border: '1px solid var(--color-border)',
              background: active === 0 ? 'transparent' : 'var(--color-surface-2)',
              color: active === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-secondary)',
              transition: 'all 150ms',
            }}>
            ← Previous
          </button>

          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>
            Step {active + 1} of {STEPS.length}
          </span>

          <button
            onClick={() => setActive(Math.min(STEPS.length - 1, active + 1))}
            disabled={active === STEPS.length - 1}
            style={{
              padding: '0.5rem 1.125rem', borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem', fontWeight: 500,
              cursor: active === STEPS.length - 1 ? 'not-allowed' : 'pointer',
              border: `1px solid ${active === STEPS.length - 1 ? 'var(--color-border)' : 'var(--color-accent)'}`,
              background: active === STEPS.length - 1 ? 'transparent' : 'var(--color-accent)',
              color: active === STEPS.length - 1 ? 'var(--color-text-tertiary)' : '#fff',
              transition: 'all 150ms',
            }}>
            Next →
          </button>
        </div>

        {/* ── Complete formula (shown when on last step) ── */}
        {active === STEPS.length - 1 && (
          <div style={{
            padding: '0.875rem 1.125rem', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-success-border)',
            background: 'var(--color-success-bg)',
            textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 0.375rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-success-text)' }}>
              Complete Formula
            </p>
            <p style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--color-success-text)', fontWeight: 600 }}>
              {FULL_FORMULA}
            </p>
          </div>
        )}

        {/* ── Caption ── */}
        <p style={{ marginTop: '1rem', fontSize: '0.8125rem', fontStyle: 'italic', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          Click any step to jump to it. Use the navigation buttons to move through the pipeline.
        </p>
      </div>
    </figure>
  );
}
