/**
 * Surprise Button Handler
 * Randomly changes color palette and background animation preset
 */

class SurpriseHandler {
    constructor() {
        this.surpriseButton = document.getElementById('surprise-toggle');
        this.init();
    }

    init() {
        if (!this.surpriseButton) {
            console.warn('Surprise button not found');
            return;
        }
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.surpriseButton.addEventListener('click', () => {
            this.triggerSurprise();
        });
    }

    /**
     * Get a random palette index (0-14)
     */
    getRandomPaletteIndex() {
        return Math.floor(Math.random() * 15);
    }

    /**
     * Get a random preset index (0-14)
     */
    getRandomPresetIndex() {
        return Math.floor(Math.random() * 15);
    }

    /**
     * Apply a specific color palette by index
     */
    applyPaletteByIndex(index) {
        if (!window.dailyColorsInstance) {
            console.warn('DailyColors instance not found');
            return;
        }

        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const palettes = isDark ? window.dailyColorsInstance.colorPalettesDark : window.dailyColorsInstance.colorPalettesLight;
        
        if (index < 0 || index >= palettes.length) {
            console.warn('Invalid palette index:', index);
            return;
        }

        const palette = palettes[index];
        const targetElement = document.body;

        if (isDark) {
            targetElement.style.setProperty('--accent-color', palette.accent);
            targetElement.style.setProperty('--accent-gradient-start', palette.gradientStart);
            targetElement.style.setProperty('--accent-hover', palette.hover);
            targetElement.style.setProperty('--secondary-accent', palette.secondary);
            targetElement.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            targetElement.style.setProperty('--success-color', palette.success);
            targetElement.style.setProperty('--shadow-accent', palette.shadow);
            
            targetElement.style.setProperty('--border-color', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.2));
            targetElement.style.setProperty('--border-hover', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.3));
            
            targetElement.style.setProperty('--badge-bg', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--badge-text', window.dailyColorsInstance.lighten(palette.accent, 0.2));
            targetElement.style.setProperty('--badge-border', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.25));
            
