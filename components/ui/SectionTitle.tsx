import { cn } from '@/lib/utils';

interface SectionTitleProps {
  /** The section label shown above the title in small caps */
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  /** Auto-generated anchor id */
  id?: string;
  as?: 'h2' | 'h3' | 'h4';
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  className,
  id,
  as: Tag = 'h2',
}: SectionTitleProps) {
  return (
    <div className={cn('mb-8', className)}>
      {eyebrow && (
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-accent-primary)' }}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className="scroll-mt-24 font-semibold tracking-tight"
        style={{
          fontSize: Tag === 'h2' ? 'var(--text-3xl)' : Tag === 'h3' ? 'var(--text-2xl)' : 'var(--text-xl)',
          color: 'var(--color-text-primary)',
          lineHeight: 'var(--leading-tight)',
        }}
      >
        {title}
      </Tag>
      {description && (
        <p
          className="mt-3 text-lg"
          style={{
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
