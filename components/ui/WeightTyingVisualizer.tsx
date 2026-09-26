'use client';

/**
 * WeightTyingVisualizer — Interactive exploration of Weight Tying in Transformers.
 *
 * Demonstrates:
 * 1. Input Embedding Matrix: Vocabulary → Feature Space [50,000 × 768]
 * 2. Output Projection Matrix: Feature Space → Vocabulary Scores [768 × 50,000]
 * 3. Weight Tying: W_out = E^T (reusing the transposed embedding matrix)
 * 4. Parameter savings calculation (38.4M parameters saved on a 50k vocab model)
 * 5. Semantic intuition: matching dot products against learned word concepts.
 *
 * Usage in MDX: <WeightTyingVisualizer />
 */

import React, { useState } from 'react';

export default function WeightTyingVisualizer({
  title = 'Weight Tying: Embedding Matrix ↔ Output Projection',
  caption = 'Weight tying reuses the input embedding matrix as the transposed output projection head (W_out = E^T), eliminating redundant parameters and enforcing semantic consistency.',
}: {
  title?: string;
  caption?: string;
}) {
  const [tiedMode, setTiedMode] = useState<boolean>(true);
  const [vocabSize, setVocabSize] = useState<number>(50257); // GPT-2 standard
  const [hiddenDim, setHiddenDim] = useState<number>(768);

  const singleMatrixParams = (vocabSize * hiddenDim) / 1_000_000;
  const untiedTotalParams = singleMatrixParams * 2;
  const tiedTotalParams = singleMatrixParams;
  const savedParams = untiedTotalParams - tiedTotalParams;

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

        {/* Weight tying toggle */}
        <div style={{ display: 'flex', gap: '0.375rem', background: 'var(--color-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            type="button"
            onClick={() => setTiedMode(true)}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: tiedMode ? 'var(--color-accent)' : 'transparent',
              color: tiedMode ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            Tied Weights (W = Eᵀ)
          </button>
          <button
            type="button"
            onClick={() => setTiedMode(false)}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: !tiedMode ? 'var(--color-accent)' : 'transparent',
              color: !tiedMode ? '#ffffff' : 'var(--color-text-secondary)',
              transition: 'all 150ms ease',
            }}
          >
            Separate Weights (W ≠ E)
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ padding: '1.75rem 1.25rem' }}>
        {/* Visual Mapping Diagrams */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.75rem',
          }}
        >
          {/* Card 1: Input Embedding Matrix */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.08em' }}>
                  Step 1: Input Embedding
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                  }}
                >
                  Matrix E
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Vocabulary → Feature Space
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                Shape: [{vocabSize.toLocaleString()} × {hiddenDim}]
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Converts discrete token IDs into 768-dimensional dense continuous vectors before entering the Transformer.
              </p>
            </div>

            {/* Visual Box */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface)',
                border: '1px dashed rgba(56, 189, 248, 0.4)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-text-tertiary)',
              }}
            >
              Token ID #9552 ("AI") → Row Vector in E
            </div>
          </div>

          {/* Card 2: Output Projection Matrix */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-surface-2)',
              border: tiedMode ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#a855f7', letterSpacing: '0.08em' }}>
                  Step 2: Output Projection
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    background: 'rgba(168, 85, 247, 0.1)',
                    color: '#a855f7',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                  }}
                >
                  {tiedMode ? 'Matrix W_out = E^T' : 'Matrix W_out (Separate)'}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
                Feature Space → Vocabulary Scores
              </div>

              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#a855f7', marginBottom: '0.75rem' }}>
                Shape: [{hiddenDim} × {vocabSize.toLocaleString()}]
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Projects the final 768-d hidden state into 50,000 vocabulary scores by taking dot products with token column vectors.
              </p>
            </div>

            {/* Visual Box */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-surface)',
                border: '1px dashed rgba(168, 85, 247, 0.4)',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-text-tertiary)',
              }}
            >
              h · Column Vector in W_out → Logit Score for "AI"
            </div>
          </div>
        </div>

        {/* Parameter Comparison & Synergy Banner */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            background: tiedMode ? 'rgba(34, 197, 94, 0.06)' : 'var(--color-surface-2)',
            border: tiedMode ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: tiedMode ? 'var(--color-success)' : 'var(--color-text-tertiary)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
              {tiedMode ? 'Weight Tying Active: 50% Parameter Savings' : 'Separate Weights Architecture'}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {tiedMode ? (
                <span>
                  The model reuses the exact same <strong>{singleMatrixParams.toFixed(1)}M parameters</strong> for both input lookup and output projection. No extra parameters required!
                </span>
              ) : (
                <span>
                  The model allocates two separate weight matrices, consuming <strong>{untiedTotalParams.toFixed(1)}M total parameters</strong> for vocabulary representation.
                </span>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', display: 'block' }}>
              Total Embedding & Head Parameters:
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: tiedMode ? 'var(--color-success)' : 'var(--color-warning)',
              }}
            >
              {tiedMode ? `${tiedTotalParams.toFixed(1)}M` : `${untiedTotalParams.toFixed(1)}M`}
            </span>
          </div>
        </div>

        {/* Semantic intuition callout */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            fontSize: '0.85rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--color-text-primary)' }}>Why Weight Tying Makes Intuitive Sense:</strong> If the vector e_AI in the embedding matrix represents the semantic concept of <em>"AI"</em> at the input, then taking the dot product h · e_AI at the output directly measures how closely the model's current thoughts align with the concept <em>"AI"</em>.
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
