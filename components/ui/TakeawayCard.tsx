import { cn } from '@/lib/utils';
import type { Takeaway } from '@/types';

interface TakeawayCardProps {
  takeaways: Takeaway[];
  className?: string;
}

export default function TakeawayCard({ takeaways, className }: TakeawayCardProps) {
  return (
    <div
      className={cn('rounded-xl p-6 my-10', className)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <p
        className="mb-5 text-xs font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-accent-primary)' }}
      >
        Key Takeaways
      </p>

      <ul className="space-y-4">
        {takeaways.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            {/* Bullet */}
            <span
              className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: 'var(--color-accent-primary)',
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
    </div>
  );
}
