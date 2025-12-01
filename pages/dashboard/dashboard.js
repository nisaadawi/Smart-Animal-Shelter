const DASHBOARD_CENTER = [3.1125, 101.7915];
let dashboardMapInstance = null;
let dashboardMapMarkers = [];

<<<<<<< Updated upstream
const healthCenterTextPlugin = {
    id: 'healthCenterText',
    afterDraw(chart, args, pluginOptions) {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data.length) return;
        const arc = meta.data[0];
        const { ctx } = chart;
        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#0f172a';
        ctx.font = '600 28px "Inter", sans-serif';
        ctx.fillText(`${pluginOptions.percent || 0}%`, arc.x, arc.y - 4);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 12px "Inter", sans-serif';
        ctx.fillText(pluginOptions.label || 'Healthy', arc.x, arc.y + 18);
        ctx.restore();
    }
};

const healthRingShadowPlugin = {
    id: 'healthRingShadow',
    beforeDatasetsDraw(chart) {
        const meta = chart.getDatasetMeta(0);
        if (!meta || !meta.data.length) return;
        const arc = meta.data[0];
        const { ctx } = chart;
        ctx.save();
        ctx.beginPath();
        ctx.arc(arc.x, arc.y, arc.outerRadius + 10, 0, Math.PI * 2);
        ctx.arc(arc.x, arc.y, arc.outerRadius - 6, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.08)';
        ctx.shadowColor = 'rgba(79, 70, 229, 0.25)';
        ctx.shadowBlur = 30;
        ctx.fill();
        ctx.restore();
    }
};

const HEALTH_STATUS_META = {
    Good: { color: '#1dd3b0', label: 'Good', detail: 'Vitals stable' },
    Warning: { color: '#f4b942', label: 'Warning', detail: 'Monitor closely' },
    Danger: { color: '#f45d48', label: 'Danger', detail: 'Immediate action' }
};

function getAllAnimals() {
    return Object.values(animalDatabase || {}).flat();
}

