class HeroAnimations {
    constructor() {
        this.changingWord = document.querySelector('.changing-word');
        this.networkNodes = document.querySelectorAll('.network-node');
        this.centerNode = document.querySelector('.center-node');
        this.connectionLines = document.querySelectorAll('.connection');
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        console.log('HeroAnimations initializing...');
        console.log('Network nodes found:', this.networkNodes.length);
        console.log('Center node found:', !!this.centerNode);
        console.log('Connection lines found:', this.connectionLines.length);
        
        this.setupChangingText();
        this.setupNetworkInteractions();
        this.animateConnections();
        this.setupIntersectionObserver();
    }
    
    setupChangingText() {
        if (!this.changingWord) return;
        
        const words = this.changingWord.getAttribute('data-words').split(',');
        let currentIndex = 0;
        
        const changeWord = () => {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            // Enhanced fade out with rotation
            this.changingWord.style.opacity = '0';
            this.changingWord.style.transform = 'translateY(20px) rotateX(90deg)';
            this.changingWord.style.filter = 'blur(5px)';
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % words.length;
                this.changingWord.textContent = words[currentIndex];
                
                // Enhanced fade in with bounce
                this.changingWord.style.opacity = '1';
                this.changingWord.style.transform = 'translateY(0) rotateX(0deg)';
                this.changingWord.style.filter = 'blur(0px)';
                
                // Add a subtle bounce effect
                setTimeout(() => {
                    this.changingWord.style.transform = 'translateY(-5px)';
                    setTimeout(() => {
                        this.changingWord.style.transform = 'translateY(0)';
                        this.isAnimating = false;
                    }, 150);
                }, 100);
            }, 400);
        };
        
        // Enhanced initial setup
        this.changingWord.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        this.changingWord.style.transformOrigin = 'center';
        
        // Start animation with longer interval for better readability
        setInterval(changeWord, 4000);
    }
    
    setupNetworkInteractions() {
        // Enhanced click interactions to network nodes
        this.networkNodes.forEach((node, index) => {
            node.addEventListener('click', (e) => {
                e.preventDefault();
                this.pulseNode(node);
                this.animateConnectionsToNode(index);
                this.showNodeDetails(node, index);
            });
            
            node.addEventListener('mouseenter', () => {
                this.highlightConnections(index);
                this.addNodeGlow(node);
            });
            
            node.addEventListener('mouseleave', () => {
                this.resetConnections();
                this.removeNodeGlow(node);
            });
        });
        
        // Enhanced center node interaction
        if (this.centerNode) {
            this.centerNode.addEventListener('click', (e) => {
                e.preventDefault();
                this.pulseAllNodes();
                this.animateAllConnections();
            });
        }
    }
    
    pulseNode(node) {
        // Enhanced pulse with ripple effect
        node.style.animation = 'none';
        node.style.transform = 'scale(1)';
        
        setTimeout(() => {
            node.style.animation = 'node-pulse 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            this.createRippleEffect(node);
        }, 10);
        
        // Reset animation
        setTimeout(() => {
            node.style.animation = '';
        }, 800);
    }
    
    pulseAllNodes() {
        this.networkNodes.forEach((node, index) => {
            setTimeout(() => {
                this.pulseNode(node);
            }, index * 100);
        });
        
        // Animate all connections
        this.connectionLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.strokeWidth = '4';
                line.style.opacity = '1';
                
                setTimeout(() => {
                    line.style.strokeWidth = '2';
                    line.style.opacity = '0.4';
                }, 300);
            }, index * 50);
        });
    }
    
    highlightConnections(nodeIndex) {
        this.connectionLines.forEach((line, index) => {
            if (index === nodeIndex) {
                line.style.strokeWidth = '3';
                line.style.opacity = '0.8';
                line.style.stroke = 'var(--secondary-accent)';
            } else {
                line.style.opacity = '0.2';
            }
        });
    }
    
    resetConnections() {
        this.connectionLines.forEach(line => {
            line.style.strokeWidth = '2';
            line.style.opacity = '0.4';
            line.style.stroke = 'var(--accent-color)';
        });
    }
    
    animateConnectionsToNode(nodeIndex) {
        const targetLine = this.connectionLines[nodeIndex];
        if (targetLine) {
            // Create a pulse effect along the line
            targetLine.style.strokeDasharray = '5 5';
            targetLine.style.strokeDashoffset = '10';
            targetLine.style.animation = 'dash 1s linear';
            
            setTimeout(() => {
                targetLine.style.strokeDasharray = '';
                targetLine.style.strokeDashoffset = '';
                targetLine.style.animation = '';
            }, 1000);
        }
    }
    
    animateConnections() {
        // Continuous subtle animation for connections
        this.connectionLines.forEach((line, index) => {
            const delay = index * 0.5;
            line.style.animationDelay = `${delay}s`;
        });
    }
    
    // New enhanced methods
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startNetworkAnimations();
                } else {
                    this.pauseNetworkAnimations();
                }
            });
        }, { threshold: 0.3 });
        
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            observer.observe(heroVisual);
        }
    }
    
    startNetworkAnimations() {
        this.networkNodes.forEach((node, index) => {
            node.style.animationPlayState = 'running';
        });
        this.connectionLines.forEach(line => {
            line.style.animationPlayState = 'running';
        });
    }
    
    pauseNetworkAnimations() {
        this.networkNodes.forEach(node => {
            node.style.animationPlayState = 'paused';
        });
        this.connectionLines.forEach(line => {
            line.style.animationPlayState = 'paused';
        });
    }
    
    addNodeGlow(node) {
        node.style.boxShadow = '0 0 30px var(--shadow-accent), 0 0 60px rgba(59, 130, 246, 0.3)';
        node.style.borderColor = 'var(--accent-color)';
    }
    
    removeNodeGlow(node) {
        node.style.boxShadow = '';
        node.style.borderColor = '';
    }
    
    showNodeDetails(node, index) {
        const skill = node.getAttribute('data-skill');
        console.log(`Selected: ${skill}`);
        // You can add more detailed interactions here
    }
    
    createRippleEffect(node) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: var(--accent-color);
            opacity: 0.6;
            transform: scale(0);
            animation: ripple 0.8s linear;
            pointer-events: none;
            z-index: 1;
        `;
        
        const rect = node.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.marginLeft = ripple.style.marginTop = -(size / 2) + 'px';
        
        node.style.position = 'relative';
        node.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }
    
    animateAllConnections() {
        this.connectionLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.strokeWidth = '4';
                line.style.opacity = '1';
                line.style.filter = 'drop-shadow(0 0 8px var(--accent-color))';
                
                setTimeout(() => {
                    line.style.strokeWidth = '2';
                    line.style.opacity = '0.3';
                    line.style.filter = 'drop-shadow(0 0 3px var(--accent-color))';
                }, 600);
            }, index * 100);
        });
    }
}

// Add enhanced animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes dash {
        to {
            stroke-dashoffset: -20;
        }
    }
    
    @keyframes node-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 0.6;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes micro-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimations();
});