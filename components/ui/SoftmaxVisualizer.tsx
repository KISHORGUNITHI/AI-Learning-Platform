'use client';

/**
 * SoftmaxVisualizer — animates the three-stage transformation:
 * Scaled Scores → Exponentials → Normalized Probabilities
 *
 * Usage: <SoftmaxVisualizer />
 */

import { useState } from 'react';

const TOKENS  = ['I', 'Love', 'AI'];
const SCORES  = [3.46, 2.96, 2.67];
const COLORS  = ['var(--color-accent)', 'var(--color-accent-secondary)', 'var(--color-success)'];
const STAGE_LABELS = ['Scaled Scores', 'Exponentials', 'Attention Weights'];

function softmax(vals: number[]): number[] {
  const exps = vals.map(v => Math.exp(v));
  const sum  = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => parseFloat((e / sum).toFixed(2)));
}

const EXPS    = SCORES.map(s => parseFloat(Math.exp(s).toFixed(2)));
const WEIGHTS = softmax(SCORES);

const STAGES = [SCORES, EXPS, WEIGHTS];
const MAX_BY_STAGE = STAGES.map(s => Math.max(...s));

export default function SoftmaxVisualizer() {
  const [stage, setStage] = useState(0);
  const values  = STAGES[stage];
  const maxVal  = MAX_BY_STAGE[stage];
  const isProbs = stage === 2;

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
          Softmax: From Scores to Probabilities
        </p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Stage buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {STAGE_LABELS.map((label, i) => (
            <button key={i} onClick={() => setStage(i)}
              style={{
                padding: '0.35rem 0.875rem', borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer', border: 'none',
                background: stage === i ? 'var(--color-accent)' : 'var(--color-surface-2)',
                color: stage === i ? '#fff' : 'var(--color-text-secondary)',
                transition: 'all 150ms',
              }}>
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {/* Stage formula */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)', marginBottom: '1.25rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
          {stage === 0 && 'Scaled scores from QKᵀ / √d'}
          {stage === 1 && 'Apply eˣ to each score → all values positive'}
          {stage === 2 && 'Divide each by the sum → probabilities that sum to 1'}
        </p>

        {/* Bar chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '9rem', marginBottom: '1rem' }}>
          {values.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: COLORS[i], marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                {isProbs ? (v * 100).toFixed(0) + '%' : v}
              </span>
              <div style={{
                width: '100%',
                height: `${(v / maxVal) * 100}%`,
                minHeight: '4px',
                background: `${COLORS[i]}30`,
                border: `2px solid ${COLORS[i]}`,
                borderRadius: '4px 4px 0 0',
                transition: 'height 350ms cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
          ))}
        </div>

        {/* Token labels */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {TOKENS.map((t, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: COLORS[i] }}>{t}</div>
          ))}
        </div>

        {/* Sum row — only for probabilities */}
        {isProbs && (
          <div style={{
            marginTop: '1.25rem', padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-lg)', background: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            textAlign: 'center', fontSize: '0.9rem', fontFamily: 'var(--font-mono)',
            color: 'var(--color-success-text)', fontWeight: 600,
          }}>
            {WEIGHTS.map((w, i) => (
              <span key={i}>
                {w}
                {i < WEIGHTS.length - 1 && <span style={{ color: 'var(--color-text-tertiary)', margin: '0 0.5rem' }}>+</span>}
              </span>
            ))}
            <span style={{ color: 'var(--color-text-tertiary)', margin: '0 0.5rem' }}>=</span>
            <span style={{ color: 'var(--color-success-text)' }}>1.00 ✓</span>
          </div>
        )}

        {/* Caption */}
        <p style={{ marginTop: '1rem', fontSize: '0.8125rem', fontStyle: 'italic', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          Softmax converts scaled Attention Scores into probabilities that determine how much attention each token receives.
        </p>
      </div>
    </figure>
  );
}
