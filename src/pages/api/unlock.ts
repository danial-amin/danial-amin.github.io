import type { APIRoute } from 'astro';
import cases from '../../server/locked-cases.json';
import {
  CASES_GATE,
  cookieHeader,
  createLimiter,
  expectedHash,
  grant,
  jsonResponse,
  verify,
} from '../../server/gate';

// Server-rendered. The confidential cases must never exist inside a static
// file, so this route runs per request. The passphrase logic itself lives in
// src/server/gate.ts, which the studio uses too — through its own gate, with a
// different secret and a different cookie.
export const prerender = false;

const limiter = createLimiter({ maxFails: 8, blockMs: 15 * 60 * 1000 });

/** Restores an already-granted session without retyping the passphrase. */
export const GET: APIRoute = ({ cookies }) => {
  const hash = expectedHash(CASES_GATE);
  if (!hash) return jsonResponse({ ok: false, reason: 'unconfigured' }, 503);

  if (!verify(cookies.get(CASES_GATE.cookie)?.value, hash, CASES_GATE)) {
    return jsonResponse({ ok: false }, 401);
  }
  return jsonResponse({ ok: true, cases });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let passphrase = '';
  try {
    const body = await request.json();
    passphrase = typeof body?.passphrase === 'string' ? body.passphrase.trim() : '';
  } catch {
    return jsonResponse({ ok: false, reason: 'bad-request' }, 400);
  }

  const result = grant(CASES_GATE, limiter, { request, clientAddress, passphrase });
  if (!result.ok) return jsonResponse(result.body, result.status);

  return jsonResponse({ ok: true, cases, expiresAt: result.expiresAt }, 200, {
    'set-cookie': result.setCookie,
  });
};

/** Explicit re-lock. */
export const DELETE: APIRoute = ({ request }) => {
  const secure = new URL(request.url).protocol === 'https:';
  return jsonResponse({ ok: true }, 200, {
    'set-cookie': cookieHeader(CASES_GATE, '', 0, secure),
  });
};
