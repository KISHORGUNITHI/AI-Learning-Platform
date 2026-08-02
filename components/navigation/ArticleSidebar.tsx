'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Day } from '@/types';

interface SidebarSection {
  id: string;
  label: string;
}

interface ArticleSidebarProps {
  /** The day entries for the current module */
  days?: Day[];
  /** Module number for header label */
  moduleNumber?: number;
  moduleTitle?: string;
  /** Slug of the currently active article */
  currentSlug?: string;
  /** Table-of-contents headings extracted from the article */
  sections?: SidebarSection[];
}

export default function ArticleSidebar({
  days = [],
  moduleNumber,
  moduleTitle,
  currentSlug,
  sections = [],
}: ArticleSidebarProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Highlight the section heading that is currently in the viewport
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <aside className="flex flex-col gap-8 text-sm">
      {/* Module navigation */}
      {days.length > 0 && (
        <div>
          {moduleNumber !== undefined && (
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Module {moduleNumber}
              {moduleTitle ? ` — ${moduleTitle}` : ''}
            </p>
          )}
          <ul className="space-y-0.5">
            {days.map((day) => {
              const isActive = day.slug === currentSlug;
              return (
                <li key={day.slug}>
                  {day.published ? (
                    <Link
                      href={`/learn/${day.slug}`}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 transition-colors',
                        isActive
                          ? 'font-medium'
                          : 'hover:text-[var(--color-text-primary)]'
                      )}
                      style={{
                        background: isActive ? 'var(--color-surface)' : 'transparent',
                        color: isActive
                          ? 'var(--color-text-primary)'
                          : 'var(--color-text-secondary)',
                      }}
                    >
                      <span
                        className="shrink-0 text-xs tabular-nums"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {String(day.number).padStart(2, '0')}
                      </span>
                      <span className="truncate">{day.title}</span>
                    </Link>
                  ) : (
                    <span
                      className="flex items-center gap-2.5 px-2.5 py-1.5 cursor-not-allowed opacity-40"
                      style={{ color: 'var(--color-text-secondary)' }}
                      title="Coming soon"
                    >
                      <span
                        className="shrink-0 text-xs tabular-nums"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {String(day.number).padStart(2, '0')}
                      </span>
                      <span className="truncate">{day.title}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* On this page (ToC) */}
      {sections.length > 0 && (
        <div>
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            On this page
          </p>
          <ul className="space-y-0.5">
            {sections.map(({ id, label }) => {
              const isActive = activeId === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      'block rounded px-2.5 py-1 transition-colors truncate',
                      isActive
                        ? 'font-medium'
                        : 'hover:text-[var(--color-text-primary)]'
                    )}
                    style={{
                      color: isActive
                        ? 'var(--color-accent-primary)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