// Initialize dashboard
=======
// Register center text plugin for donut charts
function registerCenterTextPlugin() {
    if (typeof Chart === 'undefined') return false;
    
    // Check if plugin is already registered
    try {
        if (Chart.registry && Chart.registry.getPlugin('centerText')) {
            return true;
        }
    } catch (e) {
        // Registry might not be available in older versions
    }
    
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: function(chart) {
            if (!chart || chart.config.type !== 'doughnut') return;
            if (!chart.chartArea) return;
            
            const ctx = chart.ctx;
            const centerX = chart.chartArea.left + (chart.chartArea.right - chart.chartArea.left) / 2;
            const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;
            
            // Calculate percentage from data
            if (!chart.data || !chart.data.datasets || !chart.data.datasets[0]) return;
            const data = chart.data.datasets[0].data;
            const total = data.reduce((a, b) => a + b, 0);
            if (total === 0) return;
            
            const goodValue = data[0] || 0; // First segment is "Good"
            const goodPercentage = ((goodValue / total) * 100).toFixed(0);
            
            ctx.save();
            // Main percentage text - Smaller and more elegant
            ctx.font = '800 24px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#22c55e';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${goodPercentage}%`, centerX, centerY - 8);
            
            // Subtitle text - Enhanced
            ctx.font = '600 11px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText('Healthy', centerX, centerY + 12);
            ctx.restore();
        }
    };
    
    try {
        Chart.register(centerTextPlugin);
        return true;
    } catch (e) {
        console.warn('Failed to register centerText plugin:', e);
        return false;
    }
}

>>>>>>> Stashed changes
function initializeDashboard() {
    updateDashboardStats();
    renderSpeciesChart();
    renderHealthStatusChart();
<<<<<<< Updated upstream
    renderUrgentAlerts();
    renderTaskProgress();
    renderInventoryHealth();
    renderTrackingMap();
    renderRecentActivity();
=======
    renderCriticalAlerts();
    renderSpeciesOverview();
    renderAttentionAlerts();
    renderUpcomingFeedings();
    renderLowStock();
    renderMiniMap();
    renderActivityTimeline();
    renderEnvironmentalStatus();
    renderCageGallery();
    initializeStickyHeader();
    renderQuarantinePopup();
    
    // Auto-refresh intervals
    setInterval(updateHeaderInfo, 60000);
    setInterval(() => {
        updateDashboardStats();
        if (typeof updateHeaderStats === 'function') {
            updateHeaderStats();
        }
        renderCriticalAlerts();
        renderSpeciesOverview();
        renderAttentionAlerts();
        renderUpcomingFeedings();
        renderLowStock();
        renderMiniMap();
        renderActivityTimeline();
        renderEnvironmentalStatus();
        renderCageGallery();
        updateStickyHeader();
    }, 30000); // Refresh every 30 seconds
    
    // Update time display every second
    setInterval(() => {
        const timeEl = document.getElementById('sidebarTime');
        if (timeEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            timeEl.textContent = timeString;
        }
        updateNextFeedingTime();
    }, 1000);
    
    // Update greeting every hour (in case user stays on page)
    setInterval(() => {
        updateGreeting();
    }, 3600000); // Every hour
    
    // Handle scroll for sticky header
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const stickyHeader = document.getElementById('dashboardStickyHeader');
        
        if (stickyHeader) {
            if (scrollTop > 100 && scrollTop > lastScrollTop) {
                stickyHeader.classList.add('visible');
            } else if (scrollTop < 50) {
                stickyHeader.classList.remove('visible');
            }
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize Sticky Header
function initializeStickyHeader() {
    const dashboardSection = document.getElementById('dashboard-section');
    if (!dashboardSection) return;
    
    // Create sticky header if it doesn't exist
    let stickyHeader = document.getElementById('dashboardStickyHeader');
    if (!stickyHeader) {
        stickyHeader = document.createElement('div');
        stickyHeader.id = 'dashboardStickyHeader';
        stickyHeader.className = 'dashboard-sticky-header';
        stickyHeader.innerHTML = `
            <div class="sticky-header-content">
                <div class="sticky-header-stat">
                    <span class="sticky-header-stat-icon">🐾</span>
                    <span class="sticky-header-stat-value" id="stickyTotalAnimals">0</span>
                    <span class="sticky-header-stat-label">animals</span>
                </div>
                <div class="sticky-header-stat">
                    <span class="sticky-header-stat-icon">⚠️</span>
                    <span class="sticky-header-stat-value" id="stickyNeedAttention">0</span>
                    <span class="sticky-header-stat-label">need attention</span>
                </div>
                <div class="sticky-header-stat">
                    <span class="sticky-header-stat-icon">🚨</span>
                    <span class="sticky-header-stat-value" id="stickyActiveAlert">0</span>
                    <span class="sticky-header-stat-label">active alert</span>
                </div>
            </div>
        `;
        dashboardSection.insertBefore(stickyHeader, dashboardSection.firstChild);
    }
    
    updateStickyHeader();
}

// Update Sticky Header
function updateStickyHeader() {
    const allAnimals = Object.values(animalDatabase).flat();
    const needAttention = allAnimals.filter(a => 
        a.health === 'warning' || a.health === 'danger' || (a.alerts && a.alerts.length > 0)
    ).length;
    const totalAlerts = allAnimals.reduce((sum, a) => sum + (a.alerts?.length || 0), 0);
    
    const totalEl = document.getElementById('stickyTotalAnimals');
    const attentionEl = document.getElementById('stickyNeedAttention');
    const alertEl = document.getElementById('stickyActiveAlert');
    
    if (totalEl) totalEl.textContent = allAnimals.length;
    if (attentionEl) attentionEl.textContent = needAttention;
    if (alertEl) alertEl.textContent = totalAlerts > 0 ? totalAlerts : '0';
}

// Update personalized greeting with dynamic subtitle
function updateGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const greetingSubtitleEl = document.querySelector('.greeting-subtitle-content');
    
    if (!greetingSubtitleEl) return;
    
    // Create descriptive subtitle for the dashboard
    const subtitle = 'Real-time shelter management and monitoring';
    
    // Smooth transition animation
    if (greetingSubtitleEl.textContent !== subtitle) {
        greetingSubtitleEl.style.opacity = '0';
        greetingSubtitleEl.style.transform = 'translateY(3px)';
        setTimeout(() => {
            greetingSubtitleEl.textContent = subtitle;
            greetingSubtitleEl.style.opacity = '1';
            greetingSubtitleEl.style.transform = 'translateY(0)';
        }, 150);
    } else {
        greetingSubtitleEl.textContent = subtitle;
    }
}

// Update sidebar greeting with date, time, and quick stats
function updateHeaderInfo() {
    const now = new Date();
    const hours = now.getHours();
    
    // Update dashboard greeting
    updateGreeting();
    
    const timeOfDayEl = document.getElementById('sidebarTimeOfDay');
    if (timeOfDayEl) {
        if (hours < 12) {
            timeOfDayEl.textContent = 'Morning';
        } else if (hours < 17) {
            timeOfDayEl.textContent = 'Afternoon';
        } else {
            timeOfDayEl.textContent = 'Evening';
        }
    }
    
    const dateEl = document.getElementById('sidebarDate');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
    
    const timeEl = document.getElementById('sidebarTime');
    if (timeEl) {
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        timeEl.textContent = timeString;
    }
    
    // Update header quick stats
    const allAnimals = Object.values(animalDatabase).flat();
    const totalAlerts = allAnimals.reduce((sum, a) => sum + (a.alerts?.length || 0), 0);
    const pendingTasks = feedingSchedule.filter(f => f.status === 'pending').length;
    
    const alertsCountEl = document.getElementById('headerAlertsCount');
    const tasksCountEl = document.getElementById('headerTasksCount');
    
    if (alertsCountEl) alertsCountEl.textContent = totalAlerts;
    if (tasksCountEl) tasksCountEl.textContent = pendingTasks;
>>>>>>> Stashed changes
}

// Update dashboard statistics
function updateDashboardStats() {
    const allAnimals = getAllAnimals();
    const needAttention = allAnimals.filter(a => a.health === 'warning' || a.health === 'danger' || a.alerts.length > 0).length;
    const trackingActive = allAnimals.filter(a => a.tracking.enabled).length;
    const pendingTasks = feedingSchedule.filter(f => f.status === 'pending').length;

    const needAttentionEl = document.getElementById('needAttention');
    const tasksPendingEl = document.getElementById('tasksPending');
    const trackingActiveEl = document.getElementById('trackingActive');
<<<<<<< Updated upstream
=======
    const needAttentionMetaEl = document.getElementById('needAttentionMeta');
    const tasksPendingMetaEl = document.getElementById('tasksPendingMeta');
    const trackingBatteryMetaEl = document.getElementById('trackingBatteryMeta');
>>>>>>> Stashed changes

    if (needAttentionEl) needAttentionEl.textContent = needAttention;
    if (tasksPendingEl) tasksPendingEl.textContent = pendingTasks;
    if (trackingActiveEl) trackingActiveEl.textContent = trackingActive;
<<<<<<< Updated upstream
=======
    
    if (needAttentionMetaEl) needAttentionMetaEl.textContent = needAttention > 0 ? 'Require immediate care' : 'All animals healthy';
    if (tasksPendingMetaEl) tasksPendingMetaEl.textContent = pendingTasks > 0 ? `${pendingTasks} scheduled today` : 'All feedings completed';
    if (trackingBatteryMetaEl) trackingBatteryMetaEl.textContent = batteryMeta;
>>>>>>> Stashed changes

    // Update badges
    const totalAlerts = allAnimals.reduce((sum, a) => sum + a.alerts.length, 0);
    const alertBadge = document.getElementById('alertBadge');
    if (alertBadge) alertBadge.textContent = totalAlerts;

    const lowStock = inventory.filter(i => i.stock < i.min).length;
    const inventoryBadge = document.getElementById('inventoryBadge');
    if (inventoryBadge) inventoryBadge.textContent = lowStock;
}

function renderSpeciesChart() {
    const canvas = document.getElementById('speciesChart');
    if (!canvas || !window.Chart) return;

    const allAnimals = getAllAnimals();
    const counts = {};
    allAnimals.forEach(animal => {
        counts[animal.species] = (counts[animal.species] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = labels.map(label => counts[label]);
    const colors = labels.map(label => trackingSpeciesMeta[label]?.color || '#6366f1');

    if (speciesChartInstance) speciesChartInstance.destroy();
    speciesChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Animals',
                data,
                backgroundColor: colors,
                borderRadius: 12,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#94a3b8', stepSize: 1 },
                    grid: { color: 'rgba(148, 163, 184, 0.3)', drawBorder: false }
                },
                x: {
                    ticks: { color: '#64748b' },
                    grid: { display: false }
                }
            }
        }
    });

    const summaryEl = document.getElementById('speciesSummary');
    if (summaryEl) {
        const total = data.reduce((sum, value) => sum + value, 0) || 1;
        const topSpecies = labels.map((label, index) => ({
            label,
            count: data[index],
            percent: Math.round((data[index] / total) * 100)
        })).sort((a, b) => b.count - a.count).slice(0, 3);

<<<<<<< Updated upstream
        summaryEl.innerHTML = `
            ${topSpecies.map(item => `
                <div class="chart-pill">
                    <strong>${item.label}</strong>
                    <span>${item.count} animals • ${item.percent}%</span>
                </div>
            `).join('')}
            <div class="chart-pill">
                <strong>${total}</strong>
                <span>Total animals tracked</span>
            </div>
        `;
    }
}

=======
    // Get the most urgent alert
    const topAlert = criticalAlerts[0];
    currentCriticalAlert = topAlert;

    if (!topAlert) {
        banner.style.display = 'none';
        return;
    }

    // Display the alert banner
    const meta = trackingSpeciesMeta[topAlert.species] || {};
    titleEl.textContent = `${meta.icon || '🐾'} ${topAlert.animal}`;
    messageEl.textContent = topAlert.alert;
    
    // Update action button
    if (actionBtn) {
        actionBtn.setAttribute('data-animal-id', topAlert.id);
    }
    
    banner.style.display = 'flex';
    banner.classList.add('show');
}

// Dismiss current critical alert
function dismissCriticalAlert() {
    if (currentCriticalAlert && currentCriticalAlert.alertKey) {
        dismissedAlerts.add(currentCriticalAlert.alertKey);
        currentCriticalAlert = null;
        
        const banner = document.getElementById('criticalAlertBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
                renderCriticalAlerts(); // Show next alert if any
            }, 300);
        }
    }
}

// Handle alert action (open modal or navigate)
function handleAlertAction() {
    const actionBtn = document.getElementById('alertActionBtn');
    if (!actionBtn) return;
    
    const animalId = actionBtn.getAttribute('data-animal-id');
    if (animalId) {
        // Open animal modal
        if (typeof openModal === 'function') {
            openModal(parseInt(animalId));
        } else {
            // Fallback: navigate to alerts page
            window.location.href = '../alerts/alerts.html';
        }
    } else {
        // Navigate to alerts page
        window.location.href = '../alerts/alerts.html';
    }
}

// Store current image index for each species
const speciesImageIndices = {};

// Normalize species names for display
function normalizeSpeciesName(species) {
    const nameMap = {
        'Giant Snail': 'Snail',
        'Red Fox': 'Fox'
    };
    return nameMap[species] || species;
}

// Render Species Overview
function renderSpeciesOverview() {
    const container = document.getElementById('speciesList');
    const totalEl = document.getElementById('speciesTotalValue');
    if (!container) return;

    if (typeof animalDatabase === 'undefined') {
        container.innerHTML = '<div class="species-loading">Animal data unavailable</div>';
        return;
    }

    const allAnimals = Object.values(animalDatabase).flat();
    const totalAnimals = allAnimals.length;
    const speciesCountEl = document.getElementById('speciesCount');

    if (totalEl) totalEl.textContent = totalAnimals;

    // Group animals by species with all their images and track alerts
    const speciesData = {};
    allAnimals.forEach(animal => {
        const species = animal.species || 'Unknown';
        const displayName = normalizeSpeciesName(species);
        
        // Use original species name as key for data grouping, but display normalized name
        if (!speciesData[species]) {
            speciesData[species] = {
                count: 0,
                animals: [],
                displayName: displayName,
                alertCount: 0,
                urgentCount: 0,
                warningCount: 0,
                // Per-category issue counts for clearer summary in the species cards
                quarantineCount: 0,
                healthCount: 0,
                feedingCount: 0,
                enrichmentCount: 0
            };
        }
        speciesData[species].count++;
        
        // Track animals needing attention
        const hasAlerts = animal.alerts && animal.alerts.length > 0;
        const hasHealthIssue = animal.health === 'danger' || animal.health === 'warning';
        if (hasAlerts || hasHealthIssue) {
            speciesData[species].alertCount++;
            if (animal.health === 'danger' || (hasAlerts && animal.alerts.some(a => 
                a.toLowerCase().includes('quarantine') || 
                a.toLowerCase().includes('contagious') ||
                a.toLowerCase().includes('isolat')
            ))) {
                speciesData[species].urgentCount++;
            } else if (animal.health === 'warning' || hasAlerts) {
                speciesData[species].warningCount++;
            }

            // Track per-category counts from alert messages
            if (hasAlerts) {
                animal.alerts.forEach(alertText => {
                    const lower = alertText.toLowerCase();
                    if (lower.includes('quarantine') || lower.includes('isolat') || lower.includes('contagious')) {
                        speciesData[species].quarantineCount++;
                    } else if (lower.includes('feeding') || lower.includes('appetite') || lower.includes('refused food') || lower.includes('missed')) {
                        speciesData[species].feedingCount++;
                    } else if (lower.includes('enrichment') || lower.includes('play') || lower.includes('activity')) {
                        speciesData[species].enrichmentCount++;
                    } else if (lower.includes('temperature') || lower.includes('vet') || lower.includes('health')) {
                        speciesData[species].healthCount++;
                    }
                });
            } else if (hasHealthIssue) {
                // Health issue without explicit alert text
                speciesData[species].healthCount++;
            }
        }
        
        if (animal.images && animal.images.length > 0) {
            speciesData[species].animals.push({
                name: animal.name,
                image: animal.images[0]
            });
        }
    });

    // Convert to array and sort by alert priority first, then by count descending
    const speciesList = Object.entries(speciesData)
        .sort((a, b) => {
            // First sort by urgent count (higher priority)
            if (b[1].urgentCount !== a[1].urgentCount) {
                return b[1].urgentCount - a[1].urgentCount;
            }
            // Then by warning count
            if (b[1].warningCount !== a[1].warningCount) {
                return b[1].warningCount - a[1].warningCount;
            }
            // Then by total alert count
            if (b[1].alertCount !== a[1].alertCount) {
                return b[1].alertCount - a[1].alertCount;
            }
            // Finally by total count
            return b[1].count - a[1].count;
        })
        .map(([species, data]) => ({
            species, // Keep original for navigation
            displayName: data.displayName, // Use normalized for display
            count: data.count,
            animals: data.animals,
            alertCount: data.alertCount,
            urgentCount: data.urgentCount,
            warningCount: data.warningCount,
            quarantineCount: data.quarantineCount,
            healthCount: data.healthCount,
            feedingCount: data.feedingCount,
            enrichmentCount: data.enrichmentCount
        }));

    // Update species count
    const uniqueSpeciesCount = speciesList.length;
    if (speciesCountEl) {
        speciesCountEl.textContent = `${uniqueSpeciesCount} ${uniqueSpeciesCount === 1 ? 'species' : 'species'}`;
    }

    if (speciesList.length === 0) {
        container.innerHTML = '<div class="species-loading">No species data</div>';
        return;
    }

    container.innerHTML = speciesList.map((
        { species, displayName, count, animals, alertCount, urgentCount, warningCount, quarantineCount, healthCount, feedingCount, enrichmentCount },
        index
    ) => {
        // Initialize index for this species if not exists
        if (!speciesImageIndices[species]) {
            speciesImageIndices[species] = 0;
        }
        
        const currentIndex = speciesImageIndices[species];
        const currentAnimal = animals[currentIndex] || null;
        const hasMultiple = animals.length > 1;
        const hasPrevious = hasMultiple && currentIndex > 0;
        const hasNext = hasMultiple && currentIndex < animals.length - 1;
        
        // Fallback icon if no image available - check both original and normalized names
        let fallbackIcon = '🐾';
        if (typeof trackingSpeciesMeta !== 'undefined') {
            fallbackIcon = trackingSpeciesMeta[species]?.icon || 
                          trackingSpeciesMeta[displayName]?.icon || 
                          '🐾';
        }
        
        const imageHTML = currentAnimal && currentAnimal.image
            ? `<img src="${currentAnimal.image}" alt="${currentAnimal.name}" class="species-item-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <div class="species-item-icon-fallback" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 36px;">${fallbackIcon}</div>`
            : `<div class="species-item-icon-fallback" style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 36px;">${fallbackIcon}</div>`;

        const navArrowsHTML = hasMultiple ? `
            <div class="species-item-nav-arrows">
                <button class="species-item-nav-arrow ${!hasPrevious ? 'disabled' : ''}" 
                        onclick="event.stopPropagation(); navigateSpeciesImage('${species}', -1)"
                        title="${hasPrevious ? animals[currentIndex - 1].name : 'No previous animal'}"
                        ${!hasPrevious ? 'disabled' : ''}>
                    <span>&lt;</span>
                </button>
                <button class="species-item-nav-arrow ${!hasNext ? 'disabled' : ''}" 
                        onclick="event.stopPropagation(); navigateSpeciesImage('${species}', 1)"
                        title="${hasNext ? animals[currentIndex + 1].name : 'No next animal'}"
                        ${!hasNext ? 'disabled' : ''}>
                    <span>&gt;</span>
                </button>
            </div>
        ` : '';

        // Determine alert status and styling
        const hasUrgent = urgentCount > 0;
        const hasWarning = warningCount > 0;
        const hasAlerts = alertCount > 0;
        const alertClass = hasUrgent ? 'urgent-alert' : hasWarning ? 'warning-alert' : '';
        // Removed alert badge emoji from image - using border color and breakdown pills instead

        // Compact per-category breakdown, e.g. "🚨 1  ❤️ 1  🍽️ 1"
        const issueParts = [];
        const totalQuarantine = quarantineCount || 0;
        const totalHealth = healthCount || 0;
        const totalFeeding = feedingCount || 0;
        const totalEnrichment = enrichmentCount || 0;

        if (totalQuarantine > 0) {
            issueParts.push(`<span class="species-issue-pill quarantine-pill">🚨 ${totalQuarantine}</span>`);
        }
        if (totalHealth > 0) {
            // Use health icon rather than heart to match dashboard health visuals
            issueParts.push(`<span class="species-issue-pill health-pill">🏥 ${totalHealth}</span>`);
        }
        if (totalFeeding > 0) {
            issueParts.push(`<span class="species-issue-pill feeding-pill">🍽️ ${totalFeeding}</span>`);
        }
        if (totalEnrichment > 0) {
            issueParts.push(`<span class="species-issue-pill enrichment-pill">🎾 ${totalEnrichment}</span>`);
        }

        const issuesSummaryHTML = issueParts.length > 0
            ? `<div class="species-item-issues">${issueParts.join('')}</div>`
            : '';

        return `
            <div class="species-item ${alertClass}" data-species="${species}" onclick="window.location.href='../animals/animals.html?species=${encodeURIComponent(species)}'">
                <div class="species-item-image-wrapper">
                    ${imageHTML}
                    ${navArrowsHTML}
                </div>
                <div class="species-item-name">${displayName}</div>
                <div class="species-item-count">${count}</div>
                ${issuesSummaryHTML}
            </div>
        `;
    }).join('');
}

