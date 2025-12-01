// Store all feeders data globally
let allFeeders = [];
let currentSelectedSpecies = 'Goat'; // Default selected species
let portionCounts = {}; // Store portion counts per species
let autoFeederEnabled = {}; // Store auto feeder on/off state per species
let currentMealPercent = {}; // Store current meal meter percentage per species

// Species portion information (grams per portion)
const speciesPortionInfo = {
    'Goat': { grams: 500, unit: 'g' },
    'Sugarglider': { grams: 50, unit: 'g' },
    'Alligator': { grams: 1000, unit: 'g' },
    'Snail': { grams: 25, unit: 'g' },
    'Porcupine': { grams: 200, unit: 'g' },
    'Fox': { grams: 300, unit: 'g' }
};

// Daily food intake recommendations (per day)
const speciesDailyIntake = {
    'Goat': { amount: 2000, unit: 'g', meals: 3 },
    'Sugarglider': { amount: 150, unit: 'g', meals: 4 },
    'Alligator': { amount: 3000, unit: 'g', meals: 3 },
    'Snail': { amount: 50, unit: 'g', meals: 3 },
    'Porcupine': { amount: 400, unit: 'g', meals: 3 },
    'Fox': { amount: 600, unit: 'g', meals: 3 }
};

// Normal intake per kg of animal weight (g/kg per day)
const speciesIntakePerKg = {
    'Goat': 50, // 50g per kg per day
    'Sugarglider': 75, // 75g per kg per day
    'Alligator': 30, // 30g per kg per day
    'Snail': 5, // 5g per kg per day
    'Porcupine': 40, // 40g per kg per day
    'Fox': 60 // 60g per kg per day
};

// Quantity of animals per species in the cage
const speciesQuantity = {
    'Goat': 8,
    'Sugarglider': 12,
    'Alligator': 3,
    'Snail': 25,
    'Porcupine': 5,
    'Fox': 4
};

// Today's food added (in grams) - this would normally come from a database
// Values are capped to be less than total daily intake
let todayFoodAdded = {
    'Goat': 1500,      // Less than 2000g total
    'Sugarglider': 100, // Less than 150g total
    'Alligator': 2500,  // Less than 3000g total
    'Snail': 30,        // Less than 50g total
    'Porcupine': 300,   // Less than 400g total
    'Fox': 400          // Less than 600g total
};

// Auto feeder schedules (feeding times per species with amounts) - can be edited
let autoFeederSchedules = {
    'Goat': [
        { time: '06:00', amount: 500 },
        { time: '10:00', amount: 500 },
        { time: '14:00', amount: 500 },
        { time: '18:00', amount: 500 }
    ],
    'Sugarglider': [
        { time: '08:00', amount: 100 },
        { time: '12:00', amount: 150 },
        { time: '16:00', amount: 150 },
        { time: '20:00', amount: 100 }
    ],
    'Alligator': [
        { time: '08:00', amount: 1200 },
        { time: '14:00', amount: 1200 },
        { time: '18:00', amount: 1200 }
    ],
    'Snail': [
        { time: '20:00', amount: 100 },
        { time: '22:00', amount: 100 },
        { time: '00:00', amount: 80 }
    ],
    'Porcupine': [
        { time: '06:00', amount: 300 },
        { time: '10:00', amount: 300 },
        { time: '14:00', amount: 200 },
        { time: '18:00', amount: 200 }
    ],
    'Fox': [
        { time: '06:00', amount: 600 },
        { time: '10:00', amount: 400 },
        { time: '14:00', amount: 400 },
        { time: '18:00', amount: 600 }
    ]
};

// Feeder history data (sample data for each species)
const feederHistoryData = {
    'Goat': [
        { date: '2024-01-15', time: '08:00', portions: 2, grams: 600, type: 'Auto Feeder' },
        { date: '2024-01-15', time: '14:00', portions: 2, grams: 600, type: 'Auto Feeder' },
        { date: '2024-01-14', time: '08:15', portions: 2, grams: 600, type: 'Manual' },
        { date: '2024-01-14', time: '14:30', portions: 1, grams: 300, type: 'Auto Feeder' },
        { date: '2024-01-13', time: '08:00', portions: 2, grams: 600, type: 'Auto Feeder' },
        { date: '2024-01-13', time: '14:00', portions: 2, grams: 600, type: 'Auto Feeder' }
    ],
    'Sugarglider': [
        { date: '2024-01-15', time: '10:00', portions: 1, grams: 150, type: 'Auto Feeder' },
        { date: '2024-01-15', time: '14:00', portions: 1, grams: 150, type: 'Auto Feeder' },
        { date: '2024-01-15', time: '18:00', portions: 1, grams: 150, type: 'Manual' },
        { date: '2024-01-14', time: '10:00', portions: 1, grams: 150, type: 'Auto Feeder' },
        { date: '2024-01-14', time: '14:00', portions: 1, grams: 150, type: 'Auto Feeder' }
    ],
    'Alligator': [
        { date: '2024-01-15', time: '18:00', portions: 5, grams: 3600, type: 'Auto Feeder' },
        { date: '2024-01-14', time: '18:15', portions: 5, grams: 3600, type: 'Manual' },
        { date: '2024-01-13', time: '18:00', portions: 5, grams: 3600, type: 'Auto Feeder' }
    ],
    'Snail': [
        { date: '2024-01-15', time: '22:00', portions: 1, grams: 280, type: 'Auto Feeder' },
        { date: '2024-01-14', time: '22:00', portions: 1, grams: 280, type: 'Auto Feeder' },
        { date: '2024-01-13', time: '21:45', portions: 1, grams: 280, type: 'Manual' }
    ],
    'Porcupine': [
        { date: '2024-01-15', time: '06:00', portions: 2, grams: 475, type: 'Auto Feeder' },
        { date: '2024-01-15', time: '10:00', portions: 2, grams: 475, type: 'Auto Feeder' },
        { date: '2024-01-14', time: '06:00', portions: 2, grams: 475, type: 'Auto Feeder' }
    ],
    'Fox': [
        { date: '2024-01-15', time: '06:00', portions: 3, grams: 900, type: 'Auto Feeder' },
        { date: '2024-01-15', time: '18:00', portions: 3, grams: 900, type: 'Manual' },
        { date: '2024-01-14', time: '06:00', portions: 3, grams: 900, type: 'Auto Feeder' }
    ]
};

// Feeding page functionality
function initializeFeeding() {
    renderFeederDashboard('Goat'); // Start with Goat selected
    updateSpeciesTabs(); // Update tabs with status indicators
}

// Get meal percentage for a species
function getSpeciesMealPercent(species) {
    const filteredFeeders = allFeeders.filter(feeder => feeder.species === species);
    if (filteredFeeders.length === 0) {
        return 0;
    }
    const totalPercent = filteredFeeders.reduce((sum, feeder) => sum + (feeder.mealPercent || 0), 0);
    return Math.round(totalPercent / filteredFeeders.length);
}

// Get food status for a meal percentage
function getFoodStatus(mealPercent) {
    if (mealPercent < 25) {
        return 'very-low';
    } else if (mealPercent < 50) {
        return 'low';
    } else if (mealPercent < 75) {
        return 'good';
    } else {
        return 'excellent';
    }
}

// Get status color for a meal percentage
function getStatusColor(status) {
    switch(status) {
        case 'very-low':
            return '#ef4444'; // Red
        case 'low':
            return '#fbbf24'; // Yellow
        case 'good':
            return '#3b82f6'; // Blue
        case 'excellent':
            return '#10b981'; // Green
        default:
            return '#6b7280'; // Gray
    }
}

