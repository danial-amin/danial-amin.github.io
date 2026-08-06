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

/**
 * The production default is the Railway URL, not academic.danialamin.com.
 *
 * That domain is still served by GitHub Pages from the previous version of the
 * academic site, which has no /writing routes: all 27 "read it in full" links
 * returned 404 there, and the extract pages were setting rel=canonical to those
 * same 404s. The new site — the one with the essays and the projector — answers
 * every one of those 27 slugs on the Railway deployment, which is why it is what
 * the links point at.
 *
 * This is meant to be temporary. When the domain is moved to the new deployment,
 * put 'https://academic.danialamin.com' back here (or set PUBLIC_ACADEMIC_ORIGIN
 * to it, which needs no commit) — every academic link and canonical on the site
 * follows this one value.
 */
export const ACADEMIC_ORIGIN =
  fromEnv?.replace(/\/+$/, '') ||
  (import.meta.env.DEV
    ? 'http://localhost:4322'
    : 'https://damin-acadgithubio-production.up.railway.app');

/** absolute URL of the full version of an essay */
export const academicEssay = (slug: string) => `${ACADEMIC_ORIGIN}/writing/${slug.toLowerCase()}`;

/**
 * The other two places the sister site is linked.
 *
 * These used to be written out by hand — `academicUrl` in site.json for the
 * footer, the research page, the palette and the teaser, and a literal
 * `https://academic.danialamin.com/publications` inside Cloud3D — which meant
 * PUBLIC_ACADEMIC_ORIGIN moved the essay links and left everything else pointing
 * at production. There is one origin now, so redirecting the sister site is one
 * variable rather than a search-and-replace.
 */
export const academicHome = `${ACADEMIC_ORIGIN}/`;
export const academicPublications = `${ACADEMIC_ORIGIN}/publications`;

/** true when we are pointing at a local dev server rather than the real site */
export const ACADEMIC_IS_LOCAL = /localhost|127\.0\.0\.1/.test(ACADEMIC_ORIGIN);

/**
 * Whether the sister site is currently at its permanent address.
 *
 * Only then may an extract hand its rel=canonical across. A canonical is a
 * durable claim about where a piece really lives, and while the origin is a
 * temporary railway.app hostname that claim would get the wrong URL indexed and
 * leave 27 of them to clean up later. False here means the extract stays its own
 * canonical — the visible "read it in full" link still goes to the working
 * deployment, so readers lose nothing.
 */
export const ACADEMIC_CANONICAL_ORIGIN = 'https://academic.danialamin.com';
export const ACADEMIC_IS_CANONICAL = ACADEMIC_ORIGIN === ACADEMIC_CANONICAL_ORIGIN;
