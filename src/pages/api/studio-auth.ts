import type { APIRoute } from 'astro';
import {
  STUDIO_GATE,
  cookieHeader,
  createLimiter,
  grant,
  jsonResponse,
  requireGrant,
} from '../../server/gate';

export const prerender = false;

/**
 * The studio door.
 *
 * Separate from /api/unlock on purpose: PUBLISH_PASSPHRASE lets the holder
 * commit to the repository, which is a different and larger privilege than
 * reading the confidential cases, so it is a different secret behind a
 * different cookie. Tries are counted separately too — someone guessing at the
 * cases must not be able to lock the author out of their own desk.
 */
const limiter = createLimiter({ maxFails: 6, blockMs: 20 * 60 * 1000 });

/** Is the grant in this browser still good? */
export const GET: APIRoute = ({ cookies }) => {
  const check = requireGrant(cookies.get(STUDIO_GATE.cookie)?.value, STUDIO_GATE);
  return check.ok
    ? jsonResponse({ ok: true }, 200)
    : jsonResponse({ ok: false, reason: check.reason }, check.status);
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let passphrase = '';
  try {
    const body = await request.json();
    passphrase = typeof body?.passphrase === 'string' ? body.passphrase.trim() : '';
  } catch {
    return jsonResponse({ ok: false, reason: 'bad-request' }, 400);
  }

  const result = grant(STUDIO_GATE, limiter, { request, clientAddress, passphrase });
  if (!result.ok) return jsonResponse(result.body, result.status);

  return jsonResponse({ ok: true, expiresAt: result.expiresAt }, 200, {
    'set-cookie': result.setCookie,
  });
};

/** Lock the desk. Worth doing on a shared machine — this cookie can publish. */
export const DELETE: APIRoute = ({ request }) => {
  const secure = new URL(request.url).protocol === 'https:';
  return jsonResponse({ ok: true }, 200, {
    'set-cookie': cookieHeader(STUDIO_GATE, '', 0, secure),
  });
};
