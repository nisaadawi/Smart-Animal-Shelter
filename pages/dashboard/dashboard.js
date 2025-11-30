// Initialize dashboard
let healthStatusChartInstance = null;
let dashboardMiniMap = null;
let dashboardMarkerLayer = null;
let dashboardMarkerMap = new Map();

function initializeDashboard() {
    updateDashboardStats();
    updateHeaderInfo();
    if (typeof updateHeaderStats === 'function') {
        updateHeaderStats();
    }
    renderHealthStatusChart();
    renderCriticalAlerts();
    renderUpcomingFeedings();
    renderLowStock();
    renderMiniMap();
    renderActivityTimeline();
    renderEnvironmentalStatus();
    
    // Auto-refresh intervals
    setInterval(updateHeaderInfo, 60000);
    setInterval(() => {
        updateDashboardStats();
        if (typeof updateHeaderStats === 'function') {
            updateHeaderStats();
        }
        renderCriticalAlerts();
        renderUpcomingFeedings();
        renderLowStock();
        renderMiniMap();
        renderActivityTimeline();
        renderEnvironmentalStatus();
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
}

// Update personalized greeting based on time of day
function updateGreeting() {
    const now = new Date();
    const hours = now.getHours();
    
    const greetingTimeEl = document.getElementById('greetingTime');
    const greetingSubtitleEl = document.getElementById('greetingSubtitle');
    
    if (!greetingTimeEl) return;
    
    let greeting, subtitle;
    
    if (hours >= 5 && hours < 12) {
        greeting = 'Good Morning';
        subtitle = 'Your Dashboard is updated';
    } else if (hours >= 12 && hours < 17) {
        greeting = 'Good Afternoon';
        subtitle = 'Your Dashboard is updated';
    } else if (hours >= 17 && hours < 21) {
        greeting = 'Good Evening';
        subtitle = 'Your Dashboard is updated';
    } else {
        greeting = 'Good Night';
        subtitle = 'Your Dashboard is updated';
    }
    
    // Smooth transition animation
    if (greetingTimeEl.textContent !== greeting) {
        greetingTimeEl.style.opacity = '0';
        greetingTimeEl.style.transform = 'translateY(-5px)';
        setTimeout(() => {
            greetingTimeEl.textContent = greeting;
            greetingTimeEl.style.opacity = '1';
            greetingTimeEl.style.transform = 'translateY(0)';
        }, 150);
    } else {
        greetingTimeEl.textContent = greeting;
    }
    
    if (greetingSubtitleEl) {
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
}

// Update dashboard statistics
function updateDashboardStats() {
    const allAnimals = Object.values(animalDatabase).flat();
    const needAttention = allAnimals.filter(a => 
        a.health === 'warning' || a.health === 'danger' || (a.alerts && a.alerts.length > 0)
    ).length;
    const trackingActive = allAnimals.filter(a => a.tracking && a.tracking.enabled).length;
    const pendingTasks = feedingSchedule.filter(f => f.status === 'pending').length;
    
    // Count unique species
    const speciesCounts = {};
    allAnimals.forEach(animal => {
        speciesCounts[animal.species] = (speciesCounts[animal.species] || 0) + 1;
    });
    const uniqueSpeciesCount = Object.keys(speciesCounts).length;
    const speciesMeta = uniqueSpeciesCount > 0 
        ? `${uniqueSpeciesCount} ${uniqueSpeciesCount === 1 ? 'species' : 'species'}`
        : 'No species';

    // Calculate average battery
    const trackedAnimals = allAnimals.filter(a => a.tracking && a.tracking.enabled);
    const avgBattery = trackedAnimals.length > 0
        ? trackedAnimals.reduce((sum, a) => sum + (a.tracking.battery || 100), 0) / trackedAnimals.length
        : 100;
    const batteryMeta = trackedAnimals.length > 0 
        ? `Avg battery: ${avgBattery.toFixed(0)}%`
        : 'No active devices';

    const totalAnimalsEl = document.getElementById('totalAnimals');
    const needAttentionEl = document.getElementById('needAttention');
    const tasksPendingEl = document.getElementById('tasksPending');
    const trackingActiveEl = document.getElementById('trackingActive');
    const totalAnimalsMetaEl = document.getElementById('totalAnimalsMeta');
    const needAttentionMetaEl = document.getElementById('needAttentionMeta');
    const tasksPendingMetaEl = document.getElementById('tasksPendingMeta');
    const trackingBatteryMetaEl = document.getElementById('trackingBatteryMeta');

    if (totalAnimalsEl) totalAnimalsEl.textContent = allAnimals.length;
    if (needAttentionEl) needAttentionEl.textContent = needAttention;
    if (tasksPendingEl) tasksPendingEl.textContent = pendingTasks;
    if (trackingActiveEl) trackingActiveEl.textContent = trackingActive;
    
    if (totalAnimalsMetaEl) totalAnimalsMetaEl.textContent = speciesMeta;
    if (needAttentionMetaEl) needAttentionMetaEl.textContent = needAttention > 0 ? 'Require immediate care' : 'All animals healthy';
    if (tasksPendingMetaEl) tasksPendingMetaEl.textContent = pendingTasks > 0 ? `${pendingTasks} scheduled today` : 'All feedings completed';
    if (trackingBatteryMetaEl) trackingBatteryMetaEl.textContent = batteryMeta;

    // Update badges
    const totalAlerts = allAnimals.reduce((sum, a) => sum + (a.alerts?.length || 0), 0);
    const alertBadge = document.getElementById('alertBadge');
    if (alertBadge) alertBadge.textContent = totalAlerts > 0 ? totalAlerts : '';

    const lowStock = inventory.filter(i => i.stock < i.min).length;
    const inventoryBadge = document.getElementById('inventoryBadge');
    if (inventoryBadge) inventoryBadge.textContent = lowStock > 0 ? lowStock : '';
}

// Store current alert and dismissed alerts
let currentCriticalAlert = null;
let dismissedAlerts = new Set();

// Render Critical Alert Banner (single urgent alert)
function renderCriticalAlerts() {
    const banner = document.getElementById('criticalAlertBanner');
    const titleEl = document.getElementById('alertBannerTitle');
    const messageEl = document.getElementById('alertBannerMessage');
    const actionBtn = document.getElementById('alertActionBtn');
    
    if (!banner || !titleEl || !messageEl) return;

    const allAnimals = Object.values(animalDatabase).flat();
    const criticalAlerts = [];
    
    // Only show URGENT alerts (health === 'danger')
    allAnimals.forEach(animal => {
        // Only process animals with danger health status
        if (animal.health === 'danger') {
            if (animal.alerts && animal.alerts.length > 0) {
                animal.alerts.forEach(alert => {
                    const alertKey = `${animal.id}-${alert}`;
                    if (!dismissedAlerts.has(alertKey)) {
                        criticalAlerts.push({
                            animal: animal.name,
                            species: animal.species,
                            alert: alert,
                            health: animal.health,
                            id: animal.id,
                            alertKey: alertKey
                        });
                    }
                });
            } else {
                // If no specific alert but health is danger
                const alertKey = `${animal.id}-danger`;
                if (!dismissedAlerts.has(alertKey)) {
                    criticalAlerts.push({
                        animal: animal.name,
                        species: animal.species,
                        alert: 'Critical health condition - Immediate attention required',
                        health: 'danger',
                        id: animal.id,
                        alertKey: alertKey
                    });
                }
            }
        }
    });

    // Sort by most critical (already all danger, but maintain order)
    criticalAlerts.sort((a, b) => {
        return a.id - b.id; // Simple sort by ID
    });

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

// Render Upcoming Feedings
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
        .slice(0, 4);

    if (pending.length === 0) {
        container.innerHTML = '<div class="info-empty">No upcoming feedings</div>';
        return;
    }

    container.innerHTML = pending.map(f => `
        <div class="feeding-item">
            <span class="feeding-time">${f.time}</span>
            <div class="feeding-content">
                <div class="feeding-animal">${f.icon} ${f.animal}</div>
                <div class="feeding-meal">${f.meal}</div>
            </div>
        </div>
    `).join('');
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

// Render Low Stock
function renderLowStock() {
    const container = document.getElementById('lowStockList');
    const countEl = document.getElementById('lowStockCount');
    if (!container) return;

    const lowStockItems = inventory.filter(i => i.stock < i.min).slice(0, 5);

    if (countEl) countEl.textContent = lowStockItems.length;

    if (lowStockItems.length === 0) {
        container.innerHTML = '<div class="info-empty">All items in stock</div>';
        return;
    }

    container.innerHTML = lowStockItems.map(item => `
        <div class="stock-item">
            <span class="stock-icon">${item.icon}</span>
            <div class="stock-content">
                <div class="stock-name">${item.name}</div>
                <div class="stock-level">
                    <span class="stock-current">${item.stock}</span>
                    <span class="stock-separator">/</span>
                    <span class="stock-minimum">${item.min}</span>
                </div>
            </div>
        </div>
    `).join('');
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
            scrollWheelZoom: false,
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

// Render Activity Timeline
function renderActivityTimeline() {
    const container = document.getElementById('activityTimeline');
    if (!container) return;

    const activities = [];
    const now = new Date();

    // Get recent feedings
    const recentFeedings = feedingSchedule
        .filter(f => f.status === 'completed')
        .map(f => ({
            type: 'feeding',
            time: f.time,
            text: `Fed ${f.animal} - ${f.meal}`,
            icon: '🍽️',
            timestamp: getTimeMinutes(f.time)
        }));

    // Get recent alerts
    const allAnimals = Object.values(animalDatabase).flat();
    allAnimals.forEach(animal => {
        if (animal.alerts && animal.alerts.length > 0) {
            activities.push({
                type: 'alert',
                time: 'Recent',
                text: `${animal.name}: ${animal.alerts[0]}`,
                icon: '🚨',
                timestamp: now.getMinutes() + now.getHours() * 60
            });
        }
    });

    // Get health status changes
    allAnimals.forEach(animal => {
        if (animal.health === 'warning' || animal.health === 'danger') {
            activities.push({
                type: 'health',
                time: 'Today',
                text: `${animal.name} health: ${animal.health}`,
                icon: '💊',
                timestamp: now.getMinutes() + now.getHours() * 60 - 30
            });
        }
    });

    activities.push(...recentFeedings);
    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = activities.slice(0, 7);

    if (recentActivities.length === 0) {
        container.innerHTML = '<div class="info-empty">No recent activity</div>';
        return;
    }

    container.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function getTimeMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Render Environmental Status
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

    if (goodEl) goodEl.textContent = good;
    if (warningEl) warningEl.textContent = warning;
    if (criticalEl) criticalEl.textContent = critical;

    const roomsWithIssues = rooms.filter(r => r.status !== 'good').slice(0, 4);

    if (roomsWithIssues.length === 0) {
        container.innerHTML = '<div class="info-empty">All environments optimal</div>';
        return;
    }

    container.innerHTML = roomsWithIssues.map(room => {
        const statusClass = room.status === 'danger' ? 'critical' : 'warning';
        return `
            <div class="env-item">
                <div class="env-item-name">${room.name}</div>
                <div class="env-item-stats">
                    <span class="env-stat-item">🌡️ ${room.temp}°C</span>
                    <span class="env-stat-item">💧 ${room.humidity}%</span>
                    <span class="env-stat-item status-${statusClass}">${room.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

// PROFESSIONAL CHARTS

function renderHealthStatusChart() {
    const canvas = document.getElementById('healthStatusChart');
    if (!canvas || !window.Chart) return;

    const allAnimals = Object.values(animalDatabase).flat();
    const totals = { Good: 0, Warning: 0, Danger: 0 };
    allAnimals.forEach(animal => {
        if (animal.health === 'good') totals.Good += 1;
        else if (animal.health === 'warning') totals.Warning += 1;
        else totals.Danger += 1;
    });

    if (healthStatusChartInstance) healthStatusChartInstance.destroy();
    healthStatusChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Good', 'Warning', 'Danger'],
            datasets: [{
                data: [totals.Good, totals.Warning, totals.Danger],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.9)',
                    'rgba(251, 191, 36, 0.9)',
                    'rgba(239, 68, 68, 0.9)'
                ],
                borderColor: [
                    '#22c55e',
                    '#fbbf24',
                    '#ef4444'
                ],
                borderWidth: 3,
                hoverBorderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            layout: {
                padding: {
                    top: 5,
                    bottom: 5
                }
            },
            plugins: {
                legend: { 
                    position: 'bottom',
                    align: 'center',
                    labels: { 
                        color: '#475569',
                        font: { size: 12, weight: '600', family: 'system-ui, -apple-system, sans-serif' },
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10,
                        boxHeight: 10,
                        boxPadding: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
                    padding: 16,
                    titleFont: { size: 13, weight: '700', family: 'system-ui, -apple-system, sans-serif' },
                    bodyFont: { size: 14, weight: '600', family: 'system-ui, -apple-system, sans-serif' },
                    cornerRadius: 12,
                    displayColors: true,
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 1.5,
                    titleColor: '#f1f5f9',
                    bodyColor: '#e2e8f0',
                    titleSpacing: 8,
                    bodySpacing: 6,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            return ` ${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1600,
                easing: 'easeOutQuart'
            }
        }
    });
}

// Initialize dashboard when page loads
if (document.getElementById('dashboard-section')) {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}
