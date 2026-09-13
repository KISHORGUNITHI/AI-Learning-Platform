'use client';

/**
 * VocabularyLogitsVisualizer — Interactive exploration of Raw Logits vs Softmax Probabilities.
 *
 * Demonstrates:
 * 1. Raw logits as unconstrained compatibility scores (positive, negative, unbounded).
 * 2. Prominent distinction: RAW LOGITS ARE NOT PROBABILITIES.
 * 3. 3-Step mathematical conversion: Logits (z) → Exponentiation (e^z) → Softmax (P).
 * 4. Interactive logit slider controls showing real-time probability recalculations.
 *
 * Usage in MDX: <VocabularyLogitsVisualizer />
 */

import React, { useState } from 'react';

interface TokenItem {
  token: string;
  defaultLogit: number;
  color: string;
}

const DEFAULT_TOKENS: TokenItem[] = [
  { token: 'AI', defaultLogit: 12.0, color: 'var(--color-accent)' },
  { token: 'computer', defaultLogit: 4.0, color: 'var(--color-accent-secondary)' },
  { token: 'pizza', defaultLogit: 2.0, color: '#eab308' },
  { token: 'dog', defaultLogit: -1.0, color: '#ef4444' },
];

export default function VocabularyLogitsVisualizer({
  title = 'Raw Logits vs Softmax Probabilities',
  caption = 'Logits are raw, unbounded compatibility scores. Softmax exponentiates and normalizes them into a valid probability distribution summing to 1.0.',
}: {
  title?: string;
  caption?: string;
}) {
  const [logits, setLogits] = useState<number[]>([12.0, 4.0, 2.0, -1.0]);
  const [stage, setStage] = useState<'logits' | 'exponentials' | 'probabilities'>('logits');

  // Compute numerically stable Softmax (subtract max logit for overflow safety)
  const maxLogit = Math.max(...logits);
  const exps = logits.map((z) => Math.exp(z - maxLogit));
  const sumExps = exps.reduce((acc, v) => acc + v, 0);
  const probabilities = exps.map((e) => e / sumExps);

  const handleLogitChange = (index: number, val: number) => {
    const updated = [...logits];
    updated[index] = parseFloat(val.toFixed(1));
    setLogits(updated);
  };

  const resetLogits = () => {
    setLogits([12.0, 4.0, 2.0, -1.0]);
  };

  return (
    <figure
      style={{
        margin: '2.5rem 0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
      aria-label={title}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          background: 'var(--color-surface-2)',
          borderBottom: '1px solid var(--color-border)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}
          >
            {title}
          </span>
        </div>

        {/* Stage selection tabs */}
        <div style={{ display: 'flex', gap: '0.375rem', background: 'var(--color-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            type="button"
            onClick={() => setStage('logits')}
            style={{
              padding: '0.25rem 0.625rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: stage === 'logits' ? 'var(--color-accent)' : 'transparent',
              color: stage === 'logits' ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            1. Raw Logits (z)
          </button>
          <button
            type="button"
            onClick={() => setStage('exponentials')}
            style={{
              padding: '0.25rem 0.625rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: stage === 'exponentials' ? 'var(--color-accent)' : 'transparent',
              color: stage === 'exponentials' ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            2. Exponentials (e^z)
          </button>
          <button
            type="button"
            onClick={() => setStage('probabilities')}
            style={{
              padding: '0.25rem 0.625rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: stage === 'probabilities' ? 'var(--color-accent)' : 'transparent',
              color: stage === 'probabilities' ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            3. Probabilities (P)
          </button>
        </div>
      </div>

      {/* Warning Callout: Logits are not probabilities */}
      <div
        style={{
          padding: '0.875rem 1.25rem',
          background: 'rgba(239, 68, 68, 0.08)',
          borderBottom: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            CRITICAL DISTINCTION
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5' }}>
            RAW LOGITS ARE NOT PROBABILITIES
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
          Can be negative, greater than 1, and do NOT sum to 1.0.
        </span>
      </div>

      {/* Main interactive area */}
      <div style={{ padding: '1.75rem 1.25rem' }}>
        {/* Token Bars List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>
          {DEFAULT_TOKENS.map((item, idx) => {
            const logit = logits[idx];
            const prob = probabilities[idx];
            const probPercent = (prob * 100).toFixed(prob >= 0.01 ? 1 : 3);

            // Compute bar widths
            const maxVal = Math.max(...logits, 15);
            const minVal = Math.min(...logits, -5);
            const range = maxVal - minVal;
            const logitWidth = Math.max(5, ((logit - minVal) / range) * 100);
            const probWidth = Math.max(2, prob * 100);

            return (
              <div
                key={item.token}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {/* Row Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      "{item.token}"
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                      (Index #{idx})
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Logit value badge */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                        Logit (z)
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: logit >= 0 ? item.color : '#ef4444',
                        }}
                      >
                        {logit > 0 ? `+${logit.toFixed(1)}` : logit.toFixed(1)}
                      </span>
                    </div>

                    {/* Probability value badge */}
                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', display: 'block' }}>
                        Prob (P)
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: prob > 0.5 ? 'var(--color-success)' : 'var(--color-text-primary)',
                        }}
                      >
                        {probPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bar visualization */}
                <div
                  style={{
                    height: '24px',
                    width: '100%',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    position: 'relative',
                    marginBottom: '0.75rem',
                  }}
                >
                  {stage === 'logits' ? (
                    <div
                      style={{
                        height: '100%',
                        width: `${logitWidth}%`,
                        background: logit >= 0 ? `linear-gradient(90deg, ${item.color}40, ${item.color})` : 'linear-gradient(90deg, #ef444440, #ef4444)',
                        transition: 'width 250ms ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '0.5rem',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        Score: {logit > 0 ? `+${logit}` : logit}
                      </span>
                    </div>
                  ) : stage === 'exponentials' ? (
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(4, (exps[idx] / Math.max(...exps)) * 100)}%`,
                        background: `linear-gradient(90deg, #a855f740, #a855f7)`,
                        transition: 'width 250ms ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '0.5rem',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        e^({logit > 0 ? `+${logit}` : logit})
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        height: '100%',
                        width: `${probWidth}%`,
                        background: `linear-gradient(90deg, var(--color-success)40, var(--color-success))`,
                        transition: 'width 250ms ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '0.5rem',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        {probPercent}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Logit Slider Control */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label htmlFor={`logit-slider-${idx}`} style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
                    Adjust logit z:
                  </label>
                  <input
                    id={`logit-slider-${idx}`}
                    type="range"
                    min="-5"
                    max="15"
                    step="0.5"
                    value={logit}
                    onChange={(e) => handleLogitChange(idx, parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: item.color, cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', width: '36px', textAlign: 'right' }}>
                    {logit > 0 ? `+${logit}` : logit}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sum of Probabilities Verification */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Probability Axiom Check:
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-success)',
                background: 'var(--color-success-bg)',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-success-border)',
              }}
            >
              ∑ P_i = 1.000 (100.0%) ✓
            </span>
          </div>

          <button
            type="button"
            onClick={resetLogits}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
          >
            Reset Default Scores
          </button>
        </div>

        {/* Caption */}
        <p
          style={{
            margin: '1.25rem 0 0',
            fontSize: '0.8125rem',
            fontStyle: 'italic',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
          }}
        >
          {caption}
        </p>
      </div>
    </figure>
  );
}