// Render animal selection HTML
function renderAnimalSelection(activeSpecies = null, displayName = null, icon = null) {
    const speciesList = ['Goat', 'Sugarglider', 'Alligator', 'Snail', 'Porcupine', 'Fox'];
    const speciesIcons = {
        'Goat': '🐐',
        'Sugarglider': '🐿️',
        'Alligator': '🐊',
        'Snail': '🐌',
        'Porcupine': '🦔',
        'Fox': '🦊'
    };
    const speciesDisplayNames = {
        'Goat': 'Goats',
        'Sugarglider': 'Sugar Gliders',
        'Alligator': 'Alligators',
        'Snail': 'Snails',
        'Porcupine': 'Porcupines',
        'Fox': 'Foxes'
    };

    activeSpecies = activeSpecies || currentSelectedSpecies || 'Goat';
    displayName = displayName || speciesDisplayNames[activeSpecies] || activeSpecies;
    icon = icon || speciesIcons[activeSpecies] || '';
    
    // Get food levels for all species and sort by priority (most critical first)
    const speciesWithLevels = speciesList.map(species => {
        const mealPercent = getSpeciesMealPercent(species);
        const status = getFoodStatus(mealPercent);
        return { species, mealPercent, status };
    });
    
    // Sort: very-low first (most critical), then low, then good, then excellent (least critical)
    speciesWithLevels.sort((a, b) => {
        const priority = { 'very-low': 0, 'low': 1, 'good': 2, 'excellent': 3 };
        const priorityDiff = priority[a.status] - priority[b.status];
        
        // If same priority, sort by mealPercent (lower is more critical)
        if (priorityDiff === 0) {
            return a.mealPercent - b.mealPercent;
        }
        
        return priorityDiff;
    });
    
    const createTabHTML = (item) => {
        const { species, mealPercent, status } = item;
        const statusColor = getStatusColor(status);
        const isActive = species === activeSpecies;
        const warningEmoji = (status === 'very-low' || status === 'low') ? '⚠️ ' : '';
        const pulseClass = (status === 'very-low') ? 'food-low-pulse' : '';
        
        // Get status label
        const statusLabel = status === 'very-low' ? 'Very Low' : 
                           status === 'low' ? 'Low' : 
                           status === 'good' ? 'Good' : 'Excellent';
        
        return `
            <div class="species-tab ${isActive ? 'active' : ''} ${pulseClass}" 
                 onclick="filterFeedersBySpecies('${species}')" 
                 data-species="${species}"
                 data-status="${status}"
                 style="${isActive ? `--status-color: ${statusColor};` : ''}"
                 title="${speciesDisplayNames[species]}: ${statusLabel} (${Math.round(mealPercent)}%)">
                <div class="species-tab-content-wrapper">
                    <span class="species-tab-content">
                        ${speciesIcons[species]} ${speciesDisplayNames[species]}
                    </span>
                    <span class="species-food-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                        <span class="species-status-dot" style="background-color: ${statusColor}"></span>
                        ${warningEmoji}${Math.round(mealPercent)}%
                    </span>
                </div>
                <div class="species-progress-bar">
                    <div class="species-progress-fill" style="width: ${mealPercent}%; background-color: ${statusColor};"></div>
                </div>
            </div>
        `;
    };
    
    // Split into three rows: 2 per row
    const firstRow = speciesWithLevels.slice(0, 2);
    const secondRow = speciesWithLevels.slice(2, 4);
    const thirdRow = speciesWithLevels.slice(4);
    
    return `
        <div class="animal-selection-card">
            <div class="card-header">
                <h3 class="card-title">Animal Selection and Alerts</h3>
            </div>
            <div class="animal-selection-content">
                <div class="color-indicator-legend">
                    <div class="color-indicator-title">Color Indicator:</div>
                    <div class="color-indicator-items">
                        <div class="color-indicator-item" data-percent="< 25%">
                            <span class="color-indicator-dot" style="background-color: #ef4444;"></span>
                            <span class="color-indicator-label">Very Low</span>
                            <span class="color-indicator-tooltip">< 25%</span>
                        </div>
                        <div class="color-indicator-item" data-percent="25-50%">
                            <span class="color-indicator-dot" style="background-color: #fbbf24;"></span>
                            <span class="color-indicator-label">Low</span>
                            <span class="color-indicator-tooltip">25-50%</span>
                        </div>
                        <div class="color-indicator-item" data-percent="50-75%">
                            <span class="color-indicator-dot" style="background-color: #3b82f6;"></span>
                            <span class="color-indicator-label">Good</span>
                            <span class="color-indicator-tooltip">50-75%</span>
                        </div>
                        <div class="color-indicator-item" data-percent="≥ 75%">
                            <span class="color-indicator-dot" style="background-color: #10b981;"></span>
                            <span class="color-indicator-label">Excellent</span>
                            <span class="color-indicator-tooltip">≥ 75%</span>
                        </div>
                    </div>
                </div>
                <div class="species-tabs-row">
                    ${firstRow.map(createTabHTML).join('')}
                </div>
                <div class="species-tabs-row">
                    ${secondRow.map(createTabHTML).join('')}
                </div>
                <div class="species-tabs-row">
                    ${thirdRow.map(createTabHTML).join('')}
                </div>
            </div>
        </div>
    `;
}

// Update species tabs with status indicators
function updateSpeciesTabs() {
    const speciesList = ['Goat', 'Sugarglider', 'Alligator', 'Snail', 'Porcupine', 'Fox'];
    const speciesIcons = {
        'Goat': '🐐',
        'Sugarglider': '🐿️',
        'Alligator': '🐊',
        'Snail': '🐌',
        'Porcupine': '🦔',
        'Fox': '🦊'
    };
    const speciesDisplayNames = {
        'Goat': 'Goats',
        'Sugarglider': 'Sugar Gliders',
        'Alligator': 'Alligators',
        'Snail': 'Snails',
        'Porcupine': 'Porcupines',
        'Fox': 'Foxes'
    };

    const tabsContainer = document.querySelector('.species-tabs-container');
    if (!tabsContainer) return;

    const activeSpecies = currentSelectedSpecies || 'Goat';
    
    // Split species into 2 rows (3 per row)
    const firstRow = speciesList.slice(0, 3);
    const secondRow = speciesList.slice(3);
    
    const createTabHTML = (species) => {
        const mealPercent = getSpeciesMealPercent(species);
        const status = getFoodStatus(mealPercent);
        const statusColor = getStatusColor(status);
        const isActive = species === activeSpecies;
        const warningEmoji = (status === 'very-low' || status === 'low') ? '⚠️ ' : '';
        
        return `
            <div class="species-tab ${isActive ? 'active' : ''}" 
                 onclick="filterFeedersBySpecies('${species}')" 
                 data-species="${species}">
                <span class="species-status-dot" style="background-color: ${statusColor}"></span>
                ${warningEmoji}${speciesIcons[species]} ${speciesDisplayNames[species]}
            </div>
        `;
    };
    
    tabsContainer.innerHTML = `
        <div class="species-tabs-row">
            ${firstRow.map(createTabHTML).join('')}
        </div>
        <div class="species-tabs-row">
            ${secondRow.map(createTabHTML).join('')}
        </div>
    `;
}

