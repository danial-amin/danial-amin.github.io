#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Blog Update Automation Script
 * 
 * This script automatically updates blog.html and index.html when new articles are added.
 * It scans the articles directory, extracts metadata, and updates both pages accordingly.
 * 
 * Usage: node update-blog.js
 */

const ARTICLES_DIR = './pages/articles';
const BLOG_PAGE = './pages/blog.html';
const INDEX_PAGE = './index.html';

// Helper function to extract metadata from HTML file
function extractArticleMetadata(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extract title from <title> tag
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(' - Danial Amin', '').trim() : '';
        
        // Extract description from meta description
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        const description = descMatch ? descMatch[1].trim() : '';
        
        // Extract date from filename (format: YYYY-MM-DD-title.html)
        const filename = path.basename(filePath, '.html');
        const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
        const dateStr = dateMatch ? dateMatch[1] : '';
        
        // Format date for display
        let displayDate = '';
        if (dateStr) {
            const date = new Date(dateStr);
            displayDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Extract category from article content
        const categoryMatch = content.match(/<span class="article-category">(.*?)<\/span>/);
        const category = categoryMatch ? categoryMatch[1].trim() : 'AI Research';
        
        // Extract tags from meta keywords
        const tagsMatch = content.match(/<meta name="keywords" content="(.*?)"/);
        const tags = tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : [];
        
        // Generate excerpt from description (first 200 chars)
        const excerpt = description.length > 200 ? description.substring(0, 200) + '...' : description;
        
        // Normalize the file path - convert to forward slashes and remove ./pages/ prefix
        let normalizedPath = filePath.replace(/\\/g, '/');
        if (normalizedPath.startsWith('./pages/')) {
            normalizedPath = normalizedPath.replace('./pages/', '');
        } else if (normalizedPath.includes('pages/articles/')) {
            normalizedPath = normalizedPath.substring(normalizedPath.indexOf('pages/articles/') + 6); // +6 to skip "pages/"
        } else if (normalizedPath.includes('articles/')) {
            normalizedPath = normalizedPath.substring(normalizedPath.indexOf('articles/'));
        }
        
        return {
            filename: path.basename(filePath),
            title,
            description,
            excerpt,
            date: dateStr,
            displayDate,
            category,
            tags,
            filePath: normalizedPath
        };
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return null;
    }
}

// Get all article files sorted by date (newest first)
function getAllArticles() {
    try {
        const files = fs.readdirSync(ARTICLES_DIR)
            .filter(file => file.endsWith('.html'))
            .map(file => path.join(ARTICLES_DIR, file))
            .map(filePath => extractArticleMetadata(filePath))
            .filter(article => article !== null)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return files;
    } catch (error) {
        console.error('Error reading articles directory:', error.message);
        return [];
    }
}

// Generate blog card HTML
function generateBlogCard(article, isFeatured = false, basePath = '') {
    const featuredClass = isFeatured ? 'Featured • ' : '';
    const categoryClass = isFeatured ? 'ai-research' : article.category.toLowerCase().replace(/\s+/g, '-');
    const href = basePath ? `${basePath}/${article.filePath}` : article.filePath;
    
    return `                <!-- Blog Card${isFeatured ? ' - Latest Article' : ''} -->
                <a href="${href}" class="blog-card-link">
                    <article class="blog-preview-card" data-category="${categoryClass}">
                        <div class="blog-preview-meta">
                            <span class="blog-date">${article.displayDate}</span>
                            <span class="blog-category">${featuredClass}${article.category}</span>
                        </div>
                        <h3 class="blog-preview-title">${article.title}</h3>
                        <p class="blog-preview-excerpt">
                            ${article.excerpt}
                        </p>
                        <div class="blog-preview-tags">
                            <span class="tag">${article.tags.join(' ')}</span>
                        </div>
                        <div class="read-more-link">
                            Read Article
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M7 17L17 7M17 7H7M17 7V17"/>
                            </svg>
                        </div>
                    </article>
                </a>`;
}

// Update blog page
function updateBlogPage(articles) {
    try {
        let content = fs.readFileSync(BLOG_PAGE, 'utf8');
        
        // Find the blog preview grid section
        const gridStart = content.indexOf('<div class="blog-preview-grid">');
        // Find the newsletter section that comes after the blog grid
        const newsletterStart = content.indexOf('<!-- Newsletter Subscription -->');
        
        if (gridStart === -1 || newsletterStart === -1) {
            console.error('Could not find blog preview grid or newsletter section in blog.html');
            return false;
        }
        
        // Find the closing div for the blog-preview-grid
        // Look for </div> followed by </section> or the newsletter section
        let gridEnd = -1;
        const sectionEnd = content.indexOf('</section>', gridStart);
        const searchEnd = sectionEnd !== -1 ? sectionEnd : newsletterStart;
        
        // Find the last </div> before the section ends
        let lastDiv = content.lastIndexOf('</div>', searchEnd);
        
        // Verify this is the closing div for blog-preview-grid by checking structure
        // The closing div should be right before </section> or the newsletter comment
        if (lastDiv !== -1 && lastDiv > gridStart) {
            // Count divs between start and this closing div
            const sectionBetween = content.substring(gridStart, lastDiv);
            const openingDivs = (sectionBetween.match(/<div[^>]*>/g) || []).length;
            const closingDivs = (sectionBetween.match(/<\/div>/g) || []).length;
            
            // If opening divs equal closing divs + 1, this is our closing div
            if (openingDivs === closingDivs + 1) {
                gridEnd = lastDiv;
            }
        }
        
        if (gridEnd === -1) {
            // Fallback: find the </div> right before </section>
            const sectionTag = content.indexOf('</section>', gridStart);
            if (sectionTag !== -1) {
                gridEnd = content.lastIndexOf('</div>', sectionTag);
            }
        }
        
        if (gridEnd === -1) {
            console.error('Could not find proper closing div for blog preview grid');
            return false;
        }
        
        // Generate all blog cards (blog.html is in pages/, so paths are relative to pages/)
        const blogCards = articles.map((article, index) => 
            generateBlogCard(article, index === 0, '')
        ).join('\n\n');
        
        // Replace the grid content
        const newContent = content.substring(0, gridStart) + 
            '<div class="blog-preview-grid">\n\n' + 
            blogCards + '\n            </div>' + 
            content.substring(gridEnd + 6);
        
        fs.writeFileSync(BLOG_PAGE, newContent);
        console.log('✅ Updated blog.html with', articles.length, 'articles');
        return true;
    } catch (error) {
        console.error('Error updating blog page:', error.message);
        return false;
    }
}

