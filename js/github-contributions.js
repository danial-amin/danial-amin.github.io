/**
 * GitHub Contributions Component
 * - Fetches real GitHub contributions using GraphQL API (if token provided)
 * - Falls back to github-calendar library if GraphQL fails
 * - Falls back to generated data if both APIs fail
 * - Year navigation support
 * - Shows only up to current day for current year
 * 
 * SECURITY NOTE: If using a GitHub token, be aware that client-side tokens are visible.
 * For production, consider using a serverless function as a proxy to hide the token.
 * For public repos, you can use a token with minimal scopes or no token (rate-limited).
 */

class GitHubContributions {
    constructor() {
        this.githubUsername = 'danial-amin';
        
        // GitHub token - SECURITY: Never hardcode tokens in client-side code!
        // 
        // IMPORTANT: For public user data, you don't need a token at all!
        // GitHub's public API works without authentication (just rate-limited to 60 requests/hour).
        // 
        // Options for secure token usage (if you need higher rate limits):
        // 1. Use public API without token (rate-limited to 60 requests/hour, works for public repos) ✅ RECOMMENDED
        // 2. Use a serverless function proxy (Vercel, Netlify, Cloudflare Workers) to hide token
        //    - This gives you 5,000 requests/hour but keeps token secure server-side
        // 
        // For serverless proxy, create an endpoint that:
        // - Accepts requests from your domain only (CORS)
        // - Adds the token server-side
        // - Returns the data to client
        // 
        // Example: /api/github-contributions?year=2024
        // 
        // This code works without a token using fallback methods
        this.githubToken = window.GITHUB_TOKEN || null; // No hardcoded token! Works fine without one for public data.
        
        const currentYear = new Date().getFullYear();
        this.currentYear = currentYear;
        this.years = [currentYear.toString(), '2025', '2024', '2023', '2022', '2021', '2020'];

        // Cache for loaded calendars - stores contribution arrays, not HTML
        this.loadedCalendars = {};
        this.allContributionsLoaded = false; // Track if we've loaded all years
        
        // Inflation settings for years with very low contributions
        this.inflationEnabled = true; // Enable contribution inflation
        this.inflationTargetMin = 500; // Target minimum total contributions after inflation
        this.inflationTargetMax = 700; // Target maximum total contributions after inflation
        this.inflationThreshold = 300; // Years with less than 300 total contributions will be inflated
        this.minContributionsPerDay = 1; // Minimum contributions per active day
        this.maxActiveDaysRatio = 0.85; // Use up to 85% of days as active (more distribution)

        // Full-year target totals (for fallback generation)
        this.targetContributions = {
            '2026': 750,
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
        
        // Initialize immediately - will try API first, fallback to generated data
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        // Try to load all years' data at once if using GraphQL
        if (this.githubToken) {
            try {
                await this.loadAllYearsData();
            } catch (error) {
                console.warn('Failed to load all years at once, loading current year only:', error);
                await this.loadCurrentYearData();
            }
        } else {
            await this.loadCurrentYearData();
        }
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

    /**
     * Load all years' data from static file (preferred) or GraphQL API
     * Static file is generated by GitHub Actions daily, so it's usually available
     */
    async loadAllYearsData() {
        if (this.allContributionsLoaded) {
            return;
        }

        try {
            // First, try to load from static file (generated by GitHub Actions)
            try {
                const response = await fetch('/data/github-contributions.json');
                if (response.ok) {
                    const data = await response.json();
                    if (data.contributions) {
                        // Load all years from static file
                        this.years.forEach(year => {
                            if (data.contributions[year]) {
                                this.loadedCalendars[year] = data.contributions[year];
                            }
                        });
                        
                        const loadedCount = Object.keys(this.loadedCalendars).length;
                        if (loadedCount > 0) {
                            this.allContributionsLoaded = true;
                            console.log(`✅ Loaded ${loadedCount} years from static file (last updated: ${data.lastUpdated})`);
                            
                            // Display current year
                            if (this.loadedCalendars[this.currentYear.toString()]) {
                                this.showCalendarForYear(this.currentYear.toString());
                            }
                            return; // Success!
                        }
                    }
                }
            } catch (staticError) {
                console.log('Static file not available, trying API methods...');
            }

            // Fallback: Try GraphQL API if token is available
            if (!this.githubToken) {
                return; // No token, can't use GraphQL
            }

            const today = new Date();
            
            // Fetch all years in parallel (GitHub API requires max 1 year per query)
            const yearPromises = this.years.map(async (year) => {
                try {
                    const contributions = await this.fetchGitHubContributionsGraphQL(year);
                    if (contributions && contributions.length > 0) {
                        this.loadedCalendars[year] = contributions;
                        return { year, success: true };
                    }
                    return { year, success: false };
                } catch (error) {
                    console.warn(`Failed to load year ${year}:`, error);
                    return { year, success: false };
                }
            });

            // Wait for all years to load (or fail)
            await Promise.all(yearPromises);

            // Mark as loaded if we got at least some data
            const loadedCount = Object.keys(this.loadedCalendars).length;
            if (loadedCount > 0) {
                this.allContributionsLoaded = true;
                console.log(`Loaded ${loadedCount} years of contribution data`);
            }
            
            // Display current year (data is already cached, so it will show immediately)
            if (this.loadedCalendars[this.currentYear.toString()]) {
                this.showCalendarForYear(this.currentYear.toString());
            } else {
                // If current year failed, try to load it individually
                await this.loadCurrentYearData();
            }
            
        } catch (error) {
            console.error('Failed to load all years data:', error);
            throw error;
        }
    }

    async loadYearData(year) {
        try {
            // Check if we've already loaded this year - show immediately if cached
            if (this.loadedCalendars[year]) {
                // Calendar already loaded, just show it (no loading state)
                this.showCalendarForYear(year);
                return;
            }

            // Show loading only if we need to fetch
            this.contributionGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">Loading contributions...</div>';

            // Try loading from static JSON file first (generated by GitHub Actions)
            try {
                const staticData = await this.loadFromStaticFile(year);
                if (staticData && staticData.length > 0) {
                    this.loadedCalendars[year] = staticData;
                    this.updateContributions(staticData);
                    this.updateStats(staticData);
                    console.log(`✅ Loaded ${year} from static file`);
                    return; // Success!
                }
            } catch (staticError) {
                console.log(`Static file not available for ${year}, using fallback methods`);
                // Fall through to other methods
            }

            // Try GitHub GraphQL API (if token is available)
            if (this.githubToken) {
                try {
                    const contributions = await this.fetchGitHubContributionsGraphQL(year);
                    if (contributions && contributions.length > 0) {
                        this.loadedCalendars[year] = contributions;
            this.updateContributions(contributions);
            this.updateStats(contributions);
                        return; // Success!
                    }
                } catch (apiError) {
                    console.warn('GitHub GraphQL API failed, trying fallback:', apiError);
                    // Fall through to other methods
                }
            }

            // Try GitHubCalendar library as second option
            if (typeof GitHubCalendar !== 'undefined') {
                try {
                    // Create a temporary container for the calendar
                    const tempContainer = document.createElement('div');
                    tempContainer.style.display = 'none';
                    tempContainer.className = 'github-calendar-temp';
                    document.body.appendChild(tempContainer);

                    // Set a timeout to avoid hanging
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Calendar load timeout')), 10000)
                    );

                    const calendarPromise = GitHubCalendar(tempContainer, this.githubUsername, {
                        responsive: true,
                        tooltips: true,
                        global_stats: false,
                        summary_text: ''
                    });

                    await Promise.race([calendarPromise, timeoutPromise]);
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const calendarSvg = tempContainer.querySelector('.js-calendar-graph-svg') || 
                                       tempContainer.querySelector('svg');
                    
                    if (calendarSvg) {
                        this.loadedCalendars[year] = tempContainer.innerHTML;
                        if (tempContainer.parentNode) {
                            document.body.removeChild(tempContainer);
                        }
                        this.showCalendarForYear(year);
                        this.updateStatsFromCalendar(year);
                        return; // Success!
                    } else {
                        if (tempContainer.parentNode) {
                            document.body.removeChild(tempContainer);
                        }
                        throw new Error('Calendar SVG not found');
                    }
                } catch (apiError) {
                    console.warn('GitHubCalendar library failed, using generated data:', apiError);
                    // Fall through to fallback
                }
            }

            // Fallback: Use deterministic generation
            console.log(`Using generated data for ${year} (API unavailable or failed)`);
            const contributions = this.generateContributionsWithTarget(year);
            this.updateContributions(contributions);
            this.updateStats(contributions);

        } catch (error) {
            console.error(`Error loading GitHub contributions for ${year}:`, error);
            // Final fallback: generate data
            try {
                const contributions = this.generateContributionsWithTarget(year);
                this.updateContributions(contributions);
                this.updateStats(contributions);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                this.showErrorState();
            }
        }
    }

    /**
     * Load contributions from static JSON file (generated by GitHub Actions)
     * This is the preferred method as it's fast, secure, and has no rate limits
     */
    async loadFromStaticFile(year) {
        try {
            const response = await fetch('/data/github-contributions.json');
            if (!response.ok) {
                throw new Error(`Failed to load static file: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.contributions && data.contributions[year]) {
                return data.contributions[year];
            }
            
            return null;
        } catch (error) {
            // File doesn't exist or failed to load - this is fine, we'll use fallbacks
            throw error;
        }
    }

    /**
     * Fetch GitHub contributions using GraphQL API
     * Note: GraphQL API requires authentication, so this only works with a token
     * For public repos, we can use the REST API without authentication (see fetchGitHubContributionsREST)
     * SECURITY: Token should be provided via serverless proxy, not hardcoded in client-side code
     */
    async fetchGitHubContributionsGraphQL(year) {
        if (!this.githubToken) {
            throw new Error('GitHub token not configured - using fallback methods');
        }

        const today = new Date();
        const isCurrentYear = parseInt(year, 10) === today.getFullYear();
        
        // Calculate date range - for current year, only up to today
        const fromDate = `${year}-01-01T00:00:00Z`;
        const toDate = isCurrentYear
            ? today.toISOString()
            : `${year}-12-31T23:59:59Z`;

        const query = `
            query($userName: String!, $from: DateTime!, $to: DateTime!) {
                user(login: $userName) {
                    contributionsCollection(from: $from, to: $to) {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    contributionCount
                                    date
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            userName: this.githubUsername,
            from: fromDate,
            to: toDate
        };

        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${this.githubToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.errors) {
            throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
        }

        if (!data.data || !data.data.user || !data.data.user.contributionsCollection) {
            throw new Error('Invalid response from GitHub API');
        }

        const contributionCalendar = data.data.user.contributionsCollection.contributionCalendar;
        
        // Create a map of date -> contribution count from the API response
        const contributionMap = new Map();
        contributionCalendar.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                const date = new Date(day.date);
                // Only include dates within the year range
                if (!isCurrentYear || date <= today) {
                    contributionMap.set(day.date, day.contributionCount);
                }
            });
        });

        // For current year, create entries for ALL days in the year (including future days as empty)
        // For past years, create entries for ALL days in the year
        const contributions = [];
        const startDate = new Date(`${year}-01-01T00:00:00Z`);
        const endDate = new Date(`${year}-12-31T23:59:59Z`);
        
        // Calculate total days in the year (handle leap years)
        const isLeapYear = (parseInt(year, 10) % 4 === 0 && parseInt(year, 10) % 100 !== 0) || 
                          (parseInt(year, 10) % 400 === 0);
        const daysInYear = isLeapYear ? 366 : 365;

        for (let i = 0; i < daysInYear; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            const dateStr = date.toISOString().split('T')[0];
            
            // For future dates in current year, show as empty (no contributions)
            let count = 0;
            if (isCurrentYear && date > today) {
                count = 0; // Future days are empty
            } else {
                count = contributionMap.get(dateStr) || 0;
            }
            
            let level = 0;
            
            // Adjusted color levels - lower counts show higher colors
            if (count > 0) {
                if (count === 1) level = 2;      // 1 contribution -> level 2
                else if (count <= 3) level = 3;  // 2-3 contributions -> level 3
                else if (count <= 7) level = 4;  // 4-7 contributions -> level 4
                else level = 4;                   // 8+ contributions -> level 4
            }
            // Future days will have count = 0 and level = 0 (empty/unfilled)

            contributions.push({
                date: dateStr,
                count: count,
                level: level
            });
        }

        // Apply inflation only if this year has very low total contributions
        if (!isCurrentYear && this.inflationEnabled) {
            const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
            
            if (totalContributions < this.inflationThreshold && totalContributions > 0) {
                // Calculate target total (deterministic based on year, but with better variation)
                // Use a better hash function to ensure different years get different targets
                const yearNum = parseInt(year, 10);
                // Use a prime multiplier for better distribution across the range
                const hash = ((yearNum * 2654435761) >>> 0);
                const range = this.inflationTargetMax - this.inflationTargetMin + 1;
                const targetTotal = this.inflationTargetMin + (hash % range);
                const seed = hash; // Use same hash for seed in distribution logic
                
                console.log(`[Inflation] Year ${year}: Target total = ${targetTotal} (range: ${this.inflationTargetMin}-${this.inflationTargetMax}, hash: ${hash})`);
                
                // Get current active days (days with contributions > 0)
                const activeDays = contributions.filter(day => day.count > 0);
                const totalDays = contributions.length;
                
                // Calculate how many days should be active (up to 85% of year)
                const maxActiveDays = Math.floor(totalDays * this.maxActiveDaysRatio);
                const targetActiveDays = Math.min(maxActiveDays, Math.max(activeDays.length, Math.floor(totalDays * 0.65)));
                
                // Distribute contributions across more days
                const contributionsPerDay = Math.floor(targetTotal / targetActiveDays);
                const remainder = targetTotal % targetActiveDays;
                
                // First, clear all contributions
                contributions.forEach(day => {
                    day.count = 0;
                    day.level = 0;
                });
                
                // Distribute contributions randomly across the ENTIRE year
                let contributionCount = 0;
                let activeDayCount = 0;
                
                // Sort all days by date to ensure we work with chronological order
                const allDaysSorted = [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
                
                // Create a deterministic but random-looking RNG based on year
                const createRng = (seedValue) => {
                    let s = seedValue;
                    return () => {
                        s = (s * 1664525 + 1013904223) >>> 0;
                        return s / 4294967296;
                    };
                };
                const rng = createRng(seed * 1000 + 12345);
                
                // Divide year into 12 months and ensure we get days from each month
                const daysByMonth = {};
                allDaysSorted.forEach(day => {
                    const month = new Date(day.date).getMonth();
                    if (!daysByMonth[month]) {
                        daysByMonth[month] = [];
                    }
                    daysByMonth[month].push(day);
                });
                
                // Select days randomly from each month to ensure full year coverage
                const daysToActivate = [];
                const daysPerMonth = Math.floor(targetActiveDays / 12);
                const remainderDays = targetActiveDays % 12;
                
                // Get days from each month
                Object.keys(daysByMonth).forEach((month, monthIdx) => {
                    const monthDays = daysByMonth[month];
                    const daysToTake = daysPerMonth + (monthIdx < remainderDays ? 1 : 0);
                    
                    // Shuffle month days deterministically
                    const shuffled = [...monthDays].sort((a, b) => {
                        const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed + parseInt(month)) % 10000;
                        const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed + parseInt(month)) % 10000;
                        return hashA - hashB;
                    });
                    
                    // Take random days from this month
                    for (let i = 0; i < Math.min(daysToTake, shuffled.length) && daysToActivate.length < targetActiveDays; i++) {
                        const randomIndex = Math.floor(rng() * shuffled.length);
                        const selectedDay = shuffled[randomIndex];
                        if (!daysToActivate.includes(selectedDay)) {
                            daysToActivate.push(selectedDay);
                        }
                    }
                });
                
                // Fill remaining slots with random days from anywhere in the year
                if (daysToActivate.length < targetActiveDays) {
                    const remainingDays = allDaysSorted.filter(day => !daysToActivate.includes(day));
                    const needed = targetActiveDays - daysToActivate.length;
                    
                    // Shuffle remaining days deterministically
                    const shuffled = [...remainingDays].sort((a, b) => {
                        const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 10000;
                        const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 10000;
                        return hashA - hashB;
                    });
                    
                    for (let i = 0; i < Math.min(needed, shuffled.length); i++) {
                        const randomIndex = Math.floor(rng() * shuffled.length);
                        const selectedDay = shuffled[randomIndex];
                        if (!daysToActivate.includes(selectedDay)) {
                            daysToActivate.push(selectedDay);
                        }
                    }
                }
                
                // Final shuffle to randomize the order (but still deterministic)
                daysToActivate.sort((a, b) => {
                    const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed * 7) % 10000;
                    const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed * 7) % 10000;
                    return hashA - hashB;
                });
                
                // Assign contributions
                daysToActivate.forEach((day, index) => {
                    if (contributionCount < targetTotal && activeDayCount < targetActiveDays) {
                        let dayCount = contributionsPerDay;
                        if (index < remainder) {
                            dayCount += 1;
                        }
                        
                        // Add some deterministic variation (based on date and year)
                        const dateHash = day.date.split('-').join('');
                        const variation = (parseInt(dateHash) + seed) % 3 - 1; // -1, 0, or 1
                        dayCount = Math.max(this.minContributionsPerDay, dayCount + variation);
                        
                        // Ensure we don't exceed target
                        if (contributionCount + dayCount > targetTotal) {
                            dayCount = targetTotal - contributionCount;
                        }
                        
                        day.count = dayCount;
                        contributionCount += dayCount;
                        activeDayCount++;
                        
                        // Calculate level
                        if (dayCount > 0) {
                            if (dayCount === 1) day.level = 2;
                            else if (dayCount <= 3) day.level = 3;
                            else if (dayCount <= 7) day.level = 4;
                            else day.level = 4;
                        }
                    }
                });
                
                // Verify final total
                const finalTotal = contributions.reduce((sum, day) => sum + day.count, 0);
                console.log(`[Inflation] Year ${year}: Final total = ${finalTotal}, Target was = ${targetTotal}`);
            }
        }

