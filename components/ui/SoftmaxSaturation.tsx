'use client';

/**
 * SoftmaxSaturation — shows how large Attention Scores saturate Softmax
 * vs the stable distribution after √d scaling.
 *
 * Usage: <SoftmaxSaturation />
 */

export default function SoftmaxSaturation() {
  // Unscaled scores: 96, 82, 74
  const rawScores = [96, 82, 74];
  const tokens = ['I', 'Love', 'AI'];

  // Softmax of raw (will saturate)
  const rawExp = rawScores.map((s) => Math.exp(s - 96)); // subtract max for numerical stability in render
  const rawSum = rawExp.reduce((a, b) => a + b, 0);
  const rawProbs = rawExp.map((e) => parseFloat((e / rawSum).toFixed(6)));

  // Scaled scores: divide by √768 ≈ 27.7
  const sqrtD = Math.sqrt(768);
  const scaledScores = rawScores.map((s) => parseFloat((s / sqrtD).toFixed(2)));
  const scaledExp = scaledScores.map((s) => Math.exp(s));
  const scaledSum = scaledExp.reduce((a, b) => a + b, 0);
  const scaledProbs = scaledExp.map((e) => parseFloat((e / scaledSum).toFixed(2)));

  const COLORS = ['var(--color-accent)', 'var(--color-accent-secondary)', 'var(--color-success)'];

  return (
    <figure
      style={{
        margin: '2rem 0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.25rem',
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
        <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
          Softmax Saturation vs Stable Attention
        </p>
      </div>

      <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Left — Before scaling (saturated) */}
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Before Scaling — Saturated
          </p>

          {/* Raw scores */}
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>Raw Scores</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {rawScores.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0.35rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                {s}
              </div>
            ))}
          </div>

          {/* Arrow */}
          <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '1.25rem', margin: '0.25rem 0' }}>↓ Softmax</p>

          {/* Saturated probs as bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '5rem', marginBottom: '0.5rem' }}>
            {rawProbs.map((p, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-error)', marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>{p}</span>
                <div style={{ width: '100%', height: `${p * 100}%`, minHeight: '2px', background: 'rgba(239,68,68,0.4)', border: '1px solid var(--color-error)', borderRadius: '3px 3px 0 0' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {tokens.map((t, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{t}</div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-error)', marginTop: '0.5rem', textAlign: 'center', fontWeight: 600 }}>
            Softmax Saturation — one token dominates
          </p>
        </div>

        {/* Right — After scaling (stable) */}
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            After ÷ √768 ≈ 27.7
          </p>

          {/* Scaled scores */}
          <p style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>Scaled Scores</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {scaledScores.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0.35rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', fontSize: '0.875rem', fontWeight: 700, color: COLORS[i], fontFamily: 'var(--font-mono)' }}>
                {s}
              </div>
            ))}
          </div>

          {/* Arrow */}
          <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '1.25rem', margin: '0.25rem 0' }}>↓ Softmax</p>

          {/* Stable probs as bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '5rem', marginBottom: '0.5rem' }}>
            {scaledProbs.map((p, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <span style={{ fontSize: '0.65rem', color: COLORS[i], marginBottom: '2px', fontFamily: 'var(--font-mono)' }}>{p}</span>
                <div style={{ width: '100%', height: `${p * 100}%`, minHeight: '4px', background: `${COLORS[i]}33`, border: `1px solid ${COLORS[i]}`, borderRadius: '3px 3px 0 0' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {tokens.map((t, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{t}</div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.5rem', textAlign: 'center', fontWeight: 600 }}>
            Attention distributed across tokens
          </p>
        </div>

      </div>

      <p style={{ padding: '0 1.5rem 1rem', fontSize: '0.8125rem', fontStyle: 'italic', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
        Scaling prevents Softmax from becoming overly confident, allowing attention to be distributed across multiple relevant tokens.
      </p>
    </figure>
  );
}
