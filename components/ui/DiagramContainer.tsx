import { cn } from '@/lib/utils';

interface DiagramContainerProps {
  caption?: string;
  children: React.ReactNode;
  className?: string;
  /** Remove the default min-height and center-align for text-based diagrams */
  compact?: boolean;
}

export default function DiagramContainer({
  caption,
  children,
  className,
  compact = false,
}: DiagramContainerProps) {
  return (
    <figure
      className={cn('my-10 rounded-xl overflow-hidden', className)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Diagram area */}
      <div
        className={cn(
          'flex items-center justify-center p-8',
          !compact && 'min-h-48'
        )}
      >
        {children}
      </div>

      {/* Caption */}
      {caption && (
        <figcaption
          className="border-t px-6 py-3 text-center text-xs"
          style={{
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
