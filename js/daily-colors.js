/**
 * Daily Color Rotation System - MODERNIZED
 * Automatically rotates through 15 sophisticated color palettes daily
 * Updated with contemporary, bold, and visually striking combinations
 */

class DailyColorRotation {
    constructor() {
        // ============================================
        // DARK MODE PALETTES (15 palettes)
        // ============================================
        // Modern, sophisticated palettes optimized for dark backgrounds
        // Inspired by contemporary design systems and color theory
        this.colorPalettesDark = [
            // Palette 1: Moonlight Violet - Deep purple with electric blue
            {
                name: 'Moonlight Violet',
                accent: '#A78BFA',      // Vibrant violet
                secondary: '#60A5FA',    // Electric blue
                gradientStart: '#A78BFA',
                gradientEnd: '#60A5FA',
                hover: '#8B5CF6',
                success: '#3B82F6',
                shadow: 'rgba(167, 139, 250, 0.3)'
            },
            // Palette 2: Sunset Coral - Warm coral with golden amber
            {
                name: 'Sunset Coral',
                accent: '#FB7185',      // Modern coral
                secondary: '#FBBF24',   // Warm amber
                gradientStart: '#FB7185',
                gradientEnd: '#FBBF24',
                hover: '#F43F5E',
                success: '#F59E0B',
                shadow: 'rgba(251, 113, 133, 0.3)'
            },
            // Palette 3: Arctic Breeze - Cool cyan with mint
            {
                name: 'Arctic Breeze',
                accent: '#22D3EE',      // Vivid cyan
                secondary: '#6EE7B7',    // Fresh mint
                gradientStart: '#22D3EE',
                gradientEnd: '#6EE7B7',
                hover: '#06B6D4',
                success: '#10B981',
                shadow: 'rgba(34, 211, 238, 0.3)'
            },
            // Palette 4: Neon Dream - Hot pink with electric purple
            {
                name: 'Neon Dream',
                accent: '#EC4899',      // Hot pink
                secondary: '#A855F7',   // Electric purple
                gradientStart: '#EC4899',
                gradientEnd: '#A855F7',
                hover: '#DB2777',
                success: '#9333EA',
                shadow: 'rgba(236, 72, 153, 0.3)'
            },
            // Palette 5: Forest Dusk - Deep emerald with teal
            {
                name: 'Forest Dusk',
                accent: '#34D399',      // Vibrant emerald
                secondary: '#14B8A6',   // Rich teal
                gradientStart: '#34D399',
                gradientEnd: '#14B8A6',
                hover: '#10B981',
                success: '#0D9488',
                shadow: 'rgba(52, 211, 153, 0.3)'
            },
            // Palette 6: Ocean Depths - Deep blue with aqua
            {
                name: 'Ocean Depths',
                accent: '#3B82F6',      // Rich blue
                secondary: '#06B6D4',   // Bright cyan
                gradientStart: '#3B82F6',
                gradientEnd: '#06B6D4',
                hover: '#2563EB',
                success: '#0891B2',
                shadow: 'rgba(59, 130, 246, 0.3)'
            },
            // Palette 7: Cherry Blossom - Soft pink with peach
            {
                name: 'Cherry Blossom',
                accent: '#F472B6',      // Vibrant pink
                secondary: '#FCA5A5',   // Warm peach-pink
                gradientStart: '#F472B6',
                gradientEnd: '#FCA5A5',
                hover: '#EC4899',
                success: '#FB7185',
                shadow: 'rgba(244, 114, 182, 0.3)'
            },
            // Palette 8: Royal Indigo - Rich indigo with periwinkle
            {
                name: 'Royal Indigo',
                accent: '#6366F1',      // Deep indigo
                secondary: '#818CF8',   // Light periwinkle
                gradientStart: '#6366F1',
                gradientEnd: '#818CF8',
                hover: '#4F46E5',
                success: '#A5B4FC',
                shadow: 'rgba(99, 102, 241, 0.3)'
            },
            // Palette 9: Tropical Sunset - Magenta with turquoise
            {
                name: 'Tropical Sunset',
                accent: '#D946EF',      // Bright fuchsia
                secondary: '#2DD4BF',   // Vivid turquoise
                gradientStart: '#D946EF',
                gradientEnd: '#2DD4BF',
                hover: '#C026D3',
                success: '#14B8A6',
                shadow: 'rgba(217, 70, 239, 0.3)'
            },
            // Palette 10: Cosmic Purple - Deep purple with lavender
            {
                name: 'Cosmic Purple',
                accent: '#9333EA',      // Rich purple
                secondary: '#C4B5FD',   // Soft lavender
                gradientStart: '#9333EA',
                gradientEnd: '#C4B5FD',
                hover: '#7E22CE',
                success: '#A78BFA',
                shadow: 'rgba(147, 51, 234, 0.3)'
            },
            // Palette 11: Golden Hour - Amber with rose gold
            {
                name: 'Golden Hour',
                accent: '#F59E0B',      // Rich amber
                secondary: '#FB923C',   // Warm orange
                gradientStart: '#F59E0B',
                gradientEnd: '#FB923C',
                hover: '#D97706',
                success: '#F97316',
                shadow: 'rgba(245, 158, 11, 0.3)'
            },
            // Palette 12: Spring Meadow - Lime with mint
            {
                name: 'Spring Meadow',
                accent: '#84CC16',      // Fresh lime
                secondary: '#4ADE80',   // Bright green
                gradientStart: '#84CC16',
                gradientEnd: '#4ADE80',
                hover: '#65A30D',
                success: '#22C55E',
                shadow: 'rgba(132, 204, 22, 0.3)'
            },
            // Palette 13: Nordic Sky - Steel blue with ice blue
            {
                name: 'Nordic Sky',
                accent: '#0EA5E9',      // Bright sky blue
                secondary: '#7DD3FC',   // Light ice blue
                gradientStart: '#0EA5E9',
                gradientEnd: '#7DD3FC',
                hover: '#0284C7',
                success: '#38BDF8',
                shadow: 'rgba(14, 165, 233, 0.3)'
            },
            // Palette 14: Flamingo Blush - Coral with salmon
            {
                name: 'Flamingo Blush',
                accent: '#FF6B9D',      // Vibrant coral-pink
                secondary: '#FCD34D',   // Soft yellow
                gradientStart: '#FF6B9D',
                gradientEnd: '#FCD34D',
                hover: '#F43F5E',
                success: '#FDE047',
                shadow: 'rgba(255, 107, 157, 0.3)'
            },
            // Palette 15: Aurora Borealis - Teal with violet
            {
                name: 'Aurora Borealis',
                accent: '#14B8A6',      // Deep teal
                secondary: '#8B5CF6',   // Rich violet
                gradientStart: '#14B8A6',
                gradientEnd: '#8B5CF6',
                hover: '#0D9488',
                success: '#7C3AED',
                shadow: 'rgba(20, 184, 166, 0.3)'
            }
        ];

        // ============================================
        // LIGHT MODE PALETTES (15 palettes)
        // ============================================
        // Bold, vibrant palettes optimized for light backgrounds
        // Higher saturation for better visibility and modern appeal
        this.colorPalettesLight = [
            // Palette 1: Moonlight Violet (Light) - Deeper tones for contrast
            {
                name: 'Moonlight Violet',
                accent: '#7C3AED',      // Deep violet
                secondary: '#2563EB',   // Strong blue
                gradientStart: '#7C3AED',
                gradientEnd: '#2563EB',
                hover: '#6D28D9',
                success: '#1D4ED8',
                shadow: 'rgba(124, 58, 237, 0.25)'
            },
            // Palette 2: Sunset Coral (Light)
            {
                name: 'Sunset Coral',
                accent: '#DC2626',      // Bold red
                secondary: '#EA580C',   // Vibrant orange
                gradientStart: '#DC2626',
                gradientEnd: '#EA580C',
                hover: '#B91C1C',
                success: '#C2410C',
                shadow: 'rgba(220, 38, 38, 0.25)'
            },
            // Palette 3: Arctic Breeze (Light)
            {
                name: 'Arctic Breeze',
                accent: '#0891B2',      // Deep cyan
                secondary: '#059669',   // Forest green
                gradientStart: '#0891B2',
                gradientEnd: '#059669',
                hover: '#0E7490',
                success: '#047857',
                shadow: 'rgba(8, 145, 178, 0.25)'
            },
            // Palette 4: Neon Dream (Light)
            {
                name: 'Neon Dream',
                accent: '#BE185D',      // Deep magenta
                secondary: '#7E22CE',   // Rich purple
                gradientStart: '#BE185D',
                gradientEnd: '#7E22CE',
                hover: '#9F1239',
                success: '#6B21A8',
                shadow: 'rgba(190, 24, 93, 0.25)'
            },
            // Palette 5: Forest Dusk (Light)
            {
                name: 'Forest Dusk',
                accent: '#059669',      // Deep emerald
                secondary: '#0D9488',   // Deep teal
                gradientStart: '#059669',
                gradientEnd: '#0D9488',
                hover: '#047857',
                success: '#0F766E',
                shadow: 'rgba(5, 150, 105, 0.25)'
            },
            // Palette 6: Ocean Depths (Light)
            {
                name: 'Ocean Depths',
                accent: '#1D4ED8',      // Strong blue
                secondary: '#0284C7',   // Vivid sky blue
                gradientStart: '#1D4ED8',
                gradientEnd: '#0284C7',
                hover: '#1E40AF',
                success: '#0369A1',
                shadow: 'rgba(29, 78, 216, 0.25)'
            },
            // Palette 7: Cherry Blossom (Light)
            {
                name: 'Cherry Blossom',
                accent: '#DB2777',      // Vibrant pink
                secondary: '#DC2626',   // Rose red
                gradientStart: '#DB2777',
                gradientEnd: '#DC2626',
                hover: '#BE185D',
                success: '#B91C1C',
                shadow: 'rgba(219, 39, 119, 0.25)'
            },
            // Palette 8: Royal Indigo (Light)
            {
                name: 'Royal Indigo',
                accent: '#4F46E5',      // Rich indigo
                secondary: '#6366F1',   // Bright indigo
                gradientStart: '#4F46E5',
                gradientEnd: '#6366F1',
                hover: '#4338CA',
                success: '#818CF8',
                shadow: 'rgba(79, 70, 229, 0.25)'
            },
            // Palette 9: Tropical Sunset (Light)
            {
                name: 'Tropical Sunset',
                accent: '#A21CAF',      // Deep fuchsia
                secondary: '#0D9488',   // Deep turquoise
                gradientStart: '#A21CAF',
                gradientEnd: '#0D9488',
                hover: '#86198F',
                success: '#0F766E',
                shadow: 'rgba(162, 28, 175, 0.25)'
            },
            // Palette 10: Cosmic Purple (Light)
            {
                name: 'Cosmic Purple',
                accent: '#7E22CE',      // Deep purple
                secondary: '#9333EA',   // Vivid purple
                gradientStart: '#7E22CE',
                gradientEnd: '#9333EA',
                hover: '#6B21A8',
                success: '#A855F7',
                shadow: 'rgba(126, 34, 206, 0.25)'
            },
            // Palette 11: Golden Hour (Light)
            {
                name: 'Golden Hour',
                accent: '#CA8A04',      // Deep amber
                secondary: '#EA580C',   // Bright orange
                gradientStart: '#CA8A04',
                gradientEnd: '#EA580C',
                hover: '#A16207',
                success: '#C2410C',
                shadow: 'rgba(202, 138, 4, 0.25)'
            },
            // Palette 12: Spring Meadow (Light)
            {
                name: 'Spring Meadow',
                accent: '#65A30D',      // Fresh lime
                secondary: '#16A34A',   // Vibrant green
                gradientStart: '#65A30D',
                gradientEnd: '#16A34A',
                hover: '#4D7C0F',
                success: '#15803D',
                shadow: 'rgba(101, 163, 13, 0.25)'
            },
            // Palette 13: Nordic Sky (Light)
            {
                name: 'Nordic Sky',
                accent: '#0369A1',      // Deep sky
                secondary: '#0891B2',   // Bright cyan
                gradientStart: '#0369A1',
                gradientEnd: '#0891B2',
                hover: '#075985',
                success: '#0E7490',
                shadow: 'rgba(3, 105, 161, 0.25)'
            },
            // Palette 14: Flamingo Blush (Light)
            {
                name: 'Flamingo Blush',
                accent: '#E11D48',      // Vibrant rose
                secondary: '#CA8A04',   // Rich gold
                gradientStart: '#E11D48',
                gradientEnd: '#CA8A04',
                hover: '#BE123C',
                success: '#A16207',
                shadow: 'rgba(225, 29, 72, 0.25)'
            },
            // Palette 15: Aurora Borealis (Light)
            {
                name: 'Aurora Borealis',
                accent: '#0D9488',      // Deep teal
                secondary: '#7C3AED',   // Rich violet
                gradientStart: '#0D9488',
                gradientEnd: '#7C3AED',
                hover: '#0F766E',
                success: '#6D28D9',
                shadow: 'rgba(13, 148, 136, 0.25)'
            }
        ];
    }

