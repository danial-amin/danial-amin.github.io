#!/usr/bin/env node
/**
 * Converts Jekyll/Distill Markdown posts (YAML frontmatter + body) to portfolio HTML articles.
 * Usage: node scripts/md-to-html.js [posts_dir]
 * Default posts_dir: ../damin-acad.github.io/_posts
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.resolve(__dirname, process.argv[2] || '../damin-acad.github.io/_posts');
const OUT_DIR = path.resolve(__dirname, '../pages/articles');
const BASE_URL = 'https://danial-amin.github.io';

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(d) {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return '';
}

function categoryDisplay(cat) {
  if (!cat) return 'AI Research';
  const map = { academia: 'Academia', industry: 'Industry', 'ai-research': 'AI Research' };
  return map[cat] || cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]+>/g, ' ').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function buildHtml(data) {
  const title = data.title || 'Untitled';
  const desc = data.description || '';
  const tags = Array.isArray(data.tags) ? data.tags : (data.tags || '').toString().trim().split(/\s+/).filter(Boolean);
  const keywords = tags.join(' ');
  const category = categoryDisplay(data.category);
  const date = formatDate(data.date);
  const readTime = estimateReadTime(data.bodyHtml);
  const excerpt = desc.length > 200 ? desc.substring(0, 200) + '...' : desc;
  const filename = data.filename;
  const ogUrl = `${BASE_URL}/pages/articles/${filename}`;

  const tagSpans = tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('\n                    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} - Danial Amin</title>
    <meta name="description" content="${escapeHtml(desc)}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <meta name="author" content="Danial Amin">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(excerpt)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${ogUrl}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(excerpt)}">
    
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="stylesheet" href="../../css/themes.css">
    <link rel="stylesheet" href="../../css/animations.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
</head>
<body data-theme="dark">
    <!-- Interactive Background -->
    <canvas id="interactive-bg"></canvas>
    
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">
                <a href="../../index.html">Danial Amin</a>
            </div>
            <div class="nav-menu">
                <a href="../../index.html" class="nav-link">Home</a>
                <a href="../projects.html" class="nav-link">Projects</a>
                <a href="../blog.html" class="nav-link active">Blog</a>
                <a href="../../index.html#contact" class="nav-link">Contact</a>
                <button class="theme-toggle" id="theme-toggle">
                    <span class="theme-icon">🌙</span>
                </button>
            </div>
            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Article Header -->
    <section class="article-header">
        <div class="container">
            <div class="article-hero">
                <div class="article-meta">
                    <span class="article-category">${escapeHtml(category)}</span>
                    <span class="article-date">${escapeHtml(date)}</span>
                    <span class="article-read-time">${escapeHtml(readTime)}</span>
                </div>
                <h1 class="article-title">${escapeHtml(title)}</h1>
                <p class="article-excerpt">${escapeHtml(desc)}</p>
                <div class="article-tags">
                    ${tagSpans}
                </div>
            </div>
        </div>
    </section>

    <!-- Article Content -->
    <section class="article-content">
        <div class="container">
            <div class="article-body">
${data.bodyHtml}
            </div>
        </div>
    </section>

    <script src="../../js/interactive-bg.js"></script>
    <script src="../../js/theme-switcher.js"></script>
    <script src="../../js/daily-colors.js"></script>
    <script src="../../js/main.js"></script>
</body>
</html>
`;
}

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error('Posts directory not found:', POSTS_DIR);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  marked.setOptions({ gfm: true });
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  let count = 0;

  for (const file of files) {
    const base = path.basename(file, '.md');
    const outFilename = base + '.html';
    const outPath = path.join(OUT_DIR, outFilename);
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const bodyHtml = marked.parse(content).trim();
    const indent = '                ';
    const indentedBody = bodyHtml.split('\n').map(line => indent + line).join('\n');

    const html = buildHtml({
      ...data,
      bodyHtml: indentedBody,
      filename: outFilename,
    });

    fs.writeFileSync(outPath, html, 'utf8');
    console.log('Wrote', outFilename);
    count++;
  }

  console.log(`Done. Converted ${count} articles to ${OUT_DIR}`);
}

main();
