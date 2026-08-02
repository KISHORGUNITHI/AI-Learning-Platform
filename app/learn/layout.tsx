import { LearnSidebarDesktop } from '@/components/navigation/LearnSidebar';

/**
 * Learn section layout.
 *
 * Desktop (lg+): permanent left sidebar + scrollable content column.
 * Mobile:        full-width content; navigation via Header hamburger drawer.
 */
export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <LearnSidebarDesktop />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
