class ProjectsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.activeFilter = 'all';
        
        this.init();
    }
    
    init() {
        console.log('Projects filter initialized');
        console.log('Filter buttons found:', this.filterButtons.length);
        console.log('Project cards found:', this.projectCards.length);
        this.setupFilterButtons();
        this.addProjectStyles();
    }
    
    setupFilterButtons() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.setActiveFilter(filter);
                this.filterProjects(filter);
            });
        });
    }
    
    setActiveFilter(filter) {
        this.activeFilter = filter;
        
        console.log('Setting active filter to:', filter);
        
        // Update button states
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
            console.log('Removed active from:', button.textContent);
        });
        
        const activeButton = document.querySelector(`[data-filter="${filter}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            console.log('Added active to:', activeButton.textContent);
        } else {
            console.log('No button found for filter:', filter);
        }
    }
    
    filterProjects(filter) {
        this.projectCards.forEach((card, index) => {
            const categories = card.getAttribute('data-category') || '';
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                this.showProject(card, index);
            } else {
                this.hideProject(card);
            }
        });
    }
    
    showProject(card, index) {
        card.style.display = 'block';
        
        // Add staggered animation
        setTimeout(() => {
            card.classList.add('fade-in-up');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    }
    
    hideProject(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.display = 'none';
            card.classList.remove('fade-in-up');
        }, 300);
    }
    
    addProjectStyles() {
        // Add initial styles for smooth transitions
        this.projectCards.forEach(card => {
            card.style.transition = 'all 0.3s ease';
        });
    }
}

// Initialize projects filter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsFilter();
});