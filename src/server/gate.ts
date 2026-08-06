/**
 * Passphrase gates, one per door.
 *
 * There are two, and they are deliberately independent:
 *
 *   CASES_GATE  — reading the confidential case studies (/api/unlock)
 *   STUDIO_GATE — writing to the repository (/studio, /api/publish, /api/preview)
 *
 * Reading a client's outcome and being able to commit to the site are different
 * privileges, so they do not share a secret, a cookie, or a signing key. The
 * realm baked into each signing key means that even if both passphrases were set
 * to the same string, a cases cookie still could not be replayed at the studio.
 *
 * Neither gate falls back to anything when its secret is unset: the route
 * answers 503 and stays shut.
 */
import crypto from 'node:crypto';

export type Gate = {
  /** cookie carrying this gate's grant */
  cookie: string;
  /** env var holding the passphrase itself */
  plainEnv: string;
  /** env var holding its SHA-256 hex digest, as an alternative */
  hashEnv: string;
  /** env var overriding how long a grant lasts, in hours */
  ttlEnv: string;
  defaultTtlHours: number;
  /** domain separator for the cookie signing key — keeps the two grants distinct */
  realm: string;
};

export const CASES_GATE: Gate = {
  cookie: 'cases_grant',
  plainEnv: 'LOCKED_CASES_PASSPHRASE',
  hashEnv: 'LOCKED_CASES_PASS_HASH',
  ttlEnv: 'LOCKED_CASES_TTL_HOURS',
  defaultTtlHours: 2,
  realm: 'cases-cookie-v1',
};

export const STUDIO_GATE: Gate = {
  cookie: 'studio_grant',
  plainEnv: 'PUBLISH_PASSPHRASE',
  hashEnv: 'PUBLISH_PASS_HASH',
  ttlEnv: 'PUBLISH_TTL_HOURS',
  // A writing session outlasts a look through the cases, but this cookie can
  // commit to the repository, so it is hours rather than days.
  defaultTtlHours: 4,
  realm: 'studio-cookie-v1',
};

/**
 * Reads a secret at request time.
 *
 * `process.env` is the only source used in production: `import.meta.env` is
 * statically inlined at build time, so reading a passphrase through it would
 * bake the secret into the server bundle. Vite does not copy `.env` into
 * `process.env`, though, so dev falls back to `import.meta.env` purely so a
 * local `.env` works. The dynamic key access is deliberate — it stops Vite
 * from inlining anything.
 */
export function readEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;
  if (import.meta.env.DEV) {
    return (import.meta.env as unknown as Record<string, string | undefined>)[name];
  }
  return undefined;
}

export const sha256 = (s: string) =>
  crypto.createHash('sha256').update(s, 'utf8').digest('hex');

export function ttlMs(gate: Gate) {
  const hours = Number(readEnv(gate.ttlEnv) ?? gate.defaultTtlHours);
  return (Number.isFinite(hours) && hours > 0 ? hours : gate.defaultTtlHours) * 60 * 60 * 1000;
}

/**
 * Accepts either the passphrase itself or its SHA-256 hex digest, so a secret
 * can be configured without ever putting plaintext in the environment. Returns
 * null when neither is set — callers then refuse to answer rather than falling
 * back to something guessable.
 */
export function expectedHash(gate: Gate): string | null {
  const plain = readEnv(gate.plainEnv);
  if (plain) return sha256(plain);
  const hash = readEnv(gate.hashEnv);
  if (hash && /^[0-9a-f]{64}$/i.test(hash)) return hash.toLowerCase();
  return null;
}

/** Signing key, derived from the secret and the realm, so there is only one thing to configure. */
const signingKey = (hash: string, gate: Gate) => sha256(`${gate.realm}|${hash}`);

export function sign(expiry: number, hash: string, gate: Gate) {
  const mac = crypto
    .createHmac('sha256', signingKey(hash, gate))
    .update(String(expiry))
    .digest('hex');
  return `${expiry}.${mac}`;
}

