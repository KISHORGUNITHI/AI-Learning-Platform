// ============================================================
// Type definitions — AI Learning Platform
// Schema version: 2
//
// Extending any of these types is additive and non-breaking:
// add optional fields to ArticleMetadata / Day and the
// rendering layer will use them automatically.
// ============================================================

// ─── Difficulty ─────────────────────────────────────────────────────────────
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

// ─── Prerequisite ───────────────────────────────────────────────────────────
/** A fully-qualified reference to another article. Supports navigation. */
export interface Prerequisite {
  module: number;
  day: number;
  topic: string;
  /** The URL slug — used to build the href when the article is published. */
  slug?: string;
}

// ─── NavLink ────────────────────────────────────────────────────────────────
/** Minimal cross-article navigation reference (prev / next). */
export interface NavLink {
  title: string;
  slug: string;
  module?: number;
  day?: number;
}

// ─── OnboardingLesson ────────────────────────────────────────────────────────
/** Registry entry for a pre-module onboarding lesson (content/metadata/onboarding.json) */
export interface OnboardingLesson {
  order: number;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  estimatedReadingTime?: string;
  estimatedStudyTime?: string;
  tags?: string[];
}

// ─── ArticleMetadata ────────────────────────────────────────────────────────
/**
 * Everything parsed from an MDX article's frontmatter.
 * All optional fields degrade gracefully — the UI only renders them
 * when present, so older articles never break with new schema additions.
 */
export interface ArticleMetadata {
  // Identity
  title: string;
  module?: number;
  day?: number;
  slug: string;
  description: string;

  // Status
  published: boolean;
  author?: string;
  /** ISO 8601 date string — when the article was first written, e.g. "2024-11-01" */
  createdAt?: string;
  /** ISO 8601 date string — last meaningful content update */
  updatedAt?: string;

  // Learning metadata
  difficulty?: Difficulty;
  /** Human-readable, e.g. "18 min". Sourced from frontmatter; overrides computed value. */
  estimatedReadingTime?: string;
  /** Human-readable, e.g. "45 min" — includes exercises and reflection. */
  estimatedStudyTime?: string;
  /** Computed at build time by reading-time library (in minutes). */
  computedReadingTime?: number;
  tags?: string[];

  // Prerequisites
  prerequisites?: Prerequisite[];

  // Learning objectives
  learningObjectives?: string[];

  // Navigation
  previous?: NavLink;
  next?: NavLink;
}

// ─── Day ────────────────────────────────────────────────────────────────────
/**
 * One entry in roadmap.json.
 * Mirrors ArticleMetadata for the subset of fields kept in the roadmap
 * (lightweight — no full content, no objectives).
 * Adding new optional fields here is always safe.
 */
export interface Day {
  number: number;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  difficulty?: Difficulty;
  estimatedReadingTime?: string;
  estimatedStudyTime?: string;
  tags?: string[];
}

// ─── Module ─────────────────────────────────────────────────────────────────
export interface Module {
  number: number;
  title: string;
  description: string;
  /** Hex color used as the module accent (e.g. sidebar, roadmap card) */
  color?: string;
  days: Day[];
}

// ─── LearningConnection ─────────────────────────────────────────────────────
/** Used by ConnectionsMap to render the prev → current → next concept flow. */
export interface LearningConnection {
  type: 'previous' | 'current' | 'next';
  title: string;
  module?: number;
  day?: number;
  slug?: string;
}

// ─── Takeaway ────────────────────────────────────────────────────────────────
export interface Takeaway {
  title: string;
  description: string;
}

// ─── Search ──────────────────────────────────────────────────────────────────
/** Minimal document record used by the future search index. */
export interface SearchDocument {
  slug: string;
  title: string;
  description: string;
  module?: number;
  day?: number;
  tags?: string[];
  difficulty?: Difficulty;
  excerpt?: string;
}