// Navigate through images within a species card
function navigateSpeciesImage(species, direction) {
    if (!speciesImageIndices[species]) {
        speciesImageIndices[species] = 0;
    }
    
    // Get all animals for this species
    const allAnimals = Object.values(animalDatabase).flat();
    const speciesAnimals = allAnimals
        .filter(a => a.species === species && a.images && a.images.length > 0)
        .map(a => ({ name: a.name, image: a.images[0] }));
    
    if (speciesAnimals.length === 0) return;
    
    const currentIndex = speciesImageIndices[species];
    const newIndex = currentIndex + direction;
    
    // Clamp index to valid range
    if (newIndex < 0 || newIndex >= speciesAnimals.length) return;
    
    speciesImageIndices[species] = newIndex;
    
    // Find the species item in the DOM and update its image
    // Use data-species attribute to match original species name (handles normalized display names)
    const speciesItems = document.querySelectorAll('.species-item');
    speciesItems.forEach(item => {
        const itemSpecies = item.getAttribute('data-species');
        if (itemSpecies === species) {
            const imageWrapper = item.querySelector('.species-item-image-wrapper');
            const imageEl = imageWrapper.querySelector('.species-item-image');
            const fallbackEl = imageWrapper.querySelector('.species-item-icon-fallback');
            const navArrows = imageWrapper.querySelector('.species-item-nav-arrows');
            
            const newAnimal = speciesAnimals[newIndex];
            const fallbackIcon = (typeof trackingSpeciesMeta !== 'undefined' && trackingSpeciesMeta[species]) 
                ? trackingSpeciesMeta[species].icon || '🐾'
                : '🐾';
            
            if (imageEl && newAnimal && newAnimal.image) {
                imageEl.src = newAnimal.image;
                imageEl.alt = newAnimal.name;
                imageEl.style.display = 'block';
                if (fallbackEl) fallbackEl.style.display = 'none';
            } else if (fallbackEl) {
                if (imageEl) imageEl.style.display = 'none';
                fallbackEl.style.display = 'flex';
                fallbackEl.textContent = fallbackIcon;
            }
            
            // Update navigation arrows
            if (navArrows) {
                const prevArrow = navArrows.querySelector('.species-item-nav-arrow:first-child');
                const nextArrow = navArrows.querySelector('.species-item-nav-arrow:last-child');
                
                if (prevArrow) {
                    const hasPrevious = newIndex > 0;
                    prevArrow.classList.toggle('disabled', !hasPrevious);
                    prevArrow.disabled = !hasPrevious;
                    if (hasPrevious) {
                        prevArrow.title = speciesAnimals[newIndex - 1].name;
                    }
                }
                
                if (nextArrow) {
                    const hasNext = newIndex < speciesAnimals.length - 1;
                    nextArrow.classList.toggle('disabled', !hasNext);
                    nextArrow.disabled = !hasNext;
                    if (hasNext) {
                        nextArrow.title = speciesAnimals[newIndex + 1].name;
                    }
                }
            }
        }
    });
}



// Get species emoji
function getSpeciesEmoji(species) {
    const speciesEmojiMap = {
        'Goat': '🐐',
        'Sugarglider': '🐿️',
        'Sugar Glider': '🐿️',
        'Alligator': '🐊',
        'Snail': '🐌',
        'Giant Snail': '🐌',
        'Porcupine': '🦔',
        'Fox': '🦊',
        'Red Fox': '🦊'
    };
    
    // Try direct match first
    if (speciesEmojiMap[species]) {
        return speciesEmojiMap[species];
    }
    
    // Try case-insensitive match
    const lowerSpecies = species.toLowerCase();
    for (const [key, emoji] of Object.entries(speciesEmojiMap)) {
        if (key.toLowerCase() === lowerSpecies) {
            return emoji;
        }
    }
    
    // Default fallback
    return '🐾';
}

