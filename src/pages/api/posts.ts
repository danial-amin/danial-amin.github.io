import type { APIRoute } from 'astro';
import { STUDIO_GATE, jsonResponse, requireGrant } from '../../server/gate';
import { listDir, readFile, repoConfig } from '../../server/github';
import {
  POST_DIRS,
  WRITING_ROOT,
  dirFor,
  parsePostPath,
  parseTagList,
  splitFrontmatter,
  unquote,
  type Source,
} from '../../server/post';

/**
 * What is already published, and how to read one back.
 *
 * The studio could compose a post but never open one. Editing meant finding the
 * file in the repo, copying it, pasting it back in and retyping the date and the
 * slug from the URL — and getting either of those wrong writes a second file at
 * a second URL instead of replacing the first. That is not a hypothetical: it is
 * what commit 566213e had to clean up.
 *
 * GET            -> the list, newest first
 * GET ?path=...  -> that post, split into the studio's fields
 *
 * Server-rendered for the same reason /api/publish is: it reads the token at
 * request time, and it must never be part of a static bundle.
 */
export const prerender = false;

type Row = { path: string; source: Source; date: string; slug: string };

export const GET: APIRoute = async ({ request, cookies }) => {
  const grant = requireGrant(cookies.get(STUDIO_GATE.cookie)?.value, STUDIO_GATE);
  if (!grant.ok) return jsonResponse({ ok: false, reason: grant.reason }, grant.status);

  const config = repoConfig();
  if (!config.ok) {
    return jsonResponse(
      {
        ok: false,
        reason: 'unconfigured',
        message: `Set ${config.missing.join(' and ')} on the server.`,
      },
      503,
    );
  }

  const wanted = new URL(request.url).searchParams.get('path');
  return wanted ? readOne(config.config, wanted) : readList(config.config);
};

/* ---------- one post ---------- */

async function readOne(cfg: Parameters<typeof readFile>[0], wanted: string) {
  /**
   * The path arrives from the client, so it is parsed rather than trusted. Only
   * `src/content/writing/{essays,newsletter}/YYYY-MM-DD-slug.md` survives, which
   * keeps this from becoming a way to read any file the token can reach.
   */
  const parsed = parsePostPath(wanted);
  if (!parsed) return jsonResponse({ ok: false, reason: 'bad-path' }, 400);

  const file = await readFile(cfg, parsed.path);
  if (!file.ok) {
    return jsonResponse({ ok: false, reason: file.reason, message: file.message }, file.status);
  }

  const { frontmatter, body } = splitFrontmatter(file.text);
  const value = (key: string) => (frontmatter[key] ? unquote(frontmatter[key]) : '');
  const frontSource = value('source');

  /**
   * The filename wins over the frontmatter for date, slug and source.
   *
   * The path is what decides the URL and what publishing will overwrite, so
   * loading a post has to hand back the identity the *file* has, not the one its
   * frontmatter claims. Where a file disagrees with itself — a `date:` that is
   * not the date in its name — the studio would otherwise load the frontmatter's
   * version and publish a duplicate at a third path.
   */
  return jsonResponse(
    {
      ok: true,
      path: parsed.path,
      sha: file.sha,
      fields: {
        title: value('title'),
        date: parsed.date,
        source: parsed.source,
        excerpt: value('excerpt'),
        tags: frontmatter.tags ? parseTagList(frontmatter.tags) : [],
        linkedinUrl: value('linkedinUrl') || value('linkedinurl'),
        slug: parsed.slug,
        body,
      },
      // surfaced so the studio can say so rather than silently preferring one
      frontmatterDate: value('date').slice(0, 10),
      frontmatterSource: frontSource,
    },
    200,
  );
}

/* ---------- the list ---------- */

async function readList(cfg: Parameters<typeof listDir>[0]) {
  const rows: Row[] = [];

  for (const source of Object.values(POST_DIRS)) {
    const dir = `${WRITING_ROOT}/${dirFor(source)}`;
    const listed = await listDir(cfg, dir);
    if (!listed.ok) {
      return jsonResponse({ ok: false, reason: listed.reason, message: listed.message }, listed.status);
    }
    for (const entry of listed.entries) {
      const parsed = parsePostPath(entry.path);
      // a stray file in the collection is skipped, not an error — the build
      // would reject it long before this endpoint is the right place to complain
      if (parsed) rows.push(parsed);
    }
  }

  rows.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));

  return jsonResponse({ ok: true, posts: rows, count: rows.length }, 200);
}
