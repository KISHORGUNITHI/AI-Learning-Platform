/**
 * MDXComponents.tsx
 *
 * Two things live here:
 *  1. mdxComponents — the map passed to MDXRemote. Overrides every
 *     standard HTML element rendered from Markdown, and exposes all
 *     platform components so MDX authors never need to import anything.
 *  2. Named re-exports so other files can import components from one place.
 *
 * Adding a new component to the platform:
 *   1. Create the file under components/ui/
 *   2. Import it here
 *   3. Add it to mdxComponents below
 *   That's it — it will be available in every MDX article automatically.
 */

import InfoCard, { Warning, Tip, KeyInsight } from '@/components/ui/InfoCard';
import QuestionCard from '@/components/ui/QuestionCard';
import DiagramContainer from '@/components/ui/DiagramContainer';
import TakeawayCard from '@/components/ui/TakeawayCard';
import SectionTitle from '@/components/ui/SectionTitle';
import CodeBlock from '@/components/ui/CodeBlock';
import Equation from '@/components/ui/Equation';
import Callout from '@/components/ui/Callout';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import FlowDiagram from '@/components/ui/FlowDiagram';
import TokenMapping from '@/components/ui/TokenMapping';
import Comparison from '@/components/ui/Comparison';
import MathBlock from '@/components/ui/MathBlock';
import FunctionPlot from '@/components/ui/FunctionPlot';
import ScalingVisualizer from '@/components/ui/ScalingVisualizer';
import SoftmaxSaturation from '@/components/ui/SoftmaxSaturation';
import SoftmaxVisualizer from '@/components/ui/SoftmaxVisualizer';
import WeightedSumVisualizer from '@/components/ui/WeightedSumVisualizer';
import SelfAttentionWalkthrough from '@/components/ui/SelfAttentionWalkthrough';
import MultiHeadArchitecture from '@/components/ui/MultiHeadArchitecture';
import ParallelHeadsVisualizer from '@/components/ui/ParallelHeadsVisualizer';
import ConcatenationVisualizer from '@/components/ui/ConcatenationVisualizer';

// ─── Named re-exports ─────────────────────────────────────────────────────────
export {
  InfoCard, Warning, Tip, KeyInsight,
  QuestionCard,
  DiagramContainer,
  TakeawayCard,
  SectionTitle,
  CodeBlock,
  Equation,
  Callout,
  Table, Thead, Tbody, Tr, Th, Td,
  FlowDiagram,
  TokenMapping,
  Comparison,
  MathBlock,
  FunctionPlot,
  ScalingVisualizer,
  SoftmaxSaturation,
  SoftmaxVisualizer,
  WeightedSumVisualizer,
  SelfAttentionWalkthrough,
  MultiHeadArchitecture,
  ParallelHeadsVisualizer,
  ConcatenationVisualizer,
};

