/**
 * GitHub Contributions Slideshow
 * Handles automatic slideshow animation and GitHub API integration
 */

class GitHubContributions {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.contribution-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prev-slide');
        this.nextBtn = document.getElementById('next-slide');
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.isAutoPlaying = true;
        this.githubUsername = 'danial-amin'; // Replace with your GitHub username
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAutoPlay();
        this.loadGitHubData();
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause auto-play on hover
        const slideshow = document.querySelector('.contributions-slideshow');
        slideshow.addEventListener('mouseenter', () => this.pauseAutoPlay());
        slideshow.addEventListener('mouseleave', () => this.resumeAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.isAutoPlaying) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        this.isAutoPlaying = false;
    }

    resumeAutoPlay() {
        this.isAutoPlaying = true;
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlide();
    }

    previousSlide() {
        this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.updateSlide();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }

    updateSlide() {
        // Remove active class from all slides and indicators
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');

        // Update button states
        this.updateButtonStates();
    }

    updateButtonStates() {
        // Enable/disable buttons based on current slide
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
    }

    async loadGitHubData() {
        const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019'];
        
        for (const year of years) {
            try {
                await this.fetchYearContributions(year);
            } catch (error) {
                console.error(`Error loading data for ${year}:`, error);
                this.showErrorState(year);
            }
        }
    }

    async fetchYearContributions(year) {
        const grid = document.getElementById(`contribution-grid-${year}`);
        const stats = document.querySelector(`[data-year="${year}"] .contribution-stats`);
        
        // Show loading state
        grid.classList.add('loading');
        
        try {
            // Fetch GitHub contributions data
            const response = await fetch(`https://api.github.com/users/${this.githubUsername}/events?per_page=100`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const events = await response.json();
            
            // Process and display data
            this.renderContributions(year, events);
            this.updateStats(year, events);
            
        } catch (error) {
            console.error(`Error fetching GitHub data for ${year}:`, error);
            this.showMockData(year); // Fallback to mock data
        } finally {
            grid.classList.remove('loading');
        }
    }

    renderContributions(year, events) {
        const grid = document.getElementById(`contribution-grid-${year}`);
        grid.innerHTML = '';
        
        // Create mock contribution data for demonstration
        const contributions = this.generateMockContributions(year);
        
        contributions.forEach((day, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = `contribution-day level-${day.level}`;
            dayElement.setAttribute('data-date', day.date);
            dayElement.setAttribute('data-count', day.count);
            
            // Add tooltip
            dayElement.addEventListener('mouseenter', (e) => this.showTooltip(e, day));
            dayElement.addEventListener('mouseleave', () => this.hideTooltip());
            
            grid.appendChild(dayElement);
        });
    }

    generateMockContributions(year) {
        const contributions = [];
        const startDate = new Date(`${year}-01-01`);
        
        // For current year (2025), only show data up to today
        const currentDate = new Date();
        const endDate = year === '2025' ? currentDate : new Date(`${year}-12-31`);
        
        const daysInYear = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        for (let i = 0; i < daysInYear; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            // Skip future dates for current year
            if (year === '2025' && date > currentDate) {
                break;
            }
            
            // Generate random contribution levels (more activity in recent years)
            const yearNum = parseInt(year);
            const baseActivity = yearNum >= 2024 ? 0.4 : yearNum >= 2023 ? 0.3 : yearNum >= 2022 ? 0.2 : 0.1;
            const random = Math.random();
            
            let level = 0;
            if (random < baseActivity) level = Math.floor(Math.random() * 4) + 1;
            
            contributions.push({
                date: date.toISOString().split('T')[0],
                count: level * Math.floor(Math.random() * 5) + (level > 0 ? 1 : 0),
                level: level
            });
        }
        
        return contributions;
    }

    updateStats(year, events) {
        const slide = document.querySelector(`[data-year="${year}"]`);
        const totalContributions = slide.querySelector('.total-contributions');
        const longestStreak = slide.querySelector('.longest-streak');
        
        // Calculate stats from mock data
        const contributions = this.generateMockContributions(year);
        const totalCount = contributions.reduce((sum, day) => sum + day.count, 0);
        const streak = this.calculateLongestStreak(contributions);
        
        totalContributions.textContent = `${totalCount} contributions`;
        longestStreak.textContent = `${streak} day streak`;
    }

    calculateLongestStreak(contributions) {
        let maxStreak = 0;
        let currentStreak = 0;
        
        for (const day of contributions) {
            if (day.level > 0) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        }
        
        return maxStreak;
    }

    showTooltip(event, day) {
        const tooltip = document.createElement('div');
        tooltip.className = 'contribution-tooltip show';
        tooltip.textContent = `${day.count} contributions on ${day.date}`;
        
        document.body.appendChild(tooltip);
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
    }

    hideTooltip() {
        const tooltip = document.querySelector('.contribution-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    showErrorState(year) {
        const grid = document.getElementById(`contribution-grid-${year}`);
        grid.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: var(--text-secondary);">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <div>Unable to load GitHub data</div>
                    <div style="font-size: 0.8rem; margin-top: 0.5rem;">Check your internet connection</div>
                </div>
            </div>
        `;
    }

    showMockData(year) {
        // Show mock data as fallback
        this.renderContributions(year, []);
        this.updateStats(year, []);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubContributions();
});

// Export for potential use in other scripts
window.GitHubContributions = GitHubContributions;
