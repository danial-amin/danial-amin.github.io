import type { APIRoute } from 'astro';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { STUDIO_GATE, jsonResponse, requireGrant } from '../../server/gate';
import {
  MAX_BODY_BYTES,
  cleanBody,
  deriveExcerpt,
  filePath,
  livePath,
  parseTagList,
  renderFile,
  splitFrontmatter,
  unquote,
  validate,
} from '../../server/post';

export const prerender = false;

/**
 * The preview is rendered by the same processor Astro uses to build the real
 * post pages, so what the author sees is what the site will print — a
 * client-side markdown library would have been a second, subtly different
 * renderer. Built once and reused: it compiles a plugin chain.
 */
let processor: Awaited<ReturnType<typeof createSatteriMarkdownProcessor>> | null = null;
async function getProcessor() {
  processor ??= await createSatteriMarkdownProcessor({});
  return processor;
}

/**
 * Gated like every other write route. The HTML it returns is unsanitised —
 * markdown may contain raw HTML, and Astro renders it as-is in a real post —
 * which is safe here only because the sole caller who can reach it is the author
 * previewing their own text.
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  const grant = requireGrant(cookies.get(STUDIO_GATE.cookie)?.value, STUDIO_GATE);
  if (!grant.ok) return jsonResponse({ ok: false, reason: grant.reason }, grant.status);

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ ok: false, reason: 'bad-request' }, 400);
  }

  const markdown = typeof raw.body === 'string' ? raw.body : '';
  if (Buffer.byteLength(markdown, 'utf8') > MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, reason: 'too-large' }, 413);
  }

  const title = typeof raw.title === 'string' ? raw.title : '';
  const body = cleanBody(markdown, title);

  let html = '';
  let headings: { depth: number; slug: string; text: string }[] = [];
  try {
    const rendered = await (await getProcessor()).render(body);
    html = rendered.code;
    headings = (rendered.metadata?.headings ?? []) as typeof headings;
  } catch (error) {
    return jsonResponse(
      { ok: false, reason: 'render-failed', message: (error as Error).message },
      422,
    );
  }

  // The same checks publishing will run, reported without committing anything,
  // so the author sees the problems while still in the editor.
  const checked = validate({ ...raw, body: markdown });

  return jsonResponse(
    {
      ok: true,
      html,
      headings,
      words: body.split(/\s+/).filter(Boolean).length,
      derivedExcerpt: deriveExcerpt(body),
      errors: checked.ok ? {} : checked.errors,
      post: checked.ok ? checked.post : null,
      // the exact bytes publishing would commit, so a post can still be shipped
      // by hand if the token is missing or GitHub is down
      file: checked.ok ? renderFile(checked.post) : null,
      path: checked.ok ? filePath(checked.post) : null,
      url: checked.ok ? livePath(checked.post) : null,
    },
    200,
  );
};

/**
 * Splits a pasted file into form fields and body.
 *
 * Pasting a complete .md file is the expected way to use the studio, so the
 * frontmatter is read here — by the same code the collection's own files were
 * written with — and handed back as filled fields rather than left for a second
 * parser in the browser to get subtly wrong.
 */
export const PUT: APIRoute = async ({ request, cookies }) => {
  const grant = requireGrant(cookies.get(STUDIO_GATE.cookie)?.value, STUDIO_GATE);
  if (!grant.ok) return jsonResponse({ ok: false, reason: grant.reason }, grant.status);

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return jsonResponse({ ok: false, reason: 'bad-request' }, 400);
  }

  const { frontmatter, body } = splitFrontmatter(typeof raw.text === 'string' ? raw.text : '');
  const value = (key: string) => (frontmatter[key] ? unquote(frontmatter[key]) : '');
  const source = value('source');

  return jsonResponse(
    {
      ok: true,
      found: Object.keys(frontmatter).length > 0,
      body,
      fields: {
        title: value('title'),
        // frontmatter dates may be quoted, or carry a time — the form wants YYYY-MM-DD
        date: value('date').slice(0, 10),
        source: source === 'newsletter' || source === 'essay' ? source : '',
        excerpt: value('excerpt'),
        tags: frontmatter.tags ? parseTagList(frontmatter.tags) : [],
        linkedinUrl: value('linkedinUrl') || value('linkedinurl'),
      },
    },
    200,
  );
};
