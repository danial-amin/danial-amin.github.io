/**
 * Daily Color Rotation System
 * Automatically rotates through 15 pastel color palettes daily
 * Each palette is carefully designed for good contrast and visual harmony
 */

class DailyColorRotation {
    constructor() {
        // 15 carefully curated pastel color palettes
        // Each palette contains colors that work well together with good contrast
        this.colorPalettes = [
            // Palette 1: Soft Lavender & Mint
            {
                name: 'Lavender Mint',
                accent: '#B19CD9',      // Soft lavender
                secondary: '#A8E6CF',    // Mint green
                gradientStart: '#B19CD9',
                gradientEnd: '#A8E6CF',
                hover: '#9B8BC4',
                success: '#7FB3A8',
                shadow: 'rgba(177, 156, 217, 0.25)'
            },
            // Palette 2: Peach & Sky Blue
            {
                name: 'Peach Sky',
                accent: '#FFB3BA',      // Soft peach
                secondary: '#BAE1FF',   // Sky blue
                gradientStart: '#FFB3BA',
                gradientEnd: '#BAE1FF',
                hover: '#FF9FA8',
                success: '#8FC4D9',
                shadow: 'rgba(255, 179, 186, 0.25)'
            },
            // Palette 3: Rose & Powder Blue
            {
                name: 'Rose Powder',
                accent: '#FFCCCB',      // Rose
                secondary: '#B0E0E6',    // Powder blue
                gradientStart: '#FFCCCB',
                gradientEnd: '#B0E0E6',
                hover: '#FFB8B6',
                success: '#87CEEB',
                shadow: 'rgba(255, 204, 203, 0.25)'
            },
            // Palette 4: Butter & Periwinkle
            {
                name: 'Butter Periwinkle',
                accent: '#FFF9C4',     // Butter yellow
                secondary: '#C5C5EA',   // Periwinkle
                gradientStart: '#FFF9C4',
                gradientEnd: '#C5C5EA',
                hover: '#FFF59D',
                success: '#A5A5D6',
                shadow: 'rgba(255, 249, 196, 0.25)'
            },
            // Palette 5: Coral & Aqua
            {
                name: 'Coral Aqua',
                accent: '#FFB6C1',      // Light pink/coral
                secondary: '#AFEEEE',   // Aqua
                gradientStart: '#FFB6C1',
                gradientEnd: '#AFEEEE',
                hover: '#FF9BB0',
                success: '#7FCDCD',
                shadow: 'rgba(255, 182, 193, 0.25)'
            },
            // Palette 6: Lilac & Sage
            {
                name: 'Lilac Sage',
                accent: '#D8BFD8',      // Thistle/lilac
                secondary: '#C9D9B0',   // Sage green
                gradientStart: '#D8BFD8',
                gradientEnd: '#C9D9B0',
                hover: '#C8A8C8',
                success: '#A8C088',
                shadow: 'rgba(216, 191, 216, 0.25)'
            },
            // Palette 7: Apricot & Cornflower
            {
                name: 'Apricot Cornflower',
                accent: '#FDD5B1',     // Apricot
                secondary: '#9EC5E8',   // Cornflower blue
                gradientStart: '#FDD5B1',
                gradientEnd: '#9EC5E8',
                hover: '#FCC08D',
                success: '#7BA8D4',
                shadow: 'rgba(253, 213, 177, 0.25)'
            },
            // Palette 8: Blush & Seafoam
            {
                name: 'Blush Seafoam',
                accent: '#FFD1DC',      // Blush pink
                secondary: '#B2F5EA',   // Seafoam green
                gradientStart: '#FFD1DC',
                gradientEnd: '#B2F5EA',
                hover: '#FFB8C8',
                success: '#7FD4C4',
                shadow: 'rgba(255, 209, 220, 0.25)'
            },
            // Palette 9: Honey & Lavender
            {
                name: 'Honey Lavender',
                accent: '#F5DEB3',      // Wheat/honey
                secondary: '#E6E6FA',   // Lavender
                gradientStart: '#F5DEB3',
                gradientEnd: '#E6E6FA',
                hover: '#F0C97A',
                success: '#C9C9E8',
                shadow: 'rgba(245, 222, 179, 0.25)'
            },
            // Palette 10: Salmon & Turquoise
            {
                name: 'Salmon Turquoise',
                accent: '#FFA07A',      // Light salmon
                secondary: '#AFE4DE',   // Turquoise
                gradientStart: '#FFA07A',
                gradientEnd: '#AFE4DE',
                hover: '#FF8C5A',
                success: '#7FCDC4',
                shadow: 'rgba(255, 160, 122, 0.25)'
            },
            // Palette 11: Cream & Wisteria
            {
                name: 'Cream Wisteria',
                accent: '#FFFDD0',      // Cream
                secondary: '#C9A0DC',   // Wisteria
                gradientStart: '#FFFDD0',
                gradientEnd: '#C9A0DC',
                hover: '#FFF9A3',
                success: '#B088C8',
                shadow: 'rgba(255, 253, 208, 0.25)'
            },
            // Palette 12: Melon & Sky
            {
                name: 'Melon Sky',
                accent: '#FFDAB9',      // Peach puff
                secondary: '#87CEEB',   // Sky blue
                gradientStart: '#FFDAB9',
                gradientEnd: '#87CEEB',
                hover: '#FFC88A',
                success: '#5FB3D9',
                shadow: 'rgba(255, 218, 185, 0.25)'
            },
            // Palette 13: Mauve & Mint
            {
                name: 'Mauve Mint',
                accent: '#E0B0FF',      // Mauve
                secondary: '#BDF5BD',   // Mint
                gradientStart: '#E0B0FF',
                gradientEnd: '#BDF5BD',
                hover: '#D19AFF',
                success: '#8FE08F',
                shadow: 'rgba(224, 176, 255, 0.25)'
            },
            // Palette 14: Peach & Azure
            {
                name: 'Peach Azure',
                accent: '#FFCBA4',      // Peach
                secondary: '#B0E0FF',   // Azure
                gradientStart: '#FFCBA4',
                gradientEnd: '#B0E0FF',
                hover: '#FFB87A',
                success: '#7FC4E6',
                shadow: 'rgba(255, 203, 164, 0.25)'
            },
            // Palette 15: Rose Quartz & Aquamarine
            {
                name: 'Rose Aquamarine',
                accent: '#F7CAC9',      // Rose quartz
                secondary: '#95E1D3',   // Aquamarine
                gradientStart: '#F7CAC9',
                gradientEnd: '#95E1D3',
                hover: '#F4B5B4',
                success: '#6FC4B8',
                shadow: 'rgba(247, 202, 201, 0.25)'
            }
        ];
    }