    /**
     * Get the day of year (1-365/366) for deterministic selection
     * Always calculates fresh - never caches
     */
    getDayOfYear() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay) + 1;
        
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
     */
    getTodayPaletteIndex() {
        const dayOfYear = this.getDayOfYear();
        const index = (dayOfYear - 1) % 15;
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Palette index:', index, 'from day of year:', dayOfYear);
        }
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
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Selected palette:', palette.name, 'Index:', index, 'Theme:', isDark ? 'dark' : 'light');
        }
        return palette;
    }

    /**
     * Apply colors to the current theme
     */
    applyDailyColors() {
        const palette = this.getTodayPalette();
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const targetElement = document.body;
        
        const dayOfYear = this.getDayOfYear();
        const paletteIndex = this.getTodayPaletteIndex();
        console.log('Applying daily colors:', palette.name, 'Theme:', isDark ? 'dark' : 'light', 'Day:', dayOfYear, 'Index:', paletteIndex);

        if (isDark) {
            // Dark theme - colors already optimized
            targetElement.style.setProperty('--accent-color', palette.accent);
            targetElement.style.setProperty('--accent-gradient-start', palette.gradientStart);
            targetElement.style.setProperty('--accent-hover', palette.hover);
            targetElement.style.setProperty('--secondary-accent', palette.secondary);
            targetElement.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            targetElement.style.setProperty('--success-color', palette.success);
            targetElement.style.setProperty('--shadow-accent', palette.shadow);
            
            targetElement.style.setProperty('--border-color', this.adjustOpacity(palette.accent, 0.2));
            targetElement.style.setProperty('--border-hover', this.adjustOpacity(palette.accent, 0.3));
            
            targetElement.style.setProperty('--badge-bg', this.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--badge-text', this.lighten(palette.accent, 0.2));
            targetElement.style.setProperty('--badge-border', this.adjustOpacity(palette.accent, 0.25));
            
            targetElement.style.setProperty('--tech-bg', this.adjustOpacity(palette.accent, 0.12));
            targetElement.style.setProperty('--tech-text', this.lighten(palette.accent, 0.3));
            targetElement.style.setProperty('--tech-border', this.adjustOpacity(palette.accent, 0.18));
            
            targetElement.style.setProperty('--hover-bg', this.adjustOpacity(palette.accent, 0.12));
            
            targetElement.style.setProperty('--contribution-hover-border', palette.accent);
            targetElement.style.setProperty('--contribution-level-0', this.adjustOpacity(palette.accent, 0.08));
            targetElement.style.setProperty('--contribution-level-1', this.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--contribution-level-2', this.adjustOpacity(palette.accent, 0.25));
            targetElement.style.setProperty('--contribution-level-3', palette.accent);
            targetElement.style.setProperty('--contribution-level-4', this.lighten(palette.accent, 0.15));
            
            targetElement.style.setProperty('--btn-text-color', '#ffffff');
        } else {
            // Light theme
            targetElement.style.setProperty('--accent-color', palette.accent);
            targetElement.style.setProperty('--accent-gradient-start', palette.gradientStart);
            targetElement.style.setProperty('--accent-hover', palette.hover);
            targetElement.style.setProperty('--secondary-accent', palette.secondary);
            targetElement.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            targetElement.style.setProperty('--success-color', palette.success);
            targetElement.style.setProperty('--shadow-accent', this.adjustOpacity(palette.accent, 0.2));
            
            targetElement.style.setProperty('--border-color', this.adjustOpacity(palette.accent, 0.2));
            targetElement.style.setProperty('--border-hover', this.adjustOpacity(palette.accent, 0.3));
            
            targetElement.style.setProperty('--badge-bg', this.adjustOpacity(palette.accent, 0.12));
            targetElement.style.setProperty('--badge-text', palette.accent);
            targetElement.style.setProperty('--badge-border', this.adjustOpacity(palette.accent, 0.25));
            
            targetElement.style.setProperty('--tech-bg', this.adjustOpacity(palette.accent, 0.08));
            targetElement.style.setProperty('--tech-text', palette.accent);
            targetElement.style.setProperty('--tech-border', this.adjustOpacity(palette.accent, 0.2));
            
            targetElement.style.setProperty('--hover-bg', this.adjustOpacity(palette.accent, 0.06));
            
            targetElement.style.setProperty('--contribution-hover-border', palette.accent);
            targetElement.style.setProperty('--contribution-level-0', this.adjustOpacity(palette.accent, 0.1));
            targetElement.style.setProperty('--contribution-level-1', this.adjustOpacity(palette.accent, 0.25));
            targetElement.style.setProperty('--contribution-level-2', this.adjustOpacity(palette.accent, 0.4));
            targetElement.style.setProperty('--contribution-level-3', palette.accent);
            targetElement.style.setProperty('--contribution-level-4', this.darken(palette.accent, 0.15));
            
            targetElement.style.setProperty('--btn-text-color', this.getContrastTextColor(palette.accent));
        }
        
        console.log('Colors applied! Accent color:', getComputedStyle(targetElement).getPropertyValue('--accent-color'));
    }

    adjustOpacity(hex, opacity) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    lighten(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.min(255, (num >> 16) + Math.round(255 * percent));
        const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent));
        const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    darken(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - Math.round(255 * percent));
        const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * percent));
        const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * percent));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    getContrastTextColor(backgroundColor) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
    }

    init() {
        console.log('Initializing daily colors - recalculating palette...');
        this.applyDailyColors();

        window.addEventListener('themeChange', () => {
            console.log('Theme changed, reapplying colors...');
            this.applyDailyColors();
        });

        this.scheduleMidnightUpdate();
    }

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
            setInterval(() => {
                console.log('Daily color update triggered');
                this.applyDailyColors();
            }, 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
        
        setInterval(() => {
            const currentDay = this.getDayOfYear();
            const storedDay = this._lastDayOfYear || currentDay;
            if (currentDay !== storedDay) {
                console.log('Day changed detected! Updating colors...', { old: storedDay, new: currentDay });
                this._lastDayOfYear = currentDay;
                this.applyDailyColors();
            }
        }, 60 * 60 * 1000);
        
        this._lastDayOfYear = this.getDayOfYear();
    }
}