            targetElement.style.setProperty('--tech-bg', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.12));
            targetElement.style.setProperty('--tech-text', window.dailyColorsInstance.lighten(palette.accent, 0.3));
            targetElement.style.setProperty('--tech-border', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.18));
            
            targetElement.style.setProperty('--hover-bg', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.12));
            
            targetElement.style.setProperty('--contribution-hover-border', palette.accent);
            targetElement.style.setProperty('--contribution-level-0', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.08));
            targetElement.style.setProperty('--contribution-level-1', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.15));
            targetElement.style.setProperty('--contribution-level-2', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.25));
            targetElement.style.setProperty('--contribution-level-3', palette.accent);
            targetElement.style.setProperty('--contribution-level-4', window.dailyColorsInstance.lighten(palette.accent, 0.15));
            
            targetElement.style.setProperty('--btn-text-color', '#ffffff');
        } else {
            targetElement.style.setProperty('--accent-color', palette.accent);
            targetElement.style.setProperty('--accent-gradient-start', palette.gradientStart);
            targetElement.style.setProperty('--accent-hover', palette.hover);
            targetElement.style.setProperty('--secondary-accent', palette.secondary);
            targetElement.style.setProperty('--accent-gradient-end', palette.gradientEnd);
            targetElement.style.setProperty('--success-color', palette.success);
            targetElement.style.setProperty('--shadow-accent', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.2));
            
            targetElement.style.setProperty('--border-color', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.2));
            targetElement.style.setProperty('--border-hover', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.3));
            
            targetElement.style.setProperty('--badge-bg', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.12));
            targetElement.style.setProperty('--badge-text', palette.accent);
            targetElement.style.setProperty('--badge-border', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.25));
            
            targetElement.style.setProperty('--tech-bg', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.08));
            targetElement.style.setProperty('--tech-text', palette.accent);
            targetElement.style.setProperty('--tech-border', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.2));
            
            targetElement.style.setProperty('--hover-bg', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.06));
            
            targetElement.style.setProperty('--contribution-hover-border', palette.accent);
            targetElement.style.setProperty('--contribution-level-0', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.1));
            targetElement.style.setProperty('--contribution-level-1', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.25));
            targetElement.style.setProperty('--contribution-level-2', window.dailyColorsInstance.adjustOpacity(palette.accent, 0.4));
            targetElement.style.setProperty('--contribution-level-3', palette.accent);
            targetElement.style.setProperty('--contribution-level-4', window.dailyColorsInstance.darken(palette.accent, 0.15));
            
            targetElement.style.setProperty('--btn-text-color', window.dailyColorsInstance.getContrastTextColor(palette.accent));
        }

        console.log('Applied surprise palette:', palette.name, 'Index:', index);
    }

    /**
     * Apply a specific background preset by index
     */
    applyPresetByIndex(index) {
        if (!window.interactiveBg) {
            console.warn('InteractiveBackground instance not found');
            return;
        }

        const bg = window.interactiveBg;
        const presets = [
            // Preset 0: Geometric Shapes
            {
                name: 'Geometric Shapes',
                objectTypes: ['artifacts', 'networks'],
                maxArtifacts: 30,
                maxNetworks: 4,
                maxTopographicalLines: 0,
                maxMeshes: 0,
                allowedShapes: ['circle', 'square', 'triangle'],
                animationStyle: 'smooth'
            },
            // Preset 1: Topographical Lines
            {
                name: 'Topographical Lines',
                objectTypes: ['topographicalLines'],
                maxArtifacts: 0,
                maxNetworks: 0,
                maxTopographicalLines: 12,
                maxMeshes: 0,
                allowedShapes: [],
                animationStyle: 'flowing'
            },
            // Preset 2: Network Connections
            {
                name: 'Network Connections',
                objectTypes: ['networks'],
                maxArtifacts: 0,
                maxNetworks: 8,
                maxTopographicalLines: 0,
                maxMeshes: 0,
                allowedShapes: [],
                animationStyle: 'network'
            },
            // Preset 3: Mesh Grids
            {
                name: 'Mesh Grids',
                objectTypes: ['meshes'],
                maxArtifacts: 0,
                maxNetworks: 0,
                maxTopographicalLines: 0,
                maxMeshes: 8,
                allowedShapes: [],
                animationStyle: 'mesh'
            },
            // Preset 4: Shapes + Topography
            {
                name: 'Shapes + Topography',
                objectTypes: ['artifacts', 'topographicalLines'],
                maxArtifacts: 25,
                maxNetworks: 0,
                maxTopographicalLines: 8,
                maxMeshes: 0,
                allowedShapes: ['circle', 'triangle', 'hexagon'],
                animationStyle: 'organic'
            },
            // Preset 5: Networks + Meshes
            {
                name: 'Networks + Meshes',
                objectTypes: ['networks', 'meshes'],
                maxArtifacts: 0,
                maxNetworks: 5,
                maxTopographicalLines: 0,
                maxMeshes: 6,
                allowedShapes: [],
                animationStyle: 'grid'
            },
            // Preset 6: Complex Polygons
            {
                name: 'Complex Polygons',
                objectTypes: ['artifacts'],
                maxArtifacts: 35,
                maxNetworks: 0,
                maxTopographicalLines: 0,
                maxMeshes: 0,
                allowedShapes: ['pentagon', 'hexagon'],
                animationStyle: 'angular'
            },
            // Preset 7: Flowing Topography
            {
                name: 'Flowing Topography',
                objectTypes: ['topographicalLines', 'artifacts'],
                maxArtifacts: 20,
                maxNetworks: 0,
                maxTopographicalLines: 15,
                maxMeshes: 0,
                allowedShapes: ['circle'],
                animationStyle: 'flowing'
            },
            // Preset 8: Dense Networks
            {
                name: 'Dense Networks',
                objectTypes: ['networks', 'artifacts'],
                maxArtifacts: 15,
                maxNetworks: 10,
                maxTopographicalLines: 0,
                maxMeshes: 0,
                allowedShapes: ['circle', 'square'],
                animationStyle: 'network'
            },
            // Preset 9: Mesh Patterns
            {
                name: 'Mesh Patterns',
                objectTypes: ['meshes', 'artifacts'],
                maxArtifacts: 18,
                maxNetworks: 0,
                maxTopographicalLines: 0,
                maxMeshes: 10,
                allowedShapes: ['square'],
                animationStyle: 'mesh'
            },
            // Preset 10: Simple Circles
            {
                name: 'Simple Circles',
                objectTypes: ['artifacts'],
                maxArtifacts: 40,
                maxNetworks: 0,
                maxTopographicalLines: 0,
                maxMeshes: 0,
                allowedShapes: ['circle'],
                animationStyle: 'circular'
            },
            // Preset 11: Angular Shapes
            {
                name: 'Angular Shapes',
                objectTypes: ['artifacts', 'networks'],
                maxArtifacts: 32,
                maxNetworks: 3,
                maxTopographicalLines: 0,
                maxMeshes: 0,
                allowedShapes: ['triangle', 'square', 'pentagon'],
                animationStyle: 'angular'
            },
            // Preset 12: All Elements
            {
                name: 'All Elements',
                objectTypes: ['artifacts', 'networks', 'topographicalLines', 'meshes'],
                maxArtifacts: 25,
                maxNetworks: 4,
                maxTopographicalLines: 6,
                maxMeshes: 4,
                allowedShapes: ['circle', 'square', 'triangle', 'pentagon', 'hexagon'],
                animationStyle: 'balanced'
            },
            // Preset 13: Minimal Lines
            {
                name: 'Minimal Lines',
                objectTypes: ['topographicalLines'],
                maxArtifacts: 0,
                maxNetworks: 0,
                maxTopographicalLines: 5,
                maxMeshes: 0,
                allowedShapes: [],
                animationStyle: 'minimal'
            },
            // Preset 14: Geometric Networks
            {
                name: 'Geometric Networks',
                objectTypes: ['artifacts', 'networks', 'meshes'],
                maxArtifacts: 28,
                maxNetworks: 6,
                maxTopographicalLines: 0,
                maxMeshes: 5,
                allowedShapes: ['circle', 'hexagon'],
                animationStyle: 'complex'
            }
        ];

        if (index < 0 || index >= presets.length) {
            console.warn('Invalid preset index:', index);
            return;
        }

        const preset = presets[index];
        
        // Update preset
        bg.dailyPreset = preset;
        bg.objectTypes = preset.objectTypes;
        bg.maxArtifacts = preset.maxArtifacts;
        bg.maxNetworks = preset.maxNetworks;
        bg.maxTopographicalLines = preset.maxTopographicalLines;
        bg.maxMeshes = preset.maxMeshes;
        bg.allowedShapes = preset.allowedShapes;
        bg.animationStyle = preset.animationStyle;
        
        // Clear existing objects
        bg.artifacts = [];
        bg.networks = [];
        bg.topographicalLines = [];
        bg.meshes = [];
        
        // Create new objects based on preset
        if (bg.objectTypes.includes('artifacts')) {
            bg.createArtifacts();
        }
        if (bg.objectTypes.includes('networks')) {
            bg.createNetworks();
        }
        if (bg.objectTypes.includes('topographicalLines')) {
            bg.createTopographicalLines();
        }
        if (bg.objectTypes.includes('meshes')) {
            bg.createMeshes();
        }

        console.log('Applied surprise preset:', preset.name, 'Index:', index);
    }

    /**
     * Trigger the surprise - randomly change colors and background
     */
    triggerSurprise() {
        // Animate button
        this.animateButton();

        // Get random indices
        const paletteIndex = this.getRandomPaletteIndex();
        const presetIndex = this.getRandomPresetIndex();

        console.log('🎲 Surprise! Changing to palette:', paletteIndex, 'and preset:', presetIndex);

        // Apply new palette
        this.applyPaletteByIndex(paletteIndex);

        // Apply new preset
        this.applyPresetByIndex(presetIndex);
    }

    /**
     * Animate the surprise button on click
     */
    animateButton() {
        const icon = this.surpriseButton.querySelector('.surprise-icon');
        
        // Scale animation
        this.surpriseButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.surpriseButton.style.transform = 'scale(1)';
        }, 150);

        // Rotation animation
        if (icon) {
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0deg)';
            }, 400);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to initialize
    setTimeout(() => {
        new SurpriseHandler();
    }, 500);
});
