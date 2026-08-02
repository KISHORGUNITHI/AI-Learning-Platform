/**
 * Equation — renders a display-mode mathematical equation.
 *
 * Current state: wraps children in a styled container.
 * The actual LaTeX is rendered by rehype-katex via the MDX pipeline,
 * so inline $...$ and block $$...$$ already work in MDX files.
 * This component is for programmatic use or labelled equations.
 *
 * Usage in MDX:
 *   <Equation label="Softmax">{`\\text{softmax}(x_i) = \\frac{e^{x_i}}{\\sum_j e^{x_j}}`}</Equation>
 */
interface EquationProps {
  children: React.ReactNode;
  /** Optional equation label displayed on the right */
  label?: string;
}

export default function Equation({ children, label }: EquationProps) {
  return (
    <div
      className="my-8 flex items-center justify-between gap-6 rounded-lg px-6 py-5 overflow-x-auto"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      role="math"
    >
      <div className="flex-1 text-center">{children}</div>
      {label && (
        <span
          className="shrink-0 text-xs font-medium tabular-nums"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          ({label})
        </span>
      )}
    </div>
  );
}
