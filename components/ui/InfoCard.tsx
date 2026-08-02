import { cn } from '@/lib/utils';

type CardVariant = 'info' | 'warning' | 'tip' | 'success' | 'error';

interface InfoCardProps {
  variant?: CardVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CONFIG: Record<
  CardVariant,
  { bg: string; border: string; text: string; labelColor: string; label: string; Icon: () => React.ReactElement }
> = {
  info: {
    bg: 'var(--color-info-bg)',
    border: 'var(--color-info-border)',
    text: 'var(--color-text-secondary)',
    labelColor: 'var(--color-accent-secondary)',
    label: 'Note',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="7"/><line x1="8" y1="7" x2="8" y2="11"/><line x1="8" y1="5" x2="8.01" y2="5"/>
      </svg>
    ),
  },
  warning: {
    bg: 'var(--color-warning-bg)',
    border: 'var(--color-warning-border)',
    text: 'var(--color-text-secondary)',
    labelColor: 'var(--color-warning-text)',
    label: 'Warning',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.02 1.57a1.12 1.12 0 0 1 1.96 0l5.86 10.1A1.12 1.12 0 0 1 13.86 13H2.14a1.12 1.12 0 0 1-.98-1.33L7.02 1.57z"/>
        <line x1="8" y1="6" x2="8" y2="9"/><line x1="8" y1="11" x2="8.01" y2="11"/>
      </svg>
    ),
  },
  tip: {
    bg: 'var(--color-tip-bg)',
    border: 'var(--color-tip-border)',
    text: 'var(--color-text-secondary)',
    labelColor: 'var(--color-tip-text)',
    label: 'Tip',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 1a5 5 0 0 1 2 9.58V12H6v-1.42A5 5 0 0 1 8 1z"/>
        <line x1="6" y1="13.5" x2="10" y2="13.5"/><line x1="6.5" y1="15" x2="9.5" y2="15"/>
      </svg>
    ),
  },
  success: {
    bg: 'var(--color-success-bg)',
    border: 'var(--color-success-border)',
    text: 'var(--color-text-secondary)',
    labelColor: 'var(--color-success-text)',
    label: 'Key Insight',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="7"/><polyline points="5 8.5 7 10.5 11 6.5"/>
      </svg>
    ),
  },
  error: {
    bg: 'var(--color-error-bg)',
    border: 'var(--color-error-border)',
    text: 'var(--color-text-secondary)',
    labelColor: 'var(--color-error-text)',
    label: 'Important',
    Icon: () => (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="7"/><line x1="8" y1="5" x2="8" y2="8.5"/><line x1="8" y1="10.5" x2="8.01" y2="10.5"/>
      </svg>
    ),
  },
};

export default function InfoCard({ variant = 'info', title, children, className }: InfoCardProps) {
  const cfg = VARIANT_CONFIG[variant];
  const { Icon } = cfg;

  return (
    <div
      role="note"
      className={cn('my-6 rounded-lg', className)}
      style={{
        background: cfg.bg,
        borderLeft: `3px solid ${cfg.border}`,
        padding: '1rem 1.125rem 1rem 1.125rem',
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ color: cfg.border, display: 'flex', flexShrink: 0 }} aria-hidden="true">
          <Icon />
        </span>
        <p style={{
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em',
          textTransform: 'uppercase', color: cfg.labelColor, margin: 0,
        }}>
          {title ?? cfg.label}
        </p>
      </div>

      {/* Body */}
      <div style={{
        fontSize: '0.9375rem', lineHeight: '1.7',
        color: cfg.text, paddingLeft: '1.5rem',
      }}>
        {children}
      </div>
    </div>
  );
}

export const Warning  = (props: Omit<InfoCardProps, 'variant'>) => <InfoCard variant="warning"  {...props} />;
export const Tip      = (props: Omit<InfoCardProps, 'variant'>) => <InfoCard variant="tip"      {...props} />;
export const KeyInsight = (props: Omit<InfoCardProps, 'variant'>) => <InfoCard variant="success" {...props} />;
export const Important  = (props: Omit<InfoCardProps, 'variant'>) => <InfoCard variant="error"   {...props} />;
