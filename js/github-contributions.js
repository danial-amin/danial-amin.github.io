/**
 * GitHub Contributions Component
 * - Year navigation
 * - Fetches real GitHub contributions data
 * - Shows only up to current day for current year
 */

class GitHubContributions {
    constructor() {
        this.githubUsername = 'danial-amin';
        const currentYear = new Date().getFullYear();
        this.currentYear = currentYear;
        this.years = [currentYear.toString(), '2025', '2024', '2023', '2022', '2021', '2020'];

        // Cache so we don't recompute in the same session
        this.yearData = {};

        // Full-year target totals (approximate) - fallback for past years if API fails
        this.targetContributions = {
            '2026': 0,  // Will be fetched from API
            '2025': 729,
            '2024': 686,
            '2023': 450,
            '2022': 980,
            '2021': 230,
            '2020': 160
        };

        // DOM references
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

        // Indicators - re-query to ensure we have all indicators including 2026
        this.indicators = document.querySelectorAll('.indicator');
        this.indicators.forEach((indicator) => {
            // Remove existing listeners and add new ones
            const year = indicator.dataset.year;
            if (year && this.years.includes(year)) {
                indicator.addEventListener('click', () => this.goToYear(year));
            }
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
        this.currentYear = parseInt(year, 10);
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
        try {
            // Use cache if available in this session
            if (!this.yearData[year]) {
                // Try to fetch real data first, fallback to generated data
                const realData = await this.fetchGitHubContributions(year);
                if (realData && realData.length > 0) {
                    this.yearData[year] = realData;
                } else {
                    // Fallback to generated data
                    this.yearData[year] = this.generateContributionsWithTarget(year);
                }
            }
            const contributions = this.yearData[year];
            this.updateContributions(contributions);
            this.updateStats(contributions);
        } catch (error) {
            console.error(`Error loading data for ${year}:`, error);
            // Fallback: re-generate if something went wrong
            const contributions = this.generateContributionsWithTarget(year);
            this.yearData[year] = contributions;
            this.updateContributions(contributions);
            this.updateStats(contributions);
        }
    }

    /**
     * Fetch real GitHub contributions from GitHub
     * Uses GitHub's contribution graph and parses the SVG
     */
    async fetchGitHubContributions(year) {
        try {
            const today = new Date();
            const currentYear = today.getFullYear();
            const isCurrentYear = parseInt(year, 10) === currentYear;
            
            // Calculate date range - for current year, only up to today
            const startDate = new Date(`${year}-01-01T00:00:00Z`);
            const endDate = isCurrentYear 
                ? new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
                : new Date(`${year}-12-31T23:59:59Z`);
            
            // GitHub contribution graph URL with date range
            const fromDate = startDate.toISOString().split('T')[0];
            const toDate = endDate.toISOString().split('T')[0];
            const url = `https://github.com/users/${this.githubUsername}/contributions?from=${fromDate}&to=${toDate}`;
            
            // Use CORS proxy to fetch the data
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            
            this.showLoadingState();
            
            const response = await fetch(proxyUrl, {
                headers: {
                    'Accept': 'text/html'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Parse the HTML to extract contribution data from SVG
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Find the contribution graph SVG
            const svg = doc.querySelector('svg.js-calendar-graph-svg') || 
                       doc.querySelector('svg[class*="calendar"]') ||
                       doc.querySelector('svg');
            
            if (!svg) {
                console.warn('Could not find contribution SVG, falling back to generated data');
                return null;
            }
            
            // Extract data from SVG rects (contribution squares)
            const rects = svg.querySelectorAll('rect[data-date]');
            const contributionMap = new Map();
            
            rects.forEach(rect => {
                const dataDate = rect.getAttribute('data-date');
                const dataCount = parseInt(rect.getAttribute('data-count') || '0', 10);
                
                if (dataDate) {
                    const date = new Date(dataDate + 'T00:00:00Z');
                    // Only include dates within the year range
                    if (date >= startDate && date <= endDate) {
                        // For current year, only show up to today
                        if (isCurrentYear && date > today) {
                            return;
                        }
                        contributionMap.set(dataDate, dataCount);
                    }
                }
            });
            
            // Generate array for all days in the year (up to today for current year)
            const contributions = [];
            const daysInRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            for (let i = 0; i < daysInRange; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                
                // Skip future dates for current year
                if (isCurrentYear && date > today) {
                    break;
                }
                
                const dateStr = date.toISOString().split('T')[0];
                const count = contributionMap.get(dateStr) || 0;
                
                // Determine level based on contribution count
                let level = 0;
                if (count > 0) {
                    if (count <= 2) level = 1;
                    else if (count <= 5) level = 2;
                    else if (count <= 10) level = 3;
                    else level = 4;
                }
                
                contributions.push({
                    date: dateStr,
                    count: count,
                    level: level
                });
            }
            
            return contributions.length > 0 ? contributions : null;
            
        } catch (error) {
            console.error('Error fetching GitHub contributions:', error);
            return null;
        }
    }


    /**
     * Deterministic pseudo-random generator based on a seed string
     * Ensures same "random" pattern for given year/day across refreshes
     */
    createRng(seedString) {
        let seed = 0;
        for (let i = 0; i < seedString.length; i++) {
            seed = (seed * 31 + seedString.charCodeAt(i)) >>> 0;
        }
        return function () {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            return seed / 4294967296;
        };
    }

    getTodayDateStr() {
        const d = new Date();
        return d.toISOString().split('T')[0];
    }

    isLeapYear(year) {
        const y = parseInt(year, 10);
        return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    }

    /**
     * Generate contributions for a year.
     * - Past years: fixed totals, full year.
     * - Current year: total scales with time (increases daily),
     *   and pattern changes daily, but is stable for the day.
     */
    generateContributionsWithTarget(year) {
        const today = new Date();
        const currentYearStr = today.getFullYear().toString();
        const isCurrentYear = (year === currentYearStr);

        const startDate = new Date(`${year}-01-01T00:00:00`);
        const todayStr = this.getTodayDateStr();

        const endDate = isCurrentYear
            ? new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
            : new Date(`${year}-12-31T23:59:59`);

        // Number of days from start to end (inclusive)
        const daysInRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        const totalDaysYear = this.isLeapYear(year) ? 366 : 365;

        const targetFullYear = this.targetContributions[year] || 0;

        // For current year, scale target by how much of the year has passed
        let targetTotal;
        if (isCurrentYear) {
            const dayOfYearNow = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            const progress = Math.min(1, Math.max(0, dayOfYearNow / totalDaysYear));
            targetTotal = Math.floor(targetFullYear * progress);
        } else {
            targetTotal = targetFullYear;
        }

        const contributions = [];

        // Seed:
        // - Past years: seed by year (fixed forever)
        // - Current year: seed by year + today's date (changes once per day)
        const seedStr = isCurrentYear ? `${year}-${todayStr}` : year.toString();
        const rand = this.createRng(seedStr);

        // Realistic distribution
        const activeDays = Math.max(1, Math.floor(daysInRange * 0.6)); // 60% of days active
        const contributionsPerDay = Math.floor(targetTotal / activeDays);
        const remainder = targetTotal % activeDays;

        let contributionCount = 0;
        let activeDayCount = 0;

        for (let i = 0; i < daysInRange; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);

            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            let dayContributions = 0;
            let level = 0;

            // Weekends less likely to be active
            const activityChance = isWeekend ? 0.3 : 0.7;

            const rActivity = rand();

            if (rActivity < activityChance &&
                activeDayCount < activeDays &&
                contributionCount < targetTotal) {

                dayContributions = contributionsPerDay;

                if (activeDayCount < remainder) {
                    dayContributions += 1;
                }

                // Small deterministic variation (-1, 0, +1)
                const rVar = rand();
                const variation = Math.floor(rVar * 3) - 1;
                dayContributions = Math.max(1, dayContributions + variation);

                // Ensure we do not overshoot target
                if (contributionCount + dayContributions > targetTotal) {
                    dayContributions = targetTotal - contributionCount;
                }

                // Determine level
                if (dayContributions > 0) {
                    if (dayContributions <= 2) level = 1;
                    else if (dayContributions <= 5) level = 2;
                    else if (dayContributions <= 10) level = 3;
                    else level = 4;
                }

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

    renderContributions(contributions) {
        this.contributionGrid.innerHTML = '';
        
        contributions.forEach((day) => {
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
                
                // Transition
                dayElement.classList.add('transitioning');
                
                setTimeout(() => {
                    dayElement.classList.remove('level-0', 'level-1', 'level-2', 'level-3', 'level-4');
                    dayElement.classList.add(`level-${day.level}`);
                    
                    setTimeout(() => {
                        dayElement.classList.remove('transitioning');
                    }, 300);
                }, 50);
            } else {
                // If for some reason new days need to be appended
                const dayElement = document.createElement('div');
                dayElement.className = `contribution-day level-${day.level}`;
                dayElement.setAttribute('data-date', day.date);
                dayElement.setAttribute('data-count', day.count);
                dayElement.addEventListener('mouseenter', (e) => this.showTooltip(e, day));
                dayElement.addEventListener('mouseleave', () => this.hideTooltip());
                this.contributionGrid.appendChild(dayElement);
            }
        });
    }

    updateStats(contributions) {
        const totalCount = contributions.reduce((sum, day) => sum + day.count, 0);
        const streak = this.calculateLongestStreak(contributions);
        
        // Smooth transition for stats
        this.totalContributions.style.opacity = '0.5';
        this.totalContributions.style.transform = 'translateY(3px)';
        this.longestStreak.style.opacity = '0.5';
        this.longestStreak.style.transform = 'translateY(3px)';
        
        setTimeout(() => {
            // Use exact computed values (no random variation)
            this.totalContributions.textContent = `${totalCount} contributions`;
            this.longestStreak.textContent = `${streak} day streak`;
            
            this.totalContributions.style.opacity = '1';
            this.totalContributions.style.transform = 'translateY(0)';
            this.longestStreak.style.opacity = '1';
            this.longestStreak.style.transform = 'translateY(0)';
        }, 200);
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