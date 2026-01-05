/**
 * Fetch GitHub Contributions Script
 * 
 * This script runs in GitHub Actions to fetch contribution data
 * using the GITHUB_TOKEN (automatically available in Actions).
 * 
 * It generates a static JSON file that the client-side code can use,
 * avoiding rate limits and keeping tokens secure.
 */

const fs = require('fs');
const path = require('path');

const GITHUB_USERNAME = 'danial-amin';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'github-contributions.json');

// Years to fetch
const currentYear = new Date().getFullYear();
const years = [currentYear.toString(), '2025', '2024', '2023', '2022', '2021', '2020'];

/**
 * Fetch contributions for a single year using GraphQL
 */
async function fetchYearContributions(year) {
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN environment variable is required');
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
        userName: GITHUB_USERNAME,
        from: fromDate,
        to: toDate
    };

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${GITHUB_TOKEN}`,
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

    if (!data.data || !data.data.user) {
        throw new Error('No user data returned from GitHub API');
    }

    // Transform the data into our format
    const contributions = [];
    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;
    
    // Create a map of all dates in the year (including empty days)
    // For current year, show ALL days (Jan 1 to Dec 31), with future days unfilled
    const dateMap = new Map();
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`); // Always show full year
    
    // Initialize all dates with 0 contributions
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        // For current year, mark future days explicitly
        const isFuture = isCurrentYear && new Date(dateStr) > today;
        dateMap.set(dateStr, { date: dateStr, count: 0, level: 0, isFuture });
    }
    
    // Fill in actual contributions
    weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            const dateStr = day.date.split('T')[0];
            if (dateMap.has(dateStr)) {
                const count = day.contributionCount;
                let level = 0;
                
                // Map counts to levels (matching client-side logic)
                if (count > 0) {
                    if (count === 1) level = 2;
                    else if (count <= 3) level = 3;
                    else if (count <= 7) level = 4;
                    else level = 4;
                }
                
                dateMap.set(dateStr, { date: dateStr, count, level });
            }
        });
    });
    
    // Convert map to array and sort by date
    let yearContributions = Array.from(dateMap.values())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Apply inflation for past years with low contributions
    if (!isCurrentYear) {
        yearContributions = applyInflation(yearContributions, year);
    }
    
    return yearContributions;
}

/**
 * Apply inflation to years with very low contributions
 * This matches the client-side inflation logic
 */
