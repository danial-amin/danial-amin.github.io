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
        // Add your custom dark mode palettes here
        // Each palette should have: name, accent, secondary, gradientStart, gradientEnd, hover, success, shadow
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
            // Palette 4: Periwinkle & Teal
            {
                name: 'Periwinkle Teal',
                accent: '#A5B4FC',     // Periwinkle blue
                secondary: '#81E6D9',   // Teal
                gradientStart: '#A5B4FC',
                gradientEnd: '#81E6D9',
                hover: '#8FA3FB',
                success: '#5DD4C4',
                shadow: 'rgba(165, 180, 252, 0.25)'
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
            // Palette 7: Cornflower & Cyan
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
            // Palette 9: Lavender & Indigo
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
            // Palette 10: Pink & Turquoise
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
            // Palette 11: Wisteria & Violet
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
            // Palette 12: Sky & Azure
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
            // Palette 14: Azure & Blue
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
            // Palette 2: Peach & Sky Blue (Light) - More vibrant
            {
                name: 'Peach Sky',
                accent: '#FF7A8A',      // More vibrant peach
                secondary: '#5BB5FF',   // More vibrant sky blue
                gradientStart: '#FF7A8A',
                gradientEnd: '#5BB5FF',
                hover: '#FF5A6A',
                success: '#3B95D4',
                shadow: 'rgba(255, 122, 138, 0.3)'
            },
            // Palette 3: Rose & Powder Blue (Light) - More vibrant
            {
                name: 'Rose Powder',
                accent: '#FF7F90',      // More vibrant rose
                secondary: '#5BB0C4',   // More vibrant powder blue
                gradientStart: '#FF7F90',
                gradientEnd: '#5BB0C4',
                hover: '#FF5F70',
                success: '#3B90B4',
                shadow: 'rgba(255, 127, 144, 0.3)'
            },
            // Palette 4: Butter & Periwinkle (Light) - More vibrant
            {
                name: 'Butter Periwinkle',
                accent: '#FFC952',     // More vibrant butter/yellow
                secondary: '#8A8AC4',   // More vibrant periwinkle
                gradientStart: '#FFC952',
                gradientEnd: '#8A8AC4',
                hover: '#FFB822',
                success: '#6A6AA8',
                shadow: 'rgba(255, 201, 82, 0.3)'
            },
            // Palette 5: Coral & Aqua (Light) - More vibrant
            {
                name: 'Coral Aqua',
                accent: '#FF6B85',      // More vibrant coral
                secondary: '#5BB5B5',   // More vibrant aqua
                gradientStart: '#FF6B85',
                gradientEnd: '#5BB5B5',
                hover: '#FF4B65',
                success: '#3B9595',
                shadow: 'rgba(255, 107, 133, 0.3)'
            },
            // Palette 6: Lilac & Sage (Light) - More vibrant
            {
                name: 'Lilac Sage',
                accent: '#A87AA8',      // More vibrant lilac
                secondary: '#7BA87A',   // More vibrant sage
                gradientStart: '#A87AA8',
                gradientEnd: '#7BA87A',
                hover: '#976A97',
                success: '#5B985B',
                shadow: 'rgba(168, 122, 168, 0.3)'
            },
            // Palette 7: Cornflower & Cyan (Light) - More vibrant
            {
                name: 'Cornflower Cyan',
                accent: '#5B95E8',     // Vibrant cornflower
                secondary: '#22D3EE',   // Vibrant cyan
                gradientStart: '#5B95E8',
                gradientEnd: '#22D3EE',
                hover: '#4B85D8',
                success: '#06B6D4',
                shadow: 'rgba(91, 149, 232, 0.3)'
            },
            // Palette 8: Blush & Seafoam (Light) - More vibrant
            {
                name: 'Blush Seafoam',
                accent: '#FF7FA8',      // More vibrant blush
                secondary: '#5BB5A0',   // More vibrant seafoam
                gradientStart: '#FF7FA8',
                gradientEnd: '#5BB5A0',
                hover: '#FF5F88',
                success: '#3B9580',
                shadow: 'rgba(255, 127, 168, 0.3)'
            },
            // Palette 9: Lavender & Indigo (Light) - More vibrant
            {
                name: 'Lavender Indigo',
                accent: '#A78BFA',      // Vibrant lavender
                secondary: '#6366F1',   // Vibrant indigo
                gradientStart: '#A78BFA',
                gradientEnd: '#6366F1',
                hover: '#977BEA',
                success: '#4F46E5',
                shadow: 'rgba(167, 139, 250, 0.3)'
            },
            // Palette 10: Pink & Turquoise (Light) - More vibrant
            {
                name: 'Pink Turquoise',
                accent: '#EC4899',      // Vibrant pink
                secondary: '#14B8A6',   // Vibrant turquoise
                gradientStart: '#EC4899',
                gradientEnd: '#14B8A6',
                hover: '#DB2777',
                success: '#0D9488',
                shadow: 'rgba(236, 72, 153, 0.3)'
            },
            // Palette 11: Wisteria & Violet (Light) - More vibrant
            {
                name: 'Wisteria Violet',
                accent: '#A855F7',      // Vibrant wisteria
                secondary: '#8B5CF6',   // Vibrant violet
                gradientStart: '#A855F7',
                gradientEnd: '#8B5CF6',
                hover: '#9333EA',
                success: '#7C3AED',
                shadow: 'rgba(168, 85, 247, 0.3)'
            },
            // Palette 12: Sky & Azure (Light) - More vibrant
            {
                name: 'Sky Azure',
                accent: '#0EA5E9',      // Vibrant sky blue
                secondary: '#0284C7',   // Vibrant azure
                gradientStart: '#0EA5E9',
                gradientEnd: '#0284C7',
                hover: '#0284C7',
                success: '#0369A1',
                shadow: 'rgba(14, 165, 233, 0.3)'
            },
            // Palette 13: Mauve & Mint (Light) - More vibrant
            {
                name: 'Mauve Mint',
                accent: '#A85AFF',      // More vibrant mauve
                secondary: '#5BB56A',   // More vibrant mint
                gradientStart: '#A85AFF',
                gradientEnd: '#5BB56A',
                hover: '#973AFF',
                success: '#3B954A',
                shadow: 'rgba(168, 90, 255, 0.3)'
            },
            // Palette 14: Azure & Blue (Light) - More vibrant
            {
                name: 'Azure Blue',
                accent: '#3B82F6',      // Vibrant azure
                secondary: '#2563EB',   // Vibrant blue
                gradientStart: '#3B82F6',
                gradientEnd: '#2563EB',
                hover: '#2563EB',
                success: '#1D4ED8',
                shadow: 'rgba(59, 130, 246, 0.3)'
            },
            // Palette 15: Rose Aquamarine (Light) - More vibrant
            {
                name: 'Rose Aquamarine',
                accent: '#FF6A7A',      // More vibrant rose
                secondary: '#4BA590',   // More vibrant aquamarine
                gradientStart: '#FF6A7A',
                gradientEnd: '#4BA590',
                hover: '#FF4A5A',
                success: '#2B8570',
                shadow: 'rgba(255, 106, 122, 0.3)'
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
        const dayOfYear = Math.floor(diff / oneDay);
        console.log('Day of year calculation:', {
            date: now.toISOString().split('T')[0],
            dayOfYear: dayOfYear,
            year: now.getFullYear()
        });
        return dayOfYear;
    }

    /**
     * Get the palette index for today (0-14)
     * Uses day of year to ensure same palette for entire day
     */
    getTodayPaletteIndex() {
        const dayOfYear = this.getDayOfYear();
        // Use the same index for both light and dark to keep them in sync
        const index = dayOfYear % 15;
        console.log('Palette index:', index, 'from day of year:', dayOfYear);
        return index;
    }

    /**
     * Get today's color palette based on current theme
     */
    getTodayPalette() {
        const index = this.getTodayPaletteIndex();
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const palettes = isDark ? this.colorPalettesDark : this.colorPalettesLight;
        const palette = palettes[index];
        console.log('Selected palette:', palette.name, 'Index:', index, 'Theme:', isDark ? 'dark' : 'light');
        return palette;
    }

    /**
     * Apply pastel colors to the current theme
     * Works with both dark and light themes
     */
    applyDailyColors() {
        const palette = this.getTodayPalette();
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        // Set variables on body element since that's where [data-theme] selector targets
        const targetElement = document.body;
        
        console.log('Applying daily colors:', palette.name, 'Theme:', isDark ? 'dark' : 'light');
        console.log('Target element:', targetElement);

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

