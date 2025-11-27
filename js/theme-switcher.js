class ThemeSwitcher {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        // Use stored theme if available, otherwise use time-based theme
        this.currentTheme = this.getStoredTheme() || this.getTimeBasedTheme();
        
        this.init();
    }
    
    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
        this.updateIcon();
    }
    
    setupEventListeners() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.getStoredTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.animateToggle();
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        this.storeTheme(theme);
        this.updateIcon();
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChange', { 
            detail: { theme } 
        }));
    }
    
    updateIcon() {
        if (this.currentTheme === 'dark') {
            this.themeIcon.textContent = '🌙';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.themeIcon.textContent = '☀️';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    animateToggle() {
        // Add click animation
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
        
        // Add rotation animation to icon
        this.themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeIcon.style.transform = 'rotate(0deg)';
        }, 300);
    }
    
    getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }
    
    storeTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // Handle localStorage not available
            console.warn('Could not save theme to localStorage');
        }
    }
    
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    getTimeBasedTheme() {
        const hour = new Date().getHours();
        // Day time: 6 AM to 8 PM (6:00 - 20:00) = light theme
        // Night time: 8 PM to 6 AM (20:00 - 6:00) = dark theme
        if (hour >= 6 && hour < 20) {
            return 'light';
        }
        return 'dark';
    }
}

// Set initial theme immediately (before DOMContentLoaded) to avoid flash
(function() {
    const storedTheme = (() => {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    })();
    
    const getTimeBasedTheme = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 20) {
            return 'light';
        }
        return 'dark';
    };
    
    const initialTheme = storedTheme || getTimeBasedTheme();
    if (document.body) {
        document.body.setAttribute('data-theme', initialTheme);
    } else {
        // If body doesn't exist yet, set it when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            document.body.setAttribute('data-theme', initialTheme);
        });
    }
})();

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeSwitcher();
});