# GitHub Pages Setup for Contributions

## Overview

This setup leverages **GitHub Actions** to automatically fetch GitHub contributions data and generate a static JSON file. This approach is:

✅ **Secure** - Token stays in GitHub Actions, never exposed to client  
✅ **Fast** - Static JSON file loads instantly, no API calls  
✅ **No Rate Limits** - Data is pre-fetched, no client-side API limits  
✅ **Automatic** - Runs daily via GitHub Actions schedule  

## How It Works

1. **GitHub Actions Workflow** (`.github/workflows/update-contributions.yml`)
   - Runs daily at 2 AM UTC
   - Uses `GITHUB_TOKEN` (automatically available in Actions)
   - Fetches contribution data for all years
   - Generates `data/github-contributions.json`

2. **Client-Side Code** (`js/github-contributions.js`)
   - First tries to load from static JSON file
   - Falls back to API methods if file doesn't exist
   - No token needed in client-side code!

## Setup Instructions

### 1. Initial Setup (One-Time)

The workflow is already configured! Just push the files:

```bash
git add .github/workflows/update-contributions.yml
git add scripts/fetch-contributions.js
git add js/github-contributions.js
git commit -m "Add GitHub Actions workflow for contributions"
git push
```

### 2. Trigger the Workflow

After pushing, you can:

**Option A: Wait for the schedule** (runs daily at 2 AM UTC)

**Option B: Trigger manually**
1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Update GitHub Contributions" workflow
4. Click "Run workflow" button

### 3. Verify It Works

After the workflow runs:
1. Check the Actions tab - should show a green checkmark
2. Check `data/github-contributions.json` - should be created/updated
3. Visit your site - contributions should load from the static file

## File Structure

```
.github/
  workflows/
    update-contributions.yml    # GitHub Actions workflow
scripts/
  fetch-contributions.js        # Script to fetch and format data
data/
  github-contributions.json     # Generated static file (committed to repo)
js/
  github-contributions.js       # Client-side code (updated to use static file)
```

## How the Client Code Works

The updated `github-contributions.js` now:

1. **First Priority**: Loads from `/data/github-contributions.json`
   - Fast, instant load
   - No API calls
   - No rate limits

2. **Fallback 1**: GitHub GraphQL API (if token provided)
   - Only if static file doesn't exist
   - Requires token (not recommended for client-side)

3. **Fallback 2**: GitHub Calendar library
   - Public API, no auth needed
   - Rate limited to 60/hour

4. **Fallback 3**: Generated data
   - Deterministic generation
   - Always works as last resort

## Benefits

### Security
- ✅ Token never exposed to client
- ✅ Token only used in GitHub Actions (server-side)
- ✅ No hardcoded secrets in code

### Performance
- ✅ Static JSON loads instantly
- ✅ No API latency
- ✅ No rate limit issues

### Reliability
- ✅ Data is pre-fetched and cached
- ✅ Multiple fallback methods
- ✅ Works even if GitHub API is down

## Troubleshooting

### Workflow Not Running?

1. Check Actions tab for errors
2. Verify workflow file is in `.github/workflows/`
3. Check that `GITHUB_TOKEN` is available (it's automatic)

### Static File Not Loading?

1. Check if `data/github-contributions.json` exists in repo
2. Verify file path in browser console
3. Check network tab for 404 errors

### Data Not Updating?

1. The workflow runs daily - wait for next run
2. Or manually trigger the workflow
3. Check workflow logs for errors

## Customization

### Change Update Frequency

Edit `.github/workflows/update-contributions.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
  # Change to:
  # - cron: '0 */6 * * *'  # Every 6 hours
  # - cron: '0 0 * * 0'    # Weekly on Sunday
```

### Add More Years

Edit `scripts/fetch-contributions.js`:

```javascript
const years = [currentYear.toString(), '2025', '2024', '2023', '2022', '2021', '2020', '2019'];
```

## Next Steps

1. ✅ Push the workflow files
2. ✅ Trigger the workflow manually (or wait for schedule)
3. ✅ Verify `data/github-contributions.json` is created
4. ✅ Test your site - contributions should load instantly!

That's it! Your contributions are now fetched securely via GitHub Actions and served as a static file. 🎉

