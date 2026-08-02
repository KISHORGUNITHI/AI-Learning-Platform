'use client';

/**
 * FunctionPlot — renders a mathematical function as a line chart.
 *
 * Built on Recharts. Fully responsive, theme-aware, zero config for common functions.
 *
 * Usage in MDX:
 *
 *   <FunctionPlot fn="relu"    title="ReLU Activation" />
 *   <FunctionPlot fn="gelu"    title="GELU Activation" />
 *   <FunctionPlot fn="sigmoid" title="Sigmoid Function" />
 *   <FunctionPlot fn="softmax" title="Softmax Output" />
 *   <FunctionPlot fn="sine"    title="Sine Wave" />
 *   <FunctionPlot fn="loss"    title="Training Loss Curve" />
 *
 *   // Multi-line overlay (compare two functions):
 *   <FunctionPlot fn={["relu", "gelu"]} title="ReLU vs GELU" />
 *
 *   // Custom domain/range:
 *   <FunctionPlot fn="sigmoid" xMin={-6} xMax={6} steps={200} />
 */

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ─── Built-in function definitions ───────────────────────────────────────────

type FnName = 'relu' | 'gelu' | 'sigmoid' | 'tanh' | 'sine' | 'cosine' | 'softmax' | 'loss';

const FUNCTIONS: Record<FnName, (x: number) => number> = {
  relu:    (x) => Math.max(0, x),
  gelu:    (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  tanh:    (x) => Math.tanh(x),
  sine:    (x) => Math.sin(x),
  cosine:  (x) => Math.cos(x),
  softmax: (x) => Math.exp(x) / (Math.exp(-2) + Math.exp(-1) + Math.exp(0) + Math.exp(1) + Math.exp(x)),
  loss:    (x) => 2.8 * Math.exp(-0.35 * x) + 0.15,  // simulated decreasing loss curve
};

const DEFAULT_DOMAINS: Record<FnName, [number, number]> = {
  relu:    [-3, 3],
  gelu:    [-3, 3],
  sigmoid: [-6, 6],
  tanh:    [-4, 4],
  sine:    [0, 6.28],
  cosine:  [0, 6.28],
  softmax: [-2, 4],
  loss:    [0, 20],
};

const COLORS = [
  'var(--color-accent)',
  'var(--color-accent-secondary)',
  'var(--color-success)',
  'var(--color-warning)',
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface FunctionPlotProps {
  /** Single function name or array for overlay */
  fn: FnName | FnName[];
  title?: string;
  caption?: string;
  xMin?: number;
  xMax?: number;
  /** Number of sample points */
  steps?: number;
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FunctionPlot({
  fn,
  title,
  caption,
  xMin,
  xMax,
  steps = 150,
  xLabel = 'x',
  yLabel = 'y',
  height = 240,
}: FunctionPlotProps) {
  const fns: FnName[] = Array.isArray(fn) ? fn : [fn];

  // Determine domain
  const defaultDomain = DEFAULT_DOMAINS[fns[0]] ?? [-4, 4];
  const x0 = xMin ?? defaultDomain[0];
  const x1 = xMax ?? defaultDomain[1];

  // Generate data points
  const data = Array.from({ length: steps }, (_, i) => {
    const x = x0 + (i / (steps - 1)) * (x1 - x0);
    const point: Record<string, number> = { x: parseFloat(x.toFixed(3)) };
    fns.forEach((f) => {
      point[f] = parseFloat(FUNCTIONS[f](x).toFixed(4));
    });
    return point;
  });

  const showLegend = fns.length > 1;

  return (
    <figure
      style={{
        margin: '2rem 0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
      aria-label={title ?? `Plot of ${fns.join(', ')}`}
    >
      {/* Header */}
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.625rem 1.25rem',
          background: 'var(--color-surface-2)',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, display: 'inline-block' }} />
          <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-accent)' }}>
            {title}
          </p>
        </div>
      )}

      {/* Chart */}
      <div style={{ padding: '1.25rem 0.5rem 0.75rem' }}>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 4, right: 20, left: -10, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="x"
              label={{ value: xLabel, position: 'insideBottomRight', offset: -4, fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
              tickCount={7}
            />
            <YAxis
              label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 12, fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }}
              tickCount={6}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: 'var(--color-text-primary)',
              }}
              formatter={(v: number) => [v.toFixed(3)]}
            />
            {showLegend && <Legend wrapperStyle={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }} />}
            <ReferenceLine x={0} stroke="var(--color-border-strong)" strokeWidth={1} />
            <ReferenceLine y={0} stroke="var(--color-border-strong)" strokeWidth={1} />
            {fns.map((f, i) => (
              <Line
                key={f}
                type="monotone"
                dataKey={f}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Caption */}
      {caption && (
        <p style={{
          margin: 0, padding: '0.5rem 1.25rem 0.875rem',
          fontSize: '0.8125rem', color: 'var(--color-text-tertiary)',
          textAlign: 'center', fontStyle: 'italic',
          borderTop: '1px solid var(--color-border)',
        }}>
          {caption}
        </p>
      )}
    </figure>
  );
}
