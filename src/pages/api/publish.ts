import type { APIRoute } from 'astro';
import {
  STUDIO_GATE,
  clientKey,
  createLimiter,
  jsonResponse,
  requireGrant,
} from '../../server/gate';
import { commitFile, fileSha, repoConfig } from '../../server/github';
import { filePath, livePath, livePathOf, parsePostPath, renderFile, validate } from '../../server/post';

// Server-rendered: it writes to the repo, and it must read the token at request
// time rather than have it inlined into a static bundle.
export const prerender = false;

// Publishing is not a thing to do sixty times a minute. This is a runaway-loop
// guard on a route that costs a commit and a deploy, not an auth control — the
// cookie is that.
const limiter = createLimiter({ maxFails: 12, blockMs: 5 * 60 * 1000 });

/** What the studio needs to know before the author writes two thousand words. */
export const GET: APIRoute = ({ cookies }) => {
  const grant = requireGrant(cookies.get(STUDIO_GATE.cookie)?.value, STUDIO_GATE);
  if (!grant.ok) return jsonResponse({ ok: false, reason: grant.reason }, grant.status);

  const config = repoConfig();
  return jsonResponse(
    config.ok
      ? { ok: true, ready: true, repo: config.config.repo, branch: config.config.branch }
      : {
          ok: true,
          ready: false,
          missing: config.missing,
          message: `Publishing is not configured on the server: set ${config.missing.join(' and ')}.`,
        },
    200,
  );
};

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const grant = requireGrant(cookies.get(STUDIO_GATE.cookie)?.value, STUDIO_GATE);
  if (!grant.ok) return jsonResponse({ ok: false, reason: grant.reason }, grant.status);

  const key = clientKey(request, clientAddress);
  const retryInSeconds = limiter.blockedFor(key);
  if (retryInSeconds) {
    return jsonResponse({ ok: false, reason: 'rate-limited', retryInSeconds }, 429);
  }

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

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ ok: false, reason: 'bad-request' }, 400);
  }

  const checked = validate(raw);
  if (!checked.ok) {
    return jsonResponse({ ok: false, reason: 'invalid', errors: checked.errors }, 422);
  }

  const post = checked.post;
  const overwrite = raw.overwrite === true;

  /**
   * An edit names the file it is replacing; it does not re-derive it.
   *
   * filePath() composes a name from the date and the slug, and validate() runs
   * the slug through slugify() first. For a post whose filename predates that
   * rule — `personality_ai`, `RAG-works`, five others — recomposing turns
   * `personality_ai` into `personality-ai`, so "replace this post" would quietly
   * write a second file beside the first and leave both live. Seven of the
   * fifty-three are in that state.
   *
   * So when the studio says it is editing a specific path, that path is the
   * target. The frontmatter still comes from the fields and is still validated;
   * only the filename is taken as given. Anything that is not a post path is
   * refused rather than coerced.
   */
  const editPathRaw = typeof raw.editPath === 'string' ? raw.editPath : null;
  const editing = editPathRaw ? parsePostPath(editPathRaw) : null;
  if (editPathRaw && !editing) {
    return jsonResponse({ ok: false, reason: 'bad-path', message: 'That is not a post path.' }, 400);
  }

  const path = editing ? editing.path : filePath(post);
  const url = editing ? livePathOf(editing) : livePath(post);

  const existing = await fileSha(config.config, path);
  if (!existing.ok) {
    return jsonResponse({ ok: false, reason: existing.reason, message: existing.message }, existing.status);
  }

  // Same date and slug means the same URL. Refusing by default is the point:
  // the second publish of an edited draft should be an explicit replacement.
  if (existing.sha && !overwrite) {
    return jsonResponse(
      {
        ok: false,
        reason: 'exists',
        path,
        url,
        message: 'A post already exists at that path. Publish again with replace to overwrite it.',
      },
      409,
    );
  }

  /**
   * Editing something that is no longer there.
   *
   * The desk can be left open for days, and the branch moves underneath it. If
   * the file named by editPath has been deleted or renamed since it was opened,
   * committing would create it again — resurrecting a post that was removed on
   * purpose. Better to say so and let the author decide.
   */
  if (editing && !existing.sha) {
    return jsonResponse(
      {
        ok: false,
        reason: 'gone',
        path,
        message:
          'The post being edited is no longer on this branch — it was deleted or renamed. ' +
          'Press “Stop editing” to publish this as a new post.',
      },
      409,
    );
  }

  const result = await commitFile(config.config, {
    path,
    contents: renderFile(post),
    message: `${existing.sha ? 'Update' : 'Publish'}: ${post.title}`,
    sha: existing.sha ?? undefined,
  });

  if (!result.ok) {
    limiter.fail(key);
    return jsonResponse({ ok: false, reason: result.reason, message: result.message }, result.status);
  }

  return jsonResponse(
    {
      ok: true,
      replaced: Boolean(existing.sha),
      path,
      url,
      commit: result.commit,
      repo: config.config.repo,
      branch: config.config.branch,
    },
    200,
  );
};
