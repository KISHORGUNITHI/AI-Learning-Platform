/**
 * Table — a styled data table for use in MDX articles.
 *
 * Current state: wrapper that applies platform styles.
 * Future: add sortable columns, sticky header.
 *
 * Usage in MDX (via mdxComponents override — standard Markdown
 * tables are automatically rendered through this component):
 *
 *   | Method  | Pros         | Cons          |
 *   |---------|--------------|---------------|
 *   | RAG     | No retraining| Latency cost  |
 *   | Fine-tune | Fast at inference | Expensive |
 */
import { cn } from '@/lib/utils';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn('my-8 w-full overflow-x-auto rounded-xl', className)}
      style={{
        border: '1px solid var(--color-border)',
      }}
    >
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return (
    <thead style={{ background: 'var(--color-surface)' }}>
      {children}
    </thead>
  );
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr
      style={{ borderBottom: '1px solid var(--color-border)' }}
      className="last:border-0 transition-colors hover:bg-[var(--color-surface-hover)]"
    >
      {children}
    </tr>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest"
      style={{ color: 'var(--color-text-tertiary)' }}
    >
      {children}
    </th>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      className="px-4 py-3"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      {children}
    </td>
  );
}

// Default export for convenience
export default Table;
