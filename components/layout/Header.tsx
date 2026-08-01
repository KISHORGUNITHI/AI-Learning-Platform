'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import SiteNav from '@/components/navigation/SiteNav';

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <>
      {/* ── Top bar ── */}
      <header
        className="sticky top-0 z-[1020] w-full border-b"
        style={{
          background: 'var(--color-header-bg)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="grid grid-cols-[2.25rem_1fr_2.25rem] items-center h-14 px-4 sm:px-6 gap-2">

          {/* Left: Hamburger */}
          <IconButton onClick={() => setDrawerOpen(true)} label="Open navigation">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M2.5 4.5h13M2.5 9h13M2.5 13.5h13"/>
            </svg>
          </IconButton>

          {/* Centre: Logo */}
          <Link href="/" className="flex items-center justify-center gap-2.5" aria-label="Learn AI Home">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0"
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                boxShadow: '0 2px 8px var(--color-accent-glow)',
                letterSpacing: '-0.02em',
              }}
            >
              AI
            </div>
            <span className="text-sm font-semibold hidden sm:inline" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
              Learn AI
            </span>
          </Link>

          {/* Right: Theme toggle */}
          <IconButton onClick={toggle} label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>

        </div>
      </header>

      {/* ── Mobile / global nav drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[1030] bg-black/60"
              style={{ backdropFilter: 'blur(4px)' }}
              aria-hidden="true"
            />

            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-[1040] flex flex-col"
              style={{ width: 'min(18rem, 85vw)', background: 'var(--color-background)', borderRight: '1px solid var(--color-border)' }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between h-14 px-4 shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setDrawerOpen(false)}>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ background: 'var(--color-accent)', color: '#fff', boxShadow: '0 2px 8px var(--color-accent-glow)', letterSpacing: '-0.02em' }}>
                    AI
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Learn AI</span>
                </Link>
                <IconButton onClick={() => setDrawerOpen(false)} label="Close navigation">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M2 2l12 12M14 2L2 14"/>
                  </svg>
                </IconButton>
              </div>

              {/* Nav tree */}
              <div className="flex-1 overflow-y-auto pt-3" style={{ scrollbarWidth: 'thin' }}>
                <SiteNav onNavigate={() => setDrawerOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Shared icon button ────────────────────────────────────────────────────

function IconButton({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center w-9 h-9 rounded-md transition-colors"
      style={{ color: 'var(--color-text-secondary)' }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'var(--color-surface)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
    >
      {children}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