// Generate schedule list HTML for a species
function generateScheduleList(species) {
    const schedules = autoFeederSchedules[species] || [];
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Get last fed time from history
    let lastFedTime = null;
    let lastFedDate = null;
    if (feederHistoryData[species] && feederHistoryData[species].length > 0) {
        const sortedHistory = [...feederHistoryData[species]].sort((a, b) => {
            if (a.date !== b.date) {
                return new Date(b.date) - new Date(a.date);
            }
            return b.time.localeCompare(a.time);
        });
        const latest = sortedHistory[0];
        lastFedTime = latest.time;
        lastFedDate = latest.date;
    }

    if (schedules.length === 0) {
        return '<div class="no-schedule-items">No schedule set for this animal</div>';
    }

    // Get standardized portion info for this species (calculated from daily intake)
    const dailyIntake = speciesDailyIntake[species] || { amount: 100, unit: 'g', meals: 1 };
    const totalRequired = dailyIntake.amount;
    const mealsPerDay = dailyIntake.meals;
    const gramsPerPortion = mealsPerDay > 0 ? Math.round(totalRequired / mealsPerDay) : totalRequired;
    const portionInfo = { grams: gramsPerPortion, unit: dailyIntake.unit || 'g' };

    // Helper function to render a schedule item
    const renderScheduleItem = (schedule) => {
        const scheduledTime = typeof schedule === 'string' ? schedule : schedule.time;
        const amount = typeof schedule === 'object' ? schedule.amount : null;
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const scheduleTimeInMinutes = hours * 60 + minutes;

        // Determine if upcoming or past
        const isUpcoming = scheduleTimeInMinutes > currentTime;
        let timeUntil = null;

        if (isUpcoming) {
            const minutesUntil = scheduleTimeInMinutes - currentTime;
            const hoursUntil = Math.floor(minutesUntil / 60);
            const minsUntil = minutesUntil % 60;

            if (hoursUntil > 0) {
                timeUntil = `${hoursUntil}h ${minsUntil}m`;
            } else {
                timeUntil = `${minsUntil}m`;
            }
        }

        // Format amount as portion(s) (grams)
        let amountDisplay = 'Scheduled';
        if (amount) {
            const portions = amount / gramsPerPortion;
            // Round to nearest whole number
            const roundedPortions = Math.round(portions);
            const portionText = roundedPortions === 1 ? 'portion' : 'portions';
            amountDisplay = `${roundedPortions} ${portionText} (${amount}${portionInfo.unit || 'g'})`;
        }

        // Format last fed date
        let lastFedDisplay = '';
        if (lastFedTime && lastFedDate) {
            const lastFedDateObj = new Date(lastFedDate + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            lastFedDateObj.setHours(0, 0, 0, 0);

            let dateStr = '';
            if (lastFedDateObj.getTime() === today.getTime()) {
                dateStr = 'Today';
            } else if (lastFedDateObj.getTime() === yesterday.getTime()) {
                dateStr = 'Yesterday';
            } else {
                dateStr = lastFedDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }

            lastFedDisplay = `Last fed: ${dateStr} at ${lastFedTime}`;
        }

        return `
            <div class="schedule-item ${isUpcoming ? 'schedule-item-upcoming' : ''}">
                <div class="schedule-time">
                    <div class="schedule-time-icon">⏰</div>
                    <div class="schedule-time-value">${scheduledTime}</div>
                    ${isUpcoming && timeUntil ? `<div class="schedule-time-until">in ${timeUntil}</div>` : ''}
                </div>
            <div class="schedule-details">
                    <div class="schedule-meal">${amountDisplay}</div>
                    ${lastFedDisplay ? `<div class="schedule-last-fed">${lastFedDisplay}</div>` : ''}
                </div>
                <div class="schedule-status status-${isUpcoming ? 'pending' : 'completed'}">
                    ${isUpcoming ? `⏱️ In ${timeUntil || 'N/A'}` : '✓ Completed'}
                </div>
            </div>
        `;
    };

    // Separate schedules into daytime (before 6 PM) and nighttime (6 PM and after)
    const daytimeSchedules = [];
    const nighttimeSchedules = [];
    const nightStartHour = 18; // 6 PM = 18:00

    schedules.forEach(schedule => {
        const scheduledTime = typeof schedule === 'string' ? schedule : schedule.time;
        const [hours] = scheduledTime.split(':').map(Number);
        
        if (hours >= nightStartHour) {
            nighttimeSchedules.push(schedule);
        } else {
            daytimeSchedules.push(schedule);
        }
    });

    // Sort each group by time
    const sortByTime = (a, b) => {
        const aTime = typeof a === 'string' ? a : a.time;
        const bTime = typeof b === 'string' ? b : b.time;
        return aTime.localeCompare(bTime);
    };

    daytimeSchedules.sort(sortByTime);
    nighttimeSchedules.sort(sortByTime);

    // Generate HTML for each column
    const daytimeHTML = daytimeSchedules.length > 0 
        ? daytimeSchedules.map(renderScheduleItem).join('')
        : '<div class="no-schedule-items">No daytime schedules</div>';

    const nighttimeHTML = nighttimeSchedules.length > 0
        ? nighttimeSchedules.map(renderScheduleItem).join('')
        : '<div class="no-schedule-items">No nighttime schedules</div>';

    return `
        <div class="schedule-columns-container">
            <div class="schedule-column">
                <div class="schedule-column-header">Daytime</div>
                <div class="schedule-column-content">${daytimeHTML}</div>
            </div>
            <div class="schedule-column">
                <div class="schedule-column-header">Nighttime</div>
                <div class="schedule-column-content">${nighttimeHTML}</div>
            </div>
        </div>
    `;
}

// Render auto feeder dashboard
function renderFeederDashboard(speciesFilter = 'Goat') {
    const dashboard = document.getElementById('feederDashboard');
    if (!dashboard) return;

    currentSelectedSpecies = speciesFilter;

    // Sample auto feeder data with species - you can modify this based on your needs
    allFeeders = [
        {
            id: 1,
            name: 'Goat Feeder #1',
            location: 'East Pasture',
            icon: '🐐',
            species: 'Goat',
            status: 'active',
            foodLevel: 75,
            mealPercent: 85,
            nextFeeding: '14:00',
            lastFeeding: '08:00',
            dailyCount: 2,
            totalFeeds: 1456
        },
        {
            id: 2,
            name: 'Goat Feeder #2',
            location: 'West Pasture',
            icon: '🐐',
            species: 'Goat',
            status: 'active',
            foodLevel: 65,
            mealPercent: 85,
            nextFeeding: '14:00',
            lastFeeding: '08:00',
            dailyCount: 2,
            totalFeeds: 1234
        },
        {
            id: 3,
            name: 'Sugar Glider Feeder',
            location: 'Sugar Glider Room',
            icon: '🐿️',
            species: 'Sugarglider',
            status: 'active',
            foodLevel: 45,
            mealPercent: 30,
            nextFeeding: '14:00',
            lastFeeding: '10:00',
            dailyCount: 3,
            totalFeeds: 3210
        },
        {
            id: 4,
            name: 'Porcupine Feeder',
            location: 'Porcupine Habitat',
            icon: '🦔',
            species: 'Porcupine',
            status: 'active',
            foodLevel: 60,
            mealPercent: 68,
            nextFeeding: '10:00',
            lastFeeding: '06:00',
            dailyCount: 2,
            totalFeeds: 892
        },
        {
            id: 5,
            name: 'Snail Feeder #1',
            location: 'Snail Terrarium',
            icon: '🐌',
            species: 'Snail',
            status: 'inactive',
            foodLevel: 30,
            mealPercent: 45,
            nextFeeding: '22:00',
            lastFeeding: '18:00',
            dailyCount: 1,
            totalFeeds: 567
        },
        {
            id: 6,
            name: 'Fox Feeder',
            location: 'Fox Enclosure',
            icon: '🦊',
            species: 'Fox',
            status: 'active',
            foodLevel: 20,
            mealPercent: 20,
            nextFeeding: '18:00',
            lastFeeding: '06:00',
            dailyCount: 2,
            totalFeeds: 2134
        },
        {
            id: 7,
            name: 'Alligator Feeder',
            location: 'Alligator Pool',
            icon: '🐊',
            species: 'Alligator',
            status: 'maintenance',
            foodLevel: 20,
            mealPercent: 20,
            nextFeeding: '18:00',
            lastFeeding: '06:00',
            dailyCount: 1,
            totalFeeds: 678
        }
    ];

    // Filter feeders by selected species
    const filteredFeeders = allFeeders.filter(feeder => feeder.species === speciesFilter);

    // Species display names
    const speciesDisplayNames = {
        'Goat': 'Goats',
        'Sugarglider': 'Sugar Gliders',
        'Alligator': 'Alligators',
        'Snail': 'Snails',
        'Porcupine': 'Porcupines',
        'Fox': 'Foxes'
    };

    // Species icons
    const speciesIcons = {
        'Goat': '🐐',
        'Sugarglider': '🐿️',
        'Alligator': '🐊',
        'Snail': '🐌',
        'Porcupine': '🦔',
        'Fox': '🦊'
    };

    // Species food/diet names
    const speciesFoodNames = {
        'Goat': 'Hay & Grain Mix',
        'Sugarglider': 'Fresh Fruits',
        'Alligator': 'Raw Chicken',
        'Snail': 'Fresh Vegetables',
        'Porcupine': 'Fruits & Nuts',
        'Fox': 'Sliced Meat'
    };

    const displayName = speciesDisplayNames[speciesFilter] || speciesFilter;
    const icon = speciesIcons[speciesFilter] || '';
    const foodName = speciesFoodNames[speciesFilter] || 'Standard Feed';
    const dailyIntake = speciesDailyIntake[speciesFilter] || { amount: 100, unit: 'g', meals: 1 };

    // Get intake information
    const intakePerKg = speciesIntakePerKg[speciesFilter] || 50;
    const quantity = speciesQuantity[speciesFilter] || 1;
    // Total requirement is now the total food for the day (user input, not multiplied by quantity)
    const totalRequired = dailyIntake.amount;
    const mealsPerDay = dailyIntake.meals;
    
    // Calculate portion size from total food divided by meals per day (standardized)
    const calculatedPortionGrams = mealsPerDay > 0 ? Math.round(totalRequired / mealsPerDay) : totalRequired;
    const portionInfo = { grams: calculatedPortionGrams, unit: dailyIntake.unit || 'g' };
    
    // Update speciesPortionInfo to match calculated value (for consistency)
    speciesPortionInfo[speciesFilter] = portionInfo;
    
    const todayAdded = Math.min(todayFoodAdded[speciesFilter] || 0, totalRequired); // Cap at total required
    const progressPercent = Math.min(100, Math.round((todayAdded / totalRequired) * 100));

    // Initialize portion count if not set
    if (!portionCounts[speciesFilter]) {
        portionCounts[speciesFilter] = 1;
    }

    const currentPortions = portionCounts[speciesFilter] || 1;
    const totalAmount = currentPortions * portionInfo.grams;

    // Initialize auto feeder state if not set
    if (autoFeederEnabled[speciesFilter] === undefined) {
        // Set Sugar Glider to ON by default, others to OFF
        autoFeederEnabled[speciesFilter] = speciesFilter === 'Sugarglider' ? true : false;
    }

    // Calculate average meal percentage for the species
    // Initialize current meal percent if not set (from feeder data or default)
    if (currentMealPercent[speciesFilter] === undefined) {
        if (filteredFeeders.length > 0) {
            const totalPercent = filteredFeeders.reduce((sum, feeder) => sum + (feeder.mealPercent || 0), 0);
            currentMealPercent[speciesFilter] = Math.round(totalPercent / filteredFeeders.length);
        } else {
            currentMealPercent[speciesFilter] = 0;
        }
    }
    let mealPercent = currentMealPercent[speciesFilter] || 0;

    // Show empty state if no feeders found
    if (filteredFeeders.length === 0) {
        dashboard.innerHTML = `
            <div class="species-feeder-section slide-up-animate">
                <div class="species-feeder-content">
                    <div class="species-feeder-header">
                        <h2 class="species-feeder-title">${icon} ${displayName}</h2>
                    </div>
                    <div style="text-align: center; padding: 48px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🤖</div>
                        <div style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">No feeders found</div>
                        <div style="font-size: 14px; color: var(--text-secondary);">No auto feeders available for ${displayName}</div>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    // Calculate SVG circle values for circular progress meter (responsive)
    // Use viewBox for responsive scaling - base size is 180x180 (reduced by 40%)
    const svgSize = 180;
    const radius = 72;
    const center = svgSize / 2;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (mealPercent / 100) * circumference;
    const initialOffset = circumference; // Start from 0%

    // Determine food level status and color
    const foodStatus = getFoodStatus(mealPercent);
    let statusLabel = 'Good';
    let statusColor = '#3b82f6'; // Blue
    let gradientColors = ['#3b82f6', '#60a5fa']; // Blue gradient

    if (foodStatus === 'very-low') {
        statusLabel = 'Very Low';
        statusColor = '#ef4444'; // Red
        gradientColors = ['#ef4444', '#f87171']; // Red gradient
    } else if (foodStatus === 'low') {
        statusLabel = 'Low';
        statusColor = '#fbbf24'; // Yellow
        gradientColors = ['#fbbf24', '#fcd34d']; // Yellow gradient
    } else if (foodStatus === 'good') {
        statusLabel = 'Good';
        statusColor = '#3b82f6'; // Blue
        gradientColors = ['#3b82f6', '#60a5fa']; // Blue gradient
    } else if (foodStatus === 'excellent') {
        statusLabel = 'Excellent';
        statusColor = '#10b981'; // Green
        gradientColors = ['#10b981', '#34d399']; // Green gradient
    }

    // Ensure auto feeder variables are defined (for template string)
    const scheduleTimes = autoFeederSchedules[speciesFilter] || [];
    const autoFeederOn = autoFeederEnabled[speciesFilter] || false;

    // Get portion info for unit
    const portionUnit = portionInfo.unit || 'g';

    // Render only the selected species as one big content area
    dashboard.innerHTML = `
        <div class="species-feeder-section slide-up-animate" data-species="${speciesFilter}">
            <div class="feeding-layout-container">
                <!-- LEFT SIDE: Scrollable Content -->
                <div class="feeding-left-content">
                    <!-- Manual Feed Controller and Animal Selection Container -->
                    <div class="manual-feed-animal-selection-container">
                        <!-- Animal Name Title Row -->
                        <div class="animal-feeding-title-row">
                            <div class="animal-selection-title">
                                <span class="animal-selection-title-icon">${icon}</span>
                                <span class="animal-selection-title-text">${displayName} Feeding</span>
                            </div>
                        </div>
                        <!-- Cards Row -->
                        <div class="animal-feeding-cards-row">
                            <!-- Animal Selection Column -->
                            <div class="animal-selection-column">
                                ${renderAnimalSelection(speciesFilter, displayName, icon)}
                            </div>
                            <!-- Manual Feed Controller Column -->
                            <div class="manual-feed-column">
                            <div class="portion-control-card">
                        <div class="card-header">
                            <h3 class="card-title">Manual Feeding Controller</h3>
                            <button class="edit-control-btn" onclick="toggleEditPortionControl('${speciesFilter}')" id="edit-control-btn-${speciesFilter}">
                                Edit Amount
                            </button>
                        </div>
                        
                        <!-- Normal View -->
                        <div class="portion-control-content" id="portion-control-content-${speciesFilter}">
                            <div class="portion-info">
                                <div class="portion-label">1 Portion =</div>
                                <div class="portion-amount" id="portion-amount-display-${speciesFilter}">${portionInfo.grams}${portionInfo.unit}</div>
                            </div>
                            <div class="portion-controls">
                                <button class="portion-btn minus-btn" onclick="adjustPortions('${speciesFilter}', -1)">−</button>
                                <div class="portion-count" id="portion-count-${speciesFilter}">${currentPortions}</div>
                                <button class="portion-btn plus-btn" onclick="adjustPortions('${speciesFilter}', 1)">+</button>
                            </div>
                            <div class="portion-total">
                                Total: <span class="portion-total-amount" id="portion-total-${speciesFilter}">${totalAmount}</span>${portionInfo.unit}
                            </div>
                            <div class="portion-daily-info">
                                <div class="portion-daily-item">
                                    <span class="portion-daily-label">Total Food Today:</span>
                                    <span class="portion-daily-value" id="portion-daily-total-${speciesFilter}">${Math.min(todayAdded, totalRequired)}${dailyIntake.unit} / ${totalRequired}${dailyIntake.unit}</span>
                                </div>
                                <div class="portion-daily-item">
                                    <span class="portion-daily-label">Meal Times:</span>
                                    <span class="portion-daily-value" id="portion-meal-times-${speciesFilter}">${dailyIntake.meals} meal${dailyIntake.meals > 1 ? 's' : ''} per day</span>
                                </div>
                            </div>
                            <div class="feed-button-container">
                                <button class="feed-button" onclick="feedAnimals('${speciesFilter}')">
                                    Feed Now
                                </button>
                            </div>
                                </div>
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>
            
                    <div class="auto-feeder-schedule-card">
                <div class="auto-feeder-header-title">
                    <h2 class="auto-feeder-title">Auto Feeder Controller for ${displayName} ${icon}</h2>
                    <div class="auto-feeder-toggle-container">
                        <label class="toggle-switch">
                            <input type="checkbox" id="auto-feeder-toggle-${speciesFilter}" ${autoFeederOn ? 'checked' : ''} onchange="toggleAutoFeeder('${speciesFilter}')">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="toggle-label">${autoFeederOn ? 'ON' : 'OFF'}</span>
                    </div>
                </div>
                
                <div class="auto-feeder-info-banner ${autoFeederOn ? 'banner-on' : 'banner-off'}">
                    <div class="info-banner-text">
                        ${autoFeederOn 
                            ? '🛈︎ AUTO FEEDER IS ACTIVE <br> Please configure your feeding schedule with accurate times and portion amounts to ensure proper automatic feeding.' 
                            : '🛈︎ AUTO FEEDER IS DISABLED <br> Make sure to turn on the toggle to enable the automation.'}
                    </div>
                </div>
                
                <div class="schedule-content-container">
                    <div class="schedule-header-actions">
                        <h3 class="schedule-title">Feeding Schedule</h3>
                        ${autoFeederOn ? `
                            <button class="edit-schedule-btn">
                                Edit Schedule
                            </button>
                        ` : ''}
                    </div>
                    ${autoFeederOn ? `
                        <div class="schedule-grid" id="schedule-list-${speciesFilter}">
                            ${generateScheduleList(speciesFilter)}
                        </div>
                    ` : `
                        <div class="schedule-disabled-message">
                            <div class="schedule-disabled-icon">🔒</div>
                            <div class="schedule-disabled-text">Enable auto feeder to view and manage feeding schedule</div>
                        </div>
                    `}
                </div>
            </div>
                
            <div class="feeder-history-card">
                <div class="card-header">
                    <h3 class="card-title">Feeding History</h3>
                </div>
                <div class="history-filter-container">
                    <div class="date-filter-group">
                        <label class="filter-label">Date:</label>
                        <input type="date" class="date-filter-input" id="history-date-${speciesFilter}" value="" onchange="filterHistoryByDate('${speciesFilter}')">
                    </div>
                    <div class="day-filter-group">
                        <label class="filter-label">Day:</label>
                        <select class="day-filter-select" id="history-day-${speciesFilter}" onchange="filterHistoryByDay('${speciesFilter}')">
                            <option value="all" selected>All Days</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="this-week">This Week</option>
                            <option value="this-month">This Month</option>
                        </select>
                    </div>
                </div>
                <div class="history-list" id="history-list-${speciesFilter}">
                    ${renderFeederHistory(speciesFilter, null, null)}
                </div>
            </div>
            </div>
                
            <!-- RIGHT SIDE: Fixed Meal Meter -->
            <div class="feeding-right-sidebar">
                    <div class="meal-meter-card">
                        <h3 class="meal-meter-title">${displayName}' Food Level</h3>
                        <div class="meal-meter-wrapper">
                            <div class="food-name-container">
                                <div class="food-name">${foodName}</div>
                            </div>
                            <div class="meal-meter-container">
                                <div class="circular-meter-shadow food-level-${foodStatus}"></div>
                                <div class="circular-meter">
                                    <svg class="circular-meter-svg" viewBox="0 0 ${svgSize} ${svgSize}" preserveAspectRatio="xMidYMid meet">
                                        <circle
                                            class="circular-meter-background"
                                            cx="${center}"
                                            cy="${center}"
                                            r="${radius}"
                                            stroke="rgba(99, 102, 241, 0.1)"
                                            stroke-width="${strokeWidth}"
                                            fill="none"
                                        />
                                        <circle
                                            class="circular-meter-progress food-level-${foodStatus}"
                                            cx="${center}"
                                            cy="${center}"
                                            r="${radius}"
                                            stroke="url(#gradient-${speciesFilter})"
                                            stroke-width="${strokeWidth}"
                                            fill="none"
                                            stroke-linecap="round"
                                            stroke-dasharray="${circumference}"
                                            stroke-dashoffset="${circumference}"
                                            style="--circumference: ${circumference}; --target-offset: ${offset};"
                                            transform="rotate(-90 ${center} ${center})"
                                        />
                                        <defs>
                                            <linearGradient id="gradient-${speciesFilter}" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style="stop-color:${gradientColors[0]};stop-opacity:1" />
                                                <stop offset="100%" style="stop-color:${gradientColors[1]};stop-opacity:1" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div class="circular-meter-content">
                                        <div class="circular-meter-value" data-target="${mealPercent}">0%</div>
                                        <div class="circular-meter-label">Meal</div>
                                    </div>
                                </div>
                            </div>
                            <div class="food-level-badge food-level-${foodStatus}">
                                <span class="food-level-dot"></span>
                                <span class="food-level-label">${statusLabel}</span>
                            </div>
                        </div>
                        <div class="food-progress-section">
                            <div class="food-progress-label">
                                <span>Today's Food Added</span>
                                <span class="food-progress-amount" id="food-progress-amount-${speciesFilter}">${Math.min(todayAdded, totalRequired)}${dailyIntake.unit} / ${totalRequired}${dailyIntake.unit}</span>
                            </div>
                            <div class="food-progress-bar">
                                <div class="food-progress-fill" id="food-progress-fill-${speciesFilter}" style="width: ${progressPercent}%"></div>
                            </div>
                            <div class="food-progress-percent" id="food-progress-percent-${speciesFilter}">${progressPercent}%</div>
                        </div>
                    </div>
                    
                    <!-- Smart Assistant Card -->
                    <div class="daily-intake-section">
                        <div class="card-header daily-intake-header">
                            <h3 class="card-title">🤖 SMART FEEDING ASSISTANT</h3>
                            <div class="ai-badge">
                                <span class="ai-spark-icon">✨</span>
                                <span class="ai-badge-text">AI-Driven</span>
                            </div>
                        </div>
                        <div class="ai-chat-container">
                            <div class="ai-chat-input-container">
                                <input 
                                    type="text" 
                                    class="ai-chat-input" 
                                    id="ai-chat-input-${speciesFilter}" 
                                    placeholder="Ask me anything about feeding for ${displayName}..."
                                    onkeypress="if(event.key === 'Enter') submitAIChat('${speciesFilter}')"
                                >
                                <button class="ai-chat-submit-btn" onclick="submitAIChat('${speciesFilter}')">
                                    Send
                                </button>
                            </div>
                            <div class="ai-chat-response" id="ai-chat-response-${speciesFilter}">
                                <div class="ai-welcome-message">
                                    <div class="info-label">Information:</div>
                                    <div class="info-text">
                                        A normal intake of a <strong>${displayName}</strong> is <strong>${intakePerKg} g</strong> of food per day.
                                    </div>
                                    <div class="info-text">
                                        There are <strong>${quantity} ${displayName}</strong> in the cage, hence the cage requires approximately <strong>${totalRequired}${dailyIntake.unit}</strong> of food per day.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Trigger slide-up animation
    requestAnimationFrame(() => {
        const section = dashboard.querySelector('.species-feeder-section');
        if (section) {
            // Remove and re-add animation class to ensure it plays every time
            section.classList.remove('slide-up-animate');
            void section.offsetHeight; // Force reflow
            section.classList.add('slide-up-animate');
        }
    });

    // Animate the circular meter and percentage counter
    setTimeout(() => {
        const progressCircle = dashboard.querySelector('.circular-meter-progress');
        const valueElement = dashboard.querySelector('.circular-meter-value');
        const targetPercent = mealPercent;

        if (progressCircle && valueElement) {
            // Set the CSS variables for animation
            progressCircle.style.setProperty('--circumference', circumference.toString());
            progressCircle.style.setProperty('--target-offset', offset.toString());

            // Ensure initial state
            progressCircle.style.strokeDashoffset = circumference.toString();
            
            // Trigger the animation by adding the animate class
            requestAnimationFrame(() => {
                progressCircle.classList.add('animate');
            });

            // Animate the counter from 0 to target percentage
            const duration = 1500; // 1.5 seconds
            const startTime = Date.now();

            const animateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentPercent = Math.floor(progress * targetPercent);
                valueElement.textContent = currentPercent + '%';

                if (progress < 1) {
                    requestAnimationFrame(animateCounter);
                } else {
                    valueElement.textContent = targetPercent + '%';
                }
            };

            animateCounter();
        }
    }, 50);
    
    // Update tabs to reflect current meal percentages
    updateSpeciesTabs();
}

// Adjust portion count
function adjustPortions(species, change) {
    // Initialize if not exists
    if (!portionCounts[species]) {
        portionCounts[species] = 1;
    }

    // Update portion count (minimum 1)
    portionCounts[species] = Math.max(1, portionCounts[species] + change);

    // Update the UI
    const countElement = document.getElementById(`portion-count-${species}`);
    const totalElement = document.getElementById(`portion-total-${species}`);

    if (countElement && totalElement) {
        // Get standardized portion (calculated from daily intake)
        const dailyIntake = speciesDailyIntake[species] || { amount: 100, unit: 'g', meals: 1 };
        const totalRequired = dailyIntake.amount;
        const mealsPerDay = dailyIntake.meals;
        const portionGrams = mealsPerDay > 0 ? Math.round(totalRequired / mealsPerDay) : totalRequired;
        const portionInfo = { grams: portionGrams, unit: dailyIntake.unit || 'g' };
        
        const currentPortions = portionCounts[species];
        const totalAmount = currentPortions * portionInfo.grams;

        countElement.textContent = currentPortions;
        totalElement.textContent = totalAmount;
    }
}

// Feed animals function
function feedAnimals(species) {
    // Get standardized portion (calculated from daily intake)
    const dailyIntake = speciesDailyIntake[species] || { amount: 100, unit: 'g', meals: 1 };
    const totalRequired = dailyIntake.amount;
    const mealsPerDay = dailyIntake.meals;
    const portionGrams = mealsPerDay > 0 ? Math.round(totalRequired / mealsPerDay) : totalRequired;
    const portionInfo = { grams: portionGrams, unit: dailyIntake.unit || 'g' };
    
    const currentPortions = portionCounts[species] || 1;
    const feedAmount = currentPortions * portionInfo.grams;

    // Update today's food added
    if (!todayFoodAdded[species]) {
        todayFoodAdded[species] = 0;
    }
    todayFoodAdded[species] += feedAmount;

    // Update meal meter percentage based on food added
    // Assume the feeder capacity is based on daily requirement
    // Total requirement is already calculated above (totalRequired)

    // Calculate percentage increase: (feedAmount / totalRequired) * 100
    // But we need to consider current meal percent and add to it
    // Let's say each portion adds a percentage based on total capacity
    const percentPerGram = 100 / totalRequired; // Percentage per gram
    const percentIncrease = feedAmount * percentPerGram;

    // Initialize meal percent if not set
    if (currentMealPercent[species] === undefined) {
        // Get initial value from feeders or start at 0
        const filteredFeeders = allFeeders.filter(feeder => feeder.species === species);
        if (filteredFeeders.length > 0) {
            const totalPercent = filteredFeeders.reduce((sum, feeder) => sum + (feeder.mealPercent || 0), 0);
            currentMealPercent[species] = Math.round(totalPercent / filteredFeeders.length);
        } else {
            currentMealPercent[species] = 0;
        }
    }

    // Increase meal meter percentage (cap at 100%)
    currentMealPercent[species] = Math.min(100, Math.round((currentMealPercent[species] || 0) + percentIncrease));

    // Show notification/toast
    if (typeof showToast === 'function') {
        showToast(`Fed ${feedAmount}${portionInfo.unit} to ${species}!`);
    } else {
        alert(`Fed ${feedAmount}${portionInfo.unit} to ${species}!`);
    }

    // Re-render the dashboard to update progress and meal meter
    renderFeederDashboard(species);
    
    // Update tabs to reflect new meal percentages
    updateSpeciesTabs();
}

// Toggle auto feeder on/off
function toggleAutoFeeder(species) {
    const toggle = document.getElementById(`auto-feeder-toggle-${species}`);
    if (!toggle) return;

    autoFeederEnabled[species] = toggle.checked;

    // Update the label
    const toggleContainer = toggle.closest('.auto-feeder-toggle-container');
    if (toggleContainer) {
        const label = toggleContainer.querySelector('.toggle-label');
        if (label) {
            label.textContent = autoFeederEnabled[species] ? 'ON' : 'OFF';
        }
    }

    const autoFeederOn = autoFeederEnabled[species];

    // Update the info banner inside the card but outside schedule-content-container
    const scheduleCard = toggle.closest('.auto-feeder-schedule-card');
    if (scheduleCard) {
        const banner = scheduleCard.querySelector('.auto-feeder-info-banner');
        if (banner) {
            banner.className = `auto-feeder-info-banner ${autoFeederOn ? 'banner-on' : 'banner-off'}`;
            banner.innerHTML = `
                <div class="info-banner-text">
                    ${autoFeederOn 
                        ? '🛈︎ AUTO FEEDER IS ACTIVE <br>Please configure your feeding schedule with accurate times and portion amounts to ensure proper automatic feeding.' 
                        : '🛈︎ AUTO FEEDER IS DISABLED <br> Make sure to turn on the toggle to enable the automation.'}
                </div>
            `;
        }

        // Re-render the schedule content container to show/hide button and schedule
        const scheduleContentContainer = scheduleCard.querySelector('.schedule-content-container');
        
        if (scheduleContentContainer) {
            scheduleContentContainer.innerHTML = `
                <div class="schedule-header-actions">
                    <h3 class="schedule-title">Feeding Schedule</h3>
                    ${autoFeederOn ? `
                        <button class="edit-schedule-btn">
                            Edit Schedule
                        </button>
                    ` : ''}
                </div>
                ${autoFeederOn ? `
                    <div class="schedule-grid" id="schedule-list-${species}">
                        ${generateScheduleList(species)}
                    </div>
                ` : `
                    <div class="schedule-disabled-message">
                        <div class="schedule-disabled-icon">🔒</div>
                        <div class="schedule-disabled-text">Enable auto feeder to view and manage feeding schedule</div>
                    </div>
                `}
            `;
        }
    }

    // Show notification
    if (typeof showToast === 'function') {
        showToast(`Auto feeder ${autoFeederEnabled[species] ? 'enabled' : 'disabled'} for ${species}`);
    } else {
        console.log(`Auto feeder ${autoFeederEnabled[species] ? 'enabled' : 'disabled'} for ${species}`);
    }

    // Here you would typically send a command to the actual feeder hardware
    // to enable/disable automatic feeding
}

// Render feeder history
function renderFeederHistory(species, selectedDate = null, dayFilter = null) {
    let history = feederHistoryData[species] || [];

    // Filter by date if provided
    if (selectedDate) {
        history = history.filter(item => item.date === selectedDate);
    }

    // Filter by day if provided
    if (dayFilter && dayFilter !== 'all') {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        switch (dayFilter) {
            case 'today':
                history = history.filter(item => item.date === todayStr);
                break;
            case 'yesterday':
                history = history.filter(item => item.date === yesterdayStr);
                break;
            case 'this-week':
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                history = history.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate >= weekAgo && itemDate <= today;
                });
                break;
            case 'this-month':
                history = history.filter(item => {
                    const itemDate = new Date(item.date);
                    return itemDate.getMonth() === today.getMonth() &&
                        itemDate.getFullYear() === today.getFullYear();
                });
                break;
        }
    }

    // Sort by date and time (most recent first)
    history.sort((a, b) => {
        if (a.date !== b.date) {
            return new Date(b.date) - new Date(a.date);
        }
        return b.time.localeCompare(a.time);
    });

    if (history.length === 0) {
        return '<div class="no-history">No feeding history found for the selected period.</div>';
    }

    // Table header
    let tableHTML = `
        <div class="history-table">
            <div class="history-table-header">
                <div class="history-col-date">Date</div>
                <div class="history-col-time">Time</div>
                <div class="history-col-portions">Portions</div>
                <div class="history-col-grams">Grams</div>
                <div class="history-col-type">Type</div>
            </div>
            <div class="history-table-body">
    `;

    // Table rows
    history.forEach(item => {
        const dateObj = new Date(item.date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const typeClass = item.type === 'Auto Feeder' ? 'history-type-auto' : 'history-type-manual';
        const typeIcon = item.type === 'Auto Feeder' ? '🤖' : '👤';

        tableHTML += `
            <div class="history-table-row">
                <div class="history-col-date">
                    <span class="history-day">${dayName}</span>
                    <span class="history-date-value">${formattedDate}</span>
                </div>
                <div class="history-col-time">
                    <span class="history-time-icon">⏰</span>
                    <span class="history-time-value">${item.time}</span>
                </div>
                <div class="history-col-portions">${item.portions} portion${item.portions > 1 ? 's' : ''}</div>
                <div class="history-col-grams">${item.grams}g</div>
                <div class="history-col-type">
                    <div class="history-type ${typeClass}">
                        <span class="history-type-icon">${typeIcon}</span>
                        <span class="history-type-label">${item.type}</span>
                    </div>
                </div>
            </div>
        `;
    });

    tableHTML += `
            </div>
        </div>
    `;

    return tableHTML;
}

