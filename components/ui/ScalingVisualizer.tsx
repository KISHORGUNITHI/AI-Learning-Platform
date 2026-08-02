'use client';

/**
 * ScalingVisualizer — shows how Dot Product grows with embedding dimension
 * and how dividing by √d brings it back to a stable range.
 *
 * Usage: <ScalingVisualizer />
 */

import { useState } from 'react';

const DIMS = [32, 64, 128, 256, 512, 768, 1024];

function simulateDotProduct(d: number): number {
  // Dot product of two random unit vectors in d dimensions grows ~√d
  return parseFloat((Math.sqrt(d) * 3.2).toFixed(1));
}

function scaled(raw: number, d: number): number {
  return parseFloat((raw / Math.sqrt(d)).toFixed(2));
}

export default function ScalingVisualizer() {
  const [dimIdx, setDimIdx] = useState(2); // default 128
  const d = DIMS[dimIdx];
  const raw = simulateDotProduct(d);
  const scaledVal = scaled(raw, d);
  const maxRaw = simulateDotProduct(1024);

  const barRaw    = Math.min((raw / maxRaw) * 100, 100);
  const barScaled = Math.min((scaledVal / 5) * 100, 100);

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
          Scaling Visualizer — Why We Divide by √d
        </p>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* Slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              Embedding Dimension: <strong style={{ color: 'var(--color-text-primary)' }}>{d}</strong>
            </label>
          </div>
          <input
            type="range"
            min={0}
            max={DIMS.length - 1}
            value={dimIdx}
            onChange={(e) => setDimIdx(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
            aria-label="Embedding dimension selector"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            {DIMS.map((v) => (
              <span key={v} style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)' }}>{v}</span>
            ))}
          </div>
        </div>

        {/* Side-by-side bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

          {/* Raw Dot Product */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-error)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Before Scaling
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '8rem' }}>
              <div style={{
                flex: 1,
                height: `${barRaw}%`,
                minHeight: '4px',
                background: 'rgba(239,68,68,0.3)',
                border: '1px solid var(--color-error)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 300ms ease',
              }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-error)', minWidth: '3rem' }}>
                {raw}
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>
              Dot product grows large
            </p>
          </div>

          {/* After √d scaling */}
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              After ÷ √{d} = {parseFloat(Math.sqrt(d).toFixed(1))}
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '8rem' }}>
              <div style={{
                flex: 1,
                height: `${barScaled}%`,
                minHeight: '4px',
                background: 'rgba(52,211,153,0.3)',
                border: '1px solid var(--color-success)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 300ms ease',
              }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-success)', minWidth: '3rem' }}>
                {scaledVal}
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>
              Stays in stable range
            </p>
          </div>

        </div>

        {/* Caption */}
        <p style={{
          marginTop: '1.25rem', fontSize: '0.8125rem', fontStyle: 'italic',
          color: 'var(--color-text-tertiary)', textAlign: 'center',
        }}>
          Scaling keeps Attention Scores within a stable numerical range before Softmax is applied.
        </p>
      </div>
    </figure>
  );
}
