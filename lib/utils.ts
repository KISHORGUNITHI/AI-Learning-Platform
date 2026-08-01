import { clsx, type ClassValue } from 'clsx';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return clsx(...inputs);
}

/** Format a module + day label */
export function formatModuleDay(module: number, day: number): string {
  return `Module ${module} · Day ${day}`;
}

/** Build the URL for a learning article */
export function articleHref(slug: string): string {
  return `/learn/${slug}`;
}
