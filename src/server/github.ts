/**
 * Committing a file to the repo over the GitHub contents API.
 *
 * This is the whole publishing mechanism. A post is not stored anywhere the
 * running container owns — it is written into src/content/writing/, which makes
 * the commit the source of truth, puts every post in version control, and lets
 * the existing /writing pages render it with no second code path. The cost is
 * latency: the post is live when the deploy that follows the commit finishes.
 */
import { readEnv } from './gate';

const API = 'https://api.github.com';
const TIMEOUT_MS = 15_000;

export type RepoConfig = { repo: string; branch: string; token: string };

export type ConfigResult =
  | { ok: true; config: RepoConfig }
  | { ok: false; missing: string[] };

/**
 * PUBLISH_REPO defaults to this site's own repo, so the only variable that has
 * to be set for publishing to work is the token.
 *
 * The branch default is portfolio-instrument, not main, because that is the
 * branch Railway watches — a post committed anywhere else would sit in git
 * without ever being built. Move this if the deploy ever follows main.
 */
export function repoConfig(): ConfigResult {
  const token = readEnv('PUBLISH_GITHUB_TOKEN');
  const repo = readEnv('PUBLISH_REPO') ?? 'danial-amin/danial-amin.github.io';
  const branch = readEnv('PUBLISH_BRANCH') ?? 'portfolio-instrument';

  const missing: string[] = [];
  if (!token) missing.push('PUBLISH_GITHUB_TOKEN');
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) missing.push('PUBLISH_REPO');

  if (missing.length) return { ok: false, missing };
  return { ok: true, config: { repo, branch, token: token as string } };
}

function headers(token: string) {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'x-github-api-version': '2022-11-28',
    'user-agent': 'danialamin.com-studio',
  };
}

export type GitHubFailure = {
  ok: false;
  status: number;
  reason: 'auth' | 'not-found' | 'conflict' | 'network' | 'github';
  message: string;
};

const failure = (
  status: number,
  reason: GitHubFailure['reason'],
  message: string,
): GitHubFailure => ({ ok: false, status, reason, message });

/**
 * The sha of an existing file, or null when the path is free. Publishing needs
 * this twice: to refuse to silently overwrite, and to supply the sha when an
 * overwrite is actually intended.
 */
export async function fileSha(
  cfg: RepoConfig,
  path: string,
): Promise<{ ok: true; sha: string | null } | GitHubFailure> {
  const url = `${API}/repos/${cfg.repo}/contents/${encodeURI(path)}?ref=${encodeURIComponent(cfg.branch)}`;

  let res: Response;
  try {
    res = await fetch(url, { headers: headers(cfg.token), signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    return failure(504, 'network', `Could not reach GitHub: ${(error as Error).message}`);
  }

  if (res.status === 404) return { ok: true, sha: null };
  if (res.status === 401 || res.status === 403) {
    return failure(
      502,
      'auth',
      'GitHub rejected the token. It needs Contents: read and write on this repository.',
    );
  }
  if (!res.ok) return failure(502, 'github', `GitHub answered ${res.status} reading the path.`);

  const data = (await res.json().catch(() => null)) as { sha?: string; type?: string } | null;
  if (!data?.sha) return failure(502, 'github', 'GitHub returned no sha for an existing path.');
  return { ok: true, sha: data.sha };
}

export type Commit = { sha: string; url: string };

export async function commitFile(
  cfg: RepoConfig,
  args: { path: string; contents: string; message: string; sha?: string },
): Promise<{ ok: true; commit: Commit } | GitHubFailure> {
  const url = `${API}/repos/${cfg.repo}/contents/${encodeURI(args.path)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'PUT',
      headers: { ...headers(cfg.token), 'content-type': 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      body: JSON.stringify({
        message: args.message,
        content: Buffer.from(args.contents, 'utf8').toString('base64'),
        branch: cfg.branch,
        ...(args.sha ? { sha: args.sha } : {}),
      }),
    });
  } catch (error) {
    return failure(504, 'network', `Could not reach GitHub: ${(error as Error).message}`);
  }

  if (res.status === 401 || res.status === 403) {
    return failure(
      502,
      'auth',
      'GitHub rejected the token. It needs Contents: read and write on this repository.',
    );
  }
  if (res.status === 404) {
    return failure(
      502,
      'not-found',
      `GitHub cannot see ${cfg.repo}. Check PUBLISH_REPO and that the token can reach it.`,
    );
  }
  if (res.status === 409 || res.status === 422) {
    const detail = (await res.json().catch(() => null)) as { message?: string } | null;
    return failure(
      409,
      'conflict',
      detail?.message ?? `Branch ${cfg.branch} moved under the commit. Try again.`,
    );
  }
  if (!res.ok) {
    const detail = (await res.json().catch(() => null)) as { message?: string } | null;
    return failure(502, 'github', detail?.message ?? `GitHub answered ${res.status}.`);
  }

  const data = (await res.json().catch(() => null)) as {
    commit?: { sha?: string; html_url?: string };
  } | null;

  return {
    ok: true,
    commit: {
      sha: (data?.commit?.sha ?? '').slice(0, 7),
      url: data?.commit?.html_url ?? `https://github.com/${cfg.repo}/commits/${cfg.branch}`,
    },
  };
}
