/**
 * lib/search.ts — Search index and query layer
 *
 * Current state: stub with typed contracts.
 * Architecture is ready for a real implementation drop-in.
 *
 * Recommended future implementation:
 *   - Build time: call buildSearchIndex() in a next.config build script
 *     to write a static JSON index to public/search-index.json
 *   - Client side: load the index lazily and filter with Fuse.js or
 *     FlexSearch for zero-latency local search
 *   - No backend required — compatible with static Vercel deployment
 */

import type { SearchDocument } from '@/types';

// ─── Index building (called at build time) ──────────────────────────────────

/**
 * Builds a flat array of SearchDocuments from all published articles.
 * Intended to be serialised to a static JSON file during the build.
 */
export async function buildSearchIndex(): Promise<SearchDocument[]> {
  // TODO: import getAllArticles(), strip MDX to plain text, return SearchDocument[]
  return [];
}

// ─── Query (called client-side) ─────────────────────────────────────────────

export interface SearchResult {
  document: SearchDocument;
  /** Relevance score 0–1, higher is better */
  score: number;
}

/**
 * Searches the pre-built index for articles matching the query.
 * @param query  - The user's search string
 * @param index  - The pre-loaded SearchDocument array
 * @param limit  - Maximum number of results to return (default 10)
 */
export function searchArticles(
  query: string,
  index: SearchDocument[],
  limit = 10,
): SearchResult[] {
  // TODO: implement with Fuse.js or FlexSearch
  // Stub returns empty array — no-op until search UI is built
  void query;
  void index;
  void limit;
  return [];
}

// ─── Filter helpers ──────────────────────────────────────────────────────────

/** Filter a document list by module number */
export function filterByModule(docs: SearchDocument[], module: number): SearchDocument[] {
  return docs.filter((d) => d.module === module);
}

/** Filter a document list by tag */
export function filterByTag(docs: SearchDocument[], tag: string): SearchDocument[] {
  return docs.filter((d) => d.tags?.includes(tag));
}
