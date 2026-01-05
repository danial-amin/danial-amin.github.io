/**
 * Daily Color Rotation System
 * Automatically rotates through 15 pastel color palettes daily
 * Each palette is carefully designed for good contrast and visual harmony
 */

// Make class globally accessible for testing
// Define the class first, then assign to window
class DailyColorRotation {
    constructor() {
        // ============================================
        // DARK MODE PALETTES (15 palettes)
        // ============================================
        // Carefully curated pastel palettes optimized for dark backgrounds
        // Each palette has excellent contrast and visual harmony
        this.colorPalettesDark = [
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
            // Palette 2: Rose & Sky Blue
            {
                name: 'Rose Sky',
                accent: '#FFB3D1',      // Soft rose pink
                secondary: '#A8D8EA',   // Sky blue
                gradientStart: '#FFB3D1',
                gradientEnd: '#A8D8EA',
                hover: '#FF9FC4',
                success: '#7FC4D9',
                shadow: 'rgba(255, 179, 209, 0.25)'
            },
            // Palette 3: Periwinkle & Teal
            {
                name: 'Periwinkle Teal',
                accent: '#A5B4FC',      // Periwinkle blue
                secondary: '#81E6D9',    // Teal
                gradientStart: '#A5B4FC',
                gradientEnd: '#81E6D9',
                hover: '#8FA3FB',
                success: '#5DD4C4',
                shadow: 'rgba(165, 180, 252, 0.25)'
            },
            // Palette 4: Coral & Aqua
            {
                name: 'Coral Aqua',
                accent: '#FFB6C1',      // Coral pink
                secondary: '#AFEEEE',   // Aqua
                gradientStart: '#FFB6C1',
                gradientEnd: '#AFEEEE',
                hover: '#FF9BB0',
                success: '#7FCDCD',
                shadow: 'rgba(255, 182, 193, 0.25)'
            },
            // Palette 5: Lilac & Sage
            {
                name: 'Lilac Sage',
                accent: '#D8BFD8',      // Lilac
                secondary: '#C9D9B0',   // Sage green
                gradientStart: '#D8BFD8',
                gradientEnd: '#C9D9B0',
                hover: '#C8A8C8',
                success: '#A8C088',
                shadow: 'rgba(216, 191, 216, 0.25)'
            },
            // Palette 6: Cornflower & Cyan
            {
                name: 'Cornflower Cyan',
                accent: '#93C5FD',     // Cornflower blue
                secondary: '#67E8F9',   // Cyan
                gradientStart: '#93C5FD',
                gradientEnd: '#67E8F9',
                hover: '#7AB3FC',
                success: '#3DD5E8',
                shadow: 'rgba(147, 197, 253, 0.25)'
            },
            // Palette 7: Blush & Seafoam
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
            // Palette 8: Lavender & Indigo
            {
                name: 'Lavender Indigo',
                accent: '#C4B5FD',      // Lavender
                secondary: '#818CF8',   // Indigo
                gradientStart: '#C4B5FD',
                gradientEnd: '#818CF8',
                hover: '#B5A3FC',
                success: '#6366F1',
                shadow: 'rgba(196, 181, 253, 0.25)'
            },
            // Palette 9: Pink & Turquoise
            {
                name: 'Pink Turquoise',
                accent: '#F9A8D4',      // Pink
                secondary: '#5EEAD4',   // Turquoise
                gradientStart: '#F9A8D4',
                gradientEnd: '#5EEAD4',
                hover: '#F893C4',
                success: '#2DD4BF',
                shadow: 'rgba(249, 168, 212, 0.25)'
            },
            // Palette 10: Wisteria & Violet
            {
                name: 'Wisteria Violet',
                accent: '#C084FC',      // Wisteria purple
                secondary: '#A78BFA',   // Violet
                gradientStart: '#C084FC',
                gradientEnd: '#A78BFA',
                hover: '#B573FB',
                success: '#8B5CF6',
                shadow: 'rgba(192, 132, 252, 0.25)'
            },
            // Palette 11: Sky & Azure
            {
                name: 'Sky Azure',
                accent: '#7DD3FC',      // Sky blue
                secondary: '#38BDF8',   // Azure
                gradientStart: '#7DD3FC',
                gradientEnd: '#38BDF8',
                hover: '#6BC3FB',
                success: '#0EA5E9',
                shadow: 'rgba(125, 211, 252, 0.25)'
            },
            // Palette 12: Mauve & Mint
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
            // Palette 13: Azure & Blue
            {
                name: 'Azure Blue',
                accent: '#60A5FA',      // Azure blue
                secondary: '#3B82F6',   // Blue
                gradientStart: '#60A5FA',
                gradientEnd: '#3B82F6',
                hover: '#4A95F9',
                success: '#2563EB',
                shadow: 'rgba(96, 165, 250, 0.25)'
            },
            // Palette 14: Rose Quartz & Aquamarine
            {
                name: 'Rose Aquamarine',
                accent: '#F7CAC9',      // Rose quartz
                secondary: '#95E1D3',   // Aquamarine
                gradientStart: '#F7CAC9',
                gradientEnd: '#95E1D3',
                hover: '#F4B5B4',
                success: '#6FC4B8',
                shadow: 'rgba(247, 202, 201, 0.25)'
            },
            // Palette 15: Orchid & Emerald
            {
                name: 'Orchid Emerald',
                accent: '#DA70D6',      // Orchid
                secondary: '#50C878',   // Emerald
                gradientStart: '#DA70D6',
                gradientEnd: '#50C878',
                hover: '#C85BC1',
                success: '#3BAF68',
                shadow: 'rgba(218, 112, 214, 0.25)'
            }
        ];

        // ============================================
        // LIGHT MODE PALETTES (15 palettes)
        // ============================================
        // Add your custom light mode palettes here
        // These should be optimized for light backgrounds (more vibrant/saturated for visibility)
        this.colorPalettesLight = [
            // Palette 1: Soft Lavender & Mint (Light) - More vibrant
            {
                name: 'Lavender Mint',
                accent: '#9B7DB8',      // More vibrant lavender
                secondary: '#6BB89A',   // More vibrant mint
                gradientStart: '#9B7DB8',
                gradientEnd: '#6BB89A',
                hover: '#8A6CA7',
                success: '#5AA089',
                shadow: 'rgba(155, 125, 184, 0.3)'
            },
            // Palette 2: Rose & Sky Blue (Light)
            {
                name: 'Rose Sky',
                accent: '#E91E63',      // Rich rose pink
                secondary: '#2196F3',   // Rich sky blue
                gradientStart: '#E91E63',
                gradientEnd: '#2196F3',
                hover: '#C2185B',
                success: '#1976D2',
                shadow: 'rgba(233, 30, 99, 0.3)'
            },
            // Palette 3: Periwinkle & Teal (Light)
            {
                name: 'Periwinkle Teal',
                accent: '#7C4DFF',      // Rich periwinkle
                secondary: '#26A69A',   // Rich teal
                gradientStart: '#7C4DFF',
                gradientEnd: '#26A69A',
                hover: '#651FFF',
                success: '#00897B',
                shadow: 'rgba(124, 77, 255, 0.3)'
            },
            // Palette 4: Coral & Aqua (Light)
            {
                name: 'Coral Aqua',
                accent: '#FF6B9D',     // Rich coral
                secondary: '#00BCD4',   // Rich aqua
                gradientStart: '#FF6B9D',
                gradientEnd: '#00BCD4',
                hover: '#FF4081',
                success: '#0097A7',
                shadow: 'rgba(255, 107, 157, 0.3)'
            },
            // Palette 5: Lilac & Sage (Light)
            {
                name: 'Lilac Sage',
                accent: '#9C27B0',      // Rich lilac
                secondary: '#66BB6A',   // Rich sage
                gradientStart: '#9C27B0',
                gradientEnd: '#66BB6A',
                hover: '#7B1FA2',
                success: '#4CAF50',
                shadow: 'rgba(156, 39, 176, 0.3)'
            },
            // Palette 6: Cornflower & Cyan (Light)
            {
                name: 'Cornflower Cyan',
                accent: '#448AFF',     // Rich cornflower
                secondary: '#00E5FF',   // Rich cyan
                gradientStart: '#448AFF',
                gradientEnd: '#00E5FF',
                hover: '#2979FF',
                success: '#00BCD4',
                shadow: 'rgba(68, 138, 255, 0.3)'
            },
            // Palette 7: Blush & Seafoam (Light)
            {
                name: 'Blush Seafoam',
                accent: '#F06292',      // Rich blush
                secondary: '#4DB6AC',   // Rich seafoam
                gradientStart: '#F06292',
                gradientEnd: '#4DB6AC',
                hover: '#EC407A',
                success: '#26A69A',
                shadow: 'rgba(240, 98, 146, 0.3)'
            },
            // Palette 8: Lavender & Indigo (Light)
            {
                name: 'Lavender Indigo',
                accent: '#9575CD',      // Rich lavender
                secondary: '#5C6BC0',   // Rich indigo
                gradientStart: '#9575CD',
                gradientEnd: '#5C6BC0',
                hover: '#7E57C2',
                success: '#3F51B5',
                shadow: 'rgba(149, 117, 205, 0.3)'
            },
            // Palette 9: Pink & Turquoise (Light)
            {
                name: 'Pink Turquoise',
                accent: '#EC407A',      // Rich pink
                secondary: '#1DE9B6',   // Rich turquoise
                gradientStart: '#EC407A',
                gradientEnd: '#1DE9B6',
                hover: '#E91E63',
                success: '#00BFA5',
                shadow: 'rgba(236, 64, 122, 0.3)'
            },
            // Palette 10: Wisteria & Violet (Light)
            {
                name: 'Wisteria Violet',
                accent: '#BA68C8',      // Rich wisteria
                secondary: '#8E24AA',   // Rich violet
                gradientStart: '#BA68C8',
                gradientEnd: '#8E24AA',
                hover: '#AB47BC',
                success: '#7B1FA2',
                shadow: 'rgba(186, 104, 200, 0.3)'
            },
            // Palette 11: Sky & Azure (Light)
            {
                name: 'Sky Azure',
                accent: '#42A5F5',      // Rich sky blue
                secondary: '#1E88E5',   // Rich azure
                gradientStart: '#42A5F5',
                gradientEnd: '#1E88E5',
                hover: '#2196F3',
                success: '#1565C0',
                shadow: 'rgba(66, 165, 245, 0.3)'
            },
            // Palette 12: Mauve & Mint (Light)
            {
                name: 'Mauve Mint',
                accent: '#CE93D8',      // Rich mauve
                secondary: '#4CAF50',   // Rich mint
                gradientStart: '#CE93D8',
                gradientEnd: '#4CAF50',
                hover: '#BA68C8',
                success: '#388E3C',
                shadow: 'rgba(206, 147, 216, 0.3)'
            },
            // Palette 13: Azure & Blue (Light)
            {
                name: 'Azure Blue',
                accent: '#64B5F6',      // Rich azure
                secondary: '#1976D2',   // Rich blue
                gradientStart: '#64B5F6',
                gradientEnd: '#1976D2',
                hover: '#42A5F5',
                success: '#1565C0',
                shadow: 'rgba(100, 181, 246, 0.3)'
            },
            // Palette 14: Rose Quartz & Aquamarine (Light)
            {
                name: 'Rose Aquamarine',
                accent: '#F48FB1',      // Rich rose
                secondary: '#26A69A',   // Rich aquamarine
                gradientStart: '#F48FB1',
                gradientEnd: '#26A69A',
                hover: '#F06292',
                success: '#00897B',
                shadow: 'rgba(244, 143, 177, 0.3)'
            },
            // Palette 15: Orchid & Emerald (Light)
            {
                name: 'Orchid Emerald',
                accent: '#AB47BC',      // Rich orchid
                secondary: '#43A047',   // Rich emerald
                gradientStart: '#AB47BC',
                gradientEnd: '#43A047',
                hover: '#9C27B0',
                success: '#388E3C',
                shadow: 'rgba(171, 71, 188, 0.3)'
            }
        ];
    }

