'use client';

/**
 * LLMSpeakingPipeline — The Master Hero Visual for Day 29.
 *
 * Demonstrates the full End-to-End Speaking & Autoregressive Loop:
 * 1. Current Context (e.g. "I love")
 * 2. Transformer Depth Stack → Final Hidden State h_last [1 × 768]
 * 3. Output Projection Matrix [768 × 50,000] → Vocabulary Logits [1 × 50,000]
 * 4. Temperature Scaling + Softmax Normalization → Probabilities
 * 5. Decoding Strategy (Greedy / Temperature / Top-K / Top-P) → Next Chosen Token ("AI")
 * 6. Append Token to Context → "I love AI"
 * 7. Autoregressive Loop Back → Feeds new context back to generate subsequent tokens!
 *
 * Usage in MDX: <LLMSpeakingPipeline />
 */

import React, { useState, useEffect } from 'react';

interface PromptPreset {
  title: string;
  initialTokens: string[];
  steps: {
    context: string[];
    hiddenFeatures: number[];
    candidates: { token: string; logit: number; prob: number }[];
    chosenToken: string;
    rationale: string;
  }[];
}

const PRESETS: PromptPreset[] = [
  {
    title: '"I love..."',
    initialTokens: ['I', 'love'],
    steps: [
      {
        context: ['I', 'love'],
        hiddenFeatures: [0.88, 0.62, -0.20, 0.91, 0.54, -0.35, 0.72, 0.41],
        candidates: [
          { token: 'AI', logit: 12.4, prob: 0.82 },
          { token: 'coding', logit: 9.8, prob: 0.11 },
          { token: 'learning', logit: 8.5, prob: 0.05 },
          { token: 'pizza', logit: 4.2, prob: 0.02 },
        ],
        chosenToken: 'AI',
        rationale: 'Hidden state aligns strongly with tech/AI semantics after "I love".',
      },
      {
        context: ['I', 'love', 'AI'],
        hiddenFeatures: [0.74, 0.81, 0.15, 0.66, -0.40, 0.55, 0.63, 0.29],
        candidates: [
          { token: 'because', logit: 11.2, prob: 0.76 },
          { token: 'models', logit: 8.9, prob: 0.14 },
          { token: 'research', logit: 7.8, prob: 0.07 },
          { token: 'today', logit: 5.1, prob: 0.03 },
        ],
        chosenToken: 'because',
        rationale: 'The sequence "I love AI" sets up a causal explanatory clause.',
      },
      {
        context: ['I', 'love', 'AI', 'because'],
        hiddenFeatures: [0.65, 0.45, 0.32, 0.88, 0.71, -0.12, 0.58, 0.60],
        candidates: [
          { token: 'it', logit: 13.0, prob: 0.89 },
          { token: 'learning', logit: 8.2, prob: 0.06 },
          { token: 'technology', logit: 7.4, prob: 0.03 },
          { token: 'machines', logit: 6.0, prob: 0.02 },
        ],
        chosenToken: 'it',
        rationale: 'Pronoun "it" refers back to the antecedent "AI".',
      },
      {
        context: ['I', 'love', 'AI', 'because', 'it'],
        hiddenFeatures: [0.82, 0.70, -0.10, 0.95, 0.48, 0.20, 0.79, 0.52],
        candidates: [
          { token: 'transforms', logit: 11.8, prob: 0.78 },
          { token: 'creates', logit: 9.1, prob: 0.13 },
          { token: 'learns', logit: 8.0, prob: 0.07 },
          { token: 'is', logit: 5.8, prob: 0.02 },
        ],
        chosenToken: 'transforms',
        rationale: 'Active verb completing the explanatory predicate.',
      },
    ],
  },
  {
    title: '"The student solved..."',
    initialTokens: ['The', 'student', 'solved', 'the'],
    steps: [
      {
        context: ['The', 'student', 'solved', 'the'],
        hiddenFeatures: [0.68, 0.75, -0.42, 0.85, 0.60, 0.30, 0.70, 0.48],
        candidates: [
          { token: 'problem', logit: 12.8, prob: 0.84 },
          { token: 'equation', logit: 9.9, prob: 0.10 },
          { token: 'puzzle', logit: 8.2, prob: 0.04 },
          { token: 'homework', logit: 5.5, prob: 0.02 },
        ],
        chosenToken: 'problem',
        rationale: '"solved the" transitive verb phrase demands a solvable direct object.',
      },
      {
        context: ['The', 'student', 'solved', 'the', 'problem'],
        hiddenFeatures: [0.55, 0.62, 0.18, 0.70, -0.22, 0.40, 0.58, 0.35],
        candidates: [
          { token: 'with', logit: 10.5, prob: 0.72 },
          { token: 'using', logit: 8.8, prob: 0.16 },
          { token: 'easily', logit: 7.5, prob: 0.08 },
          { token: 'in', logit: 6.0, prob: 0.04 },
        ],
        chosenToken: 'with',
        rationale: 'Preposition introducing the method or tool of solution.',
      },
    ],
  },
];

