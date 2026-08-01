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

  return { metadata, content };
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
