'use client';

/**
 * TransformerStackVisualizer — Interactive architecture visualizer for the complete
 * stacked Transformer pipeline.
 *
 * Shows:
 * 1. Input Tokens → Embeddings & Positional Encoding
 * 2. Stack of N Transformer Blocks (Block 1, Block 2, Block 3 ... Block N)
 * 3. Intermediate Hidden States H_1, H_2, ... H_N (constant shape [4 × 768])
 * 4. Final Hidden State → Final LayerNorm → Output Projection → Logits → Prediction
 * 5. Model presets (GPT-2 Small 12L, GPT-2 Medium 24L, GPT-3 96L)
 *
 * Usage in MDX: <TransformerStackVisualizer />
 */

import React, { useState } from 'react';

interface ModelPreset {
  name: string;
  layers: number;
  hiddenDim: number;
  heads: number;
  params: string;
  description: string;
}

const PRESETS: ModelPreset[] = [
  {
    name: 'GPT-2 Small',
    layers: 12,
    hiddenDim: 768,
    heads: 12,
    params: '117M',
    description: '12 stacked Transformer blocks with 768 hidden dimensions.',
  },
  {
    name: 'GPT-2 Medium',
    layers: 24,
    hiddenDim: 1024,
    heads: 16,
    params: '345M',
    description: '24 stacked Transformer blocks with 1024 hidden dimensions.',
  },
  {
    name: 'GPT-3 (175B)',
    layers: 96,
    hiddenDim: 12288,
    heads: 96,
    params: '175B',
    description: '96 stacked Transformer blocks with 12,288 hidden dimensions.',
  },
];

export default function TransformerStackVisualizer({
  title = 'Complete Transformer Stack Architecture',
  caption = 'Repeated Transformer blocks transform representations across depth without changing tensor shape.',
}: {
  title?: string;
  caption?: string;
}) {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [activeStage, setActiveStage] = useState<string>('stack');
  const [activeBlock, setActiveBlock] = useState<number>(1);

  const model = PRESETS[selectedPreset];

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
      {/* Header bar */}
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
          <div>
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
        </div>

        {/* Model Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginRight: '0.25rem' }}>
            Model Preset:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => {
                setSelectedPreset(idx);
                setActiveBlock(1);
              }}
              style={{
                padding: '0.3rem 0.625rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: selectedPreset === idx ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
                background: selectedPreset === idx ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
                color: selectedPreset === idx ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {p.name} ({p.layers}L)
            </button>
          ))}
        </div>
      </div>

      {/* Model Spec Badge */}
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
          <strong style={{ color: 'var(--color-text-primary)' }}>{model.name}</strong>: {model.description}
        </span>
        <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--color-accent)' }}>Depth: {model.layers} Blocks</span>
          <span style={{ color: 'var(--color-accent-secondary)' }}>Hidden: {model.hiddenDim}d</span>
          <span style={{ color: 'var(--color-success)' }}>Params: {model.params}</span>
        </div>
      </div>

      {/* Main interactive diagram */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '38rem',
            gap: '0.5rem',
          }}
        >
          {/* 1. INPUT TOKENS */}
          <div
            onClick={() => setActiveStage('input')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: activeStage === 'input' ? 'rgba(79, 140, 255, 0.12)' : 'var(--color-surface-2)',
              border: activeStage === 'input' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(79, 140, 255, 0.15)',
                  color: 'var(--color-accent)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                INPUT
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Tokens: [&quot;The&quot;, &quot;student&quot;, &quot;solved&quot;, &quot;the&quot;]
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Seq Length: 4
            </span>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, height: 12, background: 'var(--color-accent)', opacity: 0.6 }} />
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '5px solid var(--color-accent)',
                opacity: 0.8,
              }}
            />
          </div>

          {/* 2. EMBEDDING + POSITIONAL ENCODING */}
          <div
            onClick={() => setActiveStage('embedding')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: activeStage === 'embedding' ? 'rgba(168, 85, 247, 0.12)' : 'var(--color-surface-2)',
              border: activeStage === 'embedding' ? '1px solid #A855F7' : '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#D8B4FE',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                H₀
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Token Embedding + Positional Encoding
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#D8B4FE', fontFamily: 'var(--font-mono)' }}>
              [4 × {model.hiddenDim}]
            </span>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, height: 12, background: 'var(--color-accent)', opacity: 0.6 }} />
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '5px solid var(--color-accent)',
                opacity: 0.8,
              }}
            />
          </div>

          {/* 3. TRANSFORMER STACK CONTAINER */}
          <div
            style={{
              width: '100%',
              padding: '1.25rem',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(26, 34, 51, 0.6)',
              border: '1px solid var(--color-border-strong)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.625rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-accent-secondary)',
                }}
              >
                Stacked Transformer Depth ({model.layers} Blocks)
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                Independent learned parameters per block
              </span>
            </div>

            {/* Block 1 */}
            <div
              onClick={() => {
                setActiveBlock(1);
                setActiveStage('block1');
              }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: activeBlock === 1 ? 'rgba(79, 140, 255, 0.15)' : 'var(--color-surface)',
                border: activeBlock === 1 ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--color-accent)',
                      color: '#0B0F14',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    1
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    Transformer Block 1
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Self-Attn + FFN
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: 'var(--color-success-text)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    → H₁ [4 × {model.hiddenDim}]
                  </span>
                </div>
              </div>
            </div>

            {/* Block 2 */}
            <div
              onClick={() => {
                setActiveBlock(2);
                setActiveStage('block2');
              }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: activeBlock === 2 ? 'rgba(79, 140, 255, 0.15)' : 'var(--color-surface)',
                border: activeBlock === 2 ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--color-accent)',
                      color: '#0B0F14',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    2
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    Transformer Block 2
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Self-Attn + FFN
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(34, 197, 94, 0.15)',
                      color: 'var(--color-success-text)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    → H₂ [4 × {model.hiddenDim}]
                  </span>
                </div>
              </div>
            </div>

            {/* Ellipsis / Multi-layer indicator */}
            <div
              onClick={() => {
                setActiveBlock(Math.floor(model.layers / 2));
                setActiveStage('middle');
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: activeStage === 'middle' ? 'rgba(79, 140, 255, 0.1)' : 'transparent',
                border: '1px dashed var(--color-border-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
              }}
            >
              <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.3em' }}>• • •</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>
                Intermediate Blocks 3 to {model.layers - 1} (Repeated Refinement)
              </span>
              <span style={{ color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.3em' }}>• • •</span>
            </div>

            {/* Block N */}
            <div
              onClick={() => {
                setActiveBlock(model.layers);
                setActiveStage('blockN');
              }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-lg)',
                background: activeBlock === model.layers ? 'rgba(79, 140, 255, 0.15)' : 'var(--color-surface)',
                border: activeBlock === model.layers ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: 'var(--color-warning)',
                      color: '#0B0F14',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    N
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    Transformer Block {model.layers} (Final Block)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    Final Self-Attn + FFN
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: 'var(--color-warning-text)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    → H_{'{' + model.layers + '}'} [4 × {model.hiddenDim}]
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, height: 12, background: 'var(--color-accent)', opacity: 0.6 }} />
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '5px solid var(--color-accent)',
                opacity: 0.8,
              }}
            />
          </div>

          {/* 4. FINAL LAYERNORM & OUTPUT PROJECTION */}
          <div
            onClick={() => setActiveStage('output')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: activeStage === 'output' ? 'rgba(34, 197, 94, 0.12)' : 'var(--color-surface-2)',
              border: activeStage === 'output' ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: 'var(--color-success-text)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                LM HEAD
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Final LayerNorm + Vocab Projection
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success-text)', fontFamily: 'var(--font-mono)' }}>
              Logits: [4 × 50,257]
            </span>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 2, height: 12, background: 'var(--color-success)', opacity: 0.6 }} />
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '5px solid var(--color-success)',
                opacity: 0.8,
              }}
            />
          </div>

          {/* 5. NEXT-TOKEN PREDICTION */}
          <div
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1rem' }}>🎯</span>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-success-text)' }}>
                  Next-Token Prediction for position 4:
                </span>
                <span style={{ marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                  &quot;exam&quot; (89.2%)
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Softmax over 50k logits</span>
          </div>
        </div>

        {/* Dynamic Explanatory Footer Card */}
        <div
          style={{
            marginTop: '1.5rem',
            width: '100%',
            maxWidth: '38rem',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          {activeStage === 'input' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-accent)' }}>Input Stage:</strong> Discrete token IDs enter the model.
              The sequence length is 4 tokens. Each token will maintain its exact position throughout the entire stack.
            </p>
          )}
          {activeStage === 'embedding' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: '#D8B4FE' }}>Embedding Stage (H₀):</strong> Token IDs are looked up in the embedding table and added to positional encodings. This creates the initial hidden state tensor of shape <code>[4 × {model.hiddenDim}]</code>.
            </p>
          )}
          {activeStage === 'block1' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-accent)' }}>Transformer Block 1:</strong> First stage of contextual refinement. Self-attention captures initial token interactions; FFN transforms individual features. Produces hidden state <code>H₁ [4 × {model.hiddenDim}]</code> with own parameters.
            </p>
          )}
          {activeStage === 'block2' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-accent)' }}>Transformer Block 2:</strong> Receives <code>H₁</code> as input. Executes another round of self-attention and non-linear transformation using its own unique weights, producing <code>H₂ [4 × {model.hiddenDim}]</code>.
            </p>
          )}
          {activeStage === 'middle' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-accent-secondary)' }}>Middle Depth (Blocks 3 to {model.layers - 1}):</strong> Representations are repeatedly refined. Grammar, syntax, and relational dependencies are progressively composed into the token vectors.
            </p>
          )}
          {activeStage === 'blockN' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-warning-text)' }}>Final Block {model.layers} (H_{'{' + model.layers + '}'}):</strong> The final stage of transformation. The representations now contain rich, high-level semantic information ready for prediction.
            </p>
          )}
          {activeStage === 'output' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-success-text)' }}>Output Head:</strong> The final hidden vector of the last token (<code>[1 × {model.hiddenDim}]</code>) is multiplied by the embedding transpose matrix (<code>[{model.hiddenDim} × 50257]</code>) to compute logits for all 50k vocabulary words.
            </p>
          )}
          {activeStage === 'stack' && (
            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-accent)' }}>Key Engineering Principle:</strong> The tensor shape <code>[4 × {model.hiddenDim}]</code> remains identical across all {model.layers} blocks. No new tokens are created inside the stack — only their representations are transformed.
            </p>
          )}
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
