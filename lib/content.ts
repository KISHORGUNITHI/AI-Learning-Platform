/**
 * lib/content.ts — Data access layer
 *
 * Content layout:
 *   content/
 *     metadata/
 *       roadmap.json        ← module + day registry
 *       onboarding.json     ← pre-module onboarding lessons registry
 *     modules/
 *       start-here.mdx          ← onboarding (root level, no sub-folder)
 *       ai-journey.mdx
 *       modern-ai-systems.mdx
 *       module-1/
 *         day-1.mdx
 *       module-2/
 *         day-1.mdx
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { ArticleMetadata, Module, OnboardingLesson } from '@/types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');
const MODULES_DIR  = path.join(CONTENT_ROOT, 'modules');
const METADATA_DIR = path.join(CONTENT_ROOT, 'metadata');

// ─── Slug discovery ───────────────────────────────────────────────────────────

/**
 * Returns all MDX slugs relative to MODULES_DIR.
 * Root-level files  → slug = filename without extension  e.g. "start-here"
 * Sub-folder files  → slug = "module-1/day-1"
 */
export function getArticleSlugs(): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name));
      } else if (entry.name.endsWith('.mdx')) {
        const relative = path
          .relative(MODULES_DIR, path.join(dir, entry.name))
          .replace(/\\/g, '/')
          .replace(/\.mdx$/, '');
        files.push(relative);
      }
    }
  }

  walk(MODULES_DIR);
  return files;
}

// ─── MDX preprocessor for v6 compatibility ───────────────────────────────────

/**
 * COMPATIBILITY SHIM (next-mdx-remote v6 Migration)
 * 
 * WHY IT EXISTS:
 * In next-mdx-remote v6 (which uses MDX v3 under the hood), writing LaTeX display math 
 * blocks (`$$...$$`) directly inside a JSX element (like <MathBlock>) causes Acorn parser errors. 
 * Acorn treats curly braces `{}` and other LaTeX symbols as JavaScript expression blocks, 
 * leading to compile-time build failures.
 * 
 * WHAT IT DOES:
 * This shim intercepts the raw MDX content from files on disk and rewrites any inline
 * `<MathBlock>$$formula$$</MathBlock>` elements to pass the formula as a safe JSX string attribute:
 * `<MathBlock formula="formula" />`. Double quotes and backslashes are escaped to prevent 
 * parsing issues.
 * 
 * DECOMMISSION CONDITIONS:
 * This preprocessor shim can be removed in the future if:
 * 1. The MDX parser / compiler officially supports ignoring LaTeX braces inside JSX children, OR
 * 2. All MDX lessons are migrated to explicitly use the `formula` prop:
 *    `<MathBlock title="Example" formula="x^2 + y^2 = z^2" />`
 */
function preprocessMdx(content: string): string {
  // COMPATIBILITY FEATURE FLAG:
  // If DISABLE_MDX_MATHBLOCK_SHIM is set to 'true' in the environment,
  // bypass this compatibility preprocessor shim.
  if (process.env.DISABLE_MDX_MATHBLOCK_SHIM === 'true') {
    return content;
  }

  return content.replace(
    /<MathBlock([^>]*?)>\s*\$\$([\s\S]*?)\$\$\s*<\/MathBlock>/g,
    (_, attrs, formula) => {
      // Escape backslashes for JS/TS parser inside JSX string literal double quotes
      // and escape any double quotes inside the formula
      const escapedFormula = formula
        .trim()
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
      return `<MathBlock${attrs} formula="${escapedFormula}" />`;
    }
  );
}

// ─── Article access ───────────────────────────────────────────────────────────

export function getArticleBySlug(slug: string): {
  metadata: ArticleMetadata;
  content: string;
} {
  const filePath = path.join(MODULES_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const { minutes } = readingTime(content);

  const metadata: ArticleMetadata = {
    ...(data as Omit<ArticleMetadata, 'computedReadingTime'>),
    slug: (data.slug as string | undefined) ?? slug,
    computedReadingTime: Math.ceil(minutes),
  };

  return { metadata, content: preprocessMdx(content) };
}

export function getAllArticles(): ArticleMetadata[] {
  return getArticleSlugs()
    .map((slug) => {
      try {
        return getArticleBySlug(slug).metadata;
      } catch {
        return null;
      }
    })
    .filter((m): m is ArticleMetadata => m !== null);
}

// ─── Roadmap access ───────────────────────────────────────────────────────────

export function getRoadmap(): Module[] {
  const p = path.join(METADATA_DIR, 'roadmap.json');
  if (!fs.existsSync(p)) return [];
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as Module[];
}

export function getModuleDays(moduleNumber: number): Module['days'] {
  return getRoadmap().find((m) => m.number === moduleNumber)?.days ?? [];
}

// ─── Onboarding access ────────────────────────────────────────────────────────

/**
 * Returns all onboarding lessons from content/metadata/onboarding.json,
 * sorted by order. Filters out unpublished lessons automatically.
 */
export function getOnboardingLessons(): OnboardingLesson[] {
  const p = path.join(METADATA_DIR, 'onboarding.json');
  if (!fs.existsSync(p)) return [];
  const all = JSON.parse(fs.readFileSync(p, 'utf-8')) as OnboardingLesson[];
  return all.filter((l) => l.published).sort((a, b) => a.order - b.order);
}
