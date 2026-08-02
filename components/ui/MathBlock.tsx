/**
 * MathBlock — Math Card for important equations.
 *
 * Renders one equation inside a visually distinct card.
 * Symbol explanations go BELOW the component in the MDX, not inside it.
 *
 * Usage:
 *   <MathBlock title="Cross Entropy Loss">
 *     $$L = -\log(P(\text{correct token}))$$
 *   </MathBlock>
 *
 *   where **L** is the loss and **P** is the predicted probability.
 */

interface MathBlockProps {
  children: React.ReactNode;
  /** Short label shown above the equation e.g. "Softmax Function" */
  title?: string;
}

export default function MathBlock({ children, title }: MathBlockProps) {
  return (
    <figure
      aria-label={title ?? 'Mathematical equation'}
      style={{
        margin: '2.25rem 0',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.625rem 1.375rem',
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        {/* accent dot */}
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'var(--color-accent)', flexShrink: 0,
          display: 'inline-block',
        }} />
        <p style={{
          margin: 0,
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
        }}>
          {title ?? 'Equation'}
        </p>
      </div>

      {/* Equation body */}
      <div style={{
        padding: '2rem 1.5rem',
        textAlign: 'center',
        overflowX: 'auto',
        /* Ensure KaTeX inside doesn't double-wrap */
        lineHeight: 1,
      }}>
        {children}
      </div>
    </figure>
  );
}
