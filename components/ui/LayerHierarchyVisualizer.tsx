'use client';

/**
 * LayerHierarchyVisualizer — Visualizes the conceptual progression of representations
 * across network depth: Early Layers → Middle Layers → Late Layers.
 *
 * Highlights:
 * 1. Early Layers: Surface features (spelling, word identity, punctuation, local words)
 * 2. Middle Layers: Structural patterns (grammar, syntax, subject-object roles, dependencies)
 * 3. Late Layers: Abstract semantics (discourse intent, semantic reasoning, prediction features)
 * 4. Conceptual Disclaimer: Represents emergent empirical tendencies across depth, not rigid hardcoded layer boundaries.
 *
 * Usage in MDX: <LayerHierarchyVisualizer />
 */

import React, { useState } from 'react';

interface LayerTier {
  id: string;
  name: string;
  layerRange: string;
  color: string;
  accentBg: string;
  focus: string;
  keyAspects: string[];
  exampleBehavior: string;
  details: string;
}

const TIERS: LayerTier[] = [
  {
    id: 'early',
    name: 'Early Layers',
    layerRange: 'Layers 1 – 4',
    color: 'var(--color-accent)',
    accentBg: 'rgba(79, 140, 255, 0.12)',
    focus: 'Surface & Local Features',
    keyAspects: ['Spelling & subword assembly', 'Word dictionary identity', 'Punctuation awareness', 'Local n-gram connections'],
    exampleBehavior: 'Binds "New" and "York" into a single entity, tracks commas and sentence boundaries.',
    details: 'Early attention heads tend to attend strongly to immediate neighboring tokens and positional delimiters. The representations transition from raw subword embeddings into basic phrase-level units.',
  },
  {
    id: 'middle',
    name: 'Middle Layers',
    layerRange: 'Layers 5 – 8',
    color: 'var(--color-warning)',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    focus: 'Syntax & Structural Relationships',
    keyAspects: ['Grammar & part of speech', 'Subject-verb agreement', 'Coreference resolution ("it" → "dog")', 'Long-distance dependencies'],
    exampleBehavior: 'Connects the subject "The keys" to the plural verb "are" across intervening prepositional phrases.',
    details: 'Middle attention heads specialize in grammatical relations and syntax trees. The model forms structured graph-like associations across the entire sequence regardless of token distance.',
  },
  {
    id: 'late',
    name: 'Late Layers',
    layerRange: 'Layers 9 – 12+',
    color: 'var(--color-success)',
    accentBg: 'rgba(34, 197, 94, 0.12)',
    focus: 'Semantics, Intent & Prediction',
    keyAspects: ['Discourse & intent synthesis', 'World knowledge integration', 'Contextual reasoning patterns', 'Prediction logit preparation'],
    exampleBehavior: 'Prepares the final token vector to project directly onto vocabulary candidates like "problem" or "exam".',
    details: 'Final layers synthesize high-level semantic abstractions. The final token position condenses the entire sequence history into a dense representation optimized for vocabulary projection via the LM head.',
  },
];

export default function LayerHierarchyVisualizer({
  title = 'Representation Evolution: Early → Middle → Late Layers',
  caption = 'Empirical studies of Transformer depth show representations evolve from local surface features to high-level semantic synthesis.',
}: {
  title?: string;
  caption?: string;
}) {
  const [selectedTier, setSelectedTier] = useState<string>('early');
  const active = TIERS.find((t) => t.id === selectedTier) ?? TIERS[0];

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

        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
          Layer-by-Layer Specialization
        </span>
      </div>

      {/* Main Container */}
      <div style={{ padding: '1.5rem' }}>
        {/* Tier Hierarchy Stack */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-xl)',
                  background: isSelected ? tier.accentBg : 'var(--color-surface-2)',
                  border: isSelected ? `1.5px solid ${tier.color}` : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: tier.color,
                      color: '#0B0F14',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {tier.id === 'early' ? '1' : tier.id === 'middle' ? '2' : '3'}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {tier.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          color: tier.color,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          background: `${tier.color}18`,
                        }}
                      >
                        {tier.layerRange}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      Focus: <strong style={{ color: 'var(--color-text-primary)' }}>{tier.focus}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {tier.keyAspects.slice(0, 2).map((k, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(15, 23, 42, 0.6)',
                        color: 'var(--color-text-tertiary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive on Selected Tier */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: active.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Deep Dive: {active.name} ({active.layerRange})
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Primary Role: {active.focus}
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--color-text-primary)', lineHeight: 1.65 }}>
            {active.details}
          </p>

          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.7)',
              border: `1px solid ${active.color}33`,
              fontSize: '0.875rem',
            }}
          >
            <span style={{ color: active.color, fontWeight: 700 }}>Concrete Example: </span>
            <span style={{ color: 'var(--color-text-secondary)' }}>{active.exampleBehavior}</span>
          </div>

          {/* Key Aspects list */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
            {active.keyAspects.map((aspect, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.3rem 0.625rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                • {aspect}
              </span>
            ))}
          </div>
        </div>

        {/* Important Conceptual Disclaimer Banner */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '0.875rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '0.8125rem',
            color: 'var(--color-warning-text)',
            lineHeight: 1.6,
          }}
        >
          <strong>⚠️ Note on Conceptual Progression:</strong> This early → middle → late hierarchy is an empirical tendency observed across trained models, <em>not</em> a hardcoded programming rule. All Transformer blocks share the same mathematical architecture; the specialization emerges naturally through gradient descent.
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
