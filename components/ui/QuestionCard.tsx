'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionCardProps {
  question: string;
  /** The insight / reflection shown on expansion */
  insight?: string;
  index?: number;
}

export default function QuestionCard({ question, insight, index }: QuestionCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-4 px-5 py-4 text-left transition-colors"
        style={{ cursor: 'pointer' }}
        aria-expanded={open}
      >
        {/* Number */}
        {index !== undefined && (
          <span
            className="mt-0.5 shrink-0 text-sm font-semibold tabular-nums"
            style={{ color: 'var(--color-accent-secondary)' }}
          >
            Q{index + 1}
          </span>
        )}

        {/* Question text */}
        <span
          className="flex-1 text-sm font-medium leading-relaxed"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {question}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-0.5 text-lg leading-none select-none"
          style={{ color: 'var(--color-text-tertiary)' }}
          aria-hidden="true"
        >
          ↓
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && insight && (
          <motion.div
            key="insight"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className="px-5 pb-4 pt-0 text-sm leading-relaxed"
              style={{
                borderTop: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                paddingTop: '1rem',
              }}
            >
              {insight}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
