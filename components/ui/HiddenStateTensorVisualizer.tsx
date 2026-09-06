'use client';

/**
 * HiddenStateTensorVisualizer — Interactive tensor matrix component demonstrating
 * what a Hidden State Tensor is: [sequence_length × hidden_size].
 *
 * Shows:
 * 1. 4 token rows (e.g. ["The", "student", "solved", "the"])
 * 2. 768 hidden dimensions (sampled with d₀...d₇ + ellipsis + d₇₆₇)
 * 3. Row-level inspection (every row is one token's distributed state)
 * 4. Layer switching: Embedding H₀ → H₁ → H₆ → H₁₂ showing constant shape [4 × 768] but mutating values.
 *
 * Usage in MDX: <HiddenStateTensorVisualizer />
 */

import React, { useState } from 'react';

interface TensorLayer {
  name: string;
  badge: string;
  shape: string;
  description: string;
  matrix: number[][];
}

const TOKENS = ['The', 'student', 'solved', 'the'];

const LAYER_STATES: TensorLayer[] = [
  {
    name: 'Initial Embedding (H₀)',
    badge: 'Input State',
    shape: '[4 × 768]',
    description: 'Initial token embeddings + positional encodings. Each row holds only local lexical and positional information.',
    matrix: [
      [0.85, -0.12, 0.44, -0.67, 0.19, -0.38, 0.72, 0.05],
      [0.14, 0.92, -0.31, 0.58, -0.84, 0.23, -0.41, 0.69],
      [-0.45, 0.28, 0.76, -0.15, 0.63, 0.81, -0.22, -0.54],
      [0.81, -0.10, 0.48, -0.62, 0.22, -0.35, 0.70, 0.08],
    ],
  },
  {
    name: 'After Block 1 (H₁)',
    badge: 'Layer 1 Output',
    shape: '[4 × 768]',
    description: 'First stage of self-attention and FFN. Token representations begin mixing with adjacent tokens.',
    matrix: [
      [0.62, 0.15, 0.58, -0.42, 0.35, -0.21, 0.61, 0.24],
      [0.38, 0.75, -0.12, 0.64, -0.62, 0.45, -0.18, 0.81],
      [-0.22, 0.49, 0.68, 0.12, 0.51, 0.73, 0.15, -0.32],
      [0.54, 0.21, 0.62, -0.38, 0.44, -0.15, 0.58, 0.35],
    ],
  },
  {
    name: 'After Block 6 (H₆)',
    badge: 'Layer 6 Output',
    shape: '[4 × 768]',
    description: 'Middle layers encode grammatical roles and dependencies (e.g., student = subject, solved = transitive verb).',
    matrix: [
      [0.41, 0.39, 0.62, -0.18, 0.52, 0.08, 0.45, 0.48],
      [0.65, 0.52, 0.18, 0.72, -0.38, 0.68, 0.12, 0.90],
      [0.05, 0.68, 0.54, 0.38, 0.32, 0.61, 0.44, -0.11],
      [0.28, 0.45, 0.71, -0.12, 0.60, 0.12, 0.42, 0.55],
    ],
  },
  {
    name: 'After Block 12 (H₁₂)',
    badge: 'Final Hidden State',
    shape: '[4 × 768]',
    description: 'Deep semantic synthesis. Row 4 ("the") contains rich contextual knowledge ready to predict what the student solved ("exam", "problem", "puzzle").',
    matrix: [
      [0.22, 0.58, 0.69, 0.05, 0.64, 0.28, 0.32, 0.62],
      [0.82, 0.35, 0.41, 0.78, -0.15, 0.82, 0.38, 0.94],
      [0.31, 0.81, 0.42, 0.59, 0.18, 0.49, 0.65, 0.12],
      [0.12, 0.64, 0.78, 0.15, 0.72, 0.31, 0.35, 0.71],
    ],
  },
];

