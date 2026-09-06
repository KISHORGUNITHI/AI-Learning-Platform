'use client';

/**
 * TokenEvolutionVisualizer — Demonstrates how a single token's representation vector
 * evolves through the Transformer stack while maintaining the exact same sequence position.
 *
 * Visualizes:
 * - Token position is invariant (Position index stays 2)
 * - Representation vector values change (R₀ → R₁ → R₄ → R₈ → R₁₂)
 * - Feature semantics evolve: from isolated dictionary identity to contextual synthesis
 *
 * Usage in MDX: <TokenEvolutionVisualizer />
 */

import React, { useState } from 'react';

interface LayerState {
  layer: string;
  stageName: string;
  badge: string;
  tokenPos: string;
  shape: string;
  description: string;
  semanticMeaning: string;
  vectorSample: number[];
  dominantFeatures: string[];
}

const EVOLUTION_STAGES: LayerState[] = [
  {
    layer: 'Embedding (H₀)',
    stageName: 'Static Lexical Lookup',
    badge: 'Input Level',
    tokenPos: 'Position 3 ("bank")',
    shape: '[1 × 768]',
    description:
      'Isolated dictionary vector + position encoding. The model knows the word is "bank" at position 3, but has no context yet (river bank? money bank?).',
    semanticMeaning: 'Lexical identity ("bank" dictionary definition) + position 3 encoding',
    vectorSample: [0.12, -0.45, 0.88, 0.05, -0.32, 0.71, -0.19, 0.54],
    dominantFeatures: ['Word spelling', 'Part of speech potential', 'Token position = 3'],
  },
  {
    layer: 'Block 1 (H₁)',
    stageName: 'Local Context Binding',
    badge: 'Early Depth',
    tokenPos: 'Position 3 ("bank")',
    shape: '[1 × 768]',
    description:
      'First attention pass absorbs immediate neighbors ("deposit", "money", "into", "the"). Vector begins shifting away from river/geography meanings.',
    semanticMeaning: 'Word identity + local phrase context ("deposit into the bank")',
    vectorSample: [0.28, -0.12, 0.64, 0.42, -0.58, 0.83, 0.15, 0.31],
    dominantFeatures: ['Local bigram association', 'Punctuation awareness', 'Basic noun phrase grouping'],
  },
  {
    layer: 'Block 4 (H₄)',
    stageName: 'Syntactic & Role Resolution',
    badge: 'Middle Depth',
    tokenPos: 'Position 3 ("bank")',
    shape: '[1 × 768]',
    description:
      'Attention heads resolve grammatical roles. "bank" is established as the prepositional object / destination of the financial transaction verb.',
    semanticMeaning: 'Syntactic role (Indirect Object / Institution) within the sentence predicate',
    vectorSample: [0.55, 0.34, 0.18, 0.79, -0.81, 0.44, 0.62, -0.08],
    dominantFeatures: ['Financial domain resolved', 'Subject-verb-object dependency', 'Clause structure bound'],
  },
  {
    layer: 'Block 8 (H₈)',
    stageName: 'Semantic & Discourse Synthesis',
    badge: 'Deep Representation',
    tokenPos: 'Position 3 ("bank")',
    shape: '[1 × 768]',
    description:
      'Higher-order attention heads integrate intent, paragraph-level context, and user topic. Polysemy is completely resolved.',
    semanticMeaning: 'Commercial banking entity in modern financial transaction context',
    vectorSample: [0.72, 0.68, -0.31, 0.89, -0.92, 0.21, 0.84, -0.45],
    dominantFeatures: ['Domain contextualization', 'Discourse intent', 'Cross-sentence coherence'],
  },
  {
    layer: 'Block 12 (H₁₂)',
    stageName: 'Prediction Preparation',
    badge: 'Final State',
    tokenPos: 'Position 3 ("bank")',
    shape: '[1 × 768]',
    description:
      'The representation contains all synthesized meaning needed by the output projection head to predict what word can logically follow this token.',
    semanticMeaning: 'Final contextual hidden state ready for vocabulary projection (LM Head)',
    vectorSample: [0.89, 0.84, -0.52, 0.96, -0.98, 0.05, 0.91, -0.67],
    dominantFeatures: ['Next-token prediction features', 'High-level contextual synthesis', 'Vocabulary logit alignment'],
  },
];