// Global initialization
if (typeof window !== 'undefined') {
    window.DailyColorRotation = DailyColorRotation;
    
    window.applyDailyColorsNow = function() {
        if (window.dailyColorsInstance) {
            window.dailyColorsInstance.applyDailyColors();
        } else {
            const instance = new DailyColorRotation();
            instance.applyDailyColors();
            window.dailyColorsInstance = instance;
        }
    };
    
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

// Auto-initialize
(function() {
    let dailyColorsInstance = null;
    
    function initDailyColors() {
        if (!dailyColorsInstance) {
            const DailyColorRotationClass = typeof DailyColorRotation !== 'undefined' 
                ? DailyColorRotation 
                : (typeof window !== 'undefined' ? window.DailyColorRotation : null);
            
            if (!DailyColorRotationClass) {
                console.error('DailyColorRotation class not found');
                return;
            }
            try {
                dailyColorsInstance = new DailyColorRotationClass();
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
    
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOMContentLoaded - initializing daily colors...');
                setTimeout(initDailyColors, 200);
            });
        } else {
            console.log('DOM already loaded - initializing daily colors...');
            setTimeout(initDailyColors, 200);
        }
        
        if (typeof window !== 'undefined') {
            window.addEventListener('themeChange', () => {
                if (dailyColorsInstance) {
                    dailyColorsInstance.applyDailyColors();
                } else {
                    setTimeout(initDailyColors, 50);
                }
            });
        }
    }
})();