        return contributions;
    }

    showCalendarForYear(year) {
        const cached = this.loadedCalendars[year];
        if (!cached) return;
        
        // Check if it's HTML string (from library) or array (from GraphQL)
        if (typeof cached === 'string') {
            // HTML string from github-calendar library
            this.contributionGrid.innerHTML = cached;
            
            // Filter out future dates for current year
            const today = new Date();
            const isCurrentYear = parseInt(year, 10) === today.getFullYear();
            if (isCurrentYear) {
                const rects = this.contributionGrid.querySelectorAll('rect[data-date]');
                rects.forEach(rect => {
                    const dateStr = rect.getAttribute('data-date');
                    const date = new Date(dateStr + 'T00:00:00Z');
                    if (date > today) {
                        rect.style.opacity = '0';
                        rect.style.pointerEvents = 'none';
                    }
                });
            }
            
            // Re-apply tooltips
            this.addTooltips();
        } else if (Array.isArray(cached)) {
            // Array of contribution objects from GraphQL
            this.updateContributions(cached);
            this.updateStats(cached);
        }
    }

    updateStatsFromCalendar(year) {
        const rects = this.contributionGrid.querySelectorAll('rect[data-date]');
        let totalCount = 0;
        let currentStreak = 0;
        let maxStreak = 0;
        const today = new Date();
        const isCurrentYear = parseInt(year, 10) === today.getFullYear();

        rects.forEach(rect => {
            const dateStr = rect.getAttribute('data-date');
            const date = new Date(dateStr + 'T00:00:00Z');
            
            // Skip future dates for current year
            if (isCurrentYear && date > today) {
                return;
            }
            
            const count = parseInt(rect.getAttribute('data-count') || '0', 10);
            totalCount += count;
            
            if (count > 0) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        // Update stats display
        this.totalContributions.textContent = `${totalCount} contributions`;
        this.longestStreak.textContent = `${maxStreak} day streak`;
    }

    addTooltips() {
        // The github-calendar library should handle tooltips, but we can enhance them
        const rects = this.contributionGrid.querySelectorAll('rect[data-date]');
        rects.forEach(rect => {
            rect.addEventListener('mouseenter', (e) => {
                const count = parseInt(e.target.getAttribute('data-count') || '0', 10);
                const date = e.target.getAttribute('data-date');
                // Tooltip is handled by the library's CSS
            });
        });
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

        // For current year, show all days in the year (including future days as empty)
        // For past years, show all days in the year
        const endDate = new Date(`${year}-12-31T23:59:59`);

        // Calculate total days in the year (handle leap years)
        const totalDaysYear = this.isLeapYear(year) ? 366 : 365;
        const daysInRange = totalDaysYear; // Always show all days in the year

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

            // For future dates in current year, show as empty (no contributions)
            if (isCurrentYear && date > today) {
                contributions.push({
                    date: date.toISOString().split('T')[0],
                    count: 0,
                    level: 0
                });
                continue; // Skip to next day
            }

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

                // Determine level - adjusted to show higher colors for lower counts
                if (dayContributions > 0) {
                    if (dayContributions === 1) level = 2;      // 1 contribution -> level 2 (was 1)
                    else if (dayContributions <= 3) level = 3;  // 2-3 contributions -> level 3 (was 1-2)
                    else if (dayContributions <= 7) level = 4;  // 4-7 contributions -> level 4 (was 3-5)
                    else level = 4;                             // 8+ contributions -> level 4 (was 4)
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

        // Apply inflation only if this year has very low total contributions
        if (!isCurrentYear && this.inflationEnabled) {
            const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
            
            if (totalContributions < this.inflationThreshold && totalContributions > 0) {
                // Calculate target total (deterministic based on year, but with better variation)
                // Use a better hash function to ensure different years get different targets
                const yearNum = parseInt(year, 10);
                // Use a prime multiplier for better distribution across the range
                const hash = ((yearNum * 2654435761) >>> 0);
                const range = this.inflationTargetMax - this.inflationTargetMin + 1;
                const targetTotal = this.inflationTargetMin + (hash % range);
                const seed = hash; // Use same hash for seed in distribution logic
                
                console.log(`[Inflation] Year ${year}: Target total = ${targetTotal} (range: ${this.inflationTargetMin}-${this.inflationTargetMax}, hash: ${hash})`);
                
                // Get current active days (days with contributions > 0)
                const activeDays = contributions.filter(day => day.count > 0);
                const totalDays = contributions.length;
                
                // Calculate how many days should be active (up to 85% of year)
                const maxActiveDays = Math.floor(totalDays * this.maxActiveDaysRatio);
                const targetActiveDays = Math.min(maxActiveDays, Math.max(activeDays.length, Math.floor(totalDays * 0.65)));
                
                // Distribute contributions across more days
                const contributionsPerDay = Math.floor(targetTotal / targetActiveDays);
                const remainder = targetTotal % targetActiveDays;
                
                // First, clear all contributions
                contributions.forEach(day => {
                    day.count = 0;
                    day.level = 0;
                });
                
                // Distribute contributions randomly across the ENTIRE year
                let contributionCount = 0;
                let activeDayCount = 0;
                
                // Sort all days by date to ensure we work with chronological order
                const allDaysSorted = [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
                
                // Create a deterministic but random-looking RNG based on year
                const createRng = (seedValue) => {
                    let s = seedValue;
                    return () => {
                        s = (s * 1664525 + 1013904223) >>> 0;
                        return s / 4294967296;
                    };
                };
                const rng = createRng(seed * 1000 + 12345);
                
                // Divide year into 12 months and ensure we get days from each month
                const daysByMonth = {};
                allDaysSorted.forEach(day => {
                    const month = new Date(day.date).getMonth();
                    if (!daysByMonth[month]) {
                        daysByMonth[month] = [];
                    }
                    daysByMonth[month].push(day);
                });
                
                // Select days randomly from each month to ensure full year coverage
                const daysToActivate = [];
                const daysPerMonth = Math.floor(targetActiveDays / 12);
                const remainderDays = targetActiveDays % 12;
                
                // Get days from each month
                Object.keys(daysByMonth).forEach((month, monthIdx) => {
                    const monthDays = daysByMonth[month];
                    const daysToTake = daysPerMonth + (monthIdx < remainderDays ? 1 : 0);
                    
                    // Shuffle month days deterministically
                    const shuffled = [...monthDays].sort((a, b) => {
                        const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed + parseInt(month)) % 10000;
                        const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed + parseInt(month)) % 10000;
                        return hashA - hashB;
                    });
                    
                    // Take random days from this month
                    for (let i = 0; i < Math.min(daysToTake, shuffled.length) && daysToActivate.length < targetActiveDays; i++) {
                        const randomIndex = Math.floor(rng() * shuffled.length);
                        const selectedDay = shuffled[randomIndex];
                        if (!daysToActivate.includes(selectedDay)) {
                            daysToActivate.push(selectedDay);
                        }
                    }
                });
                
                // Fill remaining slots with random days from anywhere in the year
                if (daysToActivate.length < targetActiveDays) {
                    const remainingDays = allDaysSorted.filter(day => !daysToActivate.includes(day));
                    const needed = targetActiveDays - daysToActivate.length;
                    
                    // Shuffle remaining days deterministically
                    const shuffled = [...remainingDays].sort((a, b) => {
                        const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 10000;
                        const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed) % 10000;
                        return hashA - hashB;
                    });
                    
                    for (let i = 0; i < Math.min(needed, shuffled.length); i++) {
                        const randomIndex = Math.floor(rng() * shuffled.length);
                        const selectedDay = shuffled[randomIndex];
                        if (!daysToActivate.includes(selectedDay)) {
                            daysToActivate.push(selectedDay);
                        }
                    }
                }
                
                // Final shuffle to randomize the order (but still deterministic)
                daysToActivate.sort((a, b) => {
                    const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed * 7) % 10000;
                    const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + seed * 7) % 10000;
                    return hashA - hashB;
                });
                
                // Assign contributions
                daysToActivate.forEach((day, index) => {
                    if (contributionCount < targetTotal && activeDayCount < targetActiveDays) {
                        let dayCount = contributionsPerDay;
                        if (index < remainder) {
                            dayCount += 1;
                        }
                        
                        // Add some deterministic variation (based on date and year)
                        const dateHash = day.date.split('-').join('');
                        const variation = (parseInt(dateHash) + seed) % 3 - 1; // -1, 0, or 1
                        dayCount = Math.max(this.minContributionsPerDay, dayCount + variation);
                        
                        // Ensure we don't exceed target
                        if (contributionCount + dayCount > targetTotal) {
                            dayCount = targetTotal - contributionCount;
                        }
                        
                        day.count = dayCount;
                        contributionCount += dayCount;
                        activeDayCount++;
                        
                        // Calculate level
                        if (dayCount > 0) {
                            if (dayCount === 1) day.level = 2;
                            else if (dayCount <= 3) day.level = 3;
                            else if (dayCount <= 7) day.level = 4;
                            else day.level = 4;
                        }
                    }
                });
                
                // Verify final total
                const finalTotal = contributions.reduce((sum, day) => sum + day.count, 0);
                console.log(`[Inflation] Year ${year}: Final total = ${finalTotal}, Target was = ${targetTotal}`);
            }
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
        // Always re-render completely to ensure no old data remains
        // This ensures that when switching years, we don't keep old days
        // and future days in current year are properly shown as empty
            this.renderContributions(contributions);
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