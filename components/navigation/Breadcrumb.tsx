import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <span
                className="select-none"
                style={{ color: 'var(--color-text-tertiary)' }}
                aria-hidden="true"
              >
                /
              </span>
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-[var(--color-text-primary)]"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                style={{
                  color: isLast
                    ? 'var(--color-text-secondary)'
                    : 'var(--color-text-tertiary)',
                  fontWeight: isLast ? 500 : 400,
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
