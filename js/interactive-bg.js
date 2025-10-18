class InteractiveBackground {
    constructor() {
        this.canvas = document.getElementById('interactive-bg');
        this.ctx = this.canvas.getContext('2d');
        this.artifacts = [];
        this.networks = [];
        this.mouse = { x: 0, y: 0 };
        this.maxArtifacts = 12;
        this.maxNetworks = 3;
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
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
        
        // Create geometric shapes
        for (let i = 0; i < this.maxArtifacts; i++) {
            const type = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)];
            this.artifacts.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                originalX: 0,
                originalY: 0,
                size: Math.random() * 30 + 15,
                type: type,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.015,
                opacity: Math.random() * 0.4 + 0.1,
                wobbleAmount: Math.random() * 40 + 20,
                speed: Math.random() * 0.3 + 0.1
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
            const centerX = Math.random() * this.canvas.width;
            const centerY = Math.random() * this.canvas.height;
            const nodeCount = Math.floor(Math.random() * 4) + 3; // 3-6 nodes
            const nodes = [];
            
            // Create nodes around the center
            for (let j = 0; j < nodeCount; j++) {
                const angle = (j / nodeCount) * Math.PI * 2;
                const radius = Math.random() * 80 + 60;
                nodes.push({
                    x: centerX + Math.cos(angle) * radius,
                    y: centerY + Math.sin(angle) * radius,
                    originalX: centerX + Math.cos(angle) * radius,
                    originalY: centerY + Math.sin(angle) * radius,
                    size: Math.random() * 8 + 4,
                    angle: angle,
                    radius: radius,
                    centerX: centerX,
                    centerY: centerY
                });
            }
            
            this.networks.push({
                centerX: centerX,
                centerY: centerY,
                originalCenterX: centerX,
                originalCenterY: centerY,
                nodes: nodes,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                opacity: Math.random() * 0.3 + 0.2,
                wobbleAmount: Math.random() * 30 + 15
            });
        }
    }
    
    updateArtifacts() {
        this.artifacts.forEach(artifact => {
            // Gentle floating animation
            artifact.y += Math.sin(Date.now() * 0.001 + artifact.originalX * 0.01) * 0.2;
            artifact.x += Math.cos(Date.now() * 0.0008 + artifact.originalY * 0.01) * 0.15;
            
            // Mouse interaction - subtle wobble
            const dx = this.mouse.x - artifact.x;
            const dy = this.mouse.y - artifact.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                const force = (120 - distance) / 120;
                const wobbleX = Math.sin(Date.now() * 0.008) * force * artifact.wobbleAmount * 0.25;
                const wobbleY = Math.cos(Date.now() * 0.008) * force * artifact.wobbleAmount * 0.25;
                
                artifact.x = artifact.originalX + wobbleX;
                artifact.y = artifact.originalY + wobbleY;
            } else {
                // Return to original position slowly
                artifact.x += (artifact.originalX - artifact.x) * 0.015;
                artifact.y += (artifact.originalY - artifact.y) * 0.015;
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
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                const wobbleX = Math.sin(Date.now() * 0.006) * force * network.wobbleAmount;
                const wobbleY = Math.cos(Date.now() * 0.006) * force * network.wobbleAmount;
                
                network.centerX = network.originalCenterX + wobbleX;
                network.centerY = network.originalCenterY + wobbleY;
            } else {
                // Return to original position
                network.centerX += (network.originalCenterX - network.centerX) * 0.02;
                network.centerY += (network.originalCenterY - network.centerY) * 0.02;
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
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const primaryColor = isDark ? '59, 130, 246' : '59, 130, 246'; // Blue
        const secondaryColor = isDark ? '139, 92, 246' : '139, 92, 246'; // Purple
        const tertiaryColor = isDark ? '236, 72, 153' : '236, 72, 153'; // Pink
        
        this.artifacts.forEach((artifact, index) => {
            this.ctx.save();
            
            // Move to artifact position
            this.ctx.translate(artifact.x, artifact.y);
            this.ctx.rotate(artifact.rotation);
            
            // Create gradient
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, artifact.size);
            let color;
            if (index % 3 === 0) color = primaryColor;
            else if (index % 3 === 1) color = secondaryColor;
            else color = tertiaryColor;
            
            gradient.addColorStop(0, `rgba(${color}, ${artifact.opacity})`);
            gradient.addColorStop(1, `rgba(${color}, 0)`);
            
            if (artifact.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, artifact.size / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            } else if (artifact.type === 'square') {
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(-artifact.size / 2, -artifact.size / 2, artifact.size, artifact.size);
            } else if (artifact.type === 'triangle') {
                this.ctx.beginPath();
                this.ctx.moveTo(0, -artifact.size / 2);
                this.ctx.lineTo(-artifact.size / 2, artifact.size / 2);
                this.ctx.lineTo(artifact.size / 2, artifact.size / 2);
                this.ctx.closePath();
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }
    
    drawNetworks() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const networkColor = isDark ? '34, 197, 94' : '34, 197, 94'; // Green
        
        this.networks.forEach(network => {
            // Draw connections to center
            network.nodes.forEach(node => {
                this.ctx.beginPath();
                this.ctx.moveTo(network.centerX, network.centerY);
                this.ctx.lineTo(node.x, node.y);
                this.ctx.strokeStyle = `rgba(${networkColor}, ${network.opacity * 0.6})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            });
            
            // Draw connections between nodes
            for (let i = 0; i < network.nodes.length; i++) {
                for (let j = i + 1; j < network.nodes.length; j++) {
                    const node1 = network.nodes[i];
                    const node2 = network.nodes[j];
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(node1.x, node1.y);
                    this.ctx.lineTo(node2.x, node2.y);
                    this.ctx.strokeStyle = `rgba(${networkColor}, ${network.opacity * 0.3})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
            
            // Draw center node
            this.ctx.beginPath();
            this.ctx.arc(network.centerX, network.centerY, 6, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${networkColor}, ${network.opacity})`;
            this.ctx.fill();
            
            // Draw outer nodes
            network.nodes.forEach(node => {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${networkColor}, ${network.opacity * 0.8})`;
                this.ctx.fill();
            });
        });
    }
    
    drawConnections() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const lineColor = isDark ? '59, 130, 246' : '59, 130, 246';
        
        // Draw subtle connections between nearby artifacts
        for (let i = 0; i < this.artifacts.length; i++) {
            for (let j = i + 1; j < this.artifacts.length; j++) {
                const a1 = this.artifacts[i];
                const a2 = this.artifacts[j];
                
                const dx = a1.x - a2.x;
                const dy = a1.y - a2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.08;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(a1.x, a1.y);
                    this.ctx.lineTo(a2.x, a2.y);
                    this.ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw everything
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