export function verify(token: string | undefined, hash: string, gate: Gate) {
  if (!token) return false;
  const [expStr, mac] = token.split('.');
  const expiry = Number(expStr);
  if (!expStr || !mac || !Number.isFinite(expiry) || expiry < Date.now()) return false;
  const want = crypto.createHmac('sha256', signingKey(hash, gate)).update(expStr).digest('hex');
  const a = Buffer.from(mac, 'hex');
  const b = Buffer.from(want, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Constant-time comparison of a submitted passphrase against the configured hash. */
export function passphraseMatches(passphrase: string, hash: string) {
  const given = Buffer.from(sha256(passphrase), 'hex');
  const want = Buffer.from(hash, 'hex');
  return given.length === want.length && crypto.timingSafeEqual(given, want);
}

export function jsonResponse(
  body: unknown,
  status: number,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  });
}

export function cookieHeader(gate: Gate, value: string, maxAgeSeconds: number, secure: boolean) {
  const parts = [
    `${gate.cookie}=${value}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function clientKey(req: Request, addr: string | undefined) {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0].trim() : '') || addr || 'unknown';
}

/**
 * Per-process, in-memory failure counter: resets on redeploy, and each instance
 * keeps its own tally. That is fine for a personal site, and far better than
 * nothing. Each route gets its own limiter so a run of bad passphrases at one
 * door does not lock the other.
 */
export function createLimiter({ maxFails = 8, blockMs = 15 * 60 * 1000 } = {}) {
  const buckets = new Map<string, { fails: number; blockedUntil: number }>();

  return {
    /** seconds left on a block, or 0 when the caller may proceed */
    blockedFor(key: string) {
      const until = buckets.get(key)?.blockedUntil ?? 0;
      return until > Date.now() ? Math.ceil((until - Date.now()) / 1000) : 0;
    },
    fail(key: string) {
      const bucket = buckets.get(key) ?? { fails: 0, blockedUntil: 0 };
      bucket.fails += 1;
      if (bucket.fails >= maxFails) {
        bucket.blockedUntil = Date.now() + blockMs;
        bucket.fails = 0;
      }
      buckets.set(key, bucket);
    },
    pass(key: string) {
      buckets.delete(key);
    },
  };
}

/**
 * The one check every gated route makes: is this request carrying a valid,
 * unexpired grant for this gate? The reason is returned so routes can answer
 * 503 (nothing configured) distinctly from 401 (no grant).
 */
export function requireGrant(
  cookieValue: string | undefined,
  gate: Gate,
):
  | { ok: true }
  | { ok: false; status: 401 | 503; reason: 'unconfigured' | 'locked' } {
  const hash = expectedHash(gate);
  if (!hash) return { ok: false, status: 503, reason: 'unconfigured' };
  if (!verify(cookieValue, hash, gate)) return { ok: false, status: 401, reason: 'locked' };
  return { ok: true };
}

/**
 * Everything a POST /unlock handler does once it has the passphrase, minus the
 * payload: rate limit, compare, mint the cookie. Shared so the two doors cannot
 * drift apart in how strictly they check.
 */
export function grant(
  gate: Gate,
  limiter: ReturnType<typeof createLimiter>,
  args: { request: Request; clientAddress: string | undefined; passphrase: string },
):
  | { ok: true; expiresAt: number; setCookie: string }
  | { ok: false; status: number; body: Record<string, unknown> } {
  const hash = expectedHash(gate);
  if (!hash) {
    return {
      ok: false,
      status: 503,
      body: {
        ok: false,
        reason: 'unconfigured',
        message: `Set ${gate.plainEnv} (or ${gate.hashEnv}) on the server.`,
      },
    };
  }

  const key = clientKey(args.request, args.clientAddress);
  const retryInSeconds = limiter.blockedFor(key);
  if (retryInSeconds) {
    return {
      ok: false,
      status: 429,
      body: { ok: false, reason: 'rate-limited', retryInSeconds },
    };
  }

  if (!passphraseMatches(args.passphrase, hash)) {
    limiter.fail(key);
    return { ok: false, status: 401, body: { ok: false, reason: 'bad-passphrase' } };
  }

  limiter.pass(key);

  const ttl = ttlMs(gate);
  const expiresAt = Date.now() + ttl;
  const secure = new URL(args.request.url).protocol === 'https:';

  return {
    ok: true,
    expiresAt,
    setCookie: cookieHeader(gate, sign(expiresAt, hash, gate), Math.floor(ttl / 1000), secure),
  };
}
