'use client';

/**
 * LogitToProbTable — Tracing Numbers from Raw Logits to Softmax Probabilities.
 *
 * Displays the complete mathematical step-by-step conversion for:
 * z_i (Logits) → e^(z_i) (Exponentiation) → P_i = e^(z_i) / sum(e^(z_j)) (Probabilities)
 *
 * Highlights:
 * 1. Raw logits can be positive or negative.
 * 2. Exponentiation makes all numbers strictly positive (> 0).
 * 3. Normalization divides by the sum of all exponentials (162,817.2), producing exact probabilities summing to 1.0 (100%).
 *
 * Usage in MDX: <LogitToProbTable />
 */

import React, { useState } from 'react';

interface TraceRow {
  token: string;
  tokenId: number;
  logit: number;
  logitFormatted: string;
  expExact: number;
  expFormatted: string;
  probExact: number;
  probPercent: string;
  probDecimal: string;
  color: string;
  note: string;
}

const TRACE_DATA: TraceRow[] = [
  {
    token: 'AI',
    tokenId: 9552,
    logit: 12.0,
    logitFormatted: '+12.0',
    expExact: 162754.791,
    expFormatted: '162,754.8',
    probExact: 0.89,
    probPercent: '89.0%',
    probDecimal: '0.890',
    color: 'var(--color-accent)',
    note: 'Dominates the distribution due to exponential scaling (e¹²)',
  },
  {
    token: 'computer',
    tokenId: 4831,
    logit: 4.0,
    logitFormatted: '+4.0',
    expExact: 54.598,
    expFormatted: '54.6',
    probExact: 0.08,
    probPercent: '8.0%',
    probDecimal: '0.080',
    color: '#38bdf8',
    note: 'Moderate positive score, plausible alternative',
  },
  {
    token: 'pizza',
    tokenId: 31824,
    logit: 2.0,
    logitFormatted: '+2.0',
    expExact: 7.389,
    expFormatted: '7.4',
    probExact: 0.02,
    probPercent: '2.0%',
    probDecimal: '0.020',
    color: '#eab308',
    note: 'Low compatibility in tech context',
  },
  {
    token: 'dog',
    tokenId: 18240,
    logit: -1.0,
    logitFormatted: '-1.0',
    expExact: 0.368,
    expFormatted: '0.37',
    probExact: 0.01,
    probPercent: '1.0%',
    probDecimal: '0.010',
    color: '#ef4444',
    note: 'Negative logit turns into a small positive fraction (e⁻¹ ≈ 0.37)',
  },
];

const TOTAL_EXP = '162,817.2';
const TOTAL_PROB_PERCENT = '100.0%';
const TOTAL_PROB_DECIMAL = '1.000';