    /**
     * Get the day of year (1-365/366) for deterministic selection
     */
    getDayOfYear() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    /**
     * Get the palette index for today (0-14)
     * Uses day of year to ensure same palette for entire day
     */
    getTodayPaletteIndex() {
        const dayOfYear = this.getDayOfYear();
        return dayOfYear % this.colorPalettes.length;
    }

    /**
     * Get today's color palette
     */
    getTodayPalette() {
        const index = this.getTodayPaletteIndex();
        return this.colorPalettes[index];
    }

    /**
     * Apply pastel colors to the current theme
     * Works with both dark and light themes
     */
    applyDailyColors() {
        const palette = this.getTodayPalette();
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const root = document.documentElement;

        if (isDark) {
            // Dark theme with pastel accents
            root.style.setProperty('--accent-color', palette.accent);
            root.style.setProperty('--accent-gradient-start', palette.gradientStart);
            root.style.setProperty('--accent-hover', palette.hover);
            root.style.setProperty('--secondary-accent', palette.secondary);
            root.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            root.style.setProperty('--success-color', palette.success);
            root.style.setProperty('--shadow-accent', palette.shadow);
            
            // Update border colors with pastel tint
            root.style.setProperty('--border-color', this.adjustOpacity(palette.accent, 0.15));
            root.style.setProperty('--border-hover', this.adjustOpacity(palette.accent, 0.25));
            
            // Update badge colors
            root.style.setProperty('--badge-bg', this.adjustOpacity(palette.accent, 0.15));
            root.style.setProperty('--badge-text', this.lighten(palette.accent, 0.3));
            root.style.setProperty('--badge-border', this.adjustOpacity(palette.accent, 0.25));
            
            // Update tech stack colors
            root.style.setProperty('--tech-bg', this.adjustOpacity(palette.accent, 0.12));
            root.style.setProperty('--tech-text', this.lighten(palette.accent, 0.4));
            root.style.setProperty('--tech-border', this.adjustOpacity(palette.accent, 0.18));
            
            // Update hover background
            root.style.setProperty('--hover-bg', this.adjustOpacity(palette.accent, 0.12));
        } else {
            // Light theme with pastel accents
            root.style.setProperty('--accent-color', palette.accent);
            root.style.setProperty('--accent-gradient-start', palette.gradientStart);
            root.style.setProperty('--accent-hover', this.darken(palette.accent, 0.15));
            root.style.setProperty('--secondary-accent', palette.secondary);
            root.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            root.style.setProperty('--success-color', palette.success);
            root.style.setProperty('--shadow-accent', this.adjustOpacity(palette.accent, 0.2));
            
            // Update border colors with pastel tint
            root.style.setProperty('--border-color', this.adjustOpacity(palette.accent, 0.2));
            root.style.setProperty('--border-hover', this.adjustOpacity(palette.accent, 0.3));
            
            // Update badge colors
            root.style.setProperty('--badge-bg', this.adjustOpacity(palette.accent, 0.15));
            root.style.setProperty('--badge-text', this.darken(palette.accent, 0.2));
            root.style.setProperty('--badge-border', this.adjustOpacity(palette.accent, 0.25));
            
            // Update tech stack colors
            root.style.setProperty('--tech-bg', this.adjustOpacity(palette.accent, 0.1));
            root.style.setProperty('--tech-text', this.darken(palette.accent, 0.1));
            root.style.setProperty('--tech-border', this.adjustOpacity(palette.accent, 0.2));
            
            // Update hover background
            root.style.setProperty('--hover-bg', this.adjustOpacity(palette.accent, 0.08));
        }

        // Update contribution colors for dark theme
        if (isDark) {
            root.style.setProperty('--contribution-hover-border', palette.accent);
            root.style.setProperty('--contribution-level-3', palette.accent);
            root.style.setProperty('--contribution-level-4', this.lighten(palette.accent, 0.2));
        } else {
            root.style.setProperty('--contribution-hover-border', palette.accent);
        }
    }

