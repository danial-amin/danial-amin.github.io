class InteractiveBackground {
    constructor() {
        this.canvas = document.getElementById('interactive-bg');
        this.ctx = this.canvas.getContext('2d');
        this.artifacts = [];
        this.networks = [];
        this.mouse = { x: 0, y: 0 };
        this.maxArtifacts = Math.floor(Math.random() * 30) + 22; // More items, now 22-51
        this.maxNetworks = Math.floor(Math.random() * 4) + 2; // 2-5 networks, also a bit more random
        this.animationId = null;

        this.themeColors = {
            light: [
                "--color-primary", // Expecting blue
                "--color-secondary", // Expecting purple
                "--color-tertiary", // Expecting pink
                "--color-accent", // Expecting green or accent
                "--color-highlight", // Any highlight
            ],
            dark: [
                "--color-primary-dark",
                "--color-secondary-dark",
                "--color-tertiary-dark",
                "--color-accent-dark",
                "--color-highlight-dark"
            ]
        };

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    getThemeColors() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const root = getComputedStyle(document.documentElement);
        const colorVars = isDark && this.themeColors.dark.some(c => root.getPropertyValue(c)) ?
            this.themeColors.dark :
            this.themeColors.light;
        // get color values from CSS variables as rgb or hex
        return colorVars
            .map((v) => root.getPropertyValue(v).trim())
            .filter((c) => !!c);
    }

    randomThemeColor(opacity = 1) {
        // Return a theme color as rgba(x,x,x,opacity) or just hex with opacity fallback if needed
        const colors = this.getThemeColors();
        if (!colors.length)
            return `rgba(59,130,246,${opacity})`; // default fallback blue

        let c = colors[Math.floor(Math.random() * colors.length)];
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
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    createArtifacts() {
        this.artifacts = [];
        const shapes = ["circle", "square", "triangle", "pentagon", "hexagon", "star"];
        const minSize = 10, maxSize = 46;
        const width = this.canvas.width, height = this.canvas.height;

        for (let i = 0; i < this.maxArtifacts; i++) {
            const type = shapes[Math.floor(Math.random() * shapes.length)];
            // Randomly scatter more towards center or edges
            let placementMode = Math.random();
            let x, y;
            if (placementMode < 0.35) { // center
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * Math.min(width, height) * 0.25;
                x = width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 20;
                y = height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 20;
            } else if (placementMode < 0.65) { // edges
                const edge = Math.floor(Math.random() * 4);
                if (edge === 0) { x = Math.random() * width; y = 0; }
                else if (edge === 1) { x = 0; y = Math.random() * height; }
                else if (edge === 2) { x = Math.random() * width; y = height; }
                else { x = width; y = Math.random() * height; }
                // Jitter
                x += (Math.random() - 0.5) * 30;
                y += (Math.random() - 0.5) * 30;
            } else { // anywhere
                x = Math.random() * width;
                y = Math.random() * height;
            }
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

    drawArtifacts() {
        this.artifacts.forEach((artifact) => {
            this.ctx.save();

            // Move to artifact position
            this.ctx.translate(artifact.x, artifact.y);
            this.ctx.rotate(artifact.rotation);

            // Set color (use gradient only for circles/stars for more visual variety; use fill otherwise)
            let fillStyle;
            if (artifact.type === "circle" || artifact.type === "star") {
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
            } else if (artifact.type === 'star') {
                this.ctx.beginPath();
                const spikes = 5, outerRadius = artifact.size / 2, innerRadius = artifact.size / 4;
                for (let i = 0; i < spikes * 2; i++) {
                    const radius = i % 2 === 0 ? outerRadius : innerRadius;
                    const angle = Math.PI / 2 + (i * Math.PI) / spikes;
                    this.ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
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