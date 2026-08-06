/**
 * Turning a pasted blob of markdown into a file the writing collection accepts.
 *
 * The studio composes nothing itself. It sends fields plus a body, and this
 * module is the single authority on slug, filename, frontmatter and validation
 * — so what the preview renders and what gets committed cannot drift, and a
 * malformed post is rejected here rather than by a failed production build
 * twenty minutes later.
 */

export type Source = 'essay' | 'newsletter';

export type PostInput = {
  title: string;
  date: string;
  source: Source;
  excerpt: string;
  tags: string[];
  linkedinUrl?: string;
  slug: string;
  body: string;
};

/** Where each form lives on disk. Must match the globs in src/content.config.ts. */
const DIR: Record<Source, string> = { essay: 'essays', newsletter: 'newsletter' };
const CONTENT_ROOT = 'src/content/writing';

/** Bodies over this are almost certainly a mistake, and the GitHub contents API
 *  wants base64 in a single request. The longest existing post is ~12 KB. */
export const MAX_BODY_BYTES = 400_000;

/* ---------- slug ---------- */

/**
 * The URL is `/writing/<dir>/<date>-<slug>`, so the slug has to survive being a
 * filename and a path segment. Astro lowercases collection ids, which is why
 * three of the older files (RAG-works, AI-Ethics, Specialist-vs-Generalist)
 * needed normalising in lib/writing.ts — new ones are lowercase from the start.
 */
export function slugify(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip the accents NFKD just split off
    .toLowerCase()
    .replace(/['\u2019`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
    .replace(/-+$/g, '');
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/* ---------- pasted frontmatter ---------- */

export type ParsedPaste = { frontmatter: Record<string, string>; body: string };

/**
 * Pasting a whole .md file — frontmatter and all — is the common case, so the
 * leading block is lifted out instead of ending up rendered as a table row by
 * the markdown processor. Deliberately not a YAML parser: it handles the flat
 * `key: value` shape this site's frontmatter actually uses, and anything it
 * cannot read stays in the body where the author will see it.
 */
export function splitFrontmatter(raw: string): ParsedPaste {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { frontmatter: {}, body: text.trim() };

  const frontmatter: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const pair = /^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/.exec(line);
    if (!pair) continue;
    frontmatter[pair[1]] = pair[2].trim();
  }

  return { frontmatter, body: text.slice(match[0].length).trim() };
}

/** `"…"` / `'…'` / `["a", "b"]` → plain strings, for prefilling the form. */
export function unquote(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      return JSON.parse(trimmed.startsWith("'") ? `"${trimmed.slice(1, -1)}"` : trimmed) as string;
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

export function parseTagList(value: string): string[] {
  const trimmed = value.trim();
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((t) => String(t).trim()).filter(Boolean);
    } catch {
      /* fall through to comma splitting */
    }
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((t) => unquote(t))
      .filter(Boolean);
  }
  return trimmed
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

/* ---------- body ---------- */

/**
 * The post page renders the title and excerpt as its own header, and none of
 * the 50 existing bodies open with an H1 — so a pasted `# Title` is dropped
 * rather than printed a second line below the real one.
 */
export function cleanBody(raw: string, title: string) {
  let body = raw.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim();

  const h1 = /^#\s+(.+?)\s*\n+/.exec(body);
  if (h1 && slugify(h1[1]) === slugify(title)) body = body.slice(h1[0].length).trim();

  return body;
}

/** First real paragraph, for when the author left the excerpt empty. */
export function deriveExcerpt(body: string, limit = 260) {
  const paragraph = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !/^(#{1,6}\s|>|!\[|\||```|---)/.test(block));
  if (!paragraph) return '';

  const flat = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links → their text
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (flat.length <= limit) return flat;
  const cut = flat.slice(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/* ---------- validation ---------- */

export type Validated =
  | { ok: true; post: PostInput }
  | { ok: false; errors: Record<string, string> };

/**
 * Mirrors the zod schema in src/content.config.ts. If this passes, the build
 * that follows the commit will too — that is the whole point of validating
 * here, since a rejected post at build time takes the whole site down with it.
 */
export function validate(raw: Record<string, unknown>): Validated {
  const errors: Record<string, string> = {};
  const str = (key: string) => (typeof raw[key] === 'string' ? (raw[key] as string).trim() : '');

  const title = str('title');
  if (!title) errors.title = 'A title is required.';
  else if (title.length > 200) errors.title = 'Keep the title under 200 characters.';

  const date = str('date');
  if (!DATE_RE.test(date)) errors.date = 'Use YYYY-MM-DD.';
  else if (Number.isNaN(new Date(`${date}T00:00:00Z`).valueOf())) errors.date = 'Not a real date.';

  const source = str('source') as Source;
  if (source !== 'essay' && source !== 'newsletter') errors.source = 'Pick essay or newsletter.';

  const body = cleanBody(str('body'), title);
  if (!body) errors.body = 'The post is empty.';
  else if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES)
    errors.body = `Body is over ${Math.round(MAX_BODY_BYTES / 1000)} KB.`;

  // The schema requires an excerpt, and every list on the site prints it, so an
  // empty one falls back to the opening paragraph rather than failing the build.
  const excerpt = str('excerpt') || deriveExcerpt(body);
  if (!excerpt) errors.excerpt = 'An excerpt is required, and none could be derived.';

  const slug = slugify(str('slug') || title);
  if (!slug) errors.slug = 'The title produced no usable slug — set one.';
  else if (!SLUG_RE.test(slug)) errors.slug = 'Use lowercase letters, digits and hyphens.';

  const linkedinUrl = str('linkedinUrl') || undefined;
  if (linkedinUrl) {
    try {
      const url = new URL(linkedinUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('scheme');
    } catch {
      errors.linkedinUrl = 'Not a valid URL.';
    }
  }

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 12)
    : [];

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    post: {
      title,
      date,
      source,
      excerpt,
      tags: tags.length ? tags : [source],
      linkedinUrl,
      slug,
      body,
    },
  };
}

/* ---------- output ---------- */

/**
 * YAML double-quoted scalars and JSON strings escape identically, so
 * JSON.stringify is the correct emitter here — a title containing a quote, a
 * colon or a backslash comes out valid without a YAML library.
 */
const yamlString = (value: string) => JSON.stringify(value);

export function renderFile(post: PostInput) {
  const lines = [
    '---',
    `title: ${yamlString(post.title)}`,
    `date: ${post.date}`,
    `source: ${post.source}`,
    `excerpt: ${yamlString(post.excerpt)}`,
    `tags: [${post.tags.map(yamlString).join(', ')}]`,
  ];
  if (post.linkedinUrl) lines.push(`linkedinUrl: ${yamlString(post.linkedinUrl)}`);
  lines.push('---', '', post.body, '');

  return lines.join('\n');
}

/** e.g. `src/content/writing/essays/2026-08-06-a-new-post.md` */
export function filePath(post: PostInput) {
  return `${CONTENT_ROOT}/${DIR[post.source]}/${post.date}-${post.slug}.md`;
}

/** The URL the post will answer on once the build finishes. */
export function livePath(post: PostInput) {
  return `/writing/${DIR[post.source]}/${post.date}-${post.slug}`;
}