function applyInflation(contributions, year) {
    const inflationEnabled = true;
    const inflationTargetMin = 400;
    const inflationTargetMax = 600;
    const inflationThreshold = 300;
    const minContributionsPerDay = 1;
    const maxActiveDaysRatio = 0.75;
    
    const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
    
    // Only inflate if total is below threshold
    if (!inflationEnabled || totalContributions >= inflationThreshold || totalContributions === 0) {
        return contributions;
    }
    
    // Calculate target total (deterministic based on year)
    const yearNum = parseInt(year, 10);
    const hash = ((yearNum * 2654435761) >>> 0);
    const range = inflationTargetMax - inflationTargetMin + 1;
    const targetTotal = inflationTargetMin + (hash % range);
    
    console.log(`[Inflation] Year ${year}: Inflating from ${totalContributions} to target ${targetTotal}`);
    
    // Get active days
    const activeDays = contributions.filter(day => day.count > 0);
    const totalDays = contributions.length;
    const maxActiveDays = Math.floor(totalDays * maxActiveDaysRatio);
    const targetActiveDays = Math.min(maxActiveDays, Math.max(activeDays.length, Math.floor(totalDays * 0.65)));
    
    // Distribute contributions
    const contributionsPerDay = Math.floor(targetTotal / targetActiveDays);
    const remainder = targetTotal % targetActiveDays;
    
    // Clear all contributions
    contributions.forEach(day => {
        day.count = 0;
        day.level = 0;
    });
    
    // Create deterministic RNG
    const createRng = (seedValue) => {
        let s = seedValue;
        return () => {
            s = (s * 1664525 + 1013904223) >>> 0;
            return s / 4294967296;
        };
    };
    const rng = createRng(hash * 1000 + 12345);
    
    // Sort all days chronologically
    const allDaysSorted = [...contributions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
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
    
    Object.keys(daysByMonth).forEach((month, monthIdx) => {
        const monthDays = daysByMonth[month];
        const daysToTake = daysPerMonth + (monthIdx < remainderDays ? 1 : 0);
        
        // Shuffle month days deterministically
        const shuffled = [...monthDays].sort((a, b) => {
            const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + hash + parseInt(month)) % 10000;
            const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + hash + parseInt(month)) % 10000;
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
        
        const shuffled = [...remainingDays].sort((a, b) => {
            const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + hash) % 10000;
            const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + hash) % 10000;
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
    
    // Final shuffle
    daysToActivate.sort((a, b) => {
        const hashA = (a.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + hash * 7) % 10000;
        const hashB = (b.date.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + hash * 7) % 10000;
        return hashA - hashB;
    });
    
    // Assign contributions
    let contributionCount = 0;
    daysToActivate.forEach((day, index) => {
        if (contributionCount < targetTotal) {
            let dayCount = contributionsPerDay;
            if (index < remainder) {
                dayCount += 1;
            }
            
            // Add deterministic variation
            const dateHash = day.date.split('-').join('');
            const variation = (parseInt(dateHash) + hash) % 3 - 1;
            dayCount = Math.max(minContributionsPerDay, dayCount + variation);
            
            if (contributionCount + dayCount > targetTotal) {
                dayCount = targetTotal - contributionCount;
            }
            
            day.count = dayCount;
            contributionCount += dayCount;
            
            // Calculate level
            if (dayCount > 0) {
                if (dayCount === 1) day.level = 2;
                else if (dayCount <= 3) day.level = 3;
                else if (dayCount <= 7) day.level = 4;
                else day.level = 4;
            }
        }
    });
    
    const finalTotal = contributions.reduce((sum, day) => sum + day.count, 0);
    console.log(`[Inflation] Year ${year}: Final total = ${finalTotal}, Target was = ${targetTotal}`);
    
    return contributions;
}

/**
 * Main function to fetch all years
 */
async function main() {
    console.log('🚀 Fetching GitHub contributions...');
    console.log(`📅 Years: ${years.join(', ')}`);
    
    if (!GITHUB_TOKEN) {
        console.error('❌ GITHUB_TOKEN not found. This script must run in GitHub Actions.');
        process.exit(1);
    }
    
    const allContributions = {};
    
    // Fetch all years in parallel
    const promises = years.map(async (year) => {
        try {
            console.log(`📊 Fetching ${year}...`);
            const contributions = await fetchYearContributions(year);
            allContributions[year] = contributions;
            console.log(`✅ ${year}: ${contributions.length} days, ${contributions.reduce((sum, d) => sum + d.count, 0)} total contributions`);
            return { year, success: true };
        } catch (error) {
            console.error(`❌ Failed to fetch ${year}:`, error.message);
            return { year, success: false, error: error.message };
        }
    });
    
    await Promise.all(promises);
    
    // Add metadata
    const output = {
        lastUpdated: new Date().toISOString(),
        username: GITHUB_USERNAME,
        years: Object.keys(allContributions),
        contributions: allContributions
    };
    
    // Ensure data directory exists
    const dataDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    console.log(`\n✅ Successfully generated ${OUTPUT_FILE}`);
    console.log(`📦 Total years: ${Object.keys(allContributions).length}`);
    
    // Summary
    Object.keys(allContributions).forEach(year => {
        const total = allContributions[year].reduce((sum, d) => sum + d.count, 0);
        console.log(`   ${year}: ${total} contributions`);
    });
}

// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
}

module.exports = { fetchYearContributions };

