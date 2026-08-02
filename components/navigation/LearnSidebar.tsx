'use client';

/**
 * LearnSidebar — the desktop sidebar panel that appears on lg+ screens
 * inside the /learn section.
 *
 * Uses the unified SiteNav tree so the navigation is identical everywhere.
 * The mobile equivalent is the Header's global drawer.
 */

import SiteNav from './SiteNav';

export function LearnSidebarDesktop() {
  return (
    <aside
      className="hidden lg:flex flex-col shrink-0"
      style={{ width: '16rem', borderRight: '1px solid var(--color-border)' }}
    >
      <div
        className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto"
        style={{ scrollbarWidth: 'thin', padding: '1rem 0 1rem' }}
      >
        <SiteNav />
      </div>
    </aside>
  );
}
