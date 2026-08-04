/**
 * Where the sister site lives.
 *
 * The two sites cross-link (extracts here, full essays there), so the origin has
 * to follow the environment or every local click leaves for production. In dev
 * it points at the academic dev server; in a build it points at the real domain.
 * Override either with PUBLIC_ACADEMIC_ORIGIN, which is what a Railway preview
 * deploy would set.
 */
const fromEnv = import.meta.env.PUBLIC_ACADEMIC_ORIGIN as string | undefined;

export const ACADEMIC_ORIGIN =
  fromEnv?.replace(/\/+$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:4322' : 'https://academic.danialamin.com');

/** absolute URL of the full version of an essay */
export const academicEssay = (slug: string) => `${ACADEMIC_ORIGIN}/writing/${slug.toLowerCase()}`;

/** true when we are pointing at a local dev server rather than the real site */
export const ACADEMIC_IS_LOCAL = /localhost|127\.0\.0\.1/.test(ACADEMIC_ORIGIN);