export default function LogitToProbTable({
  title = 'From Logits to Probabilities: Numerical Trace',
  caption = 'Tracing the step-by-step mathematical conversion from raw unconstrained logits to valid Softmax probabilities.',
}: {
  title?: string;
  caption?: string;
}) {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'breakdown'>('table');

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

        {/* View toggles */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            background: 'var(--color-surface)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'table' ? 'var(--color-accent)' : 'transparent',
              color: activeTab === 'table' ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            Conversion Table
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breakdown')}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'breakdown' ? 'var(--color-accent)' : 'transparent',
              color: activeTab === 'breakdown' ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            Step-by-Step Breakdown
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ padding: '1.5rem 1.25rem' }}>
        {activeTab === 'table' ? (
          <div>
            {/* Table Container */}
            <div
              style={{
                overflowX: 'auto',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: 'var(--color-surface)',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <th
                      style={{
                        padding: '0.875rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      Token
                    </th>
                    <th
                      style={{
                        padding: '0.875rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      Raw Logit (zᵢ)
                    </th>
                    <th
                      style={{
                        padding: '0.875rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-tertiary)',
                      }}
                    >
                      Exponent (eᶻⁱ)
                    </th>
                    <th
                      style={{
                        padding: '0.875rem 1rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--color-text-tertiary)',
                        minWidth: '220px',
                      }}
                    >
                      Probability (Pᵢ = eᶻⁱ / Σ)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TRACE_DATA.map((row, idx) => {
                    const isSelected = selectedTokenIdx === idx;
                    return (
                      <tr
                        key={row.token}
                        onClick={() => setSelectedTokenIdx(isSelected ? null : idx)}
                        style={{
                          borderBottom: '1px solid var(--color-border)',
                          background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                          cursor: 'pointer',
                          transition: 'background 150ms ease',
                        }}
                      >
                        {/* Token Name + ID */}
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                color: row.color,
                              }}
                            >
                              "{row.token}"
                            </span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                color: 'var(--color-text-tertiary)',
                                fontFamily: 'var(--font-mono)',
                              }}
                            >
                              #{row.tokenId}
                            </span>
                          </div>
                        </td>

                        {/* Raw Logit */}
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              fontSize: '0.9rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              background: row.logit >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: row.logit >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                              border: `1px solid ${row.logit >= 0 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                              display: 'inline-block',
                            }}
                          >
                            {row.logitFormatted}
                          </span>
                        </td>

                        {/* Exponent */}
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 600,
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {row.expFormatted}
                          </span>
                        </td>

                        {/* Probability with Visual Progress Bar */}
                        <td style={{ padding: '0.875rem 1rem' }}>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '0.25rem',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontWeight: 700,
                                  color: row.probExact >= 0.5 ? 'var(--color-success)' : 'var(--color-text-primary)',
                                }}
                              >
                                {row.probPercent}{' '}
                                <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 500, fontSize: '0.8rem' }}>
                                  ({row.probDecimal})
                                </span>
                              </span>
                            </div>

                            {/* Mini bar */}
                            <div
                              style={{
                                height: '6px',
                                width: '100%',
                                background: 'var(--color-surface)',
                                borderRadius: '999px',
                                overflow: 'hidden',
                                border: '1px solid var(--color-border)',
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${Math.max(2, row.probExact * 100)}%`,
                                  background: row.probExact >= 0.5
                                    ? 'var(--color-success)'
                                    : row.logit >= 0
                                    ? row.color
                                    : 'var(--color-error)',
                                  borderRadius: '999px',
                                  transition: 'width 300ms ease',
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Total / Sum Row */}
                  <tr
                    style={{
                      background: 'var(--color-surface)',
                      borderTop: '2px solid var(--color-border)',
                      fontWeight: 700,
                    }}
                  >
                    <td style={{ padding: '1rem 1rem' }}>
                      <span
                        style={{
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          letterSpacing: '0.1em',
                          color: 'var(--color-accent)',
                          fontWeight: 800,
                        }}
                      >
                        Total (Sum Σ)
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                      —
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {TOTAL_EXP}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', display: 'block' }}>
                        (Denominator Σ eᶻʲ)
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          color: 'var(--color-success)',
                          fontSize: '0.95rem',
                        }}
                      >
                        {TOTAL_PROB_DECIMAL}{' '}
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)' }}>
                          ({TOTAL_PROB_PERCENT})
                        </span>
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', display: 'block' }}>
                        (Strict 100% Probability Sum)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Selected Token Note Card */}
            {selectedTokenIdx !== null && (
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                    "{TRACE_DATA[selectedTokenIdx].token}":
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {TRACE_DATA[selectedTokenIdx].note}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-primary)',
                    background: 'var(--color-surface)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  Calculation: {TRACE_DATA[selectedTokenIdx].expFormatted} ÷ {TOTAL_EXP} = {TRACE_DATA[selectedTokenIdx].probPercent}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Step-by-Step Breakdown Tab */
          <div style={{ display: 'grid', gap: '1rem' }}>
            {/* Step 1 Card */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  1
                </span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                  Raw Logits (zᵢ) — Unbounded Compatibility Scores
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Logits represent dot products between the hidden state and token vectors. Scores can be positive (<code>+12.0</code> for "AI"), zero, or negative (<code>-1.0</code> for "dog"). They do not sum to 1.0 (their raw sum is <code>17.0</code>).
              </p>
            </div>

            {/* Step 2 Card */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#a855f7',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  2
                </span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                  Exponentiation (eᶻⁱ) — Strictly Positive & Non-Linear
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Applying <code>e^z</code> guarantees every number becomes strictly positive: negative <code>-1.0</code> becomes <code>0.37</code>, while <code>+12.0</code> explodes to <code>162,754.8</code>. The sum of all exponentials is <strong>Σ eᶻʲ = 162,817.2</strong>.
              </p>
            </div>

            {/* Step 3 Card */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--color-success)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  3
                </span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '0.9rem' }}>
                  Normalization (Pᵢ = eᶻⁱ / Σ) — Valid Probability Distribution
                </span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Dividing each exponent by the sum <code>162,817.2</code> normalizes every candidate: "AI" gets <code>162,754.8 / 162,817.2 = 89.0%</code> (0.890), "computer" gets <code>8.0%</code>, "pizza" gets <code>2.0%</code>, and "dog" gets <code>1.0%</code>. The sum is strictly <strong>1.000 (100.0%)</strong>.
              </p>
            </div>
          </div>
        )}

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