// Filter history by date
function filterHistoryByDate(species) {
    const dateInput = document.getElementById(`history-date-${species}`);
    const daySelect = document.getElementById(`history-day-${species}`);
    const historyList = document.getElementById(`history-list-${species}`);

    if (!dateInput || !historyList) return;

    // Reset day filter when date is selected
    if (daySelect && dateInput.value) {
        daySelect.value = 'all';
    }

    const selectedDate = dateInput.value || null;
    historyList.innerHTML = renderFeederHistory(species, selectedDate, null);
}

// Filter history by day
function filterHistoryByDay(species) {
    const daySelect = document.getElementById(`history-day-${species}`);
    const dateInput = document.getElementById(`history-date-${species}`);
    const historyList = document.getElementById(`history-list-${species}`);

    if (!daySelect || !historyList) return;

    // Clear date filter when day filter is used
    if (dateInput && daySelect.value !== 'all') {
        dateInput.value = '';
    }

    const dayFilter = daySelect.value;
    historyList.innerHTML = renderFeederHistory(species, null, dayFilter);
}

// Open edit portion control modal
function toggleEditPortionControl(species) {
    const modal = document.getElementById('editPortionModal');
    const modalBody = document.getElementById('edit-portion-modal-body');
    const modalSubtitle = document.getElementById('edit-modal-subtitle');
    
    if (!modal || !modalBody) return;

    // Get current values
    const portionInfo = speciesPortionInfo[species] || { grams: 100, unit: 'g' };
    const dailyIntake = speciesDailyIntake[species] || { amount: 100, unit: 'g', meals: 1 };
    // totalRequired is now the total food for the day (not multiplied by quantity)
    const totalRequired = dailyIntake.amount;

    // Set modal subtitle
    const displayName = species.replace(/([A-Z])/g, ' $1').trim();
    modalSubtitle.textContent = `Adjust feeding parameters for ${displayName}`;

    // Generate modal content
    modalBody.innerHTML = `
        <div class="edit-control-item">
            <label class="edit-control-label">Total Food for the Day (grams):</label>
            <input type="number" class="edit-control-input" id="modal-edit-total-food-${species}" value="${totalRequired}" min="1" oninput="updatePortionControlPreviewModal('${species}')">
        </div>
        <div class="edit-control-item">
            <label class="edit-control-label">Meals per Day:</label>
            <input type="number" class="edit-control-input" id="modal-edit-meals-per-day-${species}" value="${dailyIntake.meals}" min="1" oninput="updatePortionControlPreviewModal('${species}')">
        </div>
        <div class="edit-preview-section">
            <div class="edit-preview-label">Suggested Portion Size:</div>
            <div class="edit-preview-values">
                <div>1 Portion = <strong id="modal-preview-portion-grams-${species}">${Math.round(totalRequired / dailyIntake.meals)}${portionInfo.unit}</strong> (Total ÷ Meals)</div>
                <div>Total Food per Day = <strong id="modal-preview-total-food-${species}">${totalRequired}${dailyIntake.unit}</strong></div>
                <div>Meals per Day = <strong id="modal-preview-meals-${species}">${dailyIntake.meals}</strong></div>
            </div>
        </div>
    `;

    // Store the current species for the modal
    modal.dataset.currentSpecies = species;

    // Update recommended value
    updatePortionControlPreviewModal(species);

    // Show modal
    modal.classList.add('active');
}

