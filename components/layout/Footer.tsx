'use client';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        padding: '1.75rem var(--page-gutter)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--page-max-width)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} Learn AI
        </p>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            margin: 0,
          }}
        >
          Designed for learning. Built from first principles.
        </p>
      </div>
    </footer>
  );
}
