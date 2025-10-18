class InteractiveBackground {
    constructor() {
        this.canvas = document.getElementById('interactive-bg');
        this.ctx = this.canvas.getContext('2d');
        this.artifacts = [];
        this.mouse = { x: 0, y: 0 };
        this.maxArtifacts = 15;
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createArtifacts();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createArtifacts();
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
            const type = Math.random() < 0.5 ? 'circle' : 'square';
            this.artifacts.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                originalX: 0,
                originalY: 0,
                size: Math.random() * 40 + 20,
                type: type,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                opacity: Math.random() * 0.3 + 0.1,
                wobbleAmount: Math.random() * 50 + 30,
                speed: Math.random() * 0.5 + 0.2
            });
        }
        
        // Store original positions
        this.artifacts.forEach(artifact => {
            artifact.originalX = artifact.x;
            artifact.originalY = artifact.y;
        });
    }
    
    updateArtifacts() {
        this.artifacts.forEach(artifact => {
            // Gentle floating animation
            artifact.y += Math.sin(Date.now() * 0.001 + artifact.originalX * 0.01) * 0.3;
            artifact.x += Math.cos(Date.now() * 0.0008 + artifact.originalY * 0.01) * 0.2;
            
            // Mouse interaction - subtle wobble
            const dx = this.mouse.x - artifact.x;
            const dy = this.mouse.y - artifact.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                const wobbleX = Math.sin(Date.now() * 0.01) * force * artifact.wobbleAmount * 0.3;
                const wobbleY = Math.cos(Date.now() * 0.01) * force * artifact.wobbleAmount * 0.3;
                
                artifact.x = artifact.originalX + wobbleX;
                artifact.y = artifact.originalY + wobbleY;
            } else {
                // Return to original position slowly
                artifact.x += (artifact.originalX - artifact.x) * 0.02;
                artifact.y += (artifact.originalY - artifact.y) * 0.02;
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
    
    drawArtifacts() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const primaryColor = isDark ? '59, 130, 246' : '59, 130, 246'; // Blue
        const secondaryColor = isDark ? '139, 92, 246' : '139, 92, 246'; // Purple
        
        this.artifacts.forEach((artifact, index) => {
            this.ctx.save();
            
            // Move to artifact position
            this.ctx.translate(artifact.x, artifact.y);
            this.ctx.rotate(artifact.rotation);
            
            // Create gradient
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, artifact.size);
            const useSecondary = index % 3 === 0;
            const color = useSecondary ? secondaryColor : primaryColor;
            
            gradient.addColorStop(0, `rgba(${color}, ${artifact.opacity})`);
            gradient.addColorStop(1, `rgba(${color}, 0)`);
            
            if (artifact.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, artifact.size / 2, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            } else {
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(-artifact.size / 2, -artifact.size / 2, artifact.size, artifact.size);
            }
            
            this.ctx.restore();
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
                
                if (distance < 200) {
                    const opacity = (200 - distance) / 200 * 0.1;
                    
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
        this.drawConnections();
        this.drawArtifacts();
        
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