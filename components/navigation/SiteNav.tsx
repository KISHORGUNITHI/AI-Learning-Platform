'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import roadmapData from '@/content/metadata/roadmap.json';
import onboardingData from '@/content/metadata/onboarding.json';
import type { Module, OnboardingLesson } from '@/types';

const allModules = roadmapData as Module[];
const allOnboarding = onboardingData as OnboardingLesson[];

const publishedModules = allModules
  .map((m) => ({ ...m, days: m.days.filter((d) => d.published) }))
  .filter((m) => m.days.length > 0);

const publishedOnboarding = allOnboarding
  .filter((l) => l.published)
  .sort((a, b) => a.order - b.order);

interface SiteNavProps {
  onNavigate?: () => void;
}

export default function SiteNav({ onNavigate }: SiteNavProps) {
  const pathname = usePathname();

  const isLearnActive = pathname.startsWith('/learn');
  const isHomeActive  = pathname === '/';
  const isAboutActive = pathname === '/about';

  const currentSlug = pathname.startsWith('/learn/')
    ? pathname.slice('/learn/'.length)
    : null;

  const activeModuleNumber =
    publishedModules.find((m) => m.days.some((d) => d.slug === currentSlug))?.number ?? null;

  const [learnOpen, setLearnOpen] = useState(isLearnActive);
  const [moduleOpen, setModuleOpen] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(
      publishedModules.map((m) => [
        m.number,
        m.number === activeModuleNumber ||
          (activeModuleNumber === null && m.number === publishedModules[0]?.number),
      ])
    )
  );

  const activeRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    if (isLearnActive) setLearnOpen(true);
  }, [isLearnActive]);

  const toggleModule = (n: number) =>
    setModuleOpen((prev) => ({ ...prev, [n]: !prev[n] }));

  return (
    <nav aria-label="Site navigation" style={{ padding: '0.25rem 0.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1px' }}>

      {/* Home */}
      <NavLink href="/" active={isHomeActive} onClick={onNavigate}>Home</NavLink>

      {/* Learn */}
      <div>
        <button
          onClick={() => setLearnOpen((v) => !v)}
          aria-expanded={learnOpen}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '0.5rem', padding: '0 0.75rem', height: '2.4rem', borderRadius: '0.5rem',
            fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', border: 'none',
            background: isLearnActive && !learnOpen ? 'var(--color-surface)' : 'transparent',
            color: isLearnActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            transition: 'background 150ms, color 150ms', textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            if (!(isLearnActive && !learnOpen))
              (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)';
          }}
          onMouseLeave={(e) => {
            if (!(isLearnActive && !learnOpen))
              (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <span>Learn</span>
          <motion.span
            animate={{ rotate: learnOpen ? 90 : 0 }}
            transition={{ duration: 0.18 }}
            style={{ color: 'var(--color-text-tertiary)', fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}
            aria-hidden="true"
          >›</motion.span>
        </button>

        <AnimatePresence initial={false}>
          {learnOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginLeft: '0.875rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '0.5rem', marginTop: '2px', marginBottom: '4px' }}>

                {/* ── Onboarding lessons (before Module 1) ── */}
                {publishedOnboarding.length > 0 && (
                  <div style={{ marginBottom: '6px' }}>
                    {publishedOnboarding.map((lesson) => {
                      const isActive = currentSlug === lesson.slug;
                      return (
                        <Link
                          key={lesson.slug}
                          href={`/learn/${lesson.slug}`}
                          ref={isActive ? activeRef : undefined}
                          onClick={onNavigate}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.3rem 0.625rem', borderRadius: '0.4375rem',
                            fontSize: '0.8125rem', lineHeight: '1.5',
                            background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
                            color: isActive ? 'var(--color-accent-secondary)' : 'var(--color-text-secondary)',
                            fontWeight: isActive ? 500 : 400,
                            transition: 'background 150ms, color 150ms',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              const el = e.currentTarget as HTMLElement;
                              el.style.color = 'var(--color-text-primary)';
                              el.style.background = 'var(--color-surface-2)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              const el = e.currentTarget as HTMLElement;
                              el.style.color = 'var(--color-text-secondary)';
                              el.style.background = 'transparent';
                            }
                          }}
                        >
                          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {lesson.title}
                          </span>
                        </Link>
                      );
                    })}
                    {/* Divider between onboarding and modules */}
                    <div style={{ height: '1px', background: 'var(--color-border)', margin: '6px 0.625rem 8px' }} />
                  </div>
                )}
                {publishedModules.map((mod) => {
                  const isModOpen = moduleOpen[mod.number] ?? false;
                  const hasActive = mod.days.some((d) => d.slug === currentSlug);

                  return (
                    <div key={mod.number} style={{ marginBottom: '2px' }}>
                      <button
                        onClick={() => toggleModule(mod.number)}
                        aria-expanded={isModOpen}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0 0.625rem', height: '2rem', borderRadius: '0.375rem',
                          fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.01em',
                          cursor: 'pointer', border: 'none', textAlign: 'left',
                          background: hasActive && !isModOpen ? 'var(--color-surface)' : 'transparent',
                          color: hasActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                          transition: 'background 150ms, color 150ms',
                        }}
                        onMouseEnter={(e) => {
                          if (!hasActive) (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)';
                        }}
                        onMouseLeave={(e) => {
                          if (!hasActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                      >
                        <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: mod.color ?? 'var(--color-accent-primary)', flexShrink: 0 }} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Module {mod.number} — {mod.title}
                        </span>
                        <motion.span
                          animate={{ rotate: isModOpen ? 90 : 0 }}
                          transition={{ duration: 0.15 }}
                          style={{ color: 'var(--color-text-tertiary)', fontSize: '0.875rem', lineHeight: 1, flexShrink: 0 }}
                          aria-hidden="true"
                        >›</motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isModOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            style={{ overflow: 'hidden', paddingLeft: '0.75rem', marginBottom: '4px', listStyle: 'none' }}
                          >
                            {mod.days.map((day) => {
                              const isActive = day.slug === currentSlug;
                              return (
                                <li key={day.slug}>
                                  <Link
                                    href={`/learn/${day.slug}`}
                                    ref={isActive ? activeRef : undefined}
                                    onClick={onNavigate}
                                    style={{
                                      display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                                      padding: '0.3rem 0.625rem', borderRadius: '0.4375rem',
                                      fontSize: '0.8125rem', lineHeight: '1.5',
                                      background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
                                      color: isActive ? 'var(--color-accent-secondary)' : 'var(--color-text-secondary)',
                                      fontWeight: isActive ? 500 : 400,
                                      transition: 'background 150ms, color 150ms',
                                      textDecoration: 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isActive) {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.color = 'var(--color-text-primary)';
                                        el.style.background = 'var(--color-surface-2)';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isActive) {
                                        const el = e.currentTarget as HTMLElement;
                                        el.style.color = 'var(--color-text-secondary)';
                                        el.style.background = 'transparent';
                                      }
                                    }}
                                  >
                                    <span style={{
                                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                                      fontSize: '0.7rem', fontVariantNumeric: 'tabular-nums',
                                      flexShrink: 0, minWidth: '1.1rem', textAlign: 'right', paddingTop: '0.15rem',
                                    }}>
                                      {day.number}.
                                    </span>
                                    <span style={{ flex: 1 }}>{day.title}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* About */}
      <NavLink href="/about" active={isAboutActive} onClick={onNavigate}>About</NavLink>

    </nav>
  );
}

function NavLink({ href, active, onClick, children }: {
  href: string; active: boolean; onClick?: () => void; children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center',
        padding: '0 0.75rem', height: '2.4rem', borderRadius: '0.5rem',
        fontSize: '0.875rem', fontWeight: active ? 500 : 400, textDecoration: 'none',
        color: active ? 'var(--color-accent-secondary)' : 'var(--color-text-secondary)',
        background: active ? 'var(--color-accent-subtle)' : 'transparent',
        transition: 'background 150ms, color 150ms',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'var(--color-surface-2)';
          el.style.color = 'var(--color-text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'transparent';
          el.style.color = 'var(--color-text-secondary)';
        }
      }}
    >
      {children}
    </Link>
  );
}
