/**
 * Comparison — side-by-side (desktop) or stacked (mobile) contrast cards.
 *
 * Usage in MDX:
 *   <Comparison
 *     title="Reading vs Training"
 *     left={{
 *       label: "Reading",
 *       points: [
 *         "Consume information passively",
 *         "No automatic improvement",
 *         "May or may not remember",
 *       ]
 *     }}
 *     right={{
 *       label: "Training",
 *       points: [
 *         "Make a prediction",
 *         "Measure the mistake",
 *         "Adjust parameters",
 *         "Repeat billions of times",
 *       ]
 *     }}
 *   />
 */

interface ComparisonSide {
  label: string;
  points: string[];
  /** Optional accent override */
  accent?: string;
}

interface ComparisonProps {
  left: ComparisonSide;
  right: ComparisonSide;
  title?: string;
}

const ICONS = {
  left:  '✕',
  right: '✓',
};

export default function Comparison({ left, right, title }: ComparisonProps) {
  const leftAccent  = left.accent  ?? 'var(--color-error)';
  const rightAccent = right.accent ?? 'var(--color-success)';

  const Card = ({ side, accent, icon }: { side: ComparisonSide; accent: string; icon: string }) => (
    <div style={{
      flex: 1,
      padding: '1.25rem 1.375rem',
      background: 'var(--color-surface-2)',
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${accent}33`,
    }}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '1.25rem', height: '1.25rem', borderRadius: '50%',
          fontSize: '0.65rem', fontWeight: 700,
          background: `${accent}22`,
          color: accent,
          flexShrink: 0,
        }}>
          {icon}
        </span>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: accent }}>
          {side.label}
        </span>
      </div>

      {/* Points */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {side.points.map((pt, i) => (
          <li key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
            fontSize: '0.875rem', lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
          }}>
            <span style={{ color: accent, flexShrink: 0, marginTop: '0.1rem', fontSize: '0.75rem' }}>—</span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <figure style={{ margin: '2rem 0' }} aria-label={title ?? 'Comparison'}>
      {title && (
        <p style={{
          margin: '0 0 1rem',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
        }}>
          {title}
        </p>
      )}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '0.75rem',
        flexWrap: 'wrap',
      }}>
        <Card side={left}  accent={leftAccent}  icon={ICONS.left}  />
        <Card side={right} accent={rightAccent} icon={ICONS.right} />
      </div>
    </figure>
  );
}