export default function HiddenStateTensorVisualizer({
  title = 'Interactive Hidden State Tensor [4 × 768]',
  caption = 'Each row represents one token. Each column represents one hidden feature dimension. Dimensions stay constant [4 × 768] across all blocks.',
}: {
  title?: string;
  caption?: string;
}) {
  const [activeLayerIdx, setActiveLayerIdx] = useState<number>(0);
  const [selectedRow, setSelectedRow] = useState<number>(3); // default to last token

  const layer = LAYER_STATES[activeLayerIdx];
  const activeToken = TOKENS[selectedRow];

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
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'inline-block',
              boxShadow: '0 0 8px var(--color-accent-glow)',
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}
          >
            {title}
          </p>
        </div>

        {/* Layer Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
          {LAYER_STATES.map((l, idx) => (
            <button
              key={l.name}
              onClick={() => setActiveLayerIdx(idx)}
              style={{
                padding: '0.3rem 0.625rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: activeLayerIdx === idx ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: activeLayerIdx === idx ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
                color: activeLayerIdx === idx ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {l.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Tensor Formula & Shape Badge */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          background: 'rgba(79, 140, 255, 0.04)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.8125rem',
        }}
      >
        <span style={{ color: 'var(--color-text-secondary)' }}>
          Current State: <strong style={{ color: 'var(--color-text-primary)' }}>{layer.name}</strong>
        </span>
        <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--color-accent)' }}>Sequence Length (S): 4</span>
          <span style={{ color: 'var(--color-accent-secondary)' }}>Hidden Size (D): 768</span>
          <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Shape: {layer.shape}</span>
        </div>
      </div>

      {/* Main Tensor Table View */}
      <div style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <div style={{ minWidth: '34rem' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: '0.25rem',
              textAlign: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: '0.5rem',
                    textAlign: 'left',
                    color: 'var(--color-text-tertiary)',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                  }}
                >
                  Token (Row i)
                </th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₀</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₁</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₂</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₃</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₄</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₅</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₆</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₇</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-text-tertiary)' }}>...</th>
                <th style={{ padding: '0.5rem', color: 'var(--color-accent)' }}>d₇₆₇</th>
              </tr>
            </thead>
            <tbody>
              {TOKENS.map((token, rowIdx) => {
                const isSelected = selectedRow === rowIdx;
                const rowValues = layer.matrix[rowIdx];
                return (
                  <tr
                    key={rowIdx}
                    onClick={() => setSelectedRow(rowIdx)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(79, 140, 255, 0.12)' : 'transparent',
                      transition: 'background 150ms ease',
                    }}
                  >
                    {/* Token Label Cell */}
                    <td
                      style={{
                        padding: '0.625rem 0.75rem',
                        textAlign: 'left',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'var(--color-accent)' : 'var(--color-surface-2)',
                        color: isSelected ? '#0B0F14' : 'var(--color-text-primary)',
                        fontWeight: 700,
                        border: isSelected ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ opacity: 0.7, fontSize: '0.65rem' }}>[{rowIdx}]</span>
                        <span>&quot;{token}&quot;</span>
                      </div>
                    </td>

                    {/* Numerical Dimensions */}
                    {rowValues.map((val, colIdx) => {
                      const intensity = Math.min(Math.abs(val), 1);
                      const isPos = val >= 0;
                      const bg = isPos
                        ? `rgba(34, 197, 94, ${0.1 + intensity * 0.35})`
                        : `rgba(239, 68, 68, ${0.1 + intensity * 0.35})`;
                      const textCol = isPos ? '#86EFAC' : '#FCA5A5';
                      return (
                        <td
                          key={colIdx}
                          style={{
                            padding: '0.5rem 0.25rem',
                            borderRadius: 'var(--radius-sm)',
                            background: bg,
                            color: textCol,
                            fontWeight: 600,
                            border: isSelected ? '1px solid rgba(79, 140, 255, 0.3)' : '1px solid transparent',
                          }}
                        >
                          {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                        </td>
                      );
                    })}

                    {/* Ellipsis Cell */}
                    <td style={{ padding: '0.5rem', color: 'var(--color-text-tertiary)', letterSpacing: '0.1em' }}>
                      ···
                    </td>

                    {/* Final Dimension d767 */}
                    <td
                      style={{
                        padding: '0.5rem 0.25rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(79, 140, 255, 0.15)',
                        color: 'var(--color-accent-secondary)',
                        fontWeight: 600,
                        border: isSelected ? '1px solid rgba(79, 140, 255, 0.3)' : '1px solid transparent',
                      }}
                    >
                      {(rowValues[0] * 0.73).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Row Vector Breakdown */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-accent)' }}>
              Selected Vector: Row {selectedRow} → &quot;{activeToken}&quot; (Vector h_{selectedRow} ∈ ℝ⁷⁶⁸)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              1 token × 768 features
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {layer.description}
          </p>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
            💡 Notice that switching layers keeps the exact same 4 rows and 768 columns, but the numerical activations evolve through repeated attention mixing and FFN transformations.
          </div>
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            background: 'var(--color-surface-2)',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.8125rem',
            color: 'var(--color-text-tertiary)',
            textAlign: 'center',
          }}
        >
          {caption}
        </div>
      )}
    </figure>
  );
}
