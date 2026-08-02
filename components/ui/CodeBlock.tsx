'use client';

import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ children, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: '1.75rem 0',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Window dots */}
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <div key={c} style={{ height: '10px', width: '10px', borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
          </div>
          <span style={{
            fontSize: '0.75rem', color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.02em',
          }}>
            {filename ?? language ?? 'code'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', border: 'none',
            background: copied ? 'var(--color-success-bg)' : 'transparent',
            color: copied ? 'var(--color-success-text)' : 'var(--color-text-muted)',
            transition: 'all 150ms',
          }}
          onMouseEnter={(e) => {
            if (!copied) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
          }}
          onMouseLeave={(e) => {
            if (!copied) (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="2 6.5 4.5 9 10 3"/>
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="4" width="7" height="7" rx="1"/><path d="M1 8V2a1 1 0 0 1 1-1h6"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre style={{
        overflowX: 'auto',
        padding: '1.25rem 1.375rem',
        margin: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem',
        lineHeight: '1.8',
        color: 'var(--color-text-secondary)',
        background: 'transparent',
        border: 'none',
        borderRadius: 0,
      }}>
        <code style={{ fontFamily: 'inherit', fontSize: 'inherit', background: 'none', border: 'none', padding: 0, color: 'inherit', whiteSpace: 'pre' }}>
          {children}
        </code>
      </pre>
    </div>
  );
}
