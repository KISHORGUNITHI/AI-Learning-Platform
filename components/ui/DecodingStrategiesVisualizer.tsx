'use client';

/**
 * DecodingStrategiesVisualizer — Comprehensive interactive laboratory for Next-Token Decoding.
 *
 * Covers:
 * 1. Greedy Decoding: Argmax selection (highest probability, deterministic).
 * 2. Temperature: Logit scaling z / T (low T = sharp peak, high T = flat distribution).
 * 3. Top-K Sampling: Fixed candidate set of K most probable tokens with renormalization.
 * 4. Top-P (Nucleus) Sampling: Dynamic candidate set accumulating up to cumulative probability threshold P.
 * 5. Side-by-side Strategy Comparison matrix.
 *
 * Usage in MDX:
 *   <DecodingStrategiesVisualizer defaultTab="temperature" />
 *   <DecodingStrategiesVisualizer defaultTab="topk" />
 *   <DecodingStrategiesVisualizer defaultTab="topp" />
 *   <DecodingStrategiesVisualizer />
 */

import React, { useState } from 'react';

interface CandidateToken {
  token: string;
  baseLogit: number;
  baseProb: number;
}

const CANDIDATES: CandidateToken[] = [
  { token: 'AI', baseLogit: 10.0, baseProb: 0.50 },
  { token: 'computer', baseLogit: 9.3, baseProb: 0.25 },
  { token: 'pizza', baseLogit: 8.8, baseProb: 0.15 },
  { token: 'dog', baseLogit: 7.7, baseProb: 0.05 },
  { token: 'table', baseLogit: 7.2, baseProb: 0.03 },
  { token: 'car', baseLogit: 6.8, baseProb: 0.02 },
];