// Render Animals Needing Attention
function renderAttentionAlerts() {
    const container = document.getElementById('attentionAlertsList');
    const countEl = document.getElementById('attentionCount');
    if (!container) return;

    if (typeof animalDatabase === 'undefined') {
        container.innerHTML = '<div class="info-empty">Animal data unavailable</div>';
        if (countEl) countEl.textContent = '0';
        return;
    }

    const allAnimals = Object.values(animalDatabase).flat();
    const alerts = [];

    // Collect all animals that need attention
    allAnimals.forEach(animal => {
        // Check health status
        if (animal.health === 'danger' || animal.health === 'warning') {
            // Determine category based on health and alerts
            let category = 'health';
            let icon = '🏥';
            let severity = animal.health === 'danger' ? 'urgent' : 'warning';
            
            // Check for specific alert messages to categorize
            if (animal.alerts && animal.alerts.length > 0) {
                animal.alerts.forEach(alertText => {
                    const lowerAlert = alertText.toLowerCase();
                    
                    // Categorize based on alert content
                    if (lowerAlert.includes('quarantine') || lowerAlert.includes('isolat') || lowerAlert.includes('contagious')) {
                        category = 'quarantine';
                        icon = '🚨';
                        severity = 'urgent';
                    } else if (lowerAlert.includes('feeding') || lowerAlert.includes('appetite') || lowerAlert.includes('refused food') || lowerAlert.includes('missed')) {
                        category = 'feeding';
                        icon = '🍽️';
                    } else if (lowerAlert.includes('enrichment') || lowerAlert.includes('play') || lowerAlert.includes('activity')) {
                        category = 'enrichment';
                        icon = '🎾';
                    } else if (lowerAlert.includes('temperature') || lowerAlert.includes('vet') || lowerAlert.includes('health')) {
                        category = 'health';
                        icon = '🏥';
                    }
                    
                    // Enhance message with sensor data if available
                    let enhancedMessage = alertText;
                    
                    // Add temperature if not already in message and sensor data available
                    if (animal.sensors) {
                        const temp = animal.sensors.temp || animal.sensors.baskingTemp;
                        if (temp && !lowerAlert.includes('temperature') && !lowerAlert.includes(temp.value)) {
                            // Check if temperature is abnormal (for health alerts)
                            if (category === 'health' && temp.value) {
                                const tempValue = temp.value;
                                // Add temperature context for health alerts
                                if (animal.health === 'danger' || animal.health === 'warning') {
                                    enhancedMessage = `${alertText} (${tempValue}${temp.unit})`;
                                }
                            }
                        }
                        
                        // Add heart rate for critical health issues
                        if (category === 'health' && animal.health === 'danger' && animal.sensors.heartRate) {
                            const hr = animal.sensors.heartRate;
                            if (!enhancedMessage.includes(hr.value)) {
                                enhancedMessage = `${enhancedMessage} • HR: ${hr.value}${hr.unit}`;
                            }
                        }
                        
                        // Add enrichment status for enrichment alerts
                        if (category === 'enrichment' && animal.sensors.enrichment) {
                            const enrichment = animal.sensors.enrichment;
                            if (enrichment.value === 'Unused' || enrichment.value === 'Reduced') {
                                if (!enhancedMessage.toLowerCase().includes('enrichment')) {
                                    enhancedMessage = `${alertText} • Status: ${enrichment.value}`;
                                }
                            }
                        }
                        
                        // Add activity level for health/enrichment alerts
                        if ((category === 'health' || category === 'enrichment') && animal.sensors.activity) {
                            const activity = animal.sensors.activity;
                            if (activity.value === 'Minimal' || activity.value === 'Low') {
                                if (!enhancedMessage.toLowerCase().includes(activity.value.toLowerCase())) {
                                    enhancedMessage = `${enhancedMessage} • Activity: ${activity.value}`;
                                }
                            }
                        }
                    }
                    
                    alerts.push({
                        animal: animal.name,
                        species: animal.species,
                        message: enhancedMessage,
                        category: category,
                        icon: icon,
                        severity: severity,
                        health: animal.health,
                        id: animal.id,
                        sensors: animal.sensors
                    });
                });
            } else {
                // No specific alerts, but health status indicates issue
                let healthMessage = animal.health === 'danger' 
                    ? 'Critical health condition - Immediate attention required'
                    : 'Health warning - Monitor closely';
                
                // Enhance with sensor data if available
                if (animal.sensors) {
                    const temp = animal.sensors.temp || animal.sensors.baskingTemp;
                    if (temp && temp.value) {
                        healthMessage = `${healthMessage} • Temp: ${temp.value}${temp.unit}`;
                    }
                    if (animal.health === 'danger' && animal.sensors.heartRate) {
                        const hr = animal.sensors.heartRate;
                        healthMessage = `${healthMessage} • HR: ${hr.value}${hr.unit}`;
                    }
                }
                
                alerts.push({
                    animal: animal.name,
                    species: animal.species,
                    message: healthMessage,
                    category: 'health',
                    icon: '🏥',
                    severity: severity,
                    health: animal.health,
                    id: animal.id,
                    sensors: animal.sensors
                });
            }
        } else if (animal.alerts && animal.alerts.length > 0) {
            // Animal has alerts but health is good
            animal.alerts.forEach(alertText => {
                const lowerAlert = alertText.toLowerCase();
                let category = 'moderate';
                let icon = '⚠️';
                let severity = 'moderate';
                
                if (lowerAlert.includes('quarantine') || lowerAlert.includes('isolat')) {
                    category = 'quarantine';
                    icon = '🚨';
                    severity = 'urgent';
                } else if (lowerAlert.includes('feeding') || lowerAlert.includes('appetite') || lowerAlert.includes('refused food')) {
                    category = 'feeding';
                    icon = '🍽️';
                } else if (lowerAlert.includes('enrichment') || lowerAlert.includes('play')) {
                    category = 'enrichment';
                    icon = '🎾';
                } else if (lowerAlert.includes('temperature') || lowerAlert.includes('vet')) {
                    category = 'health';
                    icon = '🏥';
                }
                
                // Enhance message with sensor data if available
                let enhancedMessage = alertText;
                
                if (animal.sensors) {
                    const temp = animal.sensors.temp || animal.sensors.baskingTemp;
                    if (temp && !lowerAlert.includes('temperature') && !lowerAlert.includes(temp.value)) {
                        if (category === 'health' && temp.value) {
                            enhancedMessage = `${alertText} • Temp: ${temp.value}${temp.unit}`;
                        }
                    }
                }
                
                alerts.push({
                    animal: animal.name,
                    species: animal.species,
                    message: enhancedMessage,
                    category: category,
                    icon: icon,
                    severity: severity,
                    health: animal.health,
                    id: animal.id,
                    sensors: animal.sensors
                });
            });
        }
    });

    // Check for enrichment issues from sensor data
    allAnimals.forEach(animal => {
        if (animal.sensors && animal.sensors.enrichment) {
            const enrichment = animal.sensors.enrichment;
            // Check if enrichment is unused or reduced
            if (enrichment.value === 'Unused' || enrichment.value === 'Reduced') {
                // Check if we already have an enrichment alert for this animal
                const hasEnrichmentAlert = alerts.some(a => 
                    a.id === animal.id && a.category === 'enrichment'
                );
                
                if (!hasEnrichmentAlert) {
                    const enrichmentMessage = enrichment.value === 'Unused' 
                        ? 'Enrichment not used - schedule play session'
                        : 'Reduced enrichment usage - schedule play session';
                    
                    alerts.push({
                        animal: animal.name,
                        species: animal.species,
                        message: enrichmentMessage,
                        category: 'enrichment',
                        icon: '🎾',
                        severity: 'moderate',
                        health: animal.health,
                        id: animal.id,
                        sensors: animal.sensors
                    });
                }
            }
        }
    });

    // Check for missed feedings
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    feedingSchedule.forEach(f => {
        if (f.status === 'pending') {
            const feedingMinutes = parseInt(f.time.split(':')[0]) * 60 + parseInt(f.time.split(':')[1]);
            // If feeding time has passed (more than 30 minutes ago)
            if (currentMinutes > feedingMinutes + 30) {
                // Find animals of that species
                const speciesAnimals = allAnimals.filter(a => {
                    const normalizedSpecies = normalizeSpeciesName(a.species);
                    return normalizedSpecies === f.animal || a.species === f.animal;
                });
                
                speciesAnimals.forEach(animal => {
                    // Check if we already have a feeding alert for this animal
                    const hasFeedingAlert = alerts.some(a => 
                        a.id === animal.id && a.category === 'feeding' && a.message.toLowerCase().includes('missed')
                    );
                    
                    if (!hasFeedingAlert) {
                        alerts.push({
                            animal: animal.name,
                            species: animal.species,
                            message: `Missed feeding - ${f.time} ${f.meal}`,
                            category: 'feeding',
                            icon: '🍽️',
                            severity: 'warning',
                            health: animal.health,
                            id: animal.id
                        });
                    }
                });
            }
        }
    });

    // Group alerts by category
    const categoryGroups = {};
    alerts.forEach(alert => {
        if (!categoryGroups[alert.category]) {
            categoryGroups[alert.category] = [];
        }
        categoryGroups[alert.category].push(alert);
    });

    // Update count
    if (countEl) countEl.textContent = alerts.length;

    if (alerts.length === 0) {
        container.innerHTML = '<div class="info-empty">All animals are healthy</div>';
        return;
    }

    // Sort categories by priority: Quarantine > Health > Feeding > Enrichment
    // This ensures cards appear in the correct order from left to right
    const categoryPriority = { 
        quarantine: 0,  // Highest priority - Quarantine (appears first)
        health: 1,      // Second priority - Health
        feeding: 2,     // Third priority - Feeding
        enrichment: 3   // Fourth priority - Enrichment (appears last)
    };
    
    // Get all categories and sort them by priority
    const sortedCategories = Object.keys(categoryGroups).sort((a, b) => {
        const priorityA = categoryPriority[a] !== undefined ? categoryPriority[a] : 99;
        const priorityB = categoryPriority[b] !== undefined ? categoryPriority[b] : 99;
        return priorityA - priorityB;
    });

    // Render category cards with real animal data
    container.innerHTML = sortedCategories.map(category => {
        const categoryAlerts = categoryGroups[category];
        // Sort by severity (urgent first)
        const severityOrder = { urgent: 0, warning: 1, moderate: 2 };
        categoryAlerts.sort((a, b) => {
            const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
            if (severityDiff !== 0) return severityDiff;
            return a.animal.localeCompare(b.animal);
        });
        
        const categoryLabel = category === 'quarantine' ? 'QUARANTINE' :
                             category === 'feeding' ? 'FEEDING' :
                             category === 'health' ? 'HEALTH' :
                             category === 'enrichment' ? 'ENRICHMENT' : 'ALERT';
        
        const categoryCount = categoryAlerts.length;
        const primaryAlert = categoryAlerts[0];
        
        // Determine severity for the category card (use highest severity in group)
        const categorySeverity = categoryAlerts.some(a => a.severity === 'urgent') ? 'urgent' :
                                categoryAlerts.some(a => a.severity === 'warning') ? 'warning' : 'moderate';
        
        // Show up to 2 animals in the card, with "and X more" if there are more
        const displayAlerts = categoryAlerts.slice(0, 2);
        const remainingCount = categoryCount - displayAlerts.length;
        
        return `
            <div class="alert-category-card ${categorySeverity} ${category}" 
                 role="listitem"
                 tabindex="0"
                 onclick="window.location.href='../alerts/alerts.html'"
                 onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.location.href='../alerts/alerts.html'}">
                <div class="alert-category-icon" aria-hidden="true">${primaryAlert.icon}</div>
                <div class="alert-category-content">
                    <div class="alert-category-header">
                        <span class="alert-category-badge">${categoryLabel}</span>
                        ${categoryCount > 1 ? `<span class="alert-category-count">${categoryCount}</span>` : ''}
                    </div>
                    <div class="alert-category-animals">
                        ${displayAlerts.map(alert => {
                            const animalEmoji = getSpeciesEmoji(alert.species);
                            const speciesDisplayName = normalizeSpeciesName(alert.species || 'Unknown');
                            return `
                            <div class="alert-category-animal-item">
                                <div class="alert-animal-box">
                                    <span class="alert-category-animal-name">
                                        <span class="alert-animal-emoji">${animalEmoji}</span>
                                        ${alert.animal} (${speciesDisplayName})
                                    </span>
                                    <span class="alert-category-animal-message">${alert.message}</span>
                                </div>
                            </div>
                        `;
                        }).join('')}
                        ${remainingCount > 0 ? `<div class="alert-category-more">+${remainingCount} more</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Upcoming Feedings - Organized by Time Blocks
function renderUpcomingFeedings() {
    const container = document.getElementById('upcomingFeedingsList');
    if (!container) return;

    const pending = feedingSchedule
        .filter(f => f.status === 'pending')
        .sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
        })
        .slice(0, 8);

    // Update count badge
    const countEl = document.getElementById('upcomingFeedingsCount');
    if (countEl) {
        countEl.textContent = pending.length;
    }

    if (pending.length === 0) {
        container.innerHTML = '<div class="info-empty">No upcoming feedings</div>';
        return;
    }

    // Group by time blocks
    const timeBlocks = {
        morning: [],
        afternoon: [],
        evening: []
    };

    pending.forEach(f => {
        const hour = parseInt(f.time.split(':')[0]);
        if (hour >= 5 && hour < 12) {
            timeBlocks.morning.push(f);
        } else if (hour >= 12 && hour < 17) {
            timeBlocks.afternoon.push(f);
        } else {
            timeBlocks.evening.push(f);
        }
    });

    // Find next feeding
    const nextFeeding = pending[0];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const nextFeedingMinutes = parseInt(nextFeeding.time.split(':')[0]) * 60 + parseInt(nextFeeding.time.split(':')[1]);

    let html = '';

    // Morning block
    if (timeBlocks.morning.length > 0) {
        html += '<div class="feeding-time-block">';
        html += '<div class="feeding-time-block-title">🌅 Morning</div>';
        timeBlocks.morning.forEach(f => {
            const isNext = f === nextFeeding && nextFeedingMinutes >= currentMinutes;
            // Highlight porcupines at 10:00 specifically
            const isPorcupinesAt10 = (f.animal.toLowerCase().includes('porcupine') && f.time === '10:00');
            const shouldHighlight = isNext || isPorcupinesAt10;
            html += `
                <div class="feeding-item ${shouldHighlight ? 'next-feeding' : ''}">
            <span class="feeding-time">${f.time}</span>
            <div class="feeding-content">
                <div class="feeding-animal">${f.icon} ${f.animal}</div>
                <div class="feeding-meal">${f.meal}</div>
            </div>
        </div>
            `;
        });
        html += '</div>';
    }

    // Afternoon block
    if (timeBlocks.afternoon.length > 0) {
        html += '<div class="feeding-time-block">';
        html += '<div class="feeding-time-block-title">☀️ Afternoon</div>';
        timeBlocks.afternoon.forEach(f => {
            const isNext = f === nextFeeding && nextFeedingMinutes >= currentMinutes;
            html += `
                <div class="feeding-item ${isNext ? 'next-feeding' : ''}">
                    <span class="feeding-time">${f.time}</span>
                    <div class="feeding-content">
                        <div class="feeding-animal">${f.icon} ${f.animal}</div>
                        <div class="feeding-meal">${f.meal}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
    }

    // Evening block
    if (timeBlocks.evening.length > 0) {
        html += '<div class="feeding-time-block">';
        html += '<div class="feeding-time-block-title">🌙 Evening</div>';
        timeBlocks.evening.forEach(f => {
            const isNext = f === nextFeeding && nextFeedingMinutes >= currentMinutes;
            html += `
                <div class="feeding-item ${isNext ? 'next-feeding' : ''}">
            <span class="feeding-time">${f.time}</span>
            <div class="feeding-content">
                <div class="feeding-animal">${f.icon} ${f.animal}</div>
                <div class="feeding-meal">${f.meal}</div>
            </div>
        </div>
            `;
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

function updateNextFeedingTime() {
    const pending = feedingSchedule
        .filter(f => f.status === 'pending')
        .sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
        });

    const nextFeedingEl = document.getElementById('nextFeedingTime');
    if (!nextFeedingEl || pending.length === 0) {
        if (nextFeedingEl) nextFeedingEl.textContent = '--:--';
        return;
    }

    const next = pending[0];
    nextFeedingEl.textContent = next.time;
}

// Render Low Stock - With Progress Bars
function renderLowStock() {
    const container = document.getElementById('lowStockList');
    const countEl = document.getElementById('lowStockCount');
    if (!container) return;

    // Get all low stock items (stock < min)
    let lowStockItems = inventory.filter(i => i.stock < i.min);

    // Sort by stock level (lowest first)
    lowStockItems.sort((a, b) => a.stock - b.stock);

    // Assign color indicators: red for lowest, orange for next two
    lowStockItems = lowStockItems.map((item, index) => {
        const percentage = (item.stock / item.min) * 100;
        // First item (lowest stock) = red (critical)
        // Next two items = orange (warning)
        // Remaining items = orange (warning)
        const statusClass = index === 0 ? 'critical' : 'warning';
        
        return {
            ...item,
            percentage,
            statusClass
        };
    });

    if (countEl) countEl.textContent = lowStockItems.length;

    if (lowStockItems.length === 0) {
        container.innerHTML = '<div class="info-empty">All items in stock</div>';
        return;
    }

    container.innerHTML = lowStockItems.map(item => {
        // Calculate percentage based on stock vs min (for progress bar)
        const progressPercentage = Math.min((item.stock / item.min) * 100, 100);
        
        return `
            <div class="stock-item ${item.statusClass}">
            <span class="stock-icon">${item.icon}</span>
            <div class="stock-content">
                <div class="stock-name">${item.name}</div>
                    <div class="stock-progress-container">
                        <div class="stock-progress-bar">
                            <div class="stock-progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                        <span class="stock-level-text">${item.stock}/${item.min}</span>
            </div>
        </div>
            </div>
        `;
    }).join('');
}

// Render Mini Map
function renderMiniMap() {
    const mapElement = document.getElementById('dashboardMiniMap');
    const emptyOverlay = document.getElementById('miniMapEmptyState');
    const countEl = document.getElementById('miniMapCount');
    
    if (!mapElement || typeof L === 'undefined') return;

    // Initialize map if not exists
    if (!dashboardMiniMap) {
        const farmCenter = [3.1125, 101.7915];
        dashboardMiniMap = L.map('dashboardMiniMap', {
            zoomControl: false,
            attributionControl: false,
            minZoom: 15,
            maxZoom: 18,
            dragging: true,
            touchZoom: true,
            doubleClickZoom: false,
            scrollWheelZoom: true, // Enable mouse wheel zoom
            boxZoom: false,
            keyboard: false
        }).setView(farmCenter, 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(dashboardMiniMap);

        const bounds = L.latLngBounds([3.108, 101.786], [3.118, 101.797]);
        dashboardMiniMap.setMaxBounds(bounds.pad(0.02));

        dashboardMarkerLayer = L.layerGroup().addTo(dashboardMiniMap);
        
        setTimeout(() => {
            if (dashboardMiniMap) {
                dashboardMiniMap.invalidateSize();
            }
        }, 300);
    }

    // Get tracked animals
    const allAnimals = Object.values(animalDatabase).flat();
    const trackedAnimals = allAnimals.filter(a => 
        a.tracking && a.tracking.enabled &&
        Number.isFinite(a.tracking.lat) &&
        Number.isFinite(a.tracking.lng)
    );

    if (countEl) countEl.textContent = trackedAnimals.length;

    // Clear existing markers
    if (dashboardMarkerLayer) {
        dashboardMarkerMap.forEach(marker => {
            dashboardMarkerLayer.removeLayer(marker);
        });
    }
    dashboardMarkerMap.clear();

    if (trackedAnimals.length === 0) {
        if (emptyOverlay) emptyOverlay.classList.remove('hidden');
        return;
    }

    if (emptyOverlay) emptyOverlay.classList.add('hidden');

    // Add markers for tracked animals
    const latLngs = [];
    trackedAnimals.forEach(animal => {
        const meta = trackingSpeciesMeta[animal.species] || {};
        const emoji = meta.icon || '🐾';
        const color = meta.color || '#6366f1';
        const hasAlert = animal.alerts && animal.alerts.length > 0 || animal.health !== 'good';
        const battery = animal.tracking.battery ?? 100;
        const lowBattery = battery < 20;

        const html = `
            <div class="mini-map-pin ${hasAlert ? 'has-alert' : ''} ${lowBattery ? 'low-battery' : ''}" 
                 style="--pin-color:${color}" 
                 data-label="${animal.name}"
                 title="${animal.name} - ${animal.tracking.location || 'Unknown location'}">
                <div class="mini-map-pin-inner">${emoji}</div>
                ${hasAlert ? '<span class="mini-pin-alert-dot"></span>' : ''}
                ${lowBattery ? '<span class="mini-pin-battery-low">⚠️</span>' : ''}
            </div>
        `;

        const icon = L.divIcon({
            className: 'mini-map-pin-wrapper',
            html,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const position = [animal.tracking.lat, animal.tracking.lng];
        const marker = L.marker(position, { icon });
        
        // Add tooltip with details - compact version
        const tooltipContent = `
            <div style="font-weight: 700; font-size: 12px; margin-bottom: 2px; line-height: 1.2;">${emoji} ${animal.name}</div>
            <div style="font-size: 10px; color: #94a3b8; line-height: 1.3;">
                📍 ${animal.tracking.location || 'Unknown'} • 🔋 ${battery}%${lowBattery ? ' ⚠️' : ''}${hasAlert ? ' • 🚨' : ''}
            </div>
        `;
        
        marker.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'map-tooltip-custom'
        });
        
        marker.on('click', () => {
            window.location.href = `../tracking/tracking.html`;
        });
        
        if (dashboardMarkerLayer) {
            dashboardMarkerLayer.addLayer(marker);
        }
        dashboardMarkerMap.set(animal.id, marker);
        latLngs.push(position);
    });

    // Fit map to show all markers
    if (latLngs.length > 0 && dashboardMiniMap) {
        const bounds = L.latLngBounds(latLngs);
        dashboardMiniMap.fitBounds(bounds.pad(0.1), { 
            maxZoom: 17,
            duration: 0.8
        });
        
        // Ensure map is properly sized
        setTimeout(() => {
            if (dashboardMiniMap) {
                dashboardMiniMap.invalidateSize();
            }
        }, 500);
    }
}

// Render Activity Timeline - With Icons & Color Coding
function renderActivityTimeline() {
    const container = document.getElementById('activityTimeline');
    if (!container) return;

    const activities = [];
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Helper function to get priority weight (lower = higher priority)
    const getPriorityWeight = (priority) => {
        switch(priority) {
            case 'urgent': return 1;
            case 'warning': return 2;
            case 'normal': return 3;
            default: return 3;
        }
    };

    // Helper function to format relative time
    const formatRelativeTime = (minutesAgo) => {
        if (minutesAgo < 1) return 'Just now';
        if (minutesAgo < 60) return `${Math.floor(minutesAgo)} ${Math.floor(minutesAgo) === 1 ? 'minute' : 'minutes'} ago`;
        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo === 1) return 'Yesterday';
        if (daysAgo < 7) return `${daysAgo} days ago`;
        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo === 1) return '1 week ago';
        return `${weeksAgo} weeks ago`;
    };

    // Helper function to parse time string to minutes
    const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return currentMinutes;
        if (timeStr.includes(':')) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        }
        // Handle relative times like "1h ago", "4h ago"
        if (timeStr.includes('h ago')) {
            const hours = parseInt(timeStr);
            return currentMinutes - (hours * 60);
        }
        if (timeStr.includes('day ago')) {
            const days = parseInt(timeStr);
            return currentMinutes - (days * 24 * 60);
        }
        return currentMinutes;
    };

    // Helper function to calculate minutes ago from timestamp
    const getMinutesAgo = (timestamp) => {
        return currentMinutes - timestamp;
    };

    // Get recent feedings with realistic timestamps
    const recentFeedings = feedingSchedule
        .filter(f => f.status === 'completed')
        .map((f, index) => {
            // Create varied timestamps: most recent feeding was 15 mins ago, then 1h, 2h, 3h, etc.
            const minutesAgo = 15 + (index * 45); // 15 mins, 1h, 1h45, 2h30, etc.
            const timestamp = currentMinutes - minutesAgo;
            // Normalize species name from feeding schedule (e.g., "Goats" -> "Goat", "Sugar Gliders" -> "Sugar Glider")
            let species = f.animal || 'Unknown';
            if (species === 'Goats') species = 'Goat';
            else if (species === 'Foxes') species = 'Fox';
            else if (species === 'Porcupines') species = 'Porcupine';
            else if (species === 'Sugar Gliders') species = 'Sugar Glider';
            else if (species === 'Alligators') species = 'Alligator';
            else if (species === 'Snails') species = 'Snail';
            return {
            type: 'feeding',
            time: f.time,
                timeDisplay: formatRelativeTime(minutesAgo),
            text: `Fed ${f.animal}`,
            meal: f.meal,
            icon: '🍽️',
            categoryIcon: '🍽️',
            priority: 'normal',
                timestamp: timestamp,
                priorityWeight: getPriorityWeight('normal'),
                species: species
            };
        });

    // Get recent alerts (highest priority) with realistic timestamps
    // Use the same logic as renderAttentionAlerts to ensure consistency
    const allAnimals = Object.values(animalDatabase).flat();
    const alertActivities = [];
    let alertIndex = 0;
    
    // Collect alerts using the same logic as renderAttentionAlerts
    allAnimals.forEach(animal => {
        // Check health status
        if (animal.health === 'danger' || animal.health === 'warning') {
            let category = 'health';
            let icon = '🏥';
            let severity = animal.health === 'danger' ? 'urgent' : 'warning';
            
            // Check for specific alert messages to categorize
        if (animal.alerts && animal.alerts.length > 0) {
                animal.alerts.forEach(alertText => {
                    const lowerAlert = alertText.toLowerCase();
                    
                    // Categorize based on alert content
                    if (lowerAlert.includes('quarantine') || lowerAlert.includes('isolat') || lowerAlert.includes('contagious')) {
                        category = 'quarantine';
                        icon = '🚨';
                        severity = 'urgent';
                    } else if (lowerAlert.includes('feeding') || lowerAlert.includes('appetite') || lowerAlert.includes('refused food') || lowerAlert.includes('missed')) {
                        category = 'feeding';
                        icon = '🍽️';
                    } else if (lowerAlert.includes('enrichment') || lowerAlert.includes('play') || lowerAlert.includes('activity')) {
                        category = 'enrichment';
                        icon = '🎾';
                    } else if (lowerAlert.includes('temperature') || lowerAlert.includes('vet') || lowerAlert.includes('health')) {
                        category = 'health';
                        icon = '🏥';
                    }
                    
                    // Enhance message with sensor data if available (same as alerts section)
                    let enhancedMessage = alertText;
                    
                    if (animal.sensors) {
                        const temp = animal.sensors.temp || animal.sensors.baskingTemp;
                        if (temp && !lowerAlert.includes('temperature') && !lowerAlert.includes(temp.value)) {
                            if (category === 'health' && temp.value) {
                                const tempValue = temp.value;
                                if (animal.health === 'danger' || animal.health === 'warning') {
                                    enhancedMessage = `${alertText} (${tempValue}${temp.unit})`;
                                }
                            }
                        }
                        
                        if (category === 'health' && animal.health === 'danger' && animal.sensors.heartRate) {
                            const hr = animal.sensors.heartRate;
                            if (!enhancedMessage.includes(hr.value)) {
                                enhancedMessage = `${enhancedMessage} • HR: ${hr.value}${hr.unit}`;
                            }
                        }
                        
                        if (category === 'enrichment' && animal.sensors.enrichment) {
                            const enrichment = animal.sensors.enrichment;
                            if (enrichment.value === 'Unused' || enrichment.value === 'Reduced') {
                                if (!enhancedMessage.toLowerCase().includes('enrichment')) {
                                    enhancedMessage = `${alertText} • Status: ${enrichment.value}`;
                                }
                            }
                        }
                        
                        if ((category === 'health' || category === 'enrichment') && animal.sensors.activity) {
                            const activity = animal.sensors.activity;
                            if (activity.value === 'Minimal' || activity.value === 'Low') {
                                if (!enhancedMessage.toLowerCase().includes(activity.value.toLowerCase())) {
                                    enhancedMessage = `${enhancedMessage} • Activity: ${activity.value}`;
                                }
                            }
                        }
                    }
                    
                    const minutesAgo = 5 + (alertIndex * 15);
                    const timestamp = currentMinutes - minutesAgo;
                    alertActivities.push({
                type: 'alert',
                        timeDisplay: formatRelativeTime(minutesAgo),
                text: `${animal.name}`,
                        meal: enhancedMessage,
                        icon: icon,
                        categoryIcon: icon,
                        priority: severity,
                        timestamp: timestamp,
                        priorityWeight: getPriorityWeight(severity),
                        species: animal.species
                    });
                    alertIndex++;
                });
            } else {
                // No specific alerts, but health status indicates issue
                let healthMessage = animal.health === 'danger' 
                    ? 'Critical health condition - Immediate attention required'
                    : 'Health warning - Monitor closely';
                
                // Enhance with sensor data if available
                if (animal.sensors) {
                    const temp = animal.sensors.temp || animal.sensors.baskingTemp;
                    if (temp && temp.value) {
                        healthMessage = `${healthMessage} • Temp: ${temp.value}${temp.unit}`;
                    }
                    if (animal.health === 'danger' && animal.sensors.heartRate) {
                        const hr = animal.sensors.heartRate;
                        healthMessage = `${healthMessage} • HR: ${hr.value}${hr.unit}`;
                    }
                }
                
                const minutesAgo = 5 + (alertIndex * 15);
                const timestamp = currentMinutes - minutesAgo;
                alertActivities.push({
                    type: 'alert',
                    timeDisplay: formatRelativeTime(minutesAgo),
                    text: `${animal.name}`,
                    meal: healthMessage,
                    icon: '🏥',
                    categoryIcon: '🏥',
                    priority: severity,
                    timestamp: timestamp,
                    priorityWeight: getPriorityWeight(severity),
                    species: animal.species
                });
                alertIndex++;
            }
        } else if (animal.alerts && animal.alerts.length > 0) {
            // Animal has alerts but health is good
            animal.alerts.forEach(alertText => {
                const lowerAlert = alertText.toLowerCase();
                let category = 'moderate';
                let icon = '⚠️';
                let severity = 'moderate';
                
                if (lowerAlert.includes('quarantine') || lowerAlert.includes('isolat')) {
                    category = 'quarantine';
                    icon = '🚨';
                    severity = 'urgent';
                } else if (lowerAlert.includes('feeding') || lowerAlert.includes('appetite') || lowerAlert.includes('refused food')) {
                    category = 'feeding';
                    icon = '🍽️';
                } else if (lowerAlert.includes('enrichment') || lowerAlert.includes('play')) {
                    category = 'enrichment';
                    icon = '🎾';
                } else if (lowerAlert.includes('temperature') || lowerAlert.includes('vet')) {
                    category = 'health';
                    icon = '🏥';
                }
                
                // Enhance message with sensor data if available
                let enhancedMessage = alertText;
                
                if (animal.sensors) {
                    const temp = animal.sensors.temp || animal.sensors.baskingTemp;
                    if (temp && !lowerAlert.includes('temperature') && !lowerAlert.includes(temp.value)) {
                        if (category === 'health' && temp.value) {
                            enhancedMessage = `${alertText} • Temp: ${temp.value}${temp.unit}`;
                        }
                    }
                }
                
                const minutesAgo = 5 + (alertIndex * 15);
                const timestamp = currentMinutes - minutesAgo;
                alertActivities.push({
                    type: 'alert',
                    timeDisplay: formatRelativeTime(minutesAgo),
                    text: `${animal.name}`,
                    meal: enhancedMessage,
                    icon: icon,
                    categoryIcon: icon,
                    priority: severity,
                    timestamp: timestamp,
                    priorityWeight: getPriorityWeight(severity),
                    species: animal.species
                });
                alertIndex++;
            });
        }
    });
    
    // Add enrichment issues from sensor data
    allAnimals.forEach(animal => {
        if (animal.sensors && animal.sensors.enrichment) {
            const enrichment = animal.sensors.enrichment;
            if (enrichment.value === 'Unused' || enrichment.value === 'Reduced') {
                // Check if we already have an enrichment alert for this animal
                const hasEnrichmentAlert = alertActivities.some(a => 
                    a.text === animal.name && a.meal.toLowerCase().includes('enrichment')
                );
                
                if (!hasEnrichmentAlert) {
                    const enrichmentMessage = enrichment.value === 'Unused' 
                        ? 'Enrichment not used - schedule play session'
                        : 'Reduced enrichment usage - schedule play session';
                    
                    const minutesAgo = 5 + (alertIndex * 15);
                    const timestamp = currentMinutes - minutesAgo;
                    alertActivities.push({
                        type: 'alert',
                        timeDisplay: formatRelativeTime(minutesAgo),
                        text: `${animal.name}`,
                        meal: enrichmentMessage,
                        icon: '🎾',
                        categoryIcon: '🎾',
                        priority: 'moderate',
                        timestamp: timestamp,
                        priorityWeight: getPriorityWeight('moderate'),
                        species: animal.species
                    });
                    alertIndex++;
                }
            }
        }
    });
    
    // Add missed feedings
    feedingSchedule.forEach(f => {
        if (f.status === 'pending') {
            const feedingMinutes = parseInt(f.time.split(':')[0]) * 60 + parseInt(f.time.split(':')[1]);
            if (currentMinutes > feedingMinutes + 30) {
                const speciesAnimals = allAnimals.filter(a => {
                    const normalizedSpecies = normalizeSpeciesName(a.species);
                    return normalizedSpecies === f.animal || a.species === f.animal;
                });
                
                speciesAnimals.forEach(animal => {
                    const hasFeedingAlert = alertActivities.some(a => 
                        a.text === animal.name && a.meal.toLowerCase().includes('missed')
                    );
                    
                    if (!hasFeedingAlert) {
                        const minutesAgo = 5 + (alertIndex * 15);
                        const timestamp = currentMinutes - minutesAgo;
                        alertActivities.push({
                            type: 'alert',
                            timeDisplay: formatRelativeTime(minutesAgo),
                            text: `${animal.name}`,
                            meal: `Missed feeding - ${f.time} ${f.meal}`,
                            icon: '🍽️',
                            categoryIcon: '🍽️',
                            priority: 'warning',
                            timestamp: timestamp,
                            priorityWeight: getPriorityWeight('warning'),
                            species: animal.species
                        });
                        alertIndex++;
                    }
                });
            }
        }
    });
    
    // Add all alert activities to main activities array
    activities.push(...alertActivities);

    // Health status changes are now included in the alerts section above
    // to avoid duplication and ensure consistency

    // Get recent notes from animals with realistic timestamps
    allAnimals.forEach(animal => {
        if (animal.notes && animal.notes.length > 0) {
            animal.notes.forEach((note, noteIndex) => {
                const noteTime = parseTimeToMinutes(note.time);
                // Only include notes from today
                if (noteTime <= currentMinutes && noteTime >= currentMinutes - (24 * 60)) {
                    const minutesAgo = getMinutesAgo(noteTime);
            activities.push({
                        type: 'note',
                        time: note.time,
                        timeDisplay: minutesAgo < 1440 ? formatRelativeTime(minutesAgo) : note.time,
                text: `${animal.name}`,
                        meal: note.text,
                        icon: '📝',
                        categoryIcon: '📝',
                        priority: 'normal',
                        timestamp: noteTime,
                        priorityWeight: getPriorityWeight('normal'),
                        species: animal.species
                    });
                }
            });
        }
    });

    // Add feedings
    activities.push(...recentFeedings);

    // Add additional dummy activities for more realistic timeline
    const dummyActivities = [
        {
            type: 'tracking',
            timeDisplay: formatRelativeTime(10),
            text: 'Location update',
            meal: 'Jebat moved to East Pasture',
            icon: '📍',
            categoryIcon: '📍',
            priority: 'normal',
            timestamp: currentMinutes - 10,
            priorityWeight: getPriorityWeight('normal')
        },
        {
            type: 'enrichment',
            timeDisplay: formatRelativeTime(90),
            text: 'Enrichment session',
            meal: 'Porcupines completed enrichment activity',
            icon: '🎾',
            categoryIcon: '🎾',
            priority: 'normal',
            timestamp: currentMinutes - 90,
            priorityWeight: getPriorityWeight('normal')
        },
        {
            type: 'checkup',
            timeDisplay: formatRelativeTime(120),
            text: 'Routine checkup',
            meal: 'Mimi health check completed',
            icon: '🏥',
            categoryIcon: '🏥',
            priority: 'normal',
            timestamp: currentMinutes - 120,
            priorityWeight: getPriorityWeight('normal')
        },
        {
            type: 'medication',
            timeDisplay: formatRelativeTime(180),
            text: 'Medication administered',
            meal: 'Puteh received antibiotics',
            icon: '💊',
            categoryIcon: '💊',
            priority: 'normal',
            timestamp: currentMinutes - 180,
            priorityWeight: getPriorityWeight('normal')
        },
        {
            type: 'cleaning',
            timeDisplay: formatRelativeTime(240),
            text: 'Cage maintenance',
            meal: 'Goat enclosure cleaned',
            icon: '🧹',
            categoryIcon: '🧹',
            priority: 'normal',
            timestamp: currentMinutes - 240,
            priorityWeight: getPriorityWeight('normal')
        }
    ];

    // Add dummy activities if we don't have enough real activities
    if (activities.length < 10) {
        activities.push(...dummyActivities.slice(0, 10 - activities.length));
    }

    // Sort by priority first (urgent > warning > normal), then by timestamp (most recent first)
    activities.sort((a, b) => {
        // First sort by priority weight (lower = higher priority)
        if (a.priorityWeight !== b.priorityWeight) {
            return a.priorityWeight - b.priorityWeight;
        }
        // If same priority, sort by timestamp (most recent first)
        return b.timestamp - a.timestamp;
    });

    // Show more activities (increased from 7 to 15)
    const recentActivities = activities.slice(0, 15);

    if (recentActivities.length === 0) {
        container.innerHTML = '<div class="info-empty">No recent activity</div>';
        return;
    }

    container.innerHTML = recentActivities.map(activity => {
        // Get species emoji if species is available
        const speciesEmoji = activity.species ? getSpeciesEmoji(activity.species) : '';
        const displayText = activity.species && speciesEmoji 
            ? `${activity.text} ${speciesEmoji}`
            : activity.text;
        
        return `
        <div class="activity-item priority-${activity.priority}">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-text">
                    ${displayText}
                </div>
                <div class="activity-time">${activity.meal} • ${activity.timeDisplay}</div>
            </div>
        </div>
    `;
    }).join('');
}

function getTimeMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Render Environmental Status - With Clear Icons
function renderEnvironmentalStatus() {
    const container = document.getElementById('environmentList');
    const goodEl = document.getElementById('envGood');
    const warningEl = document.getElementById('envWarning');
    const criticalEl = document.getElementById('envCritical');
    
    if (!container) return;

    if (typeof rooms === 'undefined') {
        container.innerHTML = '<div class="info-empty">Environment data unavailable</div>';
        return;
    }

    const good = rooms.filter(r => r.status === 'good').length;
    const warning = rooms.filter(r => r.status === 'warning').length;
    const critical = rooms.filter(r => r.status === 'danger').length;

    if (goodEl) {
        goodEl.textContent = good;
        goodEl.parentElement.classList.remove('warning', 'danger');
    }
    if (warningEl) {
        warningEl.textContent = warning;
        warningEl.parentElement.classList.toggle('warning', warning > 0);
    }
    if (criticalEl) {
        criticalEl.textContent = critical;
        criticalEl.parentElement.classList.toggle('danger', critical > 0);
    }

    const roomsWithIssues = rooms.filter(r => r.status !== 'good').slice(0, 4);

    if (roomsWithIssues.length === 0) {
        container.innerHTML = '<div class="info-empty">All environments optimal</div>';
        return;
    }

    container.innerHTML = roomsWithIssues.map(room => {
        const statusClass = room.status === 'danger' ? 'danger' : 'warning';
        return `
            <div class="env-item ${statusClass}">
                <div class="env-item-name">
                    <span class="env-item-name-icon">🏠</span>
                    ${room.name}
                </div>
                <div class="env-item-stats">
                    <span class="env-stat-item">
                        <span class="env-stat-item-icon">🌡️</span>
                        ${room.temp}°C
                    </span>
                    <span class="env-stat-item">
                        <span class="env-stat-item-icon">💧</span>
                        ${room.humidity}%
                    </span>
                    <span class="env-stat-item status-${statusClass}">
                        ${room.status === 'danger' ? '🚨' : '⚠️'} ${room.status}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// Render Cage Gallery - Horizontal Scrollable
function renderCageGallery() {
    const container = document.getElementById('cageGallery');
    if (!container) return;

    // Map species to their cage images
    const speciesCageImages = {
        'Goat': '../../images/shelter/sgoat.jpg',
        'Sugar Glider': '../../images/shelter/ssugarglider.jpg',
        'Sugarglider': '../../images/shelter/ssugarglider.jpg',
        'Snail': '../../images/shelter/ssnail.jpg',
        'Porcupine': '../../images/shelter/sporcupine.jpg',
        'Alligator': '../../images/shelter/salligator.jpg',
        'Red Fox': '../../images/shelter/sfox.jpg',
        'Fox': '../../images/shelter/sfox.jpg'
    };

    // Get all animals grouped by species
    const allAnimals = Object.values(animalDatabase).flat();
    const speciesData = {};

    allAnimals.forEach(animal => {
        const species = animal.species || 'Unknown';
        const displayName = normalizeSpeciesName(species);
        
        if (!speciesData[species]) {
            speciesData[species] = {
                displayName: displayName,
                animals: [],
                cageImage: speciesCageImages[species] || speciesCageImages[displayName] || null
            };
        }
        speciesData[species].animals.push(animal);
    });

    // Convert to array and sort by species name
    const speciesList = Object.entries(speciesData)
        .map(([species, data]) => ({
            species,
            displayName: data.displayName,
            animals: data.animals,
            cageImage: data.cageImage,
            count: data.animals.length
        }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));

    if (speciesList.length === 0) {
        container.innerHTML = '<div class="cage-gallery-empty">No cage data available</div>';
        return;
    }

    // Map species to appropriate enclosure/habitat names
    const speciesEnclosureNames = {
        'Goat': 'Goat Pasture',
        'Sugar Glider': 'Sugar Glider Habitat',
        'Sugarglider': 'Sugar Glider Habitat',
        'Snail': 'Snail Terrarium',
        'Porcupine': 'Porcupine Enclosure',
        'Alligator': 'Alligator Enclosure',
        'Red Fox': 'Fox Enclosure',
        'Fox': 'Fox Enclosure'
    };

    const cageItemsHTML = speciesList.map(({ species, displayName, animals, cageImage, count }) => {
        // Get appropriate enclosure name for the species
        const enclosureName = speciesEnclosureNames[species] || speciesEnclosureNames[displayName] || `${displayName} Enclosure`;
        
        // Fallback icon if no cage image
        const fallbackIcon = (typeof trackingSpeciesMeta !== 'undefined' && trackingSpeciesMeta[species]) 
            ? trackingSpeciesMeta[species].icon 
            : '🐾';

        return `
            <div class="cage-item" onclick="window.location.href='../animals/animals.html?species=${encodeURIComponent(species)}'">
                <div class="cage-item-image-wrapper">
                    ${cageImage 
                        ? `<img src="${cageImage}" alt="${displayName} cage" class="cage-item-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                           <div class="cage-item-fallback" style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 48px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.08));">${fallbackIcon}</div>`
                        : `<div class="cage-item-fallback" style="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 48px; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.08));">${fallbackIcon}</div>`
                    }
                </div>
                <div class="cage-item-info">
                    <div class="cage-item-name">${enclosureName}</div>
                    <div class="cage-item-species">${displayName}</div>
                    <div class="cage-item-count">${count} ${count === 1 ? 'animal' : 'animals'}</div>
                </div>
            </div>
        `;
    }).join('');

    // Add "Add New Place" button at the end
    const addButtonHTML = `
        <div class="cage-item cage-item-add" onclick="openAddCageModal()">
            <div class="cage-item-image-wrapper cage-item-add-wrapper">
                <div class="cage-item-add-icon">+</div>
            </div>
            <div class="cage-item-info">
                <div class="cage-item-name">Add New Place</div>
                <div class="cage-item-species">Create enclosure</div>
            </div>
        </div>
    `;

    container.innerHTML = cageItemsHTML + addButtonHTML;
}

// PROFESSIONAL CHARTS

>>>>>>> Stashed changes
function renderHealthStatusChart() {
    const canvas = document.getElementById('healthStatusChart');
    if (!canvas || !window.Chart) return;

    const allAnimals = getAllAnimals();
    const totals = { Good: 0, Warning: 0, Danger: 0 };
    allAnimals.forEach(animal => {
        if (animal.health === 'good') totals.Good += 1;
        else if (animal.health === 'warning') totals.Warning += 1;
        else totals.Danger += 1;
    });

<<<<<<< Updated upstream
    const statuses = Object.keys(totals);
    const totalAnimals = statuses.reduce((sum, key) => sum + totals[key], 0);
    const healthyPercent = totalAnimals ? Math.round((totals.Good / totalAnimals) * 100) : 0;
=======
    const totalAnimals = totals.Good + totals.Warning + totals.Danger;
    const healthyCount = totals.Good;
>>>>>>> Stashed changes

    if (healthStatusChartInstance) healthStatusChartInstance.destroy();
    
    // Ensure Chart.js is loaded
    if (!window.Chart) {
        console.error('Chart.js is not loaded');
        return;
    }
    
    // Register center text plugin before creating chart
    registerCenterTextPlugin();
    
    // Add context text below chart
    const chartContainer = canvas.parentElement;
    let contextEl = chartContainer.querySelector('.health-chart-context');
    if (!contextEl) {
        contextEl = document.createElement('div');
        contextEl.className = 'health-chart-context';
        chartContainer.appendChild(contextEl);
    }
    contextEl.innerHTML = `<strong>${healthyCount}</strong> out of <strong>${totalAnimals}</strong> animals healthy`;
    
    healthStatusChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: statuses,
            datasets: [{
<<<<<<< Updated upstream
                data: statuses.map(status => totals[status]),
                backgroundColor: statuses.map(status => HEALTH_STATUS_META[status].color),
                borderRadius: 40,
                spacing: 10,
                hoverOffset: 12,
                borderColor: '#e2e8f0',
                borderWidth: 8,
                cutout: '78%',
                radius: '88%'
=======
                data: [totals.Good, totals.Warning, totals.Danger],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.95)',      // Green with slight transparency
                    'rgba(251, 191, 36, 0.95)',    // Yellow/Orange
                    'rgba(239, 68, 68, 0.95)'      // Red
                ],
                borderColor: [
                    '#16a34a',  // Darker green border
                    '#f59e0b',  // Darker orange border
                    '#dc2626'   // Darker red border
                ],
                borderWidth: 3,  // Thinner outline
                hoverBorderWidth: 6,  // Thicker border on hover for pop effect
                hoverOffset: 12,  // Larger offset to make segments "pop up" on hover
                spacing: 2        // Small gap between segments
>>>>>>> Stashed changes
            }]
        },
        plugins: [healthRingShadowPlugin, healthCenterTextPlugin],
        options: {
            responsive: true,
<<<<<<< Updated upstream
            maintainAspectRatio: false,
            animation: { animateRotate: true, duration: 1400, easing: 'easeOutQuart' },
            rotation: -90,
            layout: { padding: 16 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 12,
                    cornerRadius: 12,
                    titleFont: { weight: '700', size: 13 },
                    bodyFont: { size: 12 },
                    callbacks: {
                        label(context) {
                            const value = context.parsed;
                            const percent = totalAnimals ? Math.round((value / totalAnimals) * 100) : 0;
                            return `${value} animals • ${percent}%`;
                        }
=======
            maintainAspectRatio: true,
            aspectRatio: 1.1,
            cutout: '70%',  // Larger cutout for more elegant look
            layout: {
                padding: {
                    top: 15,
                    bottom: 15,
                    left: 15,
                    right: 15
                }
            },
            plugins: {
                legend: { 
                    position: 'bottom',
                    align: 'center',
                    labels: { 
                        color: '#475569',
                        font: { size: 12, weight: '700', family: 'system-ui, -apple-system, sans-serif' },
                        padding: 8,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10,
                        boxHeight: 10,
                        boxPadding: 6,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const dataset = data.datasets[0];
                                    const value = dataset.data[i];
                                    const total = dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                                    
                                    return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: dataset.backgroundColor[i],
                                        strokeStyle: dataset.borderColor[i],
                                        lineWidth: dataset.borderWidth,
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
                    padding: 16,
                    titleFont: { size: 14, weight: '800', family: 'system-ui, -apple-system, sans-serif' },
                    bodyFont: { size: 13, weight: '600', family: 'system-ui, -apple-system, sans-serif' },
                    cornerRadius: 12,
                    displayColors: true,
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    borderWidth: 2,
                    titleColor: '#f1f5f9',
                    bodyColor: '#e2e8f0',
                    titleSpacing: 8,
                    bodySpacing: 6,
                    boxPadding: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return ` ${context.label}: ${context.parsed} animals (${percentage}%)`;
>>>>>>> Stashed changes
                    }
                },
                healthCenterText: {
                    percent: healthyPercent,
                    label: 'Healthy'
                }
<<<<<<< Updated upstream
=======
                },
            },
            animation: {
                animateRotate: true,
                duration: 2000,
                easing: 'easeOutQuart',
                onComplete: function() {
                    // Add subtle pulse animation after load
                    // Use the canvas element directly since this.chart is not available in this context
                    if (canvas) {
                        canvas.style.transition = 'transform 0.3s ease';
                    }
                }
            },
            interaction: {
                intersect: true,  // Enable hover on exact point
                mode: 'nearest'   // Show tooltip for nearest segment
            },
            onHover: function(event, activeElements) {
                const canvas = event.native.target;
                if (activeElements.length > 0) {
                    canvas.style.cursor = 'pointer';
                } else {
                    canvas.style.cursor = 'default';
                }
            },
            // Enhanced hover animation for pop-up effect
            elements: {
                arc: {
                    hoverOffset: 12,  // Make segments pop out more on hover
                    hoverBorderWidth: 6,
                    hoverBorderColor: function(context) {
                        // Return darker border color on hover for better contrast
                        const colors = ['#16a34a', '#f59e0b', '#dc2626'];
                        return colors[context.dataIndex] || '#475569';
                    },
                    hoverBackgroundColor: function(context) {
                        // Slightly brighter colors on hover
                        const colors = [
                            'rgba(34, 197, 94, 1)',      // Full opacity green
                            'rgba(251, 191, 36, 1)',     // Full opacity orange
                            'rgba(239, 68, 68, 1)'       // Full opacity red
                        ];
                        return colors[context.dataIndex] || 'rgba(148, 163, 184, 0.95)';
                    }
                }
>>>>>>> Stashed changes
            }
        }
    });

    const legend = document.getElementById('healthLegend');
    if (legend) {
        legend.innerHTML = statuses.map(status => {
            const meta = HEALTH_STATUS_META[status];
            const value = totals[status];
            const percent = totalAnimals ? Math.round((value / totalAnimals) * 100) : 0;
            return `
                <div class="legend-pill ${status.toLowerCase()}">
                    <span class="legend-dot" style="background:${meta.color};"></span>
                    <div>
                        <strong>${meta.label} • ${percent}%</strong>
                        <small>${meta.detail} (${value})</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    const summaryEl = document.getElementById('healthSummary');
    if (summaryEl) {
        const summaryPills = statuses.map(status => {
            const value = totals[status];
            const percent = totalAnimals ? Math.round((value / totalAnimals) * 100) : 0;
            return `
                <div class="chart-pill ${status.toLowerCase()}">
                    <strong>${percent}% ${status}</strong>
                    <span>${value} animals</span>
                </div>
            `;
        }).join('');
        summaryEl.innerHTML = `
            ${summaryPills}
            <div class="chart-pill total">
                <strong>${totalAnimals} Total</strong>
                <span>${healthyPercent}% healthy overall</span>
            </div>
        `;
    }
}

function renderUrgentAlerts() {
    const container = document.getElementById('urgentAlertsList');
    if (!container) return;

    const allAnimals = getAllAnimals();
    const urgent = allAnimals
        .map(animal => {
            const severity =
                animal.health === 'danger' ? 3 :
                animal.health === 'warning' ? 2 :
                animal.alerts.length ? 1 : 0;
            return {
                animal,
                text: animal.alerts[0] || (animal.health === 'danger'
                    ? 'Critical health reading detected.'
                    : 'Requires follow up check.'),
                severity
            };
        })
        .filter(item => item.severity > 0)
        .sort((a, b) => b.severity - a.severity)
        .slice(0, 4);

    const badge = document.getElementById('urgentAlertCount');
    if (badge) badge.textContent = urgent.length;

    if (!urgent.length) {
        container.innerHTML = '<div class="empty-state">No urgent alerts 🎉</div>';
        return;
    }

    container.innerHTML = urgent.map(({ animal, text, severity }) => {
        const icon = severity === 3 ? '🚨' : '⚠️';
        return `
            <div class="alert-row">
                <div class="alert-icon">${icon}</div>
                <div>
                    <strong>${animal.name}</strong>
                    <span>${animal.species} • ${animal.tracking?.location || 'Habitat'}</span>
                    <p>${text}</p>
                </div>
            </div>
        `;
    }).join('');
}

function renderTaskProgress() {
    const valueEl = document.getElementById('taskProgressValue');
    const ringFill = document.getElementById('taskProgressRing');
    const completedEl = document.getElementById('tasksCompletedCount');
    const nextTaskEl = document.getElementById('nextTask');
    const timelineEl = document.getElementById('taskTimeline');
    if (!valueEl || !ringFill || !timelineEl) return;

    const total = feedingSchedule.length || 1;
    const completed = feedingSchedule.filter(task => task.status === 'completed').length;
    const percent = Math.round((completed / total) * 100);

    valueEl.textContent = `${percent}%`;
    ringFill.style.setProperty('--progress', `${percent}%`);
    if (completedEl) completedEl.textContent = completed;

    const nextTask = feedingSchedule.find(task => task.status === 'pending');
    if (nextTaskEl) {
        nextTaskEl.innerHTML = nextTask
            ? `<strong>Next:</strong> ${nextTask.icon} ${nextTask.animal} at ${nextTask.time}<br>${nextTask.meal}`
            : '<strong>All tasks completed!</strong>';
    }

    timelineEl.innerHTML = feedingSchedule.slice(0, 4).map(task => `
        <div class="task-item ${task.status}">
            <span class="status-dot"></span>
            <div>
                <strong>${task.icon} ${task.animal}</strong>
                <div class="inventory-meta">${task.time} • ${task.meal}</div>
            </div>
        </div>
    `).join('');
}

function renderInventoryHealth() {
    const list = document.getElementById('inventoryWatchList');
    if (!list) return;

    const lowStock = inventory.filter(item => item.stock < item.min);
    const badge = document.getElementById('inventoryLowCount');
    if (badge) badge.textContent = lowStock.length;

    if (!lowStock.length) {
        list.innerHTML = '<div class="empty-state">Stock levels look good 🙌</div>';
        return;
    }

    list.innerHTML = lowStock.map(item => `
        <div class="inventory-item">
            <strong>${item.icon} ${item.name}</strong>
            <div class="inventory-meta">Stock ${item.stock}/${item.min}</div>
        </div>
    `).join('');
}

function renderTrackingMap() {
    const mapContainer = document.getElementById('dashboardMap');
    if (!mapContainer || !window.L) return;

    const tracked = getAllAnimals().filter(animal =>
        animal.tracking?.enabled &&
        Number.isFinite(animal.tracking.lat) &&
        Number.isFinite(animal.tracking.lng)
    );

    const countEl = document.getElementById('mapTrackerCount');
    if (countEl) countEl.textContent = `${tracked.length} active`;

    if (!dashboardMapInstance) {
        dashboardMapInstance = L.map('dashboardMap', {
            zoomControl: false,
            attributionControl: false,
            minZoom: 16,
            maxZoom: 19
        }).setView(DASHBOARD_CENTER, 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
        }).addTo(dashboardMapInstance);
    }

    dashboardMapMarkers.forEach(marker => dashboardMapInstance.removeLayer(marker));
    dashboardMapMarkers = [];

    tracked.forEach(animal => {
        const meta = trackingSpeciesMeta[animal.species] || {};
        const icon = L.divIcon({
            className: 'dashboard-pin',
            html: `<div class="dashboard-pin-inner" style="--pin-color:${meta.color || '#6366f1'}">${meta.icon || '🐾'}</div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });
        const marker = L.marker([animal.tracking.lat, animal.tracking.lng], { icon })
            .bindTooltip(`${animal.name} • ${animal.tracking.location}`, { direction: 'top' })
            .addTo(dashboardMapInstance);
        dashboardMapMarkers.push(marker);
    });

    if (tracked.length) {
        const bounds = L.latLngBounds(tracked.map(a => [a.tracking.lat, a.tracking.lng])).pad(0.12);
        dashboardMapInstance.fitBounds(bounds, { maxZoom: 18 });
    } else {
        dashboardMapInstance.setView(DASHBOARD_CENTER, 17);
    }

    const legend = document.getElementById('mapLegend');
    if (legend) {
        const legendItems = Object.entries(trackingSpeciesMeta).map(([species, meta]) => {
            const count = tracked.filter(a => a.species === species).length;
            if (!count) return '';
            return `
                <div class="legend-item">
                    <span class="legend-dot" style="background:${meta.color};"></span>
                    ${meta.icon} ${meta.label}
                    <strong>${count}</strong>
                </div>
            `;
        }).filter(Boolean).join('');
        legend.innerHTML = legendItems || '<div class="empty-state">No live trackers reporting.</div>';
    }

    setTimeout(() => dashboardMapInstance.invalidateSize(), 200);
}

