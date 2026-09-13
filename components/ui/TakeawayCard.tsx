import React from 'react';
import { cn } from '@/lib/utils';
import type { Takeaway } from '@/types';

interface TakeawayCardProps {
  takeaways?: Takeaway[];
  children?: React.ReactNode;
  title?: string;
  className?: string;
}

export default function TakeawayCard({
  takeaways = [],
  children,
  title = 'Key Takeaways',
  className,
}: TakeawayCardProps) {
  return (
    <div
      className={cn('rounded-xl p-6 my-10', className)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span
          className="w-2 h-2 rounded-full inline-block"
          style={{ background: 'var(--color-accent)' }}
        />
        <p
          className="text-xs font-semibold uppercase tracking-widest m-0"
          style={{ color: 'var(--color-accent)' }}
        >
          {title}
        </p>
      </div>

      {children ? (
        <div
          className="takeaway-content"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '0.9375rem',
            lineHeight: 1.7,
          }}
        >
          {children}
        </div>
      ) : takeaways.length > 0 ? (
        <ul className="space-y-4 m-0 p-0 list-none">
          {takeaways.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              {/* Bullet */}
              <span
                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                }}
              >
                {i + 1}
              </span>

              <div>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {item.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