// ─── MDX component map ───────────────────────────────────────────────────────
export const mdxComponents = {

  // ── Headings ─────────────────────────────────────────────────────────────
  h2: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h2
      id={id}
      className="scroll-mt-24 mt-12 mb-4 font-semibold tracking-tight"
      style={{
        fontSize: 'var(--text-2xl)',
        lineHeight: 'var(--leading-tight)',
        letterSpacing: '-0.02em',
        color: 'var(--color-text-primary)',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '0.5rem',
      }}
    >
      {children}
    </h2>
  ),

  h3: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h3
      id={id}
      className="scroll-mt-24 mt-8 mb-3 font-semibold tracking-tight"
      style={{
        fontSize: 'var(--text-xl)',
        lineHeight: 'var(--leading-tight)',
        letterSpacing: '-0.015em',
        color: 'var(--color-text-primary)',
      }}
    >
      {children}
    </h3>
  ),

  h4: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <h4
      id={id}
      className="scroll-mt-24 mt-6 mb-2 font-semibold"
      style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}
    >
      {children}
    </h4>
  ),

  // ── Body text ────────────────────────────────────────────────────────────
  p: ({ children }: { children: React.ReactNode }) => (
    <p
      className="mb-5"
      style={{
        color: 'var(--color-text-secondary)',
        lineHeight: 'var(--leading-relaxed)',
        fontSize: '1.0625rem',
      }}
    >
      {children}
    </p>
  ),

  // ── Lists ────────────────────────────────────────────────────────────────
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul
      className="mb-5 space-y-2 pl-5"
      style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', listStyleType: 'disc' }}
    >
      {children}
    </ul>
  ),

  ol: ({ children }: { children: React.ReactNode }) => (
    <ol
      className="mb-5 space-y-2 pl-5"
      style={{ color: 'var(--color-text-secondary)', lineHeight: '1.75', listStyleType: 'decimal' }}
    >
      {children}
    </ol>
  ),

  li: ({ children }: { children: React.ReactNode }) => (
    <li style={{ color: 'var(--color-text-secondary)' }}>{children}</li>
  ),

  // ── Blockquote ───────────────────────────────────────────────────────────
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote
      className="my-6 pl-5"
      style={{
        borderLeft: '3px solid var(--color-accent-primary)',
        color: 'var(--color-text-secondary)',
        fontStyle: 'italic',
      }}
    >
      {children}
    </blockquote>
  ),

  // ── Code ─────────────────────────────────────────────────────────────────
  pre: ({ children }: { children: React.ReactNode }) => (
    <pre
      className="my-6 rounded-xl overflow-x-auto p-5 text-sm"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        fontFamily: 'var(--font-mono)',
        lineHeight: '1.7',
        margin: 0,
      }}
    >
      {children}
    </pre>
  ),

  code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
    if (className?.includes('language-')) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code
        className="rounded px-1.5 py-0.5 text-sm"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-accent-secondary)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {children}
      </code>
    );
  },

  // ── Table (standard Markdown tables) ─────────────────────────────────────
  table: ({ children }: { children: React.ReactNode }) => (
    <div
      className="my-8 w-full overflow-x-auto rounded-xl"
      style={{ border: '1px solid var(--color-border)' }}
    >
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),

  thead: ({ children }: { children: React.ReactNode }) => (
    <thead style={{ background: 'var(--color-surface)' }}>{children}</thead>
  ),

  tbody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,

  tr: ({ children }: { children: React.ReactNode }) => (
    <tr
      className="transition-colors"
      style={{
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {children}
    </tr>
  ),

  th: ({ children }: { children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest"
      style={{ color: 'var(--color-text-tertiary)' }}
    >
      {children}
    </th>
  ),

  td: ({ children }: { children: React.ReactNode }) => (
    <td
      className="px-4 py-3"
      style={{ color: 'var(--color-text-secondary)' }}
    >
      {children}
    </td>
  ),

  // ── Horizontal rule ───────────────────────────────────────────────────────
  hr: () => (
    <hr
      className="my-10"
      style={{ border: 'none', borderTop: '1px solid var(--color-border)' }}
    />
  ),

  // ── Inline ────────────────────────────────────────────────────────────────
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
      {children}
    </strong>
  ),

  em: ({ children }: { children: React.ReactNode }) => (
    <em style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>{children}</em>
  ),

  // ── Platform components ───────────────────────────────────────────────────
  InfoCard, Warning, Tip, KeyInsight,
  QuestionCard,
  DiagramContainer,
  TakeawayCard,
  SectionTitle,
  CodeBlock,
  Equation,
  Callout,
  Table, Thead, Tbody, Tr, Th, Td,
  FlowDiagram,
  TokenMapping,
  Comparison,
  MathBlock,
  FunctionPlot,
  ScalingVisualizer,
  SoftmaxSaturation,
  SoftmaxVisualizer,
  WeightedSumVisualizer,
  SelfAttentionWalkthrough,
  MultiHeadArchitecture,
  ParallelHeadsVisualizer,
  ConcatenationVisualizer,
};