function renderRecentActivity() {
    const container = document.getElementById('activityList');
    if (!container) return;

    const activities = [];

    feedingSchedule.forEach(task => {
        activities.push({
            icon: task.icon || '📋',
            title: task.animal,
            detail: task.meal,
            meta: task.time,
            tag: task.status === 'completed' ? 'Completed' : 'Pending',
            priority: task.status === 'pending' ? 3 : 1
        });
    });

    getAllAnimals().forEach(animal => {
        if (animal.alerts.length) {
            activities.push({
                icon: '🚨',
                title: `${animal.name} alert`,
                detail: animal.alerts[0],
                meta: animal.tracking?.location || animal.species,
                tag: 'Alert',
                priority: 4
            });
        }

        const latestNote = animal.notes?.slice(-1)[0];
        if (latestNote) {
            activities.push({
                icon: '📝',
                title: animal.name,
                detail: latestNote.text,
                meta: latestNote.time,
                tag: 'Note',
                priority: 2
            });
        }
    });

    const recent = activities
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 6);

    if (!recent.length) {
        container.innerHTML = '<div class="empty-state">No updates yet.</div>';
        return;
    }

    container.innerHTML = recent.map(item => `
        <div class="activity-item">
            <div class="activity-icon">${item.icon}</div>
            <div>
                <strong>${item.title}</strong>
                <p>${item.detail}</p>
                <div class="activity-meta">
                    <span>${item.meta}</span>
                    <span class="activity-tag">${item.tag}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Quarantine Alert Popup (Top Right Corner)
function renderQuarantinePopup() {
    const popup = document.getElementById('quarantinePopup');
    const messageEl = document.getElementById('quarantinePopupMessage');
    const animalsEl = document.getElementById('quarantinePopupAnimals');
    
    if (!popup || !messageEl || !animalsEl) return;

    // Check if popup was already dismissed in current page session
    // (will be reset on page refresh)
    if (sessionStorage.getItem('quarantinePopupDismissed') === 'true') {
        return;
    }

    if (typeof animalDatabase === 'undefined') {
        return;
    }

    const allAnimals = Object.values(animalDatabase).flat();
    const quarantineAlerts = [];

    // Collect all quarantine alerts
    allAnimals.forEach(animal => {
        if (animal.alerts && animal.alerts.length > 0) {
            animal.alerts.forEach(alertText => {
                const lowerAlert = alertText.toLowerCase();
                if (lowerAlert.includes('quarantine') || lowerAlert.includes('isolat') || lowerAlert.includes('contagious')) {
                    quarantineAlerts.push({
                        animal: animal.name,
                        species: animal.species,
                        message: alertText,
                        id: animal.id
                    });
                }
            });
        }
    });

    // If no quarantine alerts, don't show popup
    if (quarantineAlerts.length === 0) {
        return;
    }

    // Update popup content (compact message)
    if (quarantineAlerts.length === 1) {
        messageEl.textContent = `1 animal in quarantine`;
    } else {
        messageEl.textContent = `${quarantineAlerts.length} animals in quarantine`;
    }

    // Show animal list (max 2 for compact design)
    const displayAlerts = quarantineAlerts.slice(0, 2);
    const remainingCount = quarantineAlerts.length - displayAlerts.length;
    
    animalsEl.innerHTML = displayAlerts.map(alert => {
        const animalEmoji = getSpeciesEmoji(alert.species);
        const speciesDisplayName = normalizeSpeciesName(alert.species || 'Unknown');
        return `
            <div class="quarantine-popup-animal-item">
                <span class="quarantine-popup-animal-emoji">${animalEmoji}</span>
                <span class="quarantine-popup-animal-name">${alert.animal}</span>
                <span class="quarantine-popup-animal-species">(${speciesDisplayName})</span>
            </div>
        `;
    }).join('') + (remainingCount > 0 ? `<div class="quarantine-popup-more">+${remainingCount} more</div>` : '');

    // Show popup with animation
    popup.style.display = 'block';
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
}

// Dismiss quarantine popup
function dismissQuarantinePopup() {
    const popup = document.getElementById('quarantinePopup');
    if (!popup) return;
    
    // Mark as dismissed for current page session only (will reset on refresh)
    sessionStorage.setItem('quarantinePopupDismissed', 'true');
    
    popup.classList.remove('show');
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300);
}

// Handle quarantine action button
function handleQuarantineAction() {
    // Navigate to alerts page
    window.location.href = '../alerts/alerts.html';
}

// Open Add Cage Modal
function openAddCageModal() {
    const modal = document.getElementById('addCageModal');
    if (modal) {
        // Reset form
        const form = document.getElementById('addCageForm');
        if (form) {
            form.reset();
        }
        modal.classList.add('active');
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAddCageModal();
            }
        });
    }
}

// Close Add Cage Modal
function closeAddCageModal() {
    const modal = document.getElementById('addCageModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Handle Add Cage Form Submission
function handleAddCageSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const cageData = {
        name: formData.get('cageName') || '',
        type: formData.get('cageType') || '',
        species: formData.get('cageSpecies') || '',
        capacity: formData.get('cageCapacity') || '',
        location: formData.get('cageLocation') || '',
        description: formData.get('cageDescription') || '',
        image: formData.get('cageImage') || ''
    };

    // Validate required fields
    if (!cageData.name || !cageData.type) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Here you would typically save to database or storage
    // For now, we'll just show a success message
    console.log('New cage data:', cageData);
    
    showToast(`✅ ${cageData.name} has been added successfully!`);
    closeAddCageModal();
    
    // Optionally refresh the cage gallery
    setTimeout(() => {
        renderCageGallery();
    }, 500);
}

// Open Edit Cage Mode
function openEditCageMode() {
    // Toggle edit mode on cage items
    const cageItems = document.querySelectorAll('.cage-item:not(.cage-item-add)');
    const isEditMode = document.body.classList.contains('cage-edit-mode');
    
    if (isEditMode) {
        // Exit edit mode
        document.body.classList.remove('cage-edit-mode');
        cageItems.forEach(item => {
            item.classList.remove('edit-mode');
            const editBtn = item.querySelector('.cage-item-edit-btn');
            if (editBtn) editBtn.remove();
        });
        showToast('Edit mode disabled');
    } else {
        // Enter edit mode
        document.body.classList.add('cage-edit-mode');
        cageItems.forEach(item => {
            item.classList.add('edit-mode');
            
            // Add edit button to each cage item
            if (!item.querySelector('.cage-item-edit-btn')) {
                const editBtn = document.createElement('button');
                editBtn.className = 'cage-item-edit-btn';
                editBtn.innerHTML = '✏️';
                editBtn.title = 'Edit this cage';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    const cageName = item.querySelector('.cage-item-name')?.textContent || '';
                    showToast(`Edit ${cageName} - Feature coming soon!`);
                };
                
                const imageWrapper = item.querySelector('.cage-item-image-wrapper');
                if (imageWrapper) {
                    imageWrapper.appendChild(editBtn);
                }
            }
        });
        showToast('Edit mode enabled - Click edit icon on any cage');
    }
}

// Initialize dashboard when page loads
if (document.getElementById('dashboard-section')) {
<<<<<<< Updated upstream
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}
=======
    document.addEventListener('DOMContentLoaded', () => {
        // Clear quarantine popup dismissed state on page load (so it shows on every refresh)
        sessionStorage.removeItem('quarantinePopupDismissed');
        initializeDashboard();
    });
}
>>>>>>> Stashed changes
