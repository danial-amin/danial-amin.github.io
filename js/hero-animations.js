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
            
            // Simple fade out
            this.changingWord.style.opacity = '0';
            this.changingWord.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % words.length;
                this.changingWord.textContent = words[currentIndex];
                
                // Simple fade in
                this.changingWord.style.opacity = '1';
                this.changingWord.style.transform = 'translateY(0)';
                
                setTimeout(() => {
                    this.isAnimating = false;
                }, 300);
            }, 300);
        };
        
        // Change word every 3 seconds
        setInterval(changeWord, 3000);
    }
    
    setupNetworkInteractions() {
        // Simple hover effects for network nodes
        this.networkNodes.forEach((node, index) => {
            node.addEventListener('mouseenter', () => {
                this.addNodeGlow(node);
            });
            
            node.addEventListener('mouseleave', () => {
                this.removeNodeGlow(node);
            });
        });
        
        // Simple center node interaction
        if (this.centerNode) {
            this.centerNode.addEventListener('click', (e) => {
                e.preventDefault();
                // Simple scale effect
                this.centerNode.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.centerNode.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }
    
    addNodeGlow(node) {
        node.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.3), 0 0 30px var(--accent-color)';
    }
    
    removeNodeGlow(node) {
        node.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 20px var(--accent-color)';
    }
    
    animateConnections() {
        // Simple connection animation
        this.connectionLines.forEach((line, index) => {
            line.style.animationDelay = `${index * 0.5}s`;
        });
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                } else {
                    entry.target.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe network elements
        this.networkNodes.forEach(node => observer.observe(node));
        if (this.centerNode) observer.observe(this.centerNode);
        this.connectionLines.forEach(line => observer.observe(line));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimations();
});