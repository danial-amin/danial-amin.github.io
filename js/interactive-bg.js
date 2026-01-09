class InteractiveBackground {
    constructor() {
        this.canvas = document.getElementById('interactive-bg');
        this.ctx = this.canvas.getContext('2d');
        this.artifacts = [];
        this.networks = [];
        this.topographicalLines = [];
        this.meshes = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;

        // Get daily animation preset
        this.dailyPreset = this.getDailyAnimationPreset();
        
        // Use preset values instead of random
        this.maxArtifacts = this.dailyPreset.maxArtifacts;
        this.maxNetworks = this.dailyPreset.maxNetworks;
        this.maxTopographicalLines = this.dailyPreset.maxTopographicalLines;
        this.maxMeshes = this.dailyPreset.maxMeshes;
        this.allowedShapes = this.dailyPreset.allowedShapes;
        this.animationStyle = this.dailyPreset.animationStyle;

        // Theme colors are now handled dynamically using --text-primary

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * Get day of year (1-365/366) for deterministic selection
     */
    getDayOfYear() {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay) + 1;
    }

    /**
     * Get today's animation preset index (0-14)
     */
    getTodayPresetIndex() {
        const dayOfYear = this.getDayOfYear();
        return (dayOfYear - 1) % 15;
    }

    /**
     * Get daily animation preset based on day of year
     * Each preset defines which shapes to show, counts, and animation styles
     */
    getDailyAnimationPreset() {
        const index = this.getTodayPresetIndex();
        const presets = [
            // Preset 0: Geometric Focus - Circles and squares with networks
            {
                name: 'Geometric Focus',
                maxArtifacts: 28,
                maxNetworks: 4,
                maxTopographicalLines: 6,
                maxMeshes: 4,
                allowedShapes: ['circle', 'square'],
                animationStyle: 'smooth'
            },
            // Preset 1: Organic Flow - Triangles and hexagons with topographical lines
            {
                name: 'Organic Flow',
                maxArtifacts: 35,
                maxNetworks: 2,
                maxTopographicalLines: 10,
                maxMeshes: 3,
                allowedShapes: ['triangle', 'hexagon'],
                animationStyle: 'flowing'
            },
            // Preset 2: Minimal Network - Few artifacts, more networks
            {
                name: 'Minimal Network',
                maxArtifacts: 18,
                maxNetworks: 6,
                maxTopographicalLines: 4,
                maxMeshes: 5,
                allowedShapes: ['circle', 'pentagon'],
                animationStyle: 'network'
            },
            // Preset 3: Complex Mesh - Many meshes and artifacts
            {
                name: 'Complex Mesh',
                maxArtifacts: 32,
                maxNetworks: 3,
                maxTopographicalLines: 7,
                maxMeshes: 8,
                allowedShapes: ['square', 'hexagon', 'triangle'],
                animationStyle: 'mesh'
            },
            // Preset 4: Topographic Landscape - Heavy on topographical lines
            {
                name: 'Topographic Landscape',
                maxArtifacts: 25,
                maxNetworks: 2,
                maxTopographicalLines: 12,
                maxMeshes: 2,
                allowedShapes: ['circle', 'triangle'],
                animationStyle: 'topographic'
            },
            // Preset 5: Balanced Mix - All shapes, balanced elements
            {
                name: 'Balanced Mix',
                maxArtifacts: 30,
                maxNetworks: 4,
                maxTopographicalLines: 8,
                maxMeshes: 5,
                allowedShapes: ['circle', 'square', 'triangle', 'pentagon', 'hexagon'],
                animationStyle: 'balanced'
            },
            // Preset 6: Sparse Elegance - Fewer elements, more space
            {
                name: 'Sparse Elegance',
                maxArtifacts: 20,
                maxNetworks: 2,
                maxTopographicalLines: 5,
                maxMeshes: 3,
                allowedShapes: ['circle', 'pentagon'],
                animationStyle: 'elegant'
            },
            // Preset 7: Dense Patterns - Many elements, rich patterns
            {
                name: 'Dense Patterns',
                maxArtifacts: 40,
                maxNetworks: 5,
                maxTopographicalLines: 9,
                maxMeshes: 6,
                allowedShapes: ['square', 'hexagon', 'triangle'],
                animationStyle: 'dense'
            },
            // Preset 8: Circular Harmony - Only circles
            {
                name: 'Circular Harmony',
                maxArtifacts: 35,
                maxNetworks: 3,
                maxTopographicalLines: 6,
                maxMeshes: 4,
                allowedShapes: ['circle'],
                animationStyle: 'circular'
            },
            // Preset 9: Angular Dynamics - Triangles, squares, pentagons
            {
                name: 'Angular Dynamics',
                maxArtifacts: 32,
                maxNetworks: 4,
                maxTopographicalLines: 7,
                maxMeshes: 5,
                allowedShapes: ['triangle', 'square', 'pentagon'],
                animationStyle: 'angular'
            },
            // Preset 10: Hexagonal Grid - Hexagons and meshes
            {
                name: 'Hexagonal Grid',
                maxArtifacts: 28,
                maxNetworks: 3,
                maxTopographicalLines: 5,
                maxMeshes: 7,
                allowedShapes: ['hexagon'],
                animationStyle: 'grid'
            },
            // Preset 11: Network Central - Networks dominate
            {
                name: 'Network Central',
                maxArtifacts: 22,
                maxNetworks: 7,
                maxTopographicalLines: 4,
                maxMeshes: 3,
                allowedShapes: ['circle', 'square', 'triangle'],
                animationStyle: 'network'
            },
            // Preset 12: Organic Topography - Topographical lines with organic shapes
            {
                name: 'Organic Topography',
                maxArtifacts: 30,
                maxNetworks: 2,
                maxTopographicalLines: 11,
                maxMeshes: 2,
                allowedShapes: ['circle', 'triangle', 'hexagon'],
                animationStyle: 'organic'
            },
            // Preset 13: Minimalist - Very few elements
            {
                name: 'Minimalist',
                maxArtifacts: 15,
                maxNetworks: 1,
                maxTopographicalLines: 3,
                maxMeshes: 2,
                allowedShapes: ['circle', 'square'],
                animationStyle: 'minimal'
            },
            // Preset 14: Maximum Complexity - All elements, high counts
            {
                name: 'Maximum Complexity',
                maxArtifacts: 45,
                maxNetworks: 6,
                maxTopographicalLines: 10,
                maxMeshes: 7,
                allowedShapes: ['circle', 'square', 'triangle', 'pentagon', 'hexagon'],
                animationStyle: 'complex'
            }
        ];

        const preset = presets[index];
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Daily animation preset:', preset.name, 'Index:', index, 'Day of year:', this.getDayOfYear());
        }
        return preset;
    }

    getThemeColors() {
        const root = getComputedStyle(document.documentElement);
        // Use neutral background object color
        const bgObjectColor = root.getPropertyValue('--bg-object-color').trim();
        return bgObjectColor ? [bgObjectColor] : ['#9ca3af']; // fallback neutral grey
    }

    randomThemeColor(opacity = 1) {
        // Return the theme's text-primary color with specified opacity
        const colors = this.getThemeColors();
        if (!colors.length)
            return `rgba(59,130,246,${opacity})`; // default fallback blue

        let c = colors[0]; // Use the single text-primary color
        if (c.startsWith('rgb')) {
            // rgb/rgba already
            if (opacity < 1 && c.startsWith('rgb(')) {
                c = c.replace('rgb(', `rgba(`).replace(')', `,${opacity})`);
                return c;
            }
            if (opacity < 1 && c.startsWith('rgba(')) {
                // Replace existing alpha
                c = c.replace(/rgba\([^,]+,[^,]+,[^,]+,[^)]+\)/, match => {
                    const parts = match.split(",");
                    return `rgba(${parts[0].split("(")[1]},${parts[1]},${parts[2]},${opacity})`;
                });
                return c;
            }
            return c;
        } else if (c.startsWith("#")) {
            // Convert hex to rgba
            let hex = c.replace("#", "");
            if (hex.length === 3) {
                hex = hex.split("").map(x => x + x).join("");
            }
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r},${g},${b},${opacity})`;
        }
        return c;
    }

    init() {
        this.resizeCanvas();
        this.createArtifacts();
        this.createNetworks();
        this.createTopographicalLines();
        this.createMeshes();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            // Re-get daily preset on resize (in case day changed)
            this.dailyPreset = this.getDailyAnimationPreset();
            this.maxArtifacts = this.dailyPreset.maxArtifacts;
            this.maxNetworks = this.dailyPreset.maxNetworks;
            this.maxTopographicalLines = this.dailyPreset.maxTopographicalLines;
            this.maxMeshes = this.dailyPreset.maxMeshes;
            this.allowedShapes = this.dailyPreset.allowedShapes;
            this.animationStyle = this.dailyPreset.animationStyle;
            this.createArtifacts();
            this.createNetworks();
            this.createTopographicalLines();
            this.createMeshes();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Listen for theme changes and recreate objects with new colors
        window.addEventListener('themeChange', () => {
            this.createArtifacts();
            this.createNetworks();
            this.createTopographicalLines();
            this.createMeshes();
        });

        // Check for day changes (similar to daily colors)
        this.checkDayChange();
    }

    /**
     * Check if day has changed and update animation preset
     */
    checkDayChange() {
        this._lastDayOfYear = this.getDayOfYear();
        
        setInterval(() => {
            const currentDay = this.getDayOfYear();
            if (currentDay !== this._lastDayOfYear) {
                console.log('Day changed! Updating animation preset...', { 
                    old: this._lastDayOfYear, 
                    new: currentDay 
                });
                this._lastDayOfYear = currentDay;
                
                // Update preset
                this.dailyPreset = this.getDailyAnimationPreset();
                this.maxArtifacts = this.dailyPreset.maxArtifacts;
                this.maxNetworks = this.dailyPreset.maxNetworks;
                this.maxTopographicalLines = this.dailyPreset.maxTopographicalLines;
                this.maxMeshes = this.dailyPreset.maxMeshes;
                this.allowedShapes = this.dailyPreset.allowedShapes;
                this.animationStyle = this.dailyPreset.animationStyle;
                
                // Recreate all elements with new preset
                this.createArtifacts();
                this.createNetworks();
                this.createTopographicalLines();
                this.createMeshes();
            }
        }, 60 * 60 * 1000); // Check every hour
    }

    createArtifacts() {
        this.artifacts = [];
        // Use allowed shapes from daily preset, fallback to all if not set
        const shapes = this.allowedShapes || ["circle", "square", "triangle", "pentagon", "hexagon"];
        const minSize = 10, maxSize = 46;
        const width = this.canvas.width, height = this.canvas.height;

        for (let i = 0; i < this.maxArtifacts; i++) {
            // Select from allowed shapes only
            const type = shapes[Math.floor(Math.random() * shapes.length)];
            // Truly random placement across entire background
            const x = Math.random() * width;
            const y = Math.random() * height;
            // Adjust animation properties based on daily preset style
            let rotationSpeedMultiplier = 1;
            let speedMultiplier = 1;
            let wobbleMultiplier = 1;
            
            switch(this.animationStyle) {
                case 'smooth':
                    rotationSpeedMultiplier = 0.8;
                    speedMultiplier = 0.7;
                    wobbleMultiplier = 0.9;
                    break;
                case 'flowing':
                    rotationSpeedMultiplier = 1.2;
                    speedMultiplier = 1.3;
                    wobbleMultiplier = 1.2;
                    break;
                case 'network':
                    rotationSpeedMultiplier = 0.6;
                    speedMultiplier = 0.5;
                    wobbleMultiplier = 0.7;
                    break;
                case 'mesh':
                    rotationSpeedMultiplier = 1.0;
                    speedMultiplier = 1.0;
                    wobbleMultiplier = 1.0;
                    break;
                case 'topographic':
                    rotationSpeedMultiplier = 0.9;
                    speedMultiplier = 0.8;
                    wobbleMultiplier = 1.1;
                    break;
                case 'balanced':
                    rotationSpeedMultiplier = 1.0;
                    speedMultiplier = 1.0;
                    wobbleMultiplier = 1.0;
                    break;
                case 'elegant':
                    rotationSpeedMultiplier = 0.5;
                    speedMultiplier = 0.4;
                    wobbleMultiplier = 0.6;
                    break;
                case 'dense':
                    rotationSpeedMultiplier = 1.3;
                    speedMultiplier = 1.4;
                    wobbleMultiplier = 1.3;
                    break;
                case 'circular':
                    rotationSpeedMultiplier = 1.1;
                    speedMultiplier = 1.0;
                    wobbleMultiplier = 1.0;
                    break;
                case 'angular':
                    rotationSpeedMultiplier = 1.2;
                    speedMultiplier = 1.1;
                    wobbleMultiplier = 1.1;
                    break;
                case 'grid':
                    rotationSpeedMultiplier = 0.7;
                    speedMultiplier = 0.6;
                    wobbleMultiplier = 0.8;
                    break;
                case 'organic':
                    rotationSpeedMultiplier = 1.1;
                    speedMultiplier = 1.2;
                    wobbleMultiplier = 1.2;
                    break;
                case 'minimal':
                    rotationSpeedMultiplier = 0.4;
                    speedMultiplier = 0.3;
                    wobbleMultiplier = 0.5;
                    break;
                case 'complex':
                    rotationSpeedMultiplier = 1.4;
                    speedMultiplier = 1.5;
                    wobbleMultiplier = 1.4;
                    break;
            }
            
            // artifact properties with daily preset adjustments
            this.artifacts.push({
                x: x,
                y: y,
                originalX: 0,
                originalY: 0,
                size: Math.random() * (maxSize - minSize) + minSize,
                type: type,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.022 * rotationSpeedMultiplier,
                opacity: Math.random() * 0.5 + 0.08,
                wobbleAmount: (Math.random() * 54 + 18) * wobbleMultiplier,
                speed: (Math.random() * 0.6 + 0.06) * speedMultiplier,
                colorOpacity: Math.random() * 0.7 + 0.2,
                color: this.randomThemeColor(Math.random() * 0.6 + 0.35)
            });
        }
        // Store original positions
        this.artifacts.forEach(artifact => {
            artifact.originalX = artifact.x;
            artifact.originalY = artifact.y;
        });
    }

    createNetworks() {
        this.networks = [];
        for (let i = 0; i < this.maxNetworks; i++) {
            // More random center positions including offscreen;
            const scatter = Math.random();
            let centerX, centerY;
            if (scatter < 0.4) {
                centerX = (Math.random() * 0.7 + 0.15) * this.canvas.width;
                centerY = (Math.random() * 0.7 + 0.1) * this.canvas.height;
            } else {
                centerX = Math.random() * this.canvas.width * 1.1 - this.canvas.width * 0.05;
                centerY = Math.random() * this.canvas.height * 1.1 - this.canvas.height * 0.05;
            }
            const nodeCount = Math.floor(Math.random() * 6) + 3; // 3-8 nodes, more variety
            const nodes = [];

            for (let j = 0; j < nodeCount; j++) {
                const angle = Math.random() * Math.PI * 2; // random angles! not even spiral
                const radius = Math.random() * 120 + 36; // more range, and not even
                nodes.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    originalX: centerX + Math.cos(angle) * radius,
                    originalY: centerY + Math.sin(angle) * radius,
                    size: Math.random() * 12 + 3,
                    angle: angle,
                    radius: radius,
                    centerX: centerX,
                    centerY: centerY,
                    color: this.randomThemeColor(Math.random() * 0.6 + 0.32)
                });
            }

            this.networks.push({
                centerX: centerX,
                centerY: centerY,
                originalCenterX: centerX,
                originalCenterY: centerY,
                nodes: nodes,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.014,
                opacity: Math.random() * 0.33 + 0.21,
                wobbleAmount: Math.random() * 34 + 9,
                color: this.randomThemeColor(Math.random() * 0.7 + 0.3)
            });
        }
    }

    createTopographicalLines() {
        this.topographicalLines = [];
        const width = this.canvas.width;
        const height = this.canvas.height;

        for (let i = 0; i < this.maxTopographicalLines; i++) {
            const centerX = Math.random() * width;
            const centerY = Math.random() * height;
            const radius = Math.random() * Math.min(width, height) * 0.3 + 50;
            const segments = Math.floor(Math.random() * 8) + 12; // 12-19 segments
            const points = [];

            // Create irregular contour line
            for (let j = 0; j < segments; j++) {
                const angle = (j / segments) * Math.PI * 2;
                const variation = (Math.random() - 0.5) * radius * 0.3;
                const currentRadius = radius + variation;
                
                points.push({
                    x: centerX + Math.cos(angle) * currentRadius,
                    y: centerY + Math.sin(angle) * currentRadius
                });
            }

            this.topographicalLines.push({
                points: points,
                color: this.randomThemeColor(Math.random() * 0.3 + 0.1),
                opacity: Math.random() * 0.4 + 0.1,
                lineWidth: Math.random() * 1.5 + 0.5,
                animationOffset: Math.random() * Math.PI * 2
            });
        }
    }

    createMeshes() {
        this.meshes = [];
        const width = this.canvas.width;
        const height = this.canvas.height;

        for (let i = 0; i < this.maxMeshes; i++) {
            const centerX = Math.random() * width;
            const centerY = Math.random() * height;
            const meshSize = Math.random() * 200 + 100;
            const gridDensity = Math.floor(Math.random() * 8) + 6; // 6-13 grid points
            const gridPoints = [];

            // Create grid points
            for (let x = 0; x < gridDensity; x++) {
                for (let y = 0; y < gridDensity; y++) {
                    const offsetX = (x / (gridDensity - 1) - 0.5) * meshSize;
                    const offsetY = (y / (gridDensity - 1) - 0.5) * meshSize;
                    const jitterX = (Math.random() - 0.5) * meshSize * 0.1;
                    const jitterY = (Math.random() - 0.5) * meshSize * 0.1;
                    
                    gridPoints.push({
                        x: centerX + offsetX + jitterX,
                        y: centerY + offsetY + jitterY,
                        originalX: centerX + offsetX + jitterX,
                        originalY: centerY + offsetY + jitterY
                    });
                }
            }

            this.meshes.push({
                centerX: centerX,
                centerY: centerY,
                originalCenterX: centerX,
                originalCenterY: centerY,
                gridPoints: gridPoints,
                gridDensity: gridDensity,
                color: this.randomThemeColor(Math.random() * 0.4 + 0.2),
                opacity: Math.random() * 0.3 + 0.1,
                wobbleAmount: Math.random() * 20 + 10,
                animationOffset: Math.random() * Math.PI * 2
            });
        }
    }

    updateArtifacts() {
        this.artifacts.forEach(artifact => {
            // More random floating animation (with random period/depth)
            const time = Date.now();
            artifact.y += Math.sin(time * artifact.speed * 0.0008 + artifact.originalX * 0.017) * 0.3;
            artifact.x += Math.cos(time * artifact.speed * 0.0004 + artifact.originalY * 0.017) * 0.3;

            // Mouse interaction - subtle wobble
            const dx = this.mouse.x - artifact.x;
            const dy = this.mouse.y - artifact.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120 + artifact.size) {
                const force = (120 + artifact.size - distance) / (120 + artifact.size);
                const t = time * 0.005;
                const wobbleX = Math.sin(t) * force * artifact.wobbleAmount * 0.3;
                const wobbleY = Math.cos(t * 0.7) * force * artifact.wobbleAmount * 0.3;

                artifact.x = artifact.originalX + wobbleX;
                artifact.y = artifact.originalY + wobbleY;
            } else {
                // Return to original position slowly
                artifact.x += (artifact.originalX - artifact.x) * 0.012;
                artifact.y += (artifact.originalY - artifact.y) * 0.012;
            }

            // Update rotation
            artifact.rotation += artifact.rotationSpeed;

            // Wrap around screen
            if (artifact.originalX < -artifact.size) artifact.originalX = this.canvas.width + artifact.size;
            if (artifact.originalX > this.canvas.width + artifact.size) artifact.originalX = -artifact.size;
            if (artifact.originalY < -artifact.size) artifact.originalY = this.canvas.height + artifact.size;
            if (artifact.originalY > this.canvas.height + artifact.size) artifact.originalY = -artifact.size;
        });
    }

    updateNetworks() {
        this.networks.forEach(network => {
            // Mouse interaction with network center
            const dx = this.mouse.x - network.centerX;
            const dy = this.mouse.y - network.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 170) {
                const force = (170 - distance) / 170;
                const t = Date.now() * 0.004;
                const wobbleX = Math.sin(t + network.centerX * 0.0021) * force * network.wobbleAmount;
                const wobbleY = Math.cos(t * 0.8 + network.centerY * 0.003) * force * network.wobbleAmount;

                network.centerX = network.originalCenterX + wobbleX;
                network.centerY = network.originalCenterY + wobbleY;
            } else {
                network.centerX += (network.originalCenterX - network.centerX) * 0.032;
                network.centerY += (network.originalCenterY - network.centerY) * 0.032;
            }

            // Update network rotation
            network.rotation += network.rotationSpeed;

            // Update node positions based on center and rotation
            network.nodes.forEach(node => {
                const rotatedAngle = node.angle + network.rotation;
                node.x = network.centerX + Math.cos(rotatedAngle) * node.radius;
                node.y = network.centerY + Math.sin(rotatedAngle) * node.radius;
            });

            // Wrap around screen
            if (network.originalCenterX < -100) network.originalCenterX = this.canvas.width + 100;
            if (network.originalCenterX > this.canvas.width + 100) network.originalCenterX = -100;
            if (network.originalCenterY < -100) network.originalCenterY = this.canvas.height + 100;
            if (network.originalCenterY > this.canvas.height + 100) network.originalCenterY = -100;
        });
    }

    updateTopographicalLines() {
        this.topographicalLines.forEach(line => {
            const time = Date.now() * 0.001;
            line.points.forEach((point, index) => {
                const wave = Math.sin(time + line.animationOffset + index * 0.1) * 2;
                point.x += wave * 0.1;
                point.y += Math.cos(time + line.animationOffset + index * 0.1) * 1.5;
            });
        });
    }

    updateMeshes() {
        this.meshes.forEach(mesh => {
            // Mouse interaction with mesh center
            const dx = this.mouse.x - mesh.centerX;
            const dy = this.mouse.y - mesh.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                const t = Date.now() * 0.003;
                const wobbleX = Math.sin(t + mesh.centerX * 0.001) * force * mesh.wobbleAmount;
                const wobbleY = Math.cos(t * 0.7 + mesh.centerY * 0.001) * force * mesh.wobbleAmount;

                mesh.centerX = mesh.originalCenterX + wobbleX;
                mesh.centerY = mesh.originalCenterY + wobbleY;
            } else {
                mesh.centerX += (mesh.originalCenterX - mesh.centerX) * 0.02;
                mesh.centerY += (mesh.originalCenterY - mesh.centerY) * 0.02;
            }

            // Update grid points based on center movement
            mesh.gridPoints.forEach((point, index) => {
                const gridX = Math.floor(index / mesh.gridDensity);
                const gridY = index % mesh.gridDensity;
                const offsetX = (gridX / (mesh.gridDensity - 1) - 0.5) * 200;
                const offsetY = (gridY / (mesh.gridDensity - 1) - 0.5) * 200;
                
                point.x = mesh.centerX + offsetX;
                point.y = mesh.centerY + offsetY;
            });
        });
    }

    drawArtifacts() {
        this.artifacts.forEach((artifact) => {
            this.ctx.save();

            // Move to artifact position
            this.ctx.translate(artifact.x, artifact.y);
            this.ctx.rotate(artifact.rotation);

            // Set color (use gradient only for circles for more visual variety; use fill otherwise)
            let fillStyle;
            if (artifact.type === "circle") {
                const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, artifact.size);
                gradient.addColorStop(0, this.randomThemeColor(Math.min(1.0, artifact.colorOpacity)));
                gradient.addColorStop(1, this.randomThemeColor(0.01 + Math.random() * 0.03));
                fillStyle = gradient;
            } else {
                fillStyle = artifact.color; // already random color in rgba
            }
            this.ctx.globalAlpha = Math.min(1, artifact.opacity);

            if (artifact.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, artifact.size / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
            } else if (artifact.type === 'square') {
                this.ctx.fillStyle = fillStyle;
                this.ctx.fillRect(-artifact.size / 2, -artifact.size / 2, artifact.size, artifact.size);
            } else if (artifact.type === 'triangle') {
                this.ctx.beginPath();
                this.ctx.moveTo(0, -artifact.size / 2);
                this.ctx.lineTo(-artifact.size / 2, artifact.size / 2);
                this.ctx.lineTo(artifact.size / 2, artifact.size / 2);
                this.ctx.closePath();
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
            } else if (artifact.type === 'pentagon') {
                this.ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = Math.PI / 2 + i * (2 * Math.PI / 5);
                    const x = Math.cos(angle) * artifact.size / 2;
                    const y = Math.sin(angle) * artifact.size / 2;
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
            } else if (artifact.type === 'hexagon') {
                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = Math.PI / 6 + i * (2 * Math.PI / 6);
                    const x = Math.cos(angle) * artifact.size / 2;
                    const y = Math.sin(angle) * artifact.size / 2;
                    if (i === 0) this.ctx.moveTo(x, y);
                    else this.ctx.lineTo(x, y);
                }
                this.ctx.closePath();
                this.ctx.fillStyle = fillStyle;
                this.ctx.fill();
            }

            this.ctx.globalAlpha = 1;
            this.ctx.restore();
        });
    }

    drawNetworks() {
        this.networks.forEach(network => {
            // Draw connections to center
            network.nodes.forEach(node => {
                this.ctx.beginPath();
                this.ctx.moveTo(network.centerX, network.centerY);
                this.ctx.lineTo(node.x, node.y);
                this.ctx.strokeStyle = network.color;
                this.ctx.globalAlpha = network.opacity * 0.68;
                this.ctx.lineWidth = 1.2;
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
            });

            // Draw connections between nodes (lighter)
            for (let i = 0; i < network.nodes.length; i++) {
                for (let j = i + 1; j < network.nodes.length; j++) {
                    const node1 = network.nodes[i];
                    const node2 = network.nodes[j];
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.strokeStyle = node1.color;
                    this.ctx.globalAlpha = network.opacity * 0.19;
                    this.ctx.lineWidth = 0.7;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                }
            }

            // Draw center node
            this.ctx.beginPath();
            this.ctx.arc(network.centerX, network.centerY, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = network.color;
            this.ctx.globalAlpha = network.opacity * 0.92;
            this.ctx.fill();
            this.ctx.globalAlpha = 1;

            // Draw outer nodes (slightly more opacity/variety)
            network.nodes.forEach(node => {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                this.ctx.fillStyle = node.color;
                this.ctx.globalAlpha = network.opacity * 0.82;
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
            });
        });
    }

    drawTopographicalLines() {
        this.topographicalLines.forEach(line => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = line.color;
            this.ctx.globalAlpha = line.opacity;
            this.ctx.lineWidth = line.lineWidth;
            
            // Draw the contour line
            this.ctx.moveTo(line.points[0].x, line.points[0].y);
            for (let i = 1; i < line.points.length; i++) {
                this.ctx.lineTo(line.points[i].x, line.points[i].y);
            }
            this.ctx.closePath();
            this.ctx.stroke();
            
            this.ctx.globalAlpha = 1;
        });
    }

    drawMeshes() {
        this.meshes.forEach(mesh => {
            this.ctx.strokeStyle = mesh.color;
            this.ctx.globalAlpha = mesh.opacity;
            this.ctx.lineWidth = 0.8;

            // Draw horizontal grid lines
            for (let y = 0; y < mesh.gridDensity; y++) {
                this.ctx.beginPath();
                for (let x = 0; x < mesh.gridDensity; x++) {
                    const index = y * mesh.gridDensity + x;
                    const point = mesh.gridPoints[index];
                    if (x === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                }
                this.ctx.stroke();
            }

            // Draw vertical grid lines
            for (let x = 0; x < mesh.gridDensity; x++) {
                this.ctx.beginPath();
                for (let y = 0; y < mesh.gridDensity; y++) {
                    const index = y * mesh.gridDensity + x;
                    const point = mesh.gridPoints[index];
                    if (y === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                }
                this.ctx.stroke();
            }

            // Draw grid points
            mesh.gridPoints.forEach(point => {
                this.ctx.beginPath();
                this.ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
                this.ctx.fillStyle = mesh.color;
                this.ctx.globalAlpha = mesh.opacity * 1.5;
                this.ctx.fill();
            });

            this.ctx.globalAlpha = 1;
        });
    }

    drawConnections() {
        // Draw subtle connections between nearby artifacts with random color from the theme
        for (let i = 0; i < this.artifacts.length; i++) {
            for (let j = i + 1; j < this.artifacts.length; j++) {
                const a1 = this.artifacts[i];
                const a2 = this.artifacts[j];

                const dx = a1.x - a2.x;
                const dy = a1.y - a2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 140) {
                    const opacity = ((140 - distance) / 140) * 0.11;
                    this.ctx.beginPath();
                    this.ctx.moveTo(a1.x, a1.y);
                    this.ctx.lineTo(a2.x, a2.y);
                    this.ctx.strokeStyle = this.randomThemeColor(opacity + 0.03);
                    this.ctx.lineWidth = 0.45;
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateArtifacts();
        this.updateNetworks();
        this.updateTopographicalLines();
        this.updateMeshes();

        this.drawTopographicalLines();
        this.drawMeshes();
        this.drawConnections();
        this.drawArtifacts();
        this.drawNetworks();

        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeCanvas);
        window.removeEventListener('mousemove', this.updateMouse);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveBackground();
});