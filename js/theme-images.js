/**
 * Theme-based Image Switcher
 * Automatically switches images based on the current theme (dark/light)
 * 
 * Supports two methods:
 * 1. Automatic naming: image.png -> image-dark.png / image-light.png
 * 2. Manual data attributes: data-dark-src and data-light-src
 */
class ThemeImageSwitcher {
    constructor() {
        this.currentTheme = document.body.getAttribute('data-theme') || 'dark';
        this.init();
    }
    
    init() {
        // Process all images on page load
        this.updateAllImages();
        
        // Listen for theme changes
        window.addEventListener('themeChange', (e) => {
            this.currentTheme = e.detail.theme;
            this.updateAllImages();
        });
        
        // Also check theme on DOMContentLoaded in case theme was set before script loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.currentTheme = document.body.getAttribute('data-theme') || 'dark';
                this.updateAllImages();
            });
        }
    }
    
    /**
     * Update all images that should have theme variants
     */
    updateAllImages() {
        // Find all images that should be theme-aware
        const images = document.querySelectorAll('img[data-theme-aware], .article-image img, article img');
        
        images.forEach(img => {
            this.updateImage(img);
        });
    }
    
    /**
     * Update a single image based on current theme
     */
    updateImage(img) {
        let newSrc = null;
        
        // Method 1: Manual data attributes (highest priority)
        if (img.hasAttribute('data-dark-src') || img.hasAttribute('data-light-src')) {
            const darkSrc = img.getAttribute('data-dark-src');
            const lightSrc = img.getAttribute('data-light-src');
            
            if (this.currentTheme === 'dark' && darkSrc) {
                newSrc = darkSrc;
            } else if (this.currentTheme === 'light' && lightSrc) {
                newSrc = lightSrc;
            }
        } else {
            // Method 2: Automatic naming convention
            const currentSrc = img.src || img.getAttribute('src');
            if (!currentSrc) return;
            
            // Extract base path and extension
            const url = new URL(currentSrc, window.location.href);
            const pathname = url.pathname;
            const lastSlash = pathname.lastIndexOf('/');
            const filename = pathname.substring(lastSlash + 1);
            const lastDot = filename.lastIndexOf('.');
            
            if (lastDot === -1) return; // No extension found
            
            const baseName = filename.substring(0, lastDot);
            const extension = filename.substring(lastDot);
            
            // Check if filename already has -dark or -light suffix
            // If so, remove it to get the base name
            let cleanBaseName = baseName;
            if (baseName.endsWith('-dark')) {
                cleanBaseName = baseName.substring(0, baseName.length - 5);
            } else if (baseName.endsWith('-light')) {
                cleanBaseName = baseName.substring(0, baseName.length - 6);
            }
            
            // Construct new filename with theme suffix
            const themeSuffix = this.currentTheme === 'dark' ? '-dark' : '-light';
            const newFilename = cleanBaseName + themeSuffix + extension;
            const newPath = pathname.substring(0, lastSlash + 1) + newFilename;
            
            // Update image source
            newSrc = new URL(newPath, url.origin).href;
        }
        
        // Only update if the source is different
        if (newSrc && newSrc !== img.src) {
            // Add transition class for smooth fade
            img.classList.add('theme-switching');
            
            // Create a new image to preload
            const preloadImg = new Image();
            preloadImg.onload = () => {
                // Once loaded, swap the source
                img.src = newSrc;
                // Remove transition class after a short delay
                setTimeout(() => {
                    img.classList.remove('theme-switching');
                }, 300);
            };
            preloadImg.onerror = () => {
                // If theme-specific image doesn't exist, keep the current image
                console.warn(`Theme-specific image not found: ${newSrc}, keeping current image`);
                img.classList.remove('theme-switching');
            };
            preloadImg.src = newSrc;
        }
    }
}

// Initialize theme image switcher
document.addEventListener('DOMContentLoaded', () => {
    new ThemeImageSwitcher();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    new ThemeImageSwitcher();
}
