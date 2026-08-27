'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { LearningConnection } from '@/types';

interface ConnectionsMapProps {
  connections: LearningConnection[];
  className?: string;
}

const TYPE_STYLES: Record<
  LearningConnection['type'],
  { label: string; accent: string; opacity?: string }
> = {
  previous: { label: 'Before', accent: 'var(--color-text-tertiary)', opacity: '0.6' },
  current:  { label: 'You are here', accent: 'var(--color-accent-primary)' },
  next:     { label: 'After', accent: 'var(--color-accent-secondary)', opacity: '0.6' },
};

export default function ConnectionsMap({ connections, className }: ConnectionsMapProps) {
  return (
    <div className={cn('my-10', className)}>
      <p
        className="mb-5 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-tertiary)' }}
      >
        Concept Map
      </p>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {connections.map((conn, i) => {
          const style = TYPE_STYLES[conn.type] ?? TYPE_STYLES.current;
          const isCurrent = conn.type === 'current';

          const card = (
            <div
              className={cn(
                'flex-1 rounded-lg px-4 py-3 transition-colors',
                isCurrent ? 'ring-1' : ''
              )}
              style={{
                background: isCurrent ? 'var(--color-surface)' : 'transparent',
                border: `1px solid ${isCurrent ? style.accent : 'var(--color-border)'}`,
                boxShadow: isCurrent
                  ? `0 0 0 1px ${style.accent}22`
                  : undefined,
                opacity: style.opacity ?? 1,
              }}
            >
              <p
                className="mb-1 text-xs font-semibold uppercase tracking-widest"
                style={{ color: style.accent }}
              >
                {style.label}
              </p>
              <p
                className="text-xs"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {conn.module !== undefined && conn.day !== undefined
                  ? `M${conn.module} · D${conn.day}`
                  : null}
              </p>
              <p
                className="text-sm font-medium mt-0.5"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {conn.title}
              </p>
            </div>
          );

          return (
            <div key={i} className="flex flex-row sm:flex-col items-center gap-2 flex-1">
              {conn.slug && conn.type !== 'current' ? (
                <Link
                  href={`/learn/${conn.slug}`}
                  className="flex-1 w-full hover:opacity-100 transition-opacity"
                  style={{ opacity: 0.7 }}
                >
                  {card}
                </Link>
              ) : (
                <div className="flex-1 w-full">{card}</div>
              )}

              {/* Arrow connector — hide after last item */}
              {i < connections.length - 1 && (
                <span
                  className="shrink-0 text-sm sm:rotate-90 select-none"
                  style={{ color: 'var(--color-border)' }}
                  aria-hidden="true"
                >
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
