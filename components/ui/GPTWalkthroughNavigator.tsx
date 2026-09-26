'use client';

/**
 * GPTWalkthroughNavigator — Day 30 integration shell.
 *
 * A sticky side-navigator + progress bar that lets the reader jump between
 * the 23 named phases of the complete GPT walkthrough.  Each phase is just
 * a named anchor; the actual visuals live in the MDX file as existing
 * platform components.
 *
 * Usage in MDX (place once, near the top of the article body):
 *   <GPTWalkthroughNavigator />
 *
 * The component reads the phase anchors from the DOM (data-phase attribute)
 * and highlights the active one using IntersectionObserver.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Phase {
  id: string;
  label: string;
  short: string;
  group: 'input' | 'attention' | 'block' | 'output' | 'generation';
}

const PHASES: Phase[] = [
  { id: 'phase-input',        label: 'User Input',              short: 'Input',        group: 'input'      },
  { id: 'phase-tokenization', label: 'Tokenization',            short: 'Tokens',       group: 'input'      },
  { id: 'phase-embeddings',   label: 'Token Embeddings',        short: 'Embed',        group: 'input'      },
  { id: 'phase-positional',   label: 'Positional Information',  short: 'Position',     group: 'input'      },
  { id: 'phase-qkv',          label: 'Q, K, V Projections',     short: 'Q K V',        group: 'attention'  },
  { id: 'phase-scores',       label: 'Attention Scores',        short: 'Scores',       group: 'attention'  },
  { id: 'phase-mask',         label: 'Causal Mask',             short: 'Mask',         group: 'attention'  },
  { id: 'phase-softmax',      label: 'Softmax Weights',         short: 'Softmax',      group: 'attention'  },
  { id: 'phase-values',       label: 'Weighted Values',         short: 'Values',       group: 'attention'  },
  { id: 'phase-multihead',    label: 'Multi-Head Attention',    short: 'MHA',          group: 'attention'  },
  { id: 'phase-residual1',    label: 'Residual Connection',     short: 'Residual',     group: 'block'      },
  { id: 'phase-layernorm1',   label: 'Layer Normalization',     short: 'LayerNorm',    group: 'block'      },
  { id: 'phase-ffn',          label: 'Feed-Forward Network',    short: 'FFN',          group: 'block'      },
  { id: 'phase-residual2',    label: 'Second Residual + Norm',  short: 'Res + Norm',   group: 'block'      },
  { id: 'phase-stack',        label: 'Stacked Blocks',          short: 'Stack',        group: 'block'      },
  { id: 'phase-hidden',       label: 'Final Hidden State',      short: 'Hidden',       group: 'output'     },
  { id: 'phase-projection',   label: 'Output Projection',       short: 'Projection',   group: 'output'     },
  { id: 'phase-logits',       label: 'Vocabulary Logits',       short: 'Logits',       group: 'output'     },
  { id: 'phase-softmax2',     label: 'Softmax → Probabilities', short: 'Probs',        group: 'output'     },
  { id: 'phase-decoding',     label: 'Decoding Strategy',       short: 'Decode',       group: 'generation' },
  { id: 'phase-token-out',    label: 'The Model Speaks',        short: 'Speaks',       group: 'generation' },
  { id: 'phase-loop',         label: 'Autoregressive Loop',     short: 'Loop ↺',       group: 'generation' },
  { id: 'phase-complete',     label: 'Complete Architecture',   short: 'Complete',     group: 'generation' },
];

const GROUP_META: Record<Phase['group'], { label: string; color: string }> = {
  input:      { label: 'Input Pipeline',     color: 'var(--color-accent)'           },
  attention:  { label: 'Self-Attention',      color: '#a855f7'                       },
  block:      { label: 'Transformer Block',   color: 'var(--color-warning)'          },
  output:     { label: 'Output Head',         color: '#ec4899'                       },
  generation: { label: 'Generation',          color: 'var(--color-success)'          },
};

export default function GPTWalkthroughNavigator() {
  const [activeId, setActiveId] = useState<string>(PHASES[0].id);
  const [progress, setProgress] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Build IntersectionObserver to track which phase heading is in view
  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const elements = PHASES.map(p => document.getElementById(p.id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to top of viewport
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          const id = topmost.target.id;
          setActiveId(id);
          const idx = PHASES.findIndex(p => p.id === id);
          setProgress(Math.round(((idx + 1) / PHASES.length) * 100));
        }
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    elements.forEach(el => observerRef.current!.observe(el));
  }, []);

  useEffect(() => {
    // Small delay so MDX content is mounted before we scan the DOM
    const t = setTimeout(setupObserver, 300);
    return () => {
      clearTimeout(t);
      observerRef.current?.disconnect();
    };
  }, [setupObserver]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
    setIsExpanded(false);
  };

  const activePhase = PHASES.find(p => p.id === activeId) ?? PHASES[0];
  const activeGroup = GROUP_META[activePhase.group];

  return (
    <>
      {/* ── Top progress bar ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '3px',
          background: 'var(--color-border)',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, var(--color-accent), ${activeGroup.color})`,
            transition: 'width 400ms ease',
          }}
        />
      </div>

      {/* ── Phase navigator card ─────────────────────────────────────────── */}
      <figure
        style={{
          margin: '0 0 2.5rem',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          position: 'sticky',
          top: '3px',
          zIndex: 30,
        }}
        aria-label="GPT Walkthrough Phase Navigator"
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1.25rem',
            background: 'var(--color-surface-2)',
            borderBottom: '1px solid var(--color-border)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => setIsExpanded(v => !v)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Pulsing dot */}
            <span
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: activeGroup.color,
                display: 'inline-block',
                boxShadow: `0 0 8px ${activeGroup.color}`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: activeGroup.color }}>
              GPT Walkthrough
            </span>
            <span
              style={{
                fontSize: '0.7rem', fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: `${activeGroup.color}18`,
                color: activeGroup.color,
                border: `1px solid ${activeGroup.color}44`,
              }}
            >
              {activeGroup.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            {/* Current phase label */}
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {activePhase.label}
            </span>
            {/* Progress pill */}
            <span
              style={{
                fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-tertiary)',
                border: '1px solid var(--color-border)',
              }}
            >
              {progress}%
            </span>
            {/* Chevron */}
            <span
              style={{
                fontSize: '0.75rem', color: 'var(--color-text-tertiary)',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease',
                display: 'inline-block',
              }}
            >
              ▾
            </span>
          </div>
        </div>

        {/* Expandable phase grid */}
        {isExpanded && (
          <div style={{ padding: '1rem 1.25rem' }}>
            {/* Group each set of phases */}
            {(['input', 'attention', 'block', 'output', 'generation'] as const).map(group => {
              const phases = PHASES.filter(p => p.group === group);
              const meta = GROUP_META[group];
              return (
                <div key={group} style={{ marginBottom: '0.875rem' }}>
                  <p style={{
                    margin: '0 0 0.4rem',
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: meta.color,
                  }}>
                    {meta.label}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {phases.map(phase => {
                      const isActive = phase.id === activeId;
                      return (
                        <button
                          key={phase.id}
                          onClick={() => scrollTo(phase.id)}
                          style={{
                            padding: '0.3rem 0.625rem',
                            fontSize: '0.75rem', fontWeight: 600,
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid',
                            borderColor: isActive ? meta.color : 'var(--color-border)',
                            background: isActive ? `${meta.color}18` : 'var(--color-surface-2)',
                            color: isActive ? meta.color : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                          }}
                        >
                          {phase.short}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Compact phase breadcrumb strip (always visible when collapsed) */}
        {!isExpanded && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              overflowX: 'auto',
              padding: '0.5rem 1.25rem',
              scrollbarWidth: 'none',
            }}
          >
            {PHASES.map((phase, idx) => {
              const isActive = phase.id === activeId;
              const isPast = PHASES.findIndex(p => p.id === activeId) > idx;
              const meta = GROUP_META[phase.group];
              return (
                <button
                  key={phase.id}
                  onClick={() => scrollTo(phase.id)}
                  title={phase.label}
                  style={{
                    flexShrink: 0,
                    width: '28px', height: '6px',
                    borderRadius: '3px',
                    margin: '0 2px',
                    border: 'none',
                    cursor: 'pointer',
                    background: isActive
                      ? meta.color
                      : isPast
                        ? `${meta.color}55`
                        : 'var(--color-border)',
                    transition: 'all 200ms ease',
                    transform: isActive ? 'scaleY(1.5)' : 'scaleY(1)',
                  }}
                  aria-label={phase.label}
                />
              );
            })}
          </div>
        )}
      </figure>
    </>
  );
}
