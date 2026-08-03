import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import cases from '../../server/locked-cases.json';

// Server-rendered. The confidential cases must never exist inside a static
// file, so this route is the only thing in the site that runs per request.
export const prerender = false;

const COOKIE = 'cases_grant';

/**
 * Reads a secret at request time.
 *
 * `process.env` is the only source used in production: `import.meta.env` is
 * statically inlined at build time, so reading the passphrase through it would
 * bake the secret into the server bundle. Vite does not copy `.env` into
 * `process.env`, though, so dev falls back to `import.meta.env` purely so a
 * local `.env` works. The dynamic key access is deliberate — it stops Vite
 * from inlining anything.
 */
function readEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;
  if (import.meta.env.DEV) {
    return (import.meta.env as unknown as Record<string, string | undefined>)[name];
  }
  return undefined;
}

const TTL_MS = Number(readEnv('LOCKED_CASES_TTL_HOURS') ?? 2) * 60 * 60 * 1000;

/* ---------- secret ---------- */

const sha256 = (s: string) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

/**
 * Accepts either the passphrase itself or its SHA-256 hex digest, so the
 * existing hash can be reused without ever putting plaintext in the env.
 * Returns null when neither is configured — the endpoint then refuses to
 * answer rather than falling back to something guessable.
 */
function expectedHash(): string | null {
  const plain = readEnv('LOCKED_CASES_PASSPHRASE');
  if (plain) return sha256(plain);
  const hash = readEnv('LOCKED_CASES_PASS_HASH');
  if (hash && /^[0-9a-f]{64}$/i.test(hash)) return hash.toLowerCase();
  return null;
}

/** Cookie signing key, derived from the secret so there's only one thing to configure. */
const signingKey = (hash: string) => sha256(`cases-cookie-v1|${hash}`);

function sign(expiry: number, hash: string) {
  const mac = crypto.createHmac('sha256', signingKey(hash)).update(String(expiry)).digest('hex');
  return `${expiry}.${mac}`;
}

function verify(token: string | undefined, hash: string) {
  if (!token) return false;
  const [expStr, mac] = token.split('.');
  const expiry = Number(expStr);
  if (!expStr || !mac || !Number.isFinite(expiry) || expiry < Date.now()) return false;
  const want = crypto.createHmac('sha256', signingKey(hash)).update(expStr).digest('hex');
  const a = Buffer.from(mac, 'hex');
  const b = Buffer.from(want, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ---------- rate limiting ---------- */

// Per-process and in-memory: resets on redeploy, and each instance keeps its
// own tally. That is fine for a personal site, and far better than nothing.
type Bucket = { fails: number; blockedUntil: number };
const buckets = new Map<string, Bucket>();
const MAX_FAILS = 8;
const BLOCK_MS = 15 * 60 * 1000;

function clientKey(req: Request, addr: string | undefined) {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : '') || addr || 'unknown';
}

function jsonResponse(body: unknown, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

function cookieHeader(value: string, maxAgeSeconds: number, secure: boolean) {
  const parts = [
    `${COOKIE}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

/* ---------- handlers ---------- */

/** Restores an already-granted session without retyping the passphrase. */
export const GET: APIRoute = ({ request, cookies }) => {
  const hash = expectedHash();
  if (!hash) return jsonResponse({ ok: false, reason: 'unconfigured' }, 503);

  if (!verify(cookies.get(COOKIE)?.value, hash)) {
    return jsonResponse({ ok: false }, 401);
  }
  return jsonResponse({ ok: true, cases });
};

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const hash = expectedHash();
  if (!hash) {
    return jsonResponse(
      {
        ok: false,
        reason: 'unconfigured',
        message: 'Set LOCKED_CASES_PASSPHRASE (or LOCKED_CASES_PASS_HASH) on the server.',
      },
      503,
    );
  }

  const key = clientKey(request, clientAddress);
  const now = Date.now();
  const bucket = buckets.get(key) ?? { fails: 0, blockedUntil: 0 };

  if (bucket.blockedUntil > now) {
    return jsonResponse(
      { ok: false, reason: 'rate-limited', retryInSeconds: Math.ceil((bucket.blockedUntil - now) / 1000) },
      429,
    );
  }

  let passphrase = '';
  try {
    const body = await request.json();
    passphrase = typeof body?.passphrase === 'string' ? body.passphrase.trim() : '';
  } catch {
    return jsonResponse({ ok: false, reason: 'bad-request' }, 400);
  }

  const given = Buffer.from(sha256(passphrase), 'hex');
  const want = Buffer.from(hash, 'hex');
  const match = given.length === want.length && crypto.timingSafeEqual(given, want);

  if (!match) {
    bucket.fails += 1;
    if (bucket.fails >= MAX_FAILS) {
      bucket.blockedUntil = now + BLOCK_MS;
      bucket.fails = 0;
    }
    buckets.set(key, bucket);
    return jsonResponse({ ok: false, reason: 'bad-passphrase' }, 401);
  }

  buckets.delete(key);

  const expiry = now + TTL_MS;
  const secure = new URL(request.url).protocol === 'https:';

  return jsonResponse({ ok: true, cases, expiresAt: expiry }, 200, {
    'set-cookie': cookieHeader(sign(expiry, hash), Math.floor(TTL_MS / 1000), secure),
  });
};

/** Explicit re-lock. */
export const DELETE: APIRoute = ({ request }) => {
  const secure = new URL(request.url).protocol === 'https:';
  return jsonResponse({ ok: true }, 200, { 'set-cookie': cookieHeader('', 0, secure) });
};