    /**
     * Convert hex color to rgba with opacity
     */
    adjustOpacity(hex, opacity) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    /**
     * Lighten a hex color by a percentage
     */
    lighten(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
        const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent));
        const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    /**
     * Darken a hex color by a percentage
     */
    darken(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - Math.round(255 * percent));
        const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * percent));
        const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * percent));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    /**
     * Initialize the daily color rotation
     */
    init() {
        // Apply colors immediately
        this.applyDailyColors();

        // Listen for theme changes to reapply colors
        window.addEventListener('themeChange', () => {
            this.applyDailyColors();
        });

        // Check if we need to update colors (e.g., if day changed while page is open)
        // This ensures colors update at midnight
        this.scheduleMidnightUpdate();
    }

    /**
     * Schedule color update at midnight
     */
    scheduleMidnightUpdate() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow - now;
        
        setTimeout(() => {
            this.applyDailyColors();
            // Schedule next midnight update (24 hours)
            setInterval(() => {
                this.applyDailyColors();
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }
}

// Initialize daily color rotation
(function() {
    let dailyColorsInstance = null;
    
    function initDailyColors() {
        if (!dailyColorsInstance) {
            dailyColorsInstance = new DailyColorRotation();
            dailyColorsInstance.init();
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait a bit for theme switcher to initialize
            setTimeout(initDailyColors, 150);
        });
    } else {
        // DOM already loaded
        setTimeout(initDailyColors, 150);
    }
    
    // Also listen for theme changes in case theme is set before this script loads
    window.addEventListener('themeChange', () => {
        if (dailyColorsInstance) {
            dailyColorsInstance.applyDailyColors();
        } else {
            // If not initialized yet, initialize now
            setTimeout(initDailyColors, 50);
        }
    });
})();