    /**
     * Get the day of year (1-365/366) for deterministic selection
     * Always calculates fresh - never caches
     */
    getDayOfYear() {
        const now = new Date();
        // Use January 1st as the start (day 0), so Jan 1 = day 1
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        // Add 1 because Jan 1 should be day 1, not day 0
        const dayOfYear = Math.floor(diff / oneDay) + 1;
        
        // Debug only in development (remove in production if needed)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Day of year calculation:', {
                date: now.toISOString().split('T')[0],
                dayOfYear: dayOfYear,
                year: now.getFullYear(),
                month: now.getMonth() + 1,
                day: now.getDate()
            });
        }
        return dayOfYear;
    }

    /**
     * Get the palette index for today (0-14)
     * Uses day of year to ensure same palette for entire day
     * Always calculates fresh - never caches
     */
    getTodayPaletteIndex() {
        // Always get fresh day of year (never cache)
        const dayOfYear = this.getDayOfYear();
        // Use the same index for both light and dark to keep them in sync
        // Subtract 1 because dayOfYear is 1-365, but we want index 0-14
        const index = (dayOfYear - 1) % 15;
        
        // Debug only in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Palette index:', index, 'from day of year:', dayOfYear);
        }
        return index;
    }

    /**
     * Get today's color palette based on current theme
     * Always calculates fresh - never caches
     */
    getTodayPalette() {
        // Always recalculate index (never cache)
        const index = this.getTodayPaletteIndex();
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const palettes = isDark ? this.colorPalettesDark : this.colorPalettesLight;
        const palette = palettes[index];
        
        // Debug only in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Selected palette:', palette.name, 'Index:', index, 'Theme:', isDark ? 'dark' : 'light');
        }
        return palette;
    }

    /**
     * Apply pastel colors to the current theme
     * Works with both dark and light themes
     */
    applyDailyColors() {
        // Always get fresh palette (recalculate day of year each time)
        const palette = this.getTodayPalette();
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        // Set variables on body element since that's where [data-theme] selector targets
        const targetElement = document.body;
        
        const dayOfYear = this.getDayOfYear();
        const paletteIndex = this.getTodayPaletteIndex();
        console.log('Applying daily colors:', palette.name, 'Theme:', isDark ? 'dark' : 'light', 'Day:', dayOfYear, 'Index:', paletteIndex);

        if (isDark) {
            // Dark theme with pastel accents
            // Slightly darken accent for better button contrast
            const darkerAccent = this.darken(palette.accent, 0.1);
            targetElement.style.setProperty('--accent-color', darkerAccent);
            targetElement.style.setProperty('--accent-gradient-start', darkerAccent);
            targetElement.style.setProperty('--accent-hover', this.darken(palette.accent, 0.15));
            targetElement.style.setProperty('--secondary-accent', palette.secondary);
            targetElement.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            targetElement.style.setProperty('--success-color', palette.success);
            targetElement.style.setProperty('--shadow-accent', palette.shadow);
            
            // Update border colors with pastel tint
            targetElement.style.setProperty('--border-color', this.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--border-hover', this.adjustOpacity(palette.accent, 0.25));
            
            // Update badge colors
            targetElement.style.setProperty('--badge-bg', this.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--badge-text', this.lighten(palette.accent, 0.3));
            targetElement.style.setProperty('--badge-border', this.adjustOpacity(palette.accent, 0.25));
            
            // Update tech stack colors
            targetElement.style.setProperty('--tech-bg', this.adjustOpacity(palette.accent, 0.12));
            targetElement.style.setProperty('--tech-text', this.lighten(palette.accent, 0.4));
            targetElement.style.setProperty('--tech-border', this.adjustOpacity(palette.accent, 0.18));
            
            // Update hover background
            targetElement.style.setProperty('--hover-bg', this.adjustOpacity(palette.accent, 0.12));
            
            // Update GitHub contribution colors (dark theme)
            targetElement.style.setProperty('--contribution-hover-border', palette.accent);
            targetElement.style.setProperty('--contribution-level-0', this.adjustOpacity(palette.accent, 0.08));
            targetElement.style.setProperty('--contribution-level-1', this.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--contribution-level-2', this.adjustOpacity(palette.accent, 0.25));
            targetElement.style.setProperty('--contribution-level-3', palette.accent);
            targetElement.style.setProperty('--contribution-level-4', this.lighten(palette.accent, 0.15));
            
            // Button text color - ensure good contrast for dark theme
            // For pastel colors on dark theme, use white text for better visibility
            const btnTextColor = this.getContrastTextColor(palette.accent);
            // If the calculated color is too light (meaning accent is dark), force white for dark theme
            targetElement.style.setProperty('--btn-text-color', '#ffffff');
        } else {
            // Light theme with pastel accents
            targetElement.style.setProperty('--accent-color', palette.accent);
            targetElement.style.setProperty('--accent-gradient-start', palette.gradientStart);
            targetElement.style.setProperty('--accent-hover', this.darken(palette.accent, 0.15));
            targetElement.style.setProperty('--secondary-accent', palette.secondary);
            targetElement.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            targetElement.style.setProperty('--success-color', palette.success);
            targetElement.style.setProperty('--shadow-accent', this.adjustOpacity(palette.accent, 0.2));
            
            // Update border colors with pastel tint
            targetElement.style.setProperty('--border-color', this.adjustOpacity(palette.accent, 0.2));
            targetElement.style.setProperty('--border-hover', this.adjustOpacity(palette.accent, 0.3));
            
            // Update badge colors
            targetElement.style.setProperty('--badge-bg', this.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--badge-text', this.darken(palette.accent, 0.2));
            targetElement.style.setProperty('--badge-border', this.adjustOpacity(palette.accent, 0.25));
            
            // Update tech stack colors
            targetElement.style.setProperty('--tech-bg', this.adjustOpacity(palette.accent, 0.1));
            targetElement.style.setProperty('--tech-text', this.darken(palette.accent, 0.1));
            targetElement.style.setProperty('--tech-border', this.adjustOpacity(palette.accent, 0.2));
            
            // Update hover background
            targetElement.style.setProperty('--hover-bg', this.adjustOpacity(palette.accent, 0.08));
            
            // Update GitHub contribution colors (light theme)
            targetElement.style.setProperty('--contribution-hover-border', palette.accent);
            targetElement.style.setProperty('--contribution-level-0', this.adjustOpacity(palette.accent, 0.1));
            targetElement.style.setProperty('--contribution-level-1', this.adjustOpacity(palette.accent, 0.25));
            targetElement.style.setProperty('--contribution-level-2', this.adjustOpacity(palette.accent, 0.4));
            targetElement.style.setProperty('--contribution-level-3', palette.accent);
            targetElement.style.setProperty('--contribution-level-4', this.darken(palette.accent, 0.15));
            
            // Button text color - calculate based on background brightness
            targetElement.style.setProperty('--btn-text-color', this.getContrastTextColor(palette.accent));
        }
        
        console.log('Colors applied! Accent color:', getComputedStyle(targetElement).getPropertyValue('--accent-color'));
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
     * Calculate if text should be white or dark based on background brightness
     * Returns 'white' or a dark color based on contrast
     */
    getContrastTextColor(backgroundColor) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // If background is light (luminance > 0.5), use dark text, otherwise white
        return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
    }

    /**
     * Initialize the daily color rotation
     */
    init() {
        // Always recalculate palette on init (don't cache)
        console.log('Initializing daily colors - recalculating palette...');
        // Apply colors immediately
        this.applyDailyColors();

        // Listen for theme changes to reapply colors
        window.addEventListener('themeChange', () => {
            console.log('Theme changed, reapplying colors...');
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
        
        console.log('Scheduled color update at midnight in', Math.round(msUntilMidnight / 1000 / 60), 'minutes');
        
        setTimeout(() => {
            console.log('Midnight reached - updating colors for new day...');
            this.applyDailyColors();
            // Schedule next midnight update (24 hours)
            setInterval(() => {
                console.log('Daily color update triggered');
                this.applyDailyColors();
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
        
        // Also check every hour if day has changed (in case user's clock is off or page was open for days)
        setInterval(() => {
            const currentDay = this.getDayOfYear();
            const storedDay = this._lastDayOfYear || currentDay;
            if (currentDay !== storedDay) {
                console.log('Day changed detected! Updating colors...', { old: storedDay, new: currentDay });
                this._lastDayOfYear = currentDay;
                this.applyDailyColors();
            }
        }, 60 * 60 * 1000); // Check every hour
        
        this._lastDayOfYear = this.getDayOfYear();
    }
}

// Expose class to window for global access (for testing and external use)
if (typeof window !== 'undefined') {
    window.DailyColorRotation = DailyColorRotation;
    
    // Also expose a helper function to manually apply colors (for debugging)
    window.applyDailyColorsNow = function() {
        if (window.dailyColorsInstance) {
            window.dailyColorsInstance.applyDailyColors();
        } else {
            const instance = new DailyColorRotation();
            instance.applyDailyColors();
            window.dailyColorsInstance = instance;
        }
    };
    
    // Debug function to check current day and palette
    window.checkDailyColors = function() {
        if (!window.dailyColorsInstance) {
            console.log('No dailyColorsInstance found. Creating one...');
            window.dailyColorsInstance = new DailyColorRotation();
        }
        const instance = window.dailyColorsInstance;
        const dayOfYear = instance.getDayOfYear();
        const index = instance.getTodayPaletteIndex();
        const palette = instance.getTodayPalette();
        console.log('=== Daily Colors Debug ===');
        console.log('Day of Year:', dayOfYear);
        console.log('Palette Index:', index);
        console.log('Palette Name:', palette.name);
        console.log('Palette Accent:', palette.accent);
        console.log('Theme:', document.body.getAttribute('data-theme'));
        return { dayOfYear, index, palette };
    };
}

// Initialize daily color rotation
(function() {
    let dailyColorsInstance = null;
    
    function initDailyColors() {
        if (!dailyColorsInstance) {
            // Use DailyColorRotation directly (it's in scope) or fallback to window
            const DailyColorRotationClass = typeof DailyColorRotation !== 'undefined' 
                ? DailyColorRotation 
                : (typeof window !== 'undefined' ? window.DailyColorRotation : null);
            
            if (!DailyColorRotationClass) {
                console.error('DailyColorRotation class not found');
                return;
            }
            try {
                dailyColorsInstance = new DailyColorRotationClass();
                // Store globally for debugging
                if (typeof window !== 'undefined') {
                    window.dailyColorsInstance = dailyColorsInstance;
                }
                console.log('DailyColorRotation initialized, applying colors...');
                dailyColorsInstance.init();
                console.log('Daily colors applied successfully!');
                console.log('Today\'s palette:', dailyColorsInstance.getTodayPalette().name);
            } catch (error) {
                console.error('Error initializing DailyColorRotation:', error);
            }
        }
    }
    
    // Initialize when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // Wait a bit for theme switcher to initialize
                console.log('DOMContentLoaded - initializing daily colors...');
                setTimeout(initDailyColors, 200);
            });
        } else {
            // DOM already loaded
            console.log('DOM already loaded - initializing daily colors...');
            setTimeout(initDailyColors, 200);
        }
        
        // Also listen for theme changes in case theme is set before this script loads
        if (typeof window !== 'undefined') {
            window.addEventListener('themeChange', () => {
                if (dailyColorsInstance) {
                    dailyColorsInstance.applyDailyColors();
                } else {
                    // If not initialized yet, initialize now
                    setTimeout(initDailyColors, 50);
                }
            });
        }
    }
})();

