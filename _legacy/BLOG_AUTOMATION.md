# Blog Automation Guide

This repository includes an automation script that automatically updates your blog pages when new articles are added.

## How It Works

The `update-blog.js` script:

1. **Scans** the `pages/articles/` directory for HTML files
2. **Extracts** metadata from each article (title, description, date, category, tags)
3. **Updates** both `pages/blog.html` and `index.html` with the latest articles
4. **Maintains** proper chronological ordering (newest first)

## Usage

### Quick Update
```bash
node update-blog.js
```

### Using npm script
```bash
npm run update-blog
```

## Article File Naming Convention

Articles should follow this naming pattern:
```
YYYY-MM-DD-title-name.html
```

Example: `2025-10-27-agentic-patterns.html`

## Required Article Metadata

Each article HTML file should include these meta tags in the `<head>` section:

```html
<title>Article Title - Danial Amin</title>
<meta name="description" content="Article description for excerpt...">
<meta name="keywords" content="tag1,tag2,tag3">
```

And in the article body:
```html
<span class="article-category">Category Name</span>
```

## What Gets Updated

### Blog Page (`pages/blog.html`)
- Updates the entire `blog-preview-grid` section
- Shows all articles in chronological order (newest first)
- First article gets "Featured" label

### Index Page (`index.html`)
- Updates the "Latest from the Blog" section
- Shows only the top 3 most recent articles
- First article gets "Featured" label

## Features

- ✅ **Automatic metadata extraction** from HTML files
- ✅ **Chronological sorting** by date
- ✅ **Consistent formatting** across both pages
- ✅ **Error handling** for malformed files
- ✅ **Tag generation** from meta keywords
- ✅ **Excerpt generation** from meta description

## Troubleshooting

### Common Issues

1. **"No articles found"**
   - Check that articles are in `pages/articles/` directory
   - Ensure files have `.html` extension
   - Verify file naming follows `YYYY-MM-DD-title.html` pattern

2. **"Could not find blog preview grid"**
   - Ensure `pages/blog.html` and `index.html` have the correct structure
   - Look for `<div class="blog-preview-grid">` in both files

3. **Missing metadata**
   - Check that articles have required meta tags
   - Verify title format includes " - Danial Amin"
   - Ensure category span exists in article body

### Manual Override

If the automation fails, you can manually update the pages by:

1. Copying the article card HTML from an existing article
2. Updating the metadata (title, date, category, tags, excerpt)
3. Placing it at the top of the blog preview grid
4. Updating the index page with the top 3 articles

## Future Enhancements

Potential improvements for the automation script:

- [ ] Support for article images/thumbnails
- [ ] Automatic excerpt generation from article content
- [ ] Category-based filtering
- [ ] Draft/published status handling
- [ ] Integration with Git hooks
- [ ] Support for multiple article formats (Markdown, etc.)

## Support

If you encounter issues with the automation script, check:

1. Node.js version (requires 14.0.0+)
2. File permissions
3. Article metadata format
4. HTML structure consistency

For questions or issues, please create an issue in the repository.