// Update index page (top 3 articles)
function updateIndexPage(articles) {
    try {
        let content = fs.readFileSync(INDEX_PAGE, 'utf8');
        
        // Find the blog preview grid section in index.html
        const gridStart = content.indexOf('<div class="blog-preview-grid">');
        // Find the contact section that comes after the blog grid
        const contactStart = content.indexOf('<!-- Contact Section -->');
        
        if (gridStart === -1 || contactStart === -1) {
            console.error('Could not find blog preview grid or contact section in index.html');
            return false;
        }
        
        // Find the closing div for the blog-preview-grid
        // Look for </div> followed by </section> - the grid closing div is right before </section>
        let gridEnd = -1;
        const sectionTag = content.indexOf('</section>', gridStart);
        
        if (sectionTag !== -1) {
            // Find the </div> that's immediately before </section>
            // We need to find the closing div for blog-preview-grid, which should be the last </div> before </section>
            gridEnd = content.lastIndexOf('</div>', sectionTag);
            
            // Verify: count divs between gridStart and gridEnd
            if (gridEnd > gridStart) {
                const sectionBetween = content.substring(gridStart, gridEnd);
                const openingDivs = (sectionBetween.match(/<div[^>]*>/g) || []).length;
                const closingDivs = (sectionBetween.match(/<\/div>/g) || []).length;
                
                // If opening divs don't equal closing divs + 1, try the previous </div>
                if (openingDivs !== closingDivs + 1) {
                    const prevDiv = content.lastIndexOf('</div>', gridEnd - 1);
                    if (prevDiv > gridStart) {
                        const sectionBetween2 = content.substring(gridStart, prevDiv);
                        const openingDivs2 = (sectionBetween2.match(/<div[^>]*>/g) || []).length;
                        const closingDivs2 = (sectionBetween2.match(/<\/div>/g) || []).length;
                        if (openingDivs2 === closingDivs2 + 1) {
                            gridEnd = prevDiv;
                        }
                    }
                }
            }
        }
        
        if (gridEnd === -1) {
            console.error('Could not find proper closing div for blog preview grid in index.html');
            return false;
        }
        
        // Generate top 3 blog cards (index.html is in root/, so paths need pages/ prefix)
        const topArticles = articles.slice(0, 3);
        const blogCards = topArticles.map((article, index) => 
            generateBlogCard(article, index === 0, 'pages')
        ).join('\n\n');
        
        // Replace the grid content using regex for more reliable matching
        const gridRegex = /<div class="blog-preview-grid">[\s\S]*?<\/div>\s*(?=<\/section>)/;
        const replacement = `<div class="blog-preview-grid">\n${blogCards}\n        </div>`;
        
        if (gridRegex.test(content)) {
            const newContent = content.replace(gridRegex, replacement);
            fs.writeFileSync(INDEX_PAGE, newContent);
            console.log('✅ Updated index.html with top 3 articles');
            return true;
        } else {
            // Fallback to substring method
            const newContent = content.substring(0, gridStart) + 
                '<div class="blog-preview-grid">\n' + 
                blogCards + '\n        </div>' + 
                content.substring(gridEnd + 6);
            fs.writeFileSync(INDEX_PAGE, newContent);
            console.log('✅ Updated index.html with top 3 articles (fallback method)');
            return true;
        }
    } catch (error) {
        console.error('Error updating index page:', error.message);
        return false;
    }
}

// Main function
function main() {
    console.log('🚀 Starting blog update automation...');
    
    // Get all articles
    const articles = getAllArticles();
    
    if (articles.length === 0) {
        console.log('❌ No articles found');
        return;
    }
    
    console.log(`📚 Found ${articles.length} articles`);
    console.log('📅 Articles by date:');
    articles.forEach((article, index) => {
        console.log(`  ${index + 1}. ${article.displayDate} - ${article.title}`);
    });
    
    // Update both pages
    const blogSuccess = updateBlogPage(articles);
    const indexSuccess = updateIndexPage(articles);
    
    if (blogSuccess && indexSuccess) {
        console.log('🎉 Blog update completed successfully!');
        console.log('📝 Next steps:');
        console.log('  1. Review the updated pages');
        console.log('  2. Test the links and formatting');
        console.log('  3. Commit your changes to git');
    } else {
        console.log('❌ Some updates failed. Please check the errors above.');
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    extractArticleMetadata,
    getAllArticles,
    generateBlogCard,
    updateBlogPage,
    updateIndexPage
};
