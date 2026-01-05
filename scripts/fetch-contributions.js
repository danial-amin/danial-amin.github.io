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
    const dateMap = new Map();
    const startDate = new Date(`${year}-01-01`);
    const endDate = isCurrentYear ? today : new Date(`${year}-12-31`);
    
    // Initialize all dates with 0 contributions
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dateMap.set(dateStr, { date: dateStr, count: 0, level: 0 });
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
    const yearContributions = Array.from(dateMap.values())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return yearContributions;
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