// Close edit portion control modal
function closeEditPortionModal() {
    const modal = document.getElementById('editPortionModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Update preview when editing values in modal
function updatePortionControlPreviewModal(species) {
    const totalFoodInput = document.getElementById(`modal-edit-total-food-${species}`);
    const mealsPerDayInput = document.getElementById(`modal-edit-meals-per-day-${species}`);

    if (!totalFoodInput || !mealsPerDayInput) return;

    const totalFood = parseInt(totalFoodInput.value) || 0;
    const mealsPerDay = parseInt(mealsPerDayInput.value) || 1;

    const dailyIntake = speciesDailyIntake[species] || { unit: 'g' };
    const portionInfo = speciesPortionInfo[species] || { unit: 'g' };

    // Calculate suggested portion size
    const suggestedPortionSize = mealsPerDay > 0 ? Math.round(totalFood / mealsPerDay) : 0;

    // Update preview values
    const previewPortionGrams = document.getElementById(`modal-preview-portion-grams-${species}`);
    const previewTotalFood = document.getElementById(`modal-preview-total-food-${species}`);
    const previewMeals = document.getElementById(`modal-preview-meals-${species}`);

    if (previewPortionGrams) {
        previewPortionGrams.textContent = `${suggestedPortionSize}${portionInfo.unit} (Total ÷ Meals)`;
    }
    if (previewTotalFood) {
        previewTotalFood.textContent = `${totalFood}${dailyIntake.unit}`;
    }
    if (previewMeals) {
        previewMeals.textContent = `${mealsPerDay}`;
    }
}

// Update preview when editing values
function updatePortionControlPreview(species) {
    const cageRequiredInput = document.getElementById(`edit-cage-required-${species}`);
    const portionGramsInput = document.getElementById(`edit-portion-grams-${species}`);

    if (!cageRequiredInput || !portionGramsInput) return;

    const newCageRequired = parseInt(cageRequiredInput.value) || 0;
    const newPortionGrams = parseInt(portionGramsInput.value) || 0;

    // Update preview in edit section
    const previewCageRequired = document.getElementById(`preview-cage-required-${species}`);
    const previewPortionGrams = document.getElementById(`preview-portion-grams-${species}`);

    if (previewCageRequired) {
        const dailyIntake = speciesDailyIntake[species] || { unit: 'g' };
        previewCageRequired.textContent = `${newCageRequired}${dailyIntake.unit}`;
    }
    if (previewPortionGrams) {
        const portionInfo = speciesPortionInfo[species] || { unit: 'g' };
        previewPortionGrams.textContent = `${newPortionGrams}${portionInfo.unit}`;
    }

    // Get current values for preview updates in the content section
    const dailyIntake = speciesDailyIntake[species] || { amount: 100, unit: 'g', meals: 1 };
    const totalRequired = dailyIntake.amount; // Use standardized total from dailyIntake
    const portionCount = portionCounts[species] || 1;
    const todayAdded = Math.min(todayFoodAdded[species] || 0, totalRequired); // Cap at total required
    const newTotalAmount = portionCount * newPortionGrams;
    const progressPercent = Math.min(100, Math.round((todayAdded / totalRequired) * 100));

    // Update preview elements in content section (if they exist)
    const progressAmount = document.getElementById(`food-progress-amount-${species}`);
    const progressFill = document.getElementById(`food-progress-fill-${species}`);
    const progressPercentEl = document.getElementById(`food-progress-percent-${species}`);
    const portionAmountDisplay = document.getElementById(`portion-amount-display-${species}`);
    const portionTotal = document.getElementById(`portion-total-${species}`);

    if (progressAmount) {
        const cappedTodayAdded = Math.min(todayAdded, totalRequired);
        progressAmount.textContent = `${cappedTodayAdded}${dailyIntake.unit} / ${totalRequired}${dailyIntake.unit}`;
    }
    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
    }
    if (progressPercentEl) {
        progressPercentEl.textContent = `${progressPercent}%`;
    }
    if (portionAmountDisplay) {
        portionAmountDisplay.textContent = `${newPortionGrams}${dailyIntake.unit}`;
    }
    if (portionTotal) {
        portionTotal.textContent = newTotalAmount;
    }
    
    // Update daily info fields
    const portionDailyTotal = document.getElementById(`portion-daily-total-${species}`);
    const portionMealTimes = document.getElementById(`portion-meal-times-${species}`);
    
    if (portionDailyTotal) {
        const cappedTodayAdded = Math.min(todayAdded, totalRequired);
        portionDailyTotal.textContent = `${cappedTodayAdded}${dailyIntake.unit} / ${totalRequired}${dailyIntake.unit}`;
    }
    if (portionMealTimes) {
        portionMealTimes.textContent = `${dailyIntake.meals} meal${dailyIntake.meals > 1 ? 's' : ''} per day`;
    }
}

// Submit edit changes from modal
function submitEditPortionControlModal() {
    const modal = document.getElementById('editPortionModal');
    if (!modal) return;

    const species = modal.dataset.currentSpecies;
    if (!species) return;

    const totalFoodInput = document.getElementById(`modal-edit-total-food-${species}`);
    const mealsPerDayInput = document.getElementById(`modal-edit-meals-per-day-${species}`);

    if (!totalFoodInput || !mealsPerDayInput) return;

    const totalFood = parseInt(totalFoodInput.value) || 0;
    const mealsPerDay = parseInt(mealsPerDayInput.value) || 1;

    if (totalFood <= 0 || mealsPerDay <= 0) {
        alert('Please enter valid positive numbers');
        return;
    }

    // Calculate portion size (total food divided by meals per day)
    const portionSize = Math.round(totalFood / mealsPerDay);

    // Update the data (in a real app, this would save to backend)
    speciesPortionInfo[species] = { grams: portionSize, unit: 'g' };
    speciesDailyIntake[species] = { ...speciesDailyIntake[species], amount: totalFood, meals: mealsPerDay };

    // Close modal
    closeEditPortionModal();

    // Re-render dashboard to reflect changes
    renderFeederDashboard(species);

    // Show notification
    if (typeof showToast === 'function') {
        showToast('Portion control settings updated');
    }
}

// Toggle daily intake card collapse/expand

// Handle AI chat submission
function submitAIChat(species) {
    const chatInput = document.getElementById(`ai-chat-input-${species}`);
    const chatResponse = document.getElementById(`ai-chat-response-${species}`);
    
    if (!chatInput || !chatResponse) return;
    
    const question = chatInput.value.trim();
    
    if (!question) {
        return; // Don't submit empty messages
    }
    
    // Get species information for context
    const displayName = species.replace(/([A-Z])/g, ' $1').trim();
    const portionInfo = speciesPortionInfo[species] || { grams: 100, unit: 'g' };
    const dailyIntake = speciesDailyIntake[species] || { amount: 100, unit: 'g', meals: 1 };
    const intakePerKg = speciesIntakePerKg[species] || 50;
    const quantity = speciesQuantity[species] || 1;
    const totalRequired = dailyIntake.amount * quantity;
    
    // Show user's question
    const userMessage = `
        <div class="ai-chat-message ai-user-message">
            <div class="ai-message-content">
                <strong>You:</strong> ${question}
            </div>
        </div>
    `;
    
    // Generate AI response (dummy response for now)
    const aiResponse = generateAIResponse(question, displayName, portionInfo, dailyIntake, intakePerKg, quantity, totalRequired);
    
    const aiMessage = `
        <div class="ai-chat-message ai-assistant-message">
            <div class="ai-message-content">
                <strong>AI-Helper:</strong> ${aiResponse}
            </div>
        </div>
    `;
    
    // Append messages to response area
    chatResponse.innerHTML += userMessage + aiMessage;
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatResponse.scrollTop = chatResponse.scrollHeight;
}

// Generate dummy AI response based on question
function generateAIResponse(question, displayName, portionInfo, dailyIntake, intakePerKg, quantity, totalRequired) {
    const lowerQuestion = question.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerQuestion.includes('daily') || lowerQuestion.includes('day') || lowerQuestion.includes('intake')) {
        return `A normal intake of a ${displayName} is ${intakePerKg} g of food per day. With ${quantity} ${displayName} in the cage, the total daily requirement is approximately ${totalRequired}${dailyIntake.unit} of food per day.`;
    }
    
    if (lowerQuestion.includes('portion') || lowerQuestion.includes('feed') || lowerQuestion.includes('meal')) {
        return `Each portion for ${displayName} is ${portionInfo.grams}${portionInfo.unit}. The recommended feeding schedule is ${dailyIntake.meals} meal(s) per day to meet the daily requirement of ${totalRequired}${dailyIntake.unit}.`;
    }
    
    if (lowerQuestion.includes('schedule') || lowerQuestion.includes('time') || lowerQuestion.includes('when')) {
        return `For optimal health, ${displayName} should be fed ${dailyIntake.meals} time(s) per day. You can set up an automated feeding schedule in the Auto Feeder section above.`;
    }
    
    if (lowerQuestion.includes('how much') || lowerQuestion.includes('quantity') || lowerQuestion.includes('amount')) {
        return `For ${quantity} ${displayName}, the total daily food requirement is ${totalRequired}${dailyIntake.unit}, which equals ${portionInfo.grams}${portionInfo.unit} per portion. You can adjust these values using the "Edit Amount" button in the Manual Feeding Control section.`;
    }
    
    // Default response
    return `For ${displayName}, the daily food intake is ${intakePerKg} g per animal. With ${quantity} animals in the cage, you'll need approximately ${totalRequired}${dailyIntake.unit} of food per day, divided into ${dailyIntake.meals} meal(s). Each portion is ${portionInfo.grams}${portionInfo.unit}. Is there anything specific you'd like to know about feeding?`;
}

// Filter feeders by species
function filterFeedersBySpecies(species) {
    currentSelectedSpecies = species;
    
    // Re-render dashboard with filtered feeders
    renderFeederDashboard(species);
    
    // Update tabs to reflect active state
    updateSpeciesTabs();
}

// Initialize feeding page when page loads
if (document.getElementById('feeding-section')) {
    document.addEventListener('DOMContentLoaded', initializeFeeding);
    
    // Re-trigger fade-in animation when section becomes active
    const feedingSection = document.getElementById('feeding-section');
    if (feedingSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (feedingSection.classList.contains('active')) {
                        const leftContent = document.querySelector('.feeding-left-content');
                        if (leftContent) {
                            // Force reflow to restart animation
                            leftContent.style.animation = 'none';
                            void leftContent.offsetWidth; // Trigger reflow
                            leftContent.style.animation = 'fadeInContent 0.6s ease-out';
                        }
                    }
                }
            });
        });
        
        observer.observe(feedingSection, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}