export default function LLMSpeakingPipeline({
  title = 'The Complete LLM Speaking Pipeline',
  caption = 'The definitive autoregressive loop: The final hidden state is projected to vocabulary logits, converted to probabilities, sampled via decoding, and looped back into the prompt.',
}: {
  title?: string;
  caption?: string;
}) {
  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);
  const [decodingStrategy, setDecodingStrategy] = useState<'greedy' | 'temperature' | 'topk' | 'topp'>('greedy');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const preset = PRESETS[presetIdx];
  const currentStep = preset.steps[Math.min(stepIdx, preset.steps.length - 1)];

  // Autoplay timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActivePipelineStage((prevStage) => {
          if (prevStage < 6) {
            return prevStage + 1;
          } else {
            // Advance to next token generation step
            setStepIdx((prevStep) => {
              if (prevStep < preset.steps.length - 1) {
                return prevStep + 1;
              } else {
                setIsPlaying(false);
                return prevStep;
              }
            });
            return 0;
          }
        });
      }, 900);
    }
    return () => clearInterval(timer);
  }, [isPlaying, preset.steps.length]);

  const PIPELINE_STAGES = [
    { title: '1. Input Context', desc: 'Current token sequence processed by attention layers', badge: 'Tokens' },
    { title: '2. Final Hidden State', desc: 'Continuous vector h_last produced by the final Transformer block', badge: '[1 × 768]' },
    { title: '3. Output Projection', desc: 'Matrix multiplication h × W_out yields raw compatibility scores', badge: '[768 × 50,000]' },
    { title: '4. Vocabulary Logits', desc: 'Unbounded raw scores z across all 50,000 dictionary tokens', badge: '[1 × 50,000]' },
    { title: '5. Softmax Normalization', desc: 'Exponentiates & normalizes logits into valid probabilities summing to 1.0', badge: 'P ∈ [0, 1]' },
    { title: '6. Decoding Selection', desc: `Selects next token via ${decodingStrategy.toUpperCase()} strategy`, badge: 'Next Token' },
    { title: '7. Append & Autoregress', desc: 'Appends emitted token to context and loops back to Step 1', badge: 'Loop ↺' },
  ];

  const handleNextStep = () => {
    if (activePipelineStage < 6) {
      setActivePipelineStage(activePipelineStage + 1);
    } else {
      if (stepIdx < preset.steps.length - 1) {
        setStepIdx(stepIdx + 1);
        setActivePipelineStage(0);
      }
    }
  };

  const handlePrevStep = () => {
    if (activePipelineStage > 0) {
      setActivePipelineStage(activePipelineStage - 1);
    } else if (stepIdx > 0) {
      setStepIdx(stepIdx - 1);
      setActivePipelineStage(6);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepIdx(0);
    setActivePipelineStage(0);
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

        {/* Preset Selector */}
        <div style={{ display: 'flex', gap: '0.375rem' }}>
          {PRESETS.map((p, idx) => (
            <button
              key={p.title}
              type="button"
              onClick={() => {
                setPresetIdx(idx);
                setStepIdx(0);
                setActivePipelineStage(0);
                setIsPlaying(false);
              }}
              style={{
                padding: '0.25rem 0.625rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: presetIdx === idx ? 'var(--color-accent)' : 'var(--color-border)',
                background: presetIdx === idx ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
                color: presetIdx === idx ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Control Strip */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          background: 'var(--color-surface-2)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '0.35rem 0.875rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: isPlaying ? '#ef4444' : 'var(--color-accent)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            {isPlaying ? '❚❚ Pause Auto-Play' : '▶ Auto-Play Speaking Loop'}
          </button>

          <button
            type="button"
            onClick={handlePrevStep}
            disabled={stepIdx === 0 && activePipelineStage === 0}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              opacity: stepIdx === 0 && activePipelineStage === 0 ? 0.4 : 1,
            }}
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={stepIdx === preset.steps.length - 1 && activePipelineStage === 6}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              opacity: stepIdx === preset.steps.length - 1 && activePipelineStage === 6 ? 0.4 : 1,
            }}
          >
            Step Forward →
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
            }}
          >
            ↺ Reset
          </button>
        </div>

        {/* Decoding strategy selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Decoding:</span>
          {(['greedy', 'temperature', 'topk', 'topp'] as const).map((strat) => (
            <button
              key={strat}
              type="button"
              onClick={() => setDecodingStrategy(strat)}
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid',
                borderColor: decodingStrategy === strat ? 'var(--color-accent)' : 'var(--color-border)',
                background: decodingStrategy === strat ? 'var(--color-accent-subtle)' : 'var(--color-surface)',
                color: decodingStrategy === strat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {strat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Visual Arena */}
      <div style={{ padding: '1.75rem 1.25rem' }}>
        {/* Live Token Generation Stream */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
              Autoregressive Context Stream
            </span>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)' }}>
              Step {stepIdx + 1} of {preset.steps.length}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              minHeight: '44px',
            }}
          >
            {currentStep.context.map((token, idx) => (
              <span
                key={idx}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.625rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {token}
              </span>
            ))}

            {/* Target next token slot */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 800,
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                background: activePipelineStage >= 5 ? 'var(--color-success-bg)' : 'rgba(59, 130, 246, 0.1)',
                border: activePipelineStage >= 5 ? '1px solid var(--color-success)' : '1px dashed var(--color-accent)',
                color: activePipelineStage >= 5 ? 'var(--color-success)' : 'var(--color-accent)',
                animation: activePipelineStage < 5 ? 'pulse 1.5s infinite' : 'none',
              }}
            >
              {activePipelineStage >= 5 ? `+ "${currentStep.chosenToken}"` : '⏳ predicting...'}
            </span>
          </div>
        </div>

        {/* 7-Step Pipeline Diagram */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {PIPELINE_STAGES.map((stage, sIdx) => {
            const isActive = activePipelineStage === sIdx;
            const isCompleted = activePipelineStage > sIdx;

            return (
              <div
                key={stage.title}
                onClick={() => setActivePipelineStage(sIdx)}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'var(--color-surface-2)',
                  border: isActive ? '1px solid var(--color-accent)' : isCompleted ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  transition: 'all 200ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-accent)' : 'var(--color-surface)',
                      color: isCompleted || isActive ? '#ffffff' : 'var(--color-text-tertiary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {isCompleted ? '✓' : sIdx + 1}
                  </span>

                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isActive ? 'var(--color-accent)' : isCompleted ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                      {stage.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                      {stage.desc}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isActive ? 'var(--color-accent)' : 'var(--color-surface)',
                      color: isActive ? '#ffffff' : 'var(--color-text-tertiary)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {stage.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Active Stage Deep-Dive Card */}
        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            Active Stage Detail: {PIPELINE_STAGES[activePipelineStage].title}
          </div>

          {activePipelineStage === 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
              The model ingests the tokenized prompt sequence: <code style={{ color: 'var(--color-accent)' }}>[{currentStep.context.map((t) => `"${t}"`).join(', ')}]</code>. Causal attention masks future positions so token predictions rely strictly on preceding context.
            </p>
          )}

          {activePipelineStage === 1 && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                After 12 to 96 stacked Transformer blocks, the last sequence position produces a continuous mathematical vector <code style={{ color: '#38bdf8' }}>h_last ∈ ℝ^768</code>.
              </p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--color-surface)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                h_last = [{currentStep.hiddenFeatures.slice(0, 4).join(', ')}, ..., {currentStep.hiddenFeatures.slice(4).join(', ')}]
              </div>
            </div>
          )}

          {activePipelineStage === 2 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
              The Output Projection matrix <code style={{ color: '#a855f7' }}>W_out [768 × 50,000]</code> multiplies the hidden state: <code style={{ color: 'var(--color-text-primary)' }}>[1 × 768] × [768 × 50,000] = [1 × 50,000]</code>. The inner dimension cancels out, producing one dot product per vocabulary word.
            </p>
          )}

          {activePipelineStage === 3 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
              Each of the 50,000 vocabulary words receives a raw logit score <code style={{ color: '#f472b6' }}>z</code>. Higher scores indicate strong semantic alignment with the prompt's final hidden state.
            </p>
          )}

          {activePipelineStage === 4 && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.75rem', lineHeight: 1.6 }}>
                Softmax exponentiates and normalizes raw scores into probabilities <code style={{ color: 'var(--color-success)' }}>P(w) = e^(z/T) / ∑ e^(z/T)</code>:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {currentStep.candidates.map((c) => (
                  <div key={c.token} style={{ background: 'var(--color-surface)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>"{c.token}"</strong>: {(c.prob * 100).toFixed(0)}% <span style={{ color: 'var(--color-text-tertiary)' }}>(logit {c.logit})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePipelineStage === 5 && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
                Decoding strategy <strong>{decodingStrategy.toUpperCase()}</strong> evaluates the candidate probabilities and selects: <code style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: '1rem' }}>"{currentStep.chosenToken}"</code>.
              </p>
              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--color-text-tertiary)' }}>
                Rationale: {currentStep.rationale}
              </div>
            </div>
          )}

          {activePipelineStage === 6 && (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
                The newly generated token <code style={{ color: 'var(--color-success)' }}>"{currentStep.chosenToken}"</code> is appended to the sequence. The new sequence <code style={{ color: 'var(--color-text-primary)' }}>"{(currentStep.context.concat(currentStep.chosenToken)).join(' ')}"</code> is fed back into the Transformer stack to generate the subsequent word!
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                ↺ The Autoregressive Loop is now complete and ready for the next iteration!
              </div>
            </div>
          )}
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
