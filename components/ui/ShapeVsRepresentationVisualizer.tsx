'use client';

/**
 * ShapeVsRepresentationVisualizer — Demonstrates the key engineering concept:
 * "Tensor shape stays constant [4 × 768]; representation values evolve."
 *
 * Shows:
 * 1. Blocks 1, 2, 3 ... N side-by-side / sequential comparison
 * 2. Shape invariance ([4 × 768] throughout)
 * 3. Representation evolution (R₀ → R₁ → R₂ → R₃ → ... → R_N)
 * 4. Interactive block inspector showing how information becomes richer.
 *
 * Usage in MDX: <ShapeVsRepresentationVisualizer />
 */

import React, { useState } from 'react';

interface BlockStep {
  id: number;
  blockName: string;
  repSymbol: string;
  shape: string;
  role: string;
  informationContent: string;
  color: string;
}

const BLOCKS: BlockStep[] = [
  {
    id: 0,
    blockName: 'Embedding Layer',
    repSymbol: 'R₀',
    shape: '[4 × 768]',
    role: 'Lookup + Position',
    informationContent: 'Isolated lexical meanings + token index encoding. No cross-token context yet.',
    color: '#A855F7',
  },
  {
    id: 1,
    blockName: 'Transformer Block 1',
    repSymbol: 'R₁',
    shape: '[4 × 768]',
    role: 'Local Context Mixing',
    informationContent: 'First attention pass. Nearby words and punctuation are bound together.',
    color: 'var(--color-accent)',
  },
  {
    id: 2,
    blockName: 'Transformer Block 2',
    repSymbol: 'R₂',
    shape: '[4 × 768]',
    role: 'Syntactic Relations',
    informationContent: 'Subject-verb agreements, phrase boundaries, and grammatical roles established.',
    color: 'var(--color-accent-secondary)',
  },
  {
    id: 3,
    blockName: 'Transformer Block 3',
    repSymbol: 'R₃',
    shape: '[4 × 768]',
    role: 'Semantic Grouping',
    informationContent: 'Clause-level meaning and entity resolution across broader sentence context.',
    color: 'var(--color-warning)',
  },
  {
    id: 4,
    blockName: 'Transformer Block N (Final)',
    repSymbol: 'R_N',
    shape: '[4 × 768]',
    role: 'Discourse & Prediction',
    informationContent: 'Fully synthesized high-level contextual representation aligned with vocabulary logits.',
    color: 'var(--color-success)',
  },
];

export default function ShapeVsRepresentationVisualizer({
  title = 'Shape vs Representation Across the Transformer Stack',
  caption = 'Dimensions remain strictly constant [4 × 768] so outputs can feed directly into next blocks, while learned values evolve R₀ → R₁ → R₂ → ... → R_N.',
}: {
  title?: string;
  caption?: string;
}) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const current = BLOCKS[activeStep];

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-success-text)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          >
            Shape: Invariant [4 × 768]
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ padding: '1.5rem' }}>
        {/* Step Flow Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          {BLOCKS.map((b, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={b.id}
                onClick={() => setActiveStep(idx)}
                style={{
                  flex: '1 1 0',
                  minWidth: '6.5rem',
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected ? 'rgba(79, 140, 255, 0.15)' : 'var(--color-surface-2)',
                  border: isSelected ? `1.5px solid ${b.color}` : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 150ms ease',
                }}
              >
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: b.color,
                  }}
                >
                  {b.repSymbol}
                </span>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  {b.shape}
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {b.blockName.replace('Transformer ', '')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Comparison Matrix / Detail Display */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Card 1: Fixed Tensor Shape */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
                Tensor Geometry (Shape)
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', fontWeight: 700 }}>
                STAYS CONSTANT ✓
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px dashed var(--color-border-strong)',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              [ 4 tokens × 768 dimensions ]
            </div>

            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              Because the tensor shape never changes, the output matrix of Block k perfectly matches the expected input matrix format for Block k+1.
            </p>
          </div>

          {/* Card 2: Evolving Representation */}
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(79, 140, 255, 0.05)',
              border: `1px solid ${current.color}55`,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: current.color, letterSpacing: '0.08em' }}>
                Representation State: {current.repSymbol}
              </span>
              <span style={{ fontSize: '0.7rem', color: current.color, fontWeight: 700 }}>
                CHANGES CONTINUOUSLY ⚡
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                padding: '1rem',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--color-surface)',
                border: `1px solid ${current.color}33`,
              }}
            >
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: current.color }}>
                {current.blockName}: {current.role}
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                {current.informationContent}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              <span>Sequence: R₀ → R₁ → R₂ → R₃ → ... → R_N</span>
            </div>
          </div>
        </div>

        {/* Summary Takeaway Banner */}
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--color-accent)' }}>The Core Takeaway:</strong> Think of the tensor as a fixed-size container (4 × 768). Each Transformer block does not resize the container — it refines and enriches the knowledge stored inside every coordinate.
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