export default function TokenEvolutionVisualizer({
  title = "One Token's Journey Through the Transformer Stack",
  caption = 'Same token position ("bank" at index 3), but representation evolves from lexical lookup to context-rich synthesis.',
}: {
  title?: string;
  caption?: string;
}) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const current = EVOLUTION_STAGES[activeIdx];

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
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--color-accent-secondary)',
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(147, 197, 253, 0.4)',
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-secondary)',
            }}
          >
            {title}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(79, 140, 255, 0.12)',
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(79, 140, 255, 0.25)',
            }}
          >
            Position: 3 (&quot;bank&quot;)
          </span>
        </div>
      </div>

      {/* Interactive Layer Step Selector */}
      <div style={{ padding: '1.25rem 1.25rem 0.5rem', background: 'rgba(26, 34, 51, 0.4)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
            gap: '0.5rem',
          }}
        >
          {EVOLUTION_STAGES.map((s, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={s.layer}
                onClick={() => setActiveIdx(idx)}
                style={{
                  padding: '0.625rem 0.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'rgba(79, 140, 255, 0.18)' : 'var(--color-surface)',
                  border: isActive ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 150ms ease',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  }}
                >
                  {s.layer.split(' ')[0]}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {s.stageName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Pane */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* State Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {current.layer}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(79, 140, 255, 0.15)',
                  color: 'var(--color-accent)',
                }}
              >
                {current.badge}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-accent-secondary)', fontWeight: 500 }}>
              Stage: {current.stageName}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--color-text-tertiary)' }}>Token Position: Index 3 (Unchanged)</span>
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Shape: {current.shape}</span>
          </div>
        </div>

        {/* Conceptual Contrast: Same Token vs Evolving State */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* Constant: Identity & Position */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Invariant (What Remains Constant)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Input Token:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-primary)' }}>&quot;bank&quot;</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Sequence Slot:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-accent)' }}>Index 3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Tensor Dimension:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-success)' }}>768 floats</span>
              </div>
            </div>
          </div>

          {/* Variable: Representation Content */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(79, 140, 255, 0.06)',
              border: '1px solid rgba(79, 140, 255, 0.25)',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Evolving Content (What Actually Changes)
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              {current.semanticMeaning}
            </p>
          </div>
        </div>

        {/* TSX Numerical Vector Heatmap / Inspection */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.08em' }}>
              Numerical Hidden State Vector Sample (d₀ to d₇ of 768)
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Values update every block
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))',
              gap: '0.375rem',
              marginBottom: '1rem',
            }}
          >
            {current.vectorSample.map((val, dIdx) => {
              const intensity = Math.min(Math.abs(val), 1);
              const isPos = val >= 0;
              const bg = isPos ? `rgba(34, 197, 94, ${0.15 + intensity * 0.4})` : `rgba(239, 68, 68, ${0.15 + intensity * 0.4})`;
              const border = isPos ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';
              return (
                <div
                  key={dIdx}
                  style={{
                    padding: '0.5rem 0.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: bg,
                    border: `1px solid ${border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                    d{dIdx}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: isPos ? '#86EFAC' : '#FCA5A5',
                    }}
                  >
                    {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dominant Learned Features at this layer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: 600 }}>
              Primary Encoded Patterns at this Layer:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {current.dominantFeatures.map((feat, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.625rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(79, 140, 255, 0.08)',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  ✓ {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Explanation */}
        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          {current.description}
        </p>
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