export default function DecodingStrategiesVisualizer({
  defaultTab = 'temperature',
  title = 'Decoding Strategies Visualizer',
  caption = 'Decoding turns a probability distribution over vocabulary tokens into the single next token that the LLM generates.',
}: {
  defaultTab?: 'greedy' | 'temperature' | 'topk' | 'topp' | 'comparison';
  title?: string;
  caption?: string;
}) {
  const [activeTab, setActiveTab] = useState<'greedy' | 'temperature' | 'topk' | 'topp' | 'comparison'>(defaultTab);

  // Temperature state
  const [temperature, setTemperature] = useState<number>(0.7);

  // Top-K state
  const [topK, setTopK] = useState<number>(3);

  // Top-P state
  const [topP, setTopP] = useState<number>(0.90);
  const [distributionScenario, setDistributionScenario] = useState<'confident' | 'uncertain'>('confident');

  // Compute Temperature-scaled probabilities
  const maxScaledLogit = Math.max(...CANDIDATES.map((c) => c.baseLogit / temperature));
  const tempExps = CANDIDATES.map((c) => Math.exp(c.baseLogit / temperature - maxScaledLogit));
  const tempSumExps = tempExps.reduce((a, b) => a + b, 0);
  const tempProbs = tempExps.map((e) => e / tempSumExps);

  // Compute Top-K probabilities
  const topKCandidates = CANDIDATES.slice(0, topK);
  const topKSum = topKCandidates.reduce((sum, c) => sum + c.baseProb, 0);
  const topKRenormalized = CANDIDATES.map((c, i) => (i < topK ? c.baseProb / topKSum : 0));

  // Compute Top-P candidates
  const activeDataset = distributionScenario === 'confident'
    ? CANDIDATES
    : [
        { token: 'AI', baseLogit: 8.2, baseProb: 0.22 },
        { token: 'computer', baseLogit: 8.0, baseProb: 0.20 },
        { token: 'pizza', baseLogit: 7.9, baseProb: 0.18 },
        { token: 'dog', baseLogit: 7.8, baseProb: 0.16 },
        { token: 'table', baseLogit: 7.6, baseProb: 0.14 },
        { token: 'car', baseLogit: 7.3, baseProb: 0.10 },
      ];

  let cumulative = 0;
  const topPSelections: { token: string; prob: number; cumBefore: number; cumAfter: number; inNucleus: boolean }[] = [];
  let thresholdReached = false;

  for (const c of activeDataset) {
    const cumBefore = cumulative;
    cumulative += c.baseProb;
    const cumAfter = Math.min(1.0, cumulative);
    const inNucleus = !thresholdReached;

    topPSelections.push({
      token: c.token,
      prob: c.baseProb,
      cumBefore,
      cumAfter,
      inNucleus,
    });

    if (cumulative >= topP - 0.001) {
      thresholdReached = true;
    }
  }

  const nucleusCount = topPSelections.filter((s) => s.inNucleus).length;

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
      {/* Header with strategy tabs */}
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

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--color-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
          {(['greedy', 'temperature', 'topk', 'topp', 'comparison'] as const).map((tab) => {
            const labels = {
              greedy: 'Greedy',
              temperature: 'Temperature ($T$)',
              topk: 'Top-K',
              topp: 'Top-P (Nucleus)',
              comparison: 'Comparison Matrix',
            };
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.25rem 0.625rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === tab ? 'var(--color-accent)' : 'transparent',
                  color: activeTab === tab ? '#ffffff' : 'var(--color-text-secondary)',
                  transition: 'all 150ms ease',
                }}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Panels */}
      <div style={{ padding: '1.75rem 1.25rem' }}>
        {/* TAB 1: GREEDY DECODING */}
        {activeTab === 'greedy' && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--color-text-primary)', fontSize: '1rem', fontWeight: 700 }}>
                Greedy Decoding: Deterministic Argmax
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Greedy decoding always selects the single token with the <strong>highest probability</strong> (t = argmax P(w)). It involves no randomness and is 100% deterministic.
              </p>
            </div>

            {/* Token ranking list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {CANDIDATES.map((item, idx) => {
                const isWinner = idx === 0;
                return (
                  <div
                    key={item.token}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      background: isWinner ? 'rgba(34, 197, 94, 0.08)' : 'var(--color-surface-2)',
                      border: isWinner ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isWinner ? 'var(--color-success)' : 'var(--color-surface)',
                          color: isWinner ? '#ffffff' : 'var(--color-text-tertiary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: isWinner ? 'none' : '1px solid var(--color-border)',
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: isWinner ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                        "{item.token}"
                      </span>
                      {isWinner && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', background: 'var(--color-success)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                          Selected Winner
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '120px', height: '8px', background: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.baseProb * 100}%`, height: '100%', background: isWinner ? 'var(--color-success)' : 'var(--color-text-tertiary)' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: isWinner ? 'var(--color-success)' : 'var(--color-text-secondary)', minWidth: '45px', textAlign: 'right' }}>
                        {(item.baseProb * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pros/Cons Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                  ✓ Advantages
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Extremely fast, predictable, and reproducible. Ideal for factual Q&A, mathematical reasoning, and code generation where only the single most accurate token is desired.
                </div>
              </div>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', marginBottom: '0.375rem' }}>
                  ✕ Disadvantages
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Prone to repetitive loops, boring prose, and getting stuck in suboptimal local trajectories ("the the the..."). Lacks creativity.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPERATURE */}
        {activeTab === 'temperature' && (
          <div>
            {/* Temperature Slider Control */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 700 }}>
                    Temperature Parameter ($T$)
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                    T = {temperature.toFixed(2)}
                  </div>
                </div>

                {/* Preset buttons */}
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {[0.2, 0.7, 1.0, 1.5].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTemperature(preset)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        background: Math.abs(temperature - preset) < 0.05 ? 'var(--color-accent)' : 'var(--color-surface)',
                        color: Math.abs(temperature - preset) < 0.05 ? '#ffffff' : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {preset === 0.2 ? '0.2 (Low)' : preset === 0.7 ? '0.7 (Balanced)' : preset === 1.0 ? '1.0 (Standard)' : '1.5 (High)'}
                    </button>
                  ))}
                </div>
              </div>

              <input
                id="temperature-slider"
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>
                <span>0.1 (Sharp / Peaked / Confident)</span>
                <span>1.0 (Standard Softmax)</span>
                <span>2.0 (Flat / Uniform / Creative)</span>
              </div>
            </div>

            {/* Distribution Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {CANDIDATES.map((item, idx) => {
                const prob = tempProbs[idx];
                const probPct = (prob * 100).toFixed(1);
                return (
                  <div
                    key={item.token}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                        "{item.token}" <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>(Logit: {item.baseLogit} / {temperature.toFixed(2)} = {(item.baseLogit / temperature).toFixed(1)})</span>
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-accent)' }}>
                        {probPct}%
                      </span>
                    </div>

                    <div style={{ height: '12px', width: '100%', background: 'var(--color-surface)', borderRadius: '6px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(1, prob * 100)}%`,
                          background: `linear-gradient(90deg, var(--color-accent)60, var(--color-accent))`,
                          transition: 'width 250ms ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mathematical insight */}
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
              <strong style={{ color: 'var(--color-text-primary)' }}>Mathematical Insight:</strong> Temperature does <em>not</em> inject random noise. It applies a scaling factor to the logits: P_i = softmax(z_i / T).
              <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                <li><strong>Low T (T → 0):</strong> Logit differences are magnified exponentially → top candidate dominates (approaches Greedy).</li>
                <li><strong>High T (T → ∞):</strong> Logit differences shrink toward 0 → distribution flattens toward uniform distribution.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: TOP-K SAMPLING */}
        {activeTab === 'topk' && (
          <div>
            {/* Top-K Selector */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 700 }}>
                  Active Pool Size
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>
                  K = {topK} Candidates
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  Keep top {topK} tokens, discard bottom {CANDIDATES.length - topK}, renormalize to 100%.
                </div>
              </div>

              {/* K Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 6].map((kVal) => (
                  <button
                    key={kVal}
                    type="button"
                    onClick={() => setTopK(kVal)}
                    style={{
                      padding: '0.4rem 0.875rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid',
                      borderColor: topK === kVal ? '#38bdf8' : 'var(--color-border)',
                      background: topK === kVal ? 'rgba(56, 189, 248, 0.2)' : 'var(--color-surface)',
                      color: topK === kVal ? '#38bdf8' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    K={kVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate List with Retained vs Discarded Demarcation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {CANDIDATES.map((item, idx) => {
                const isKept = idx < topK;
                const renormalizedProb = topKRenormalized[idx];

                return (
                  <React.Fragment key={item.token}>
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-lg)',
                        background: isKept ? 'rgba(56, 189, 248, 0.08)' : 'var(--color-surface-2)',
                        border: isKept ? '1px solid rgba(56, 189, 248, 0.4)' : '1px dashed rgba(239, 68, 68, 0.3)',
                        opacity: isKept ? 1 : 0.45,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: isKept ? '#38bdf8' : 'var(--color-surface)',
                            color: isKept ? '#000' : 'var(--color-text-tertiary)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: isKept ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                          "{item.token}"
                        </span>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '0.15rem 0.4rem',
                            borderRadius: 'var(--radius-sm)',
                            background: isKept ? 'rgba(56, 189, 248, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                            color: isKept ? '#38bdf8' : '#ef4444',
                          }}
                        >
                          {isKept ? 'Kept Candidate' : 'Discarded'}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginRight: '0.75rem' }}>
                          Original: {(item.baseProb * 100).toFixed(0)}%
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.95rem',
                            fontWeight: 800,
                            color: isKept ? '#38bdf8' : '#ef4444',
                          }}
                        >
                          {isKept ? `${(renormalizedProb * 100).toFixed(1)}%` : '0.0%'}
                        </span>
                      </div>
                    </div>

                    {/* Cutoff Boundary Line */}
                    {idx === topK - 1 && idx < CANDIDATES.length - 1 && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          margin: '0.25rem 0',
                        }}
                      >
                        <div style={{ flex: 1, height: '1px', background: 'rgba(239, 68, 68, 0.4)' }} />
                        <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          ⛔ Cutoff Line (Tail Discarded)
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(239, 68, 68, 0.4)' }} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: TOP-P (NUCLEUS) SAMPLING */}
        {activeTab === 'topp' && (
          <div>
            {/* Top-P Slider & Scenario Toggle */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 700 }}>
                    Cumulative Probability Threshold ($P$)
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.35rem', fontWeight: 800, color: '#ec4899' }}>
                    P = {topP.toFixed(2)} ({Math.round(topP * 100)}%)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    Active Nucleus Set: <strong>{nucleusCount} candidates</strong> selected dynamically
                  </div>
                </div>

                {/* Scenario Toggle */}
                <div style={{ display: 'flex', gap: '0.375rem', background: 'var(--color-surface)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <button
                    type="button"
                    onClick={() => setDistributionScenario('confident')}
                    style={{
                      padding: '0.25rem 0.625rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      cursor: 'pointer',
                      background: distributionScenario === 'confident' ? '#ec4899' : 'transparent',
                      color: distributionScenario === 'confident' ? '#ffffff' : 'var(--color-text-secondary)',
                    }}
                  >
                    Confident Context (Sharp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistributionScenario('uncertain')}
                    style={{
                      padding: '0.25rem 0.625rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      cursor: 'pointer',
                      background: distributionScenario === 'uncertain' ? '#ec4899' : 'transparent',
                      color: distributionScenario === 'uncertain' ? '#ffffff' : 'var(--color-text-secondary)',
                    }}
                  >
                    Uncertain Context (Flat)
                  </button>
                </div>
              </div>

              <input
                id="top-p-slider"
                type="range"
                min="0.40"
                max="0.99"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>
                <span>P = 0.40 (Small Nucleus)</span>
                <span>P = 0.90 (Standard Nucleus)</span>
                <span>P = 0.99 (Wide Nucleus)</span>
              </div>
            </div>

            {/* Cumulative Probability Progress Tracking */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {topPSelections.map((item, idx) => (
                <div
                  key={item.token}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    background: item.inNucleus ? 'rgba(236, 72, 153, 0.08)' : 'var(--color-surface-2)',
                    border: item.inNucleus ? '1px solid rgba(236, 72, 153, 0.4)' : '1px dashed rgba(239, 68, 68, 0.3)',
                    opacity: item.inNucleus ? 1 : 0.45,
                    transition: 'all 200ms ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem', color: item.inNucleus ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)' }}>
                        "{item.token}"
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 'var(--radius-sm)',
                          background: item.inNucleus ? 'rgba(236, 72, 153, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                          color: item.inNucleus ? '#ec4899' : '#ef4444',
                        }}
                      >
                        {item.inNucleus ? 'In Nucleus' : 'Excluded'}
                      </span>
                    </div>

                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>+{(item.prob * 100).toFixed(0)}%</span>
                      <span style={{ margin: '0 0.5rem', color: 'var(--color-text-tertiary)' }}>→</span>
                      <strong style={{ color: item.inNucleus ? '#ec4899' : 'var(--color-text-tertiary)' }}>
                        Cum: {(item.cumAfter * 100).toFixed(0)}%
                      </strong>
                    </div>
                  </div>

                  {/* Cumulative visual bar */}
                  <div style={{ height: '8px', width: '100%', background: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.cumAfter * 100}%`,
                        background: item.inNucleus ? 'linear-gradient(90deg, #ec489980, #ec4899)' : '#ef444440',
                        transition: 'width 250ms ease',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Why Top-P is dynamic */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(236, 72, 153, 0.05)',
                border: '1px solid rgba(236, 72, 153, 0.25)',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: 'var(--color-text-primary)' }}>Why Top-P Adapts Dynamically:</strong> Unlike Top-K (which keeps a static number of candidates), Top-P dynamically expands or contracts the candidate pool based on model confidence. When confident, only 1–2 tokens are needed to reach $P=0.90$; when uncertain, the candidate set expands to 5+ tokens automatically!
            </div>
          </div>
        )}

        {/* TAB 5: COMPARISON MATRIX */}
        {activeTab === 'comparison' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                1. Greedy Decoding
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                Always selects t = argmax P(w). 100% deterministic and fastest.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                Best for: Math, code, factual QA.
              </div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                2. Temperature ($T$)
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                Scales logits $z/T$ before Softmax. Controls distribution sharpness vs entropy.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                Best for: Creativity tuning.
              </div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                3. Top-K Sampling
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                Truncates distribution to a <strong>fixed number $K$</strong> of highest probability tokens.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                Best for: Pruning bad tail tokens.
              </div>
            </div>

            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                4. Top-P (Nucleus)
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
                Dynamic candidate set accumulating up to <strong>cumulative threshold $P$</strong>.
              </p>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>
                Best for: Modern generation defaults.
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
