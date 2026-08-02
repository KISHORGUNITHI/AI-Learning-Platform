/**
 * TokenMapping — renders a token → ID (or word → value) mapping table.
 *
 * Usage in MDX:
 *   <TokenMapping title="Token IDs" items={[
 *     { from: "Who",  to: "51" },
 *     { from: "are",  to: "884" },
 *     { from: "you",  to: "77" },
 *     { from: "?",    to: "18" },
 *   ]} />
 *
 * Also works for score mappings:
 *   { from: "blue", to: "0.78" }
 */

interface MappingItem {
  from: string;
  to: string;
}

interface TokenMappingProps {
  items: MappingItem[];
  title?: string;
  fromLabel?: string;
  toLabel?: string;
  /** Arrow symbol between columns */
  arrow?: string;
}

export default function TokenMapping({
  items,
  title,
  fromLabel = 'Token',
  toLabel = 'ID',
  arrow = '→',
}: TokenMappingProps) {
  return (
    <figure
      style={{
        margin: '2rem 0',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}
      aria-label={title ?? 'Token mapping'}
    >
      {/* Header */}
      <div style={{
        padding: '0.625rem 1.25rem',
        background: 'var(--color-surface-2)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {title && (
          <p style={{
            margin: 0,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
          }}>
            {title}
          </p>
        )}
        <div style={{ display: 'flex', gap: '3rem', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>{fromLabel}</span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>{toLabel}</span>
        </div>
      </div>

      {/* Rows */}
      <div style={{ padding: '0.5rem 0' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1.25rem',
            gap: '1rem',
            borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none',
          }}>
            <span style={{
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
            }}>
              {item.from}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-tertiary)',
              flexShrink: 0,
            }}>
              {arrow}
            </span>
            <span style={{
              flex: 1,
              textAlign: 'right',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-accent)',
            }}>
              {item.to}
            </span>
          </div>
        ))}
      </div>
    </figure>
  );
}
