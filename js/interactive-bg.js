class InteractiveBackground {
    constructor() {
        this.canvas = document.getElementById('interactive-bg');
        this.ctx = this.canvas.getContext('2d');
        this.artifacts = [];
        this.networks = [];
        this.topographicalLines = [];
        this.meshes = [];
        this.mouse = { x: 0, y: 0 };
        this.maxArtifacts = Math.floor(Math.random() * 30) + 22; // More items, now 22-51
        this.maxNetworks = Math.floor(Math.random() * 4) + 2; // 2-5 networks, also a bit more random
        this.maxTopographicalLines = Math.floor(Math.random() * 8) + 5; // 5-12 topographical lines
        this.maxMeshes = Math.floor(Math.random() * 6) + 3; // 3-8 meshes
        this.animationId = null;

        // Theme colors are now handled dynamically using --text-primary

        this.init();
        this.setupEventListeners();
        this.animate();
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
    }

    createArtifacts() {
        this.artifacts = [];
        const shapes = ["circle", "square", "triangle", "pentagon", "hexagon"];
        const minSize = 10, maxSize = 46;
        const width = this.canvas.width, height = this.canvas.height;

        for (let i = 0; i < this.maxArtifacts; i++) {
            const type = shapes[Math.floor(Math.random() * shapes.length)];
            // Truly random placement across entire background
            const x = Math.random() * width;
            const y = Math.random() * height;
            // artifact properties with more randomness
            this.artifacts.push({
                x: x,
                y: y,
                originalX: 0,
                originalY: 0,
                size: Math.random() * (maxSize - minSize) + minSize,
                type: type,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.022,
                opacity: Math.random() * 0.5 + 0.08,
                wobbleAmount: Math.random() * 54 + 18,
                speed: Math.random() * 0.6 + 0.06,
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