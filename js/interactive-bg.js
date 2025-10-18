class InteractiveBackground {
    constructor() {
        this.canvas = document.getElementById('interactive-bg');
        this.ctx = this.canvas.getContext('2d');
        this.lines = [];
        this.mouse = { x: 0, y: 0 };
        this.particles = [];
        this.maxLines = 100;
        this.maxParticles = 50;
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        this.resizeCanvas();
        this.createInitialLines();
        this.createParticles();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createInitialLines();
        });
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createMouseLine();
        });
        
        window.addEventListener('click', (e) => {
            this.createClickEffect(e.clientX, e.clientY);
        });
    }
    
    createInitialLines() {
        this.lines = [];
        for (let i = 0; i < 20; i++) {
            this.lines.push({
                x1: Math.random() * this.canvas.width,
                y1: Math.random() * this.canvas.height,
                x2: Math.random() * this.canvas.width,
                y2: Math.random() * this.canvas.height,
                opacity: Math.random() * 0.3 + 0.1,
                speed: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2,
                length: Math.random() * 100 + 50,
                life: 1,
                decay: Math.random() * 0.01 + 0.005
            });
        }
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                life: 1,
                decay: Math.random() * 0.005 + 0.002
            });
        }
    }
    
    createMouseLine() {
        if (this.lines.length > this.maxLines) return;
        
        const angle = Math.random() * Math.PI * 2;
        const length = Math.random() * 150 + 100;
        
        this.lines.push({
            x1: this.mouse.x,
            y1: this.mouse.y,
            x2: this.mouse.x + Math.cos(angle) * length,
            y2: this.mouse.y + Math.sin(angle) * length,
            opacity: 0.6,
            speed: Math.random() * 1 + 0.5,
            angle: angle,
            length: length,
            life: 1,
            decay: 0.02,
            isMouseLine: true
        });
    }
    
    createClickEffect(x, y) {
        // Create burst of lines
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const length = Math.random() * 80 + 40;
            
            this.lines.push({
                x1: x,
                y1: y,
                x2: x + Math.cos(angle) * length,
                y2: y + Math.sin(angle) * length,
                opacity: 0.8,
                speed: Math.random() * 2 + 1,
                angle: angle,
                length: length,
                life: 1,
                decay: 0.03,
                isClickEffect: true
            });
        }
        
        // Create particles
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                size: Math.random() * 4 + 2,
                opacity: 0.8,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1,
                decay: 0.02,
                isClickEffect: true
            });
        }
    }
    
    updateLines() {
        for (let i = this.lines.length - 1; i >= 0; i--) {
            const line = this.lines[i];
            
            // Update position based on angle and speed
            line.x1 += Math.cos(line.angle) * line.speed;
            line.y1 += Math.sin(line.angle) * line.speed;
            line.x2 += Math.cos(line.angle) * line.speed;
            line.y2 += Math.sin(line.angle) * line.speed;
            
            // Apply mouse attraction for regular lines
            if (!line.isMouseLine && !line.isClickEffect) {
                const dx = this.mouse.x - line.x1;
                const dy = this.mouse.y - line.y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const force = (200 - distance) / 200 * 0.02;
                    line.x1 += dx * force;
                    line.y1 += dy * force;
                    line.x2 += dx * force;
                    line.y2 += dy * force;
                }
            }
            
            // Update life
            line.life -= line.decay;
            line.opacity = line.life * (line.isMouseLine ? 0.6 : line.isClickEffect ? 0.8 : 0.3);
            
            // Remove dead lines
            if (line.life <= 0 || 
                line.x1 < -100 || line.x1 > this.canvas.width + 100 ||
                line.y1 < -100 || line.y1 > this.canvas.height + 100) {
                this.lines.splice(i, 1);
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Apply mouse attraction
            if (!particle.isClickEffect) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150 * 0.01;
                    particle.vx += dx * force;
                    particle.vy += dy * force;
                }
            }
            
            // Add friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Update life
            particle.life -= particle.decay;
            particle.opacity = particle.life * (particle.isClickEffect ? 0.8 : 0.5);
            
            // Wrap around screen for regular particles
            if (!particle.isClickEffect) {
                if (particle.x < 0) particle.x = this.canvas.width;
                if (particle.x > this.canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = this.canvas.height;
                if (particle.y > this.canvas.height) particle.y = 0;
                
                // Reset life for wrapped particles
                if (particle.life <= 0) {
                    particle.life = 1;
                    particle.opacity = Math.random() * 0.5 + 0.2;
                }
            } else {
                // Remove click effect particles when dead
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }
    }
    
    drawLines() {
        // Get theme colors
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const baseColor = isDark ? '59, 130, 246' : '59, 130, 246'; // Blue
        
        this.lines.forEach(line => {
            if (line.opacity > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(line.x1, line.y1);
                this.ctx.lineTo(line.x2, line.y2);
                
                // Create gradient for lines
                const gradient = this.ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
                gradient.addColorStop(0, `rgba(${baseColor}, ${line.opacity})`);
                gradient.addColorStop(0.5, `rgba(${baseColor}, ${line.opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(${baseColor}, 0)`);
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = line.isClickEffect ? 2 : line.isMouseLine ? 1.5 : 1;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
            }
        });
    }
    
    drawParticles() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const baseColor = isDark ? '59, 130, 246' : '59, 130, 246';
        
        this.particles.forEach(particle => {
            if (particle.opacity > 0) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                
                // Create radial gradient for particles
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size
                );
                gradient.addColorStop(0, `rgba(${baseColor}, ${particle.opacity})`);
                gradient.addColorStop(1, `rgba(${baseColor}, 0)`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.fill();
            }
        });
    }
    
    drawConnections() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const baseColor = isDark ? '59, 130, 246' : '59, 130, 246';
        
        // Draw connections between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (100 - distance) / 100 * 0.1;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
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
        this.updateLines();
        this.updateParticles();
        
        this.drawConnections();
        this.drawLines();
        this.drawParticles();
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeCanvas);
        window.removeEventListener('mousemove', this.updateMouse);
        window.removeEventListener('click', this.createClickEffect);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveBackground();
});