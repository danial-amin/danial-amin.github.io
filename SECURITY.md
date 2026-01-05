# Security Guide for GitHub Contributions

## Current Setup (Secure)

The GitHub contributions component is now configured to work **without a hardcoded token** in the client-side code. This is the most secure approach for a static site.

## Important Note

**For public user data, you don't need a token at all!** GitHub's public API allows access to public repositories and user data without authentication. The only limitation is rate limiting (60 requests/hour without auth vs 5,000/hour with auth).

Even if your token only has read-only access to public data, it's still a security risk to hardcode it in client-side code because:
- Anyone can view the source code and extract the token
- The token could be abused or used by others
- It's unnecessary for public data access

## How It Works

1. **Primary Method**: Uses the `github-calendar` library which fetches public data without authentication
2. **Fallback Method**: Generates deterministic contribution data if API calls fail
3. **No Token Required**: Public GitHub data can be accessed without authentication (rate-limited to 60 requests/hour)

## If You Need Higher Rate Limits

If you need to bypass rate limits, you have two secure options:

### Option 1: Serverless Function Proxy (Recommended)

Create a serverless function that:
- Hides your GitHub token server-side
- Adds CORS headers to only allow your domain
- Proxies requests to GitHub API

#### Example: Vercel Serverless Function

Create `api/github-contributions.js`:

```javascript
export default async function handler(req, res) {
  // Only allow requests from your domain
  const allowedOrigins = ['https://danial-amin.github.io', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (!allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { year, username } = req.query;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set in Vercel environment variables

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    const query = `
      query($userName: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      userName: username || 'danial-amin',
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`
    };

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

Then update `js/github-contributions.js` to use the proxy:

```javascript
async fetchGitHubContributionsGraphQL(year) {
  // Use serverless proxy instead of direct API call
  const response = await fetch(`/api/github-contributions?year=${year}&username=${this.githubUsername}`);
  const data = await response.json();
  // ... rest of the parsing logic
}
```

#### Example: Netlify Function

Create `netlify/functions/github-contributions.js`:

```javascript
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': 'https://danial-amin.github.io',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { year, username } = event.queryStringParameters;
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Set in Netlify environment variables

  // ... same GraphQL logic as above
};
```

### Option 2: Environment Variable (For Build-Time Only)

If you're using a static site generator that builds at deploy time:

1. Set `GITHUB_TOKEN` as an environment variable in your CI/CD (GitHub Actions, etc.)
2. Use it only during build time to generate static data
3. Never include it in the client-side bundle

## Security Best Practices

✅ **DO:**
- Use serverless functions to hide tokens
- Set CORS headers to restrict access
- Use environment variables for tokens
- Rotate tokens regularly
- Use tokens with minimal scopes (read-only, public data only)

❌ **DON'T:**
- Hardcode tokens in JavaScript files
- Commit tokens to version control
- Use tokens with write permissions in client-side code
- Share tokens publicly

## Token Scopes (If You Really Need One)

**For public data, you don't need a token at all!** But if you want higher rate limits (5,000/hour vs 60/hour), you can use a serverless function with a token.

If you must use a token (via serverless function only):
- Only `public_repo` read access (or no scope for public data)
- Never use tokens with write/delete permissions
- **Never hardcode in client-side code**, even for read-only access

## Current Status

✅ Token removed from client-side code
✅ `.gitignore` updated to prevent accidental commits
✅ Fallback methods work without authentication
✅ Code is secure for public deployment

