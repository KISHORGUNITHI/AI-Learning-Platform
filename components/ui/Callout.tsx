/**
 * Callout — a prominent pull-quote or highlighted statement.
 *
 * Different from InfoCard: no icon, no label, just a visually
 * emphasised block of text. Good for definitions, memorable
 * statements, or central ideas you want the reader to remember.
 *
 * Usage in MDX:
 *   <Callout>Attention is just a weighted average — but the weights are learned.</Callout>
 */
import { cn } from '@/lib/utils';

interface CalloutProps {
  children: React.ReactNode;
  /** Optional accent override (CSS color string) */
  accent?: string;
  className?: string;
}

export default function Callout({ children, accent, className }: CalloutProps) {
  return (
    <aside
      className={cn('my-8 rounded-xl px-7 py-6', className)}
      style={{
        background: 'var(--color-surface)',
        borderLeft: `4px solid ${accent ?? 'var(--color-accent-primary)'}`,
      }}
    >
      <span
        className="text-lg font-medium leading-relaxed"
        style={{
          color: 'var(--color-text-primary)',
          fontStyle: 'italic',
          margin: 0,
          display: 'block',
        }}
      >
        {children}
      </span>
    </aside>
  );
}
