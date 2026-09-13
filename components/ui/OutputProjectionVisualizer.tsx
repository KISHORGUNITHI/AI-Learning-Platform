'use client';

/**
 * OutputProjectionVisualizer — Interactive visualizer for the Output Projection layer.
 *
 * Demonstrates:
 * 1. Matrix multiplication dimension alignment: [1 × 768] × [768 × 50,000] = [1 × 50,000]
 * 2. Visual matching and cancellation of the inner hidden dimension (768).
 * 3. Linear classifier interpretation: Each column in W_out represents one vocabulary token's feature vector.
 * 4. Interactive token dot product inspection: h · w_token = raw logit score.
 *
 * Usage in MDX: <OutputProjectionVisualizer />
 */

import React, { useState } from 'react';

interface VocabTokenSample {
  token: string;
  tokenId: number;
  logit: number;
  category: string;
  featureWeights: number[];
  compatibility: 'very-high' | 'moderate' | 'low' | 'negative';
}

const SAMPLE_TOKENS: VocabTokenSample[] = [
  {
    token: 'AI',
    tokenId: 9552,
    logit: 12.4,
    category: 'High Context Match',
    featureWeights: [0.82, 0.65, -0.15, 0.94, 0.58, -0.32, 0.77, 0.45],
    compatibility: 'very-high',
  },
  {
    token: 'computer',
    tokenId: 4831,
    logit: 4.1,
    category: 'Related Tech Concept',
    featureWeights: [0.45, 0.32, 0.10, 0.38, 0.15, -0.05, 0.22, 0.18],
    compatibility: 'moderate',
  },
  {
    token: 'pizza',
    tokenId: 31824,
    logit: 2.0,
    category: 'Unrelated Food Concept',
    featureWeights: [0.12, -0.25, 0.35, -0.40, 0.20, 0.15, -0.10, 0.05],
    compatibility: 'low',
  },
  {
    token: 'dog',
    tokenId: 18240,
    logit: -1.2,
    category: 'Negative Compatibility',
    featureWeights: [-0.35, -0.42, 0.18, -0.62, -0.28, 0.40, -0.55, -0.30],
    compatibility: 'negative',
  },
  {
    token: 'learning',
    tokenId: 4673,
    logit: 8.7,
    category: 'High Context Match',
    featureWeights: [0.70, 0.58, -0.10, 0.81, 0.49, -0.20, 0.64, 0.38],
    compatibility: 'very-high',
  },
];

// Sample hidden state vector components for the prompt "I love"
const SAMPLE_HIDDEN_VECTOR = [0.88, 0.62, -0.20, 0.91, 0.54, -0.35, 0.72, 0.41];

