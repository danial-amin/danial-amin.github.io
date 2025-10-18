class HeroAnimations {
    constructor() {
        this.changingWord = document.querySelector('.changing-word');
        this.networkNodes = document.querySelectorAll('.network-node');
        this.centerNode = document.querySelector('.center-node');
        this.connectionLines = document.querySelectorAll('.connection');
        
        this.init();
    }
    
    init() {
        this.setupChangingText();
        this.setupNetworkInteractions();
        this.animateConnections();
    }
    
    setupChangingText() {
        if (!this.changingWord) return;
        
        const words = this.changingWord.getAttribute('data-words').split(',');
        let currentIndex = 0;
        
        const changeWord = () => {
            // Fade out
            this.changingWord.style.opacity = '0';
            this.changingWord.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % words.length;
                this.changingWord.textContent = words[currentIndex];
                
                // Fade in
                this.changingWord.style.opacity = '1';
                this.changingWord.style.transform = 'translateY(0)';
            }, 500);
        };
        
        // Initial setup
        this.changingWord.style.transition = 'all 0.5s ease';
        
        // Start animation
        setInterval(changeWord, 3000);
    }
    
    setupNetworkInteractions() {
        // Add click interactions to network nodes
        this.networkNodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                this.pulseNode(node);
                this.animateConnectionsToNode(index);
            });
            
            node.addEventListener('mouseenter', () => {
                this.highlightConnections(index);
            });
            
            node.addEventListener('mouseleave', () => {
                this.resetConnections();
            });
        });
        
        // Center node interaction
        if (this.centerNode) {
            this.centerNode.addEventListener('click', () => {
                this.pulseAllNodes();
            });
        }
    }
    
    pulseNode(node) {
        node.style.animation = 'none';
        setTimeout(() => {
            node.style.animation = 'micro-bounce 0.6s ease';
        }, 10);
        
        // Reset animation
        setTimeout(() => {
            node.style.animation = '';
        }, 600);
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
}

// Add the dash animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes dash {
        to {
            stroke-dashoffset: -20;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimations();
});