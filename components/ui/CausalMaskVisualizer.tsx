'use client';

/**
 * CausalMaskVisualizer — Interactive exploration of Causal Masking.
 *
 * Visualizes:
 * 1. Unmasked Attention Matrix (showing future-token information leakage)
 * 2. Causal Mask Applied (setting future scores to -∞)
 * 3. Softmax Output (converting -∞ to 0.00 / 0% attention weights)
 * 4. Token-by-token row inspector showing permitted context
 *
 * Usage in MDX: <CausalMaskVisualizer />
 */

import { useState } from 'react';

const TOKENS = ['I', 'love', 'AI'];

// Raw attention scores before masking
const RAW_SCORES = [
  [2.0, 5.0, 4.0],
  [1.0, 3.0, 4.5],
  [2.0, 4.0, 8.0],
];

// Masked scores with -Infinity in upper triangle (j > i)
const MASKED_SCORES: (number | string)[][] = [
  [2.0, '-∞', '-∞'],
  [1.0, 3.0, '-∞'],
  [2.0, 4.0, 8.0],
];

// Softmax probabilities after masking (row-wise)
const SOFTMAX_PROBS = [
  [1.0, 0.0, 0.0],
  [0.12, 0.88, 0.0],
  [0.0, 0.02, 0.98],
];

export default function CausalMaskVisualizer() {
  const [tab, setTab] = useState<'raw' | 'masked' | 'softmax'>('masked');
  const [selectedRow, setSelectedRow] = useState<number>(0);

  const isFuture = (row: number, col: number) => col > row;

  return (
    <figure
      style={{
        margin: '2rem 0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
      aria-label="Interactive Causal Attention Visualizer"
    >
      {/* Header */}
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
              background: 'var(--color-accent)',
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
              color: 'var(--color-accent)',
            }}
          >
            Interactive Causal Mask Visualizer
          </p>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
          Sequence: <strong>&ldquo;I love AI&rdquo;</strong>
        </span>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Step Mode Controls */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setTab('raw')}
            style={{
              padding: '0.4rem 0.875rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background:
                tab === 'raw'
                  ? 'var(--color-error)'
                  : 'var(--color-surface-2)',
              color: tab === 'raw' ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all 150ms',
            }}
          >
            1. Without Mask (Leakage ✗)
          </button>
          <button
            onClick={() => setTab('masked')}
            style={{
              padding: '0.4rem 0.875rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background:
                tab === 'masked'
                  ? 'var(--color-accent)'
                  : 'var(--color-surface-2)',
              color: tab === 'masked' ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all 150ms',
            }}
          >
            2. Causal Mask (-∞ Applied)
          </button>
          <button
            onClick={() => setTab('softmax')}
            style={{
              padding: '0.4rem 0.875rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background:
                tab === 'softmax'
                  ? 'var(--color-success)'
                  : 'var(--color-surface-2)',
              color: tab === 'softmax' ? '#fff' : 'var(--color-text-secondary)',
              transition: 'all 150ms',
            }}
          >
            3. After Softmax (0% Prob ✓)
          </button>
        </div>

        {/* Dynamic description box */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
          }}
        >
          {tab === 'raw' && (
            <span>
              <strong style={{ color: 'var(--color-error)' }}>
                Without Causal Masking:
              </strong>{' '}
              Every token attends to every token. When predicting what follows{' '}
              <em>&ldquo;I&rdquo;</em>, the model can already see <em>&ldquo;love&rdquo;</em> and <em>&ldquo;AI&rdquo;</em>.
              This future leakage prevents real autoregressive learning.
            </span>
          )}
          {tab === 'masked' && (
            <span>
              <strong style={{ color: 'var(--color-accent)' }}>
                Causal Masking (Lower Triangular):
              </strong>{' '}
              For any column index <code style={{ color: 'var(--color-accent-secondary)' }}>j &gt; i</code> (the future),
              the score is replaced with <code style={{ color: 'var(--color-error)' }}>-∞</code>. Past and present positions (<code style={{ color: 'var(--color-accent-secondary)' }}>j ≤ i</code>) retain their exact scores.
            </span>
          )}
          {tab === 'softmax' && (
            <span>
              <strong style={{ color: 'var(--color-success)' }}>
                Softmax Transformation:
              </strong>{' '}
              Because <code style={{ color: 'var(--color-mono)' }}>e^(-∞) = 0</code>, Softmax maps every masked future position to{' '}
              <strong style={{ color: 'var(--color-success)' }}>exactly 0.00 (0% probability)</strong>. Each row forms a valid probability distribution summing to 1.0.
            </span>
          )}
        </div>

        {/* 3x3 Matrix Grid Visualization */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '1.5rem',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px repeat(3, 90px)',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
            }}
          >
            {/* Top-left empty cell */}
            <div />

            {/* Column Headers (Keys) */}
            {TOKENS.map((token, colIdx) => (
              <div
                key={colIdx}
                style={{
                  textAlign: 'center',
                  padding: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--color-text-tertiary)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Key: &ldquo;{token}&rdquo;
              </div>
            ))}

            {/* Matrix Rows (Queries) */}
            {TOKENS.map((token, rowIdx) => (
              <div key={rowIdx} style={{ display: 'contents' }}>
                {/* Row Header (Query) */}
                <button
                  onClick={() => setSelectedRow(rowIdx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '0.5rem 0.6rem',
                    background:
                      selectedRow === rowIdx
                        ? 'var(--color-surface-3, rgba(255,255,255,0.08))'
                        : 'transparent',
                    border:
                      selectedRow === rowIdx
                        ? '1px solid var(--color-accent)'
                        : '1px solid transparent',
                    borderRadius: 'var(--radius-md)',
                    color:
                      selectedRow === rowIdx
                        ? 'var(--color-accent)'
                        : 'var(--color-text-primary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                  }}
                  title="Click to inspect this token row"
                >
                  Q: &ldquo;{token}&rdquo;
                </button>

                {/* Cells */}
                {TOKENS.map((_, colIdx) => {
                  const future = isFuture(rowIdx, colIdx);
                  const isMaskedTab = tab === 'masked';
                  const isSoftmaxTab = tab === 'softmax';
                  const isRowActive = selectedRow === rowIdx;

                  let cellVal: string | number = RAW_SCORES[rowIdx][colIdx];
                  let bg = 'var(--color-surface-2)';
                  let border = 'var(--color-border)';
                  let textCol = 'var(--color-text-primary)';

                  if (tab === 'raw') {
                    if (future) {
                      bg = 'rgba(239, 68, 68, 0.12)';
                      border = 'rgba(239, 68, 68, 0.4)';
                      textCol = 'var(--color-error)';
                    } else {
                      bg = 'rgba(52, 211, 153, 0.08)';
                      border = 'rgba(52, 211, 153, 0.3)';
                      textCol = 'var(--color-text-primary)';
                    }
                  } else if (isMaskedTab) {
                    cellVal = MASKED_SCORES[rowIdx][colIdx];
                    if (future) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1px dashed var(--color-error)';
                      textCol = 'var(--color-error)';
                    } else {
                      bg = 'rgba(79, 140, 255, 0.1)';
                      border = '1px solid rgba(79, 140, 255, 0.4)';
                      textCol = 'var(--color-accent)';
                    }
                  } else if (isSoftmaxTab) {
                    const prob = SOFTMAX_PROBS[rowIdx][colIdx];
                    cellVal = (prob * 100).toFixed(0) + '%';
                    if (future) {
                      bg = 'rgba(255, 255, 255, 0.02)';
                      border = '1px solid var(--color-border)';
                      textCol = 'var(--color-text-tertiary)';
                    } else {
                      bg = `rgba(52, 211, 153, ${Math.max(0.1, prob * 0.4)})`;
                      border = '1px solid var(--color-success)';
                      textCol = 'var(--color-success)';
                    }
                  }

                  return (
                    <div
                      key={colIdx}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: bg,
                        border: isRowActive
                          ? `2px solid ${border}`
                          : `1px solid ${border}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: textCol,
                        }}
                      >
                        {cellVal}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          marginTop: '2px',
                          color: future
                            ? 'var(--color-error)'
                            : 'var(--color-text-tertiary)',
                        }}
                      >
                        {future
                          ? tab === 'raw'
                            ? 'leak!'
                            : 'blocked'
                          : 'allowed'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Row Context Detail Card */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
              }}
            >
              Row {selectedRow + 1} Inspection: Position {selectedRow + 1} (&ldquo;{TOKENS[selectedRow]}&rdquo;)
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              Allowed Context Tokens:{' '}
              <strong style={{ color: 'var(--color-text-primary)' }}>
                {TOKENS.slice(0, selectedRow + 1).map((t) => `"${t}"`).join(', ')}
              </strong>
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
            }}
          >
            {TOKENS.map((token, colIdx) => {
              const future = isFuture(selectedRow, colIdx);
              const prob = SOFTMAX_PROBS[selectedRow][colIdx];
              return (
                <div
                  key={colIdx}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface)',
                    border: `1px solid ${
                      future ? 'var(--color-border)' : 'var(--color-border-strong, #3b82f644)'
                    }`,
                    opacity: future ? 0.45 : 1,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>&ldquo;{token}&rdquo;</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: future ? 'var(--color-error)' : 'var(--color-success)',
                      }}
                    >
                      {future ? '0.00 (0%)' : `${(prob * 100).toFixed(0)}%`}
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      background: 'var(--color-surface-2)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: future ? '0%' : `${prob * 100}%`,
                        background: 'var(--color-accent)',
                        borderRadius: '3px',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </figure>
  );
}