export default function OutputProjectionVisualizer({
  title = 'Output Projection: Hidden State to Vocabulary Logits',
  caption = 'The Output Projection matrix projects the 768-dimensional hidden state into 50,000 vocabulary scores via matrix multiplication.',
}: {
  title?: string;
  caption?: string;
}) {
  const [viewMode, setViewMode] = useState<'dimensions' | 'classifier'>('dimensions');
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);

  const selectedToken = SAMPLE_TOKENS[selectedTokenIdx];

  const getCompatibilityBadge = (comp: VocabTokenSample['compatibility']) => {
    switch (comp) {
      case 'very-high':
        return { label: 'Strong Positive Match', color: 'var(--color-success)', bg: 'var(--color-success-bg)' };
      case 'moderate':
        return { label: 'Moderate Match', color: 'var(--color-accent)', bg: 'var(--color-accent-subtle)' };
      case 'low':
        return { label: 'Low Compatibility', color: 'var(--color-warning)', bg: 'rgba(234, 179, 8, 0.1)' };
      case 'negative':
        return { label: 'Negative Compatibility', color: 'var(--color-error)', bg: 'var(--color-error-bg)' };
    }
  };

  const badge = getCompatibilityBadge(selectedToken.compatibility);

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
        <div style={{ display: 'flex', gap: '0.375rem', background: 'var(--color-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            type="button"
            onClick={() => setViewMode('dimensions')}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'dimensions' ? 'var(--color-accent)' : 'transparent',
              color: viewMode === 'dimensions' ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            Matrix Dimensions
          </button>
          <button
            type="button"
            onClick={() => setViewMode('classifier')}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'classifier' ? 'var(--color-accent)' : 'transparent',
              color: viewMode === 'classifier' ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            Classifier / Dot Product
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '1.75rem 1.25rem' }}>
        {viewMode === 'dimensions' ? (
          <div>
            {/* Context Prompt Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Input Context:
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    background: 'var(--color-surface)',
                    padding: '0.125rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  "I love"
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Targeting next token at position t = 2
              </span>
            </div>

            {/* Matrix Multiplication Diagram */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem',
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
              }}
            >
              {/* Matrix 1: Final Hidden State */}
              <div
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-surface)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.08)',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent)', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>
                  Final Hidden State (h)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  [1 × <span style={{ color: '#38bdf8' }}>768</span>]
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Continuous representation vector of the last token
                </div>
              </div>

              {/* Multiplication Operator */}
              <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-tertiary)' }}>
                ×
              </div>

              {/* Matrix 2: Output Projection Matrix */}
              <div
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-surface)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.08)',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#a78bfa', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>
                  Output Projection (W_out)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  [<span style={{ color: '#38bdf8' }}>768</span> × <span style={{ color: '#ec4899' }}>50,000</span>]
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  768 features × 50,000 vocabulary projection weights
                </div>
              </div>

              {/* Equals Operator */}
              <div style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-tertiary)' }}>
                =
              </div>

              {/* Matrix 3: Vocabulary Logits */}
              <div
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-surface)',
                  border: '1px solid rgba(236, 72, 153, 0.5)',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.1)',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#f472b6', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>
                  Vocabulary Logits (z)
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                  [1 × <span style={{ color: '#ec4899' }}>50,000</span>]
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  Exactly one raw compatibility score per vocabulary token
                </div>
              </div>
            </div>

            {/* Dimension Alignment Explanation Box */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.875rem',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '0.125rem',
                }}
              >
                ✓
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Dimension Alignment Rule:</strong> The inner dimension{' '}
                <code style={{ color: '#38bdf8', fontWeight: 700 }}>768</code> matches between the hidden state and projection matrix rows, collapsing during matrix multiplication. The outer dimensions{' '}
                <code style={{ color: 'var(--color-text-primary)' }}>1</code> and <code style={{ color: '#ec4899', fontWeight: 700 }}>50,000</code> define the resulting logit vector shape: exactly one prediction score for all 50,000 tokens in the dictionary.
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Classifier Explanation */}
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              The Output Projection matrix <code style={{ color: 'var(--color-accent)' }}>W_out</code> is literally a <strong>50,000-class linear classifier</strong>. Each column vector <code>w_i</code> (768 dimensions) is a learned vector representing vocabulary token <code>i</code>. Computing the dot product <code>h · w_i</code> produces the logit score for that token.
            </p>

            {/* Token Selector Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {SAMPLE_TOKENS.map((item, idx) => (
                <button
                  key={item.token}
                  type="button"
                  onClick={() => setSelectedTokenIdx(idx)}
                  style={{
                    padding: '0.4rem 0.875rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedTokenIdx === idx ? 'var(--color-accent)' : 'var(--color-border)',
                    background: selectedTokenIdx === idx ? 'var(--color-accent-subtle)' : 'var(--color-surface-2)',
                    color: selectedTokenIdx === idx ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    transition: 'all 150ms ease',
                  }}
                >
                  "{item.token}" (Score: {item.logit > 0 ? `+${item.logit}` : item.logit})
                </button>
              ))}
            </div>

            {/* Dot Product Calculation Detail Card */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                marginBottom: '1rem',
              }}
            >
              {/* Header with Token info and Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Token Column in W_out:
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                    "{selectedToken.token}" <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-tertiary)' }}>(Token ID #{selectedToken.tokenId})</span>
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    background: badge.bg,
                    border: `1px solid ${badge.color}40`,
                    color: badge.color,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {badge.label}
                </div>
              </div>

              {/* Dot Product Equation Display */}
              <div
                style={{
                  background: 'var(--color-surface)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  lineHeight: 1.8,
                  marginBottom: '1rem',
                }}
              >
                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  // Vector dot product across 768 dimensions:
                </div>
                <div style={{ color: 'var(--color-text-primary)' }}>
                  <span style={{ color: '#38bdf8' }}>h</span> · <span style={{ color: '#ec4899' }}>w_"{selectedToken.token}"</span> ={' '}
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    ({SAMPLE_HIDDEN_VECTOR[0]} × {selectedToken.featureWeights[0]}) + ({SAMPLE_HIDDEN_VECTOR[1]} × {selectedToken.featureWeights[1]}) + ... + ({SAMPLE_HIDDEN_VECTOR[7]} × {selectedToken.featureWeights[7]})
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Raw Logit Score (z_{selectedToken.tokenId}):
                  </span>
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: selectedToken.logit >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                    }}
                  >
                    {selectedToken.logit > 0 ? `+${selectedToken.logit}` : selectedToken.logit}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {selectedToken.logit > 8 ? (
                  <span>
                    🚀 <strong>High Alignment:</strong> The hidden state features for "I love" strongly align with the semantic vector for "{selectedToken.token}", producing a very large positive dot product.
                  </span>
                ) : selectedToken.logit >= 0 ? (
                  <span>
                    ⚡ <strong>Partial Alignment:</strong> The hidden state shares some semantic dimensions with "{selectedToken.token}", yielding a moderate positive score.
                  </span>
                ) : (
                  <span>
                    ❄️ <strong>Negative Compatibility:</strong> The hidden state features oppose "{selectedToken.token}", resulting in a negative logit score (z &lt; 0).
                  </span>
                )}
              </div>
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
