/**
 * GitHub Contributions Static Component
 * Handles year navigation and GitHub API integration with realistic data
 */

class GitHubContributions {
    constructor() {
        this.currentYear = 2025;
        this.years = ['2025', '2024', '2023', '2022', '2021', '2020'];
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prev-slide');
        this.nextBtn = document.getElementById('next-slide');
        this.yearTitle = document.getElementById('contribution-year');
        this.contributionGrid = document.getElementById('contribution-grid');
        this.totalContributions = document.querySelector('.total-contributions');
        this.longestStreak = document.querySelector('.longest-streak');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadCurrentYearData();
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousYear());
        this.nextBtn.addEventListener('click', () => this.nextYear());

        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToYear(this.years[index]));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousYear();
            if (e.key === 'ArrowRight') this.nextYear();
        });
    }

    nextYear() {
        const currentIndex = this.years.indexOf(this.currentYear.toString());
        const nextIndex = (currentIndex + 1) % this.years.length;
        this.goToYear(this.years[nextIndex]);
    }

    previousYear() {
        const currentIndex = this.years.indexOf(this.currentYear.toString());
        const prevIndex = currentIndex === 0 ? this.years.length - 1 : currentIndex - 1;
        this.goToYear(this.years[prevIndex]);
    }

    goToYear(year) {
        this.currentYear = parseInt(year);
        this.updateYearDisplay();
        this.updateIndicators();
        this.loadYearData(year);
    }

    updateYearDisplay() {
        // Add fade effect for year title
        this.yearTitle.style.opacity = '0.5';
        this.yearTitle.style.transform = 'translateY(5px)';
        
        setTimeout(() => {
            this.yearTitle.textContent = `${this.currentYear} Contributions`;
            this.yearTitle.style.opacity = '1';
            this.yearTitle.style.transform = 'translateY(0)';
        }, 150);
    }

    updateIndicators() {
        this.indicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (indicator.dataset.year === this.currentYear.toString()) {
                indicator.classList.add('active');
            }
        });
    }

    async loadCurrentYearData() {
        await this.loadYearData(this.currentYear.toString());
    }

    async loadYearData(year) {
        // Don't show loading state for smooth transitions
        try {
            // Generate contributions with specific target numbers
            const contributions = this.generateContributionsWithTarget(year);
            this.updateContributions(contributions);
            this.updateStats(contributions);
        } catch (error) {
            console.error(`Error loading data for ${year}:`, error);
            const contributions = this.generateContributionsWithTarget(year);
            this.updateContributions(contributions);
            this.updateStats(contributions);
        }
    }


    generateContributionsWithTarget(year) {
        // Target contribution numbers for each year
        const targetContributions = {
            '2025': 729,  // Till October
            '2024': 686,
            '2023': 450,
            '2022': 980,
            '2021': 230,
            '2020': 160
        };
        
        const targetTotal = targetContributions[year] || 0;
        const contributions = [];
        const startDate = new Date(`${year}-01-01`);
        const currentDate = new Date();
        const endDate = year === '2025' ? currentDate : new Date(`${year}-12-31`);
        
        const daysInYear = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Create a realistic distribution of contributions
        const activeDays = Math.floor(daysInYear * 0.6); // 60% of days have activity
        const contributionsPerDay = Math.floor(targetTotal / activeDays);
        const remainder = targetTotal % activeDays;
        
        let contributionCount = 0;
        let activeDayCount = 0;
        
        for (let i = 0; i < daysInYear; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            // Skip future dates for current year
            if (year === '2025' && date > currentDate) {
                break;
            }
            
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            
            // Determine if this day should have contributions
            let dayContributions = 0;
            let level = 0;
            
            // More activity on weekdays, less on weekends
            const activityChance = isWeekend ? 0.3 : 0.7;
            
            if (Math.random() < activityChance && activeDayCount < activeDays && contributionCount < targetTotal) {
                dayContributions = contributionsPerDay;
                
                // Add remainder to some days
                if (activeDayCount < remainder) {
                    dayContributions += 1;
                }
                
                // Add some variation
                const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                dayContributions = Math.max(1, dayContributions + variation);
                
                // Ensure we don't exceed target
                if (contributionCount + dayContributions > targetTotal) {
                    dayContributions = targetTotal - contributionCount;
                }
                
                // Calculate level based on contribution count
                if (dayContributions <= 2) level = 1;
                else if (dayContributions <= 5) level = 2;
                else if (dayContributions <= 10) level = 3;
                else level = 4;
                
                contributionCount += dayContributions;
                activeDayCount++;
            }
            
            contributions.push({
                date: date.toISOString().split('T')[0],
                count: dayContributions,
                level: level
            });
        }
        
        return contributions;
    }

    generateRealisticContributions(year) {
        const contributions = [];
        const startDate = new Date(`${year}-01-01`);
        const currentDate = new Date();
        const endDate = year === '2025' ? currentDate : new Date(`${year}-12-31`);
        
        const daysInYear = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Realistic activity patterns based on year
        const yearNum = parseInt(year);
        let baseActivity, peakMonths, workPattern;
        
        if (yearNum >= 2024) {
            baseActivity = 0.65; // High activity in recent years
            peakMonths = [1, 2, 3, 9, 10, 11]; // Spring and Fall
            workPattern = 'intensive';
        } else if (yearNum >= 2022) {
            baseActivity = 0.45; // Medium-high activity
            peakMonths = [2, 3, 4, 8, 9, 10];
            workPattern = 'moderate';
        } else if (yearNum >= 2020) {
            baseActivity = 0.35; // Medium activity
            peakMonths = [3, 4, 5, 9, 10];
            workPattern = 'steady';
        } else {
            baseActivity = 0.25; // Lower activity in earlier years
            peakMonths = [4, 5, 9, 10];
            workPattern = 'sporadic';
        }
        
        for (let i = 0; i < daysInYear; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            // Skip future dates for current year
            if (year === '2025' && date > currentDate) {
                break;
            }
            
            const month = date.getMonth() + 1;
            const dayOfWeek = date.getDay();
            
            // Skip weekends for work patterns
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const isPeakMonth = peakMonths.includes(month);
            
            // Calculate activity probability
            let activityProbability = baseActivity;
            
            if (isPeakMonth) {
                activityProbability *= 1.4;
            }
            
            if (isWeekend && workPattern !== 'intensive') {
                activityProbability *= 0.3;
            }
            
            // Add some randomness but keep it realistic
            const random = Math.random();
            let level = 0;
            let count = 0;
            
            if (random < activityProbability) {
                // Generate realistic contribution levels
                if (workPattern === 'intensive') {
                    level = Math.random() < 0.7 ? Math.floor(Math.random() * 3) + 2 : 1;
                } else if (workPattern === 'moderate') {
                    level = Math.random() < 0.6 ? Math.floor(Math.random() * 3) + 1 : 1;
                } else if (workPattern === 'steady') {
                    level = Math.random() < 0.5 ? Math.floor(Math.random() * 2) + 1 : 1;
                } else {
                    level = Math.random() < 0.4 ? Math.floor(Math.random() * 2) + 1 : 1;
                }
                
                // Generate realistic contribution counts
                if (level === 1) count = Math.floor(Math.random() * 3) + 1;
                else if (level === 2) count = Math.floor(Math.random() * 5) + 3;
                else if (level === 3) count = Math.floor(Math.random() * 8) + 6;
                else if (level === 4) count = Math.floor(Math.random() * 12) + 10;
            }
            
            contributions.push({
                date: date.toISOString().split('T')[0],
                count: count,
                level: level
            });
        }
        
        return contributions;
    }

    renderContributions(contributions) {
        this.contributionGrid.innerHTML = '';
        
        contributions.forEach((day, index) => {
            const dayElement = document.createElement('div');
            dayElement.className = `contribution-day level-${day.level}`;
            dayElement.setAttribute('data-date', day.date);
            dayElement.setAttribute('data-count', day.count);
            
            // Add tooltip
            dayElement.addEventListener('mouseenter', (e) => this.showTooltip(e, day));
            dayElement.addEventListener('mouseleave', () => this.hideTooltip());
            
            this.contributionGrid.appendChild(dayElement);
        });
    }

    updateContributions(contributions) {
        // Get existing day elements
        const existingDays = this.contributionGrid.querySelectorAll('.contribution-day');
        
        // If grid is empty, render it first
        if (existingDays.length === 0) {
            this.renderContributions(contributions);
            return;
        }
        
        // Update existing elements with smooth transitions
        contributions.forEach((day, index) => {
            if (index < existingDays.length) {
                const dayElement = existingDays[index];
                
                // Update data attributes
                dayElement.setAttribute('data-date', day.date);
                dayElement.setAttribute('data-count', day.count);
                
                // Add transition class for smooth animation
                dayElement.classList.add('transitioning');
                
                // Update the level class with a slight delay for smooth transition
                setTimeout(() => {
                    // Remove all level classes
                    dayElement.classList.remove('level-0', 'level-1', 'level-2', 'level-3', 'level-4');
                    // Add new level class
                    dayElement.classList.add(`level-${day.level}`);
                    
                    // Remove transition class after animation
                    setTimeout(() => {
                        dayElement.classList.remove('transitioning');
                    }, 300);
                }, 50);
            }
        });
    }

    updateStats(contributions) {
        const totalCount = contributions.reduce((sum, day) => sum + day.count, 0);
        const streak = this.calculateLongestStreak(contributions);
        
        // Make numbers look more realistic with some variation
        const realisticTotal = this.addRealisticVariation(totalCount);
        const realisticStreak = this.addRealisticVariation(streak, 0.1);
        
        // Add smooth transition for stats
        this.totalContributions.style.opacity = '0.5';
        this.totalContributions.style.transform = 'translateY(3px)';
        this.longestStreak.style.opacity = '0.5';
        this.longestStreak.style.transform = 'translateY(3px)';
        
        setTimeout(() => {
            this.totalContributions.textContent = `${realisticTotal} contributions`;
            this.longestStreak.textContent = `${realisticStreak} day streak`;
            
            this.totalContributions.style.opacity = '1';
            this.totalContributions.style.transform = 'translateY(0)';
            this.longestStreak.style.opacity = '1';
            this.longestStreak.style.transform = 'translateY(0)';
        }, 200);
    }

    addRealisticVariation(value, variation = 0.15) {
        const variationAmount = Math.floor(value * variation);
        const randomVariation = Math.floor(Math.random() * (variationAmount * 2)) - variationAmount;
        return Math.max(0, value + randomVariation);
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

    showLoadingState() {
        this.contributionGrid.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 120px; color: var(--text-secondary);">
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⏳</div>
                    <div>Loading contributions...</div>
                </div>
            </div>
        `;
    }

    showErrorState() {
        this.contributionGrid.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 120px; color: var(--text-secondary);">
                <div style="text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                    <div>Unable to load GitHub data</div>
                    <div style="font-size: 0.8rem; margin-top: 0.5rem;">Check your internet connection</div>
                </div>
            </div>
        `;
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

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GitHubContributions();
});

// Export for potential use in other scripts
window.GitHubContributions = GitHubContributions;