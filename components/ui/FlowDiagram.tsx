/**
 * FlowDiagram — renders a vertical step-by-step flow.
 *
 * Usage in MDX:
 *   <FlowDiagram title="Training Pipeline" steps={[
 *     "Raw Internet Data",
 *     "Cleaning",
 *     "Training Dataset",
 *     "Tokenization",
 *     "Neural Network",
 *     "Prediction",
 *   ]} />
 */

interface FlowDiagramProps {
  steps: string[];
  title?: string;
  /** Accent color for arrows and active step indicator */
  accent?: string;
}

export default function FlowDiagram({ steps, title, accent }: FlowDiagramProps) {
  const color = accent ?? 'var(--color-accent)';

  return (
    <figure
      style={{
        margin: '2rem 0',
        padding: '1.5rem 1.5rem 1.25rem',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflowX: 'auto',
      }}
      aria-label={title ?? 'Flow diagram'}
    >
      {title && (
        <p style={{
          margin: '0 0 1.25rem',
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: color,
        }}>
          {title}
        </p>
      )}

      <div style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '100%',
        gap: 0,
      }}>
        {(steps ?? []).map((step, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {/* Step box */}
            <div style={{
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              minWidth: '12rem',
              textAlign: 'center',
            }}>
              {step}
            </div>

            {/* Arrow — not after last */}
            {i < steps.length - 1 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0,
                margin: '2px 0',
              }}>
                <div style={{ width: '2px', height: '10px', background: color, opacity: 0.5 }} />
                {/* Arrowhead */}
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `6px solid ${color}`,
                  opacity: 0.7,
                }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}
