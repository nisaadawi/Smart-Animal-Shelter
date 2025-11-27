const DASHBOARD_CENTER = [3.1125, 101.7915];
let dashboardMapInstance = null;
let dashboardMapMarkers = [];

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
function initializeDashboard() {
    updateDashboardStats();
    renderSpeciesChart();
    renderHealthStatusChart();
    renderUrgentAlerts();
    renderTaskProgress();
    renderInventoryHealth();
    renderTrackingMap();
    renderRecentActivity();
}

// Update dashboard statistics
function updateDashboardStats() {
    const allAnimals = getAllAnimals();
    const needAttention = allAnimals.filter(a => a.health === 'warning' || a.health === 'danger' || a.alerts.length > 0).length;
    const trackingActive = allAnimals.filter(a => a.tracking.enabled).length;
    const pendingTasks = feedingSchedule.filter(f => f.status === 'pending').length;

    const totalAnimalsEl = document.getElementById('totalAnimals');
    const needAttentionEl = document.getElementById('needAttention');
    const tasksPendingEl = document.getElementById('tasksPending');
    const trackingActiveEl = document.getElementById('trackingActive');

    if (totalAnimalsEl) totalAnimalsEl.textContent = allAnimals.length;
    if (needAttentionEl) needAttentionEl.textContent = needAttention;
    if (tasksPendingEl) tasksPendingEl.textContent = pendingTasks;
    if (trackingActiveEl) trackingActiveEl.textContent = trackingActive;

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

    const statuses = Object.keys(totals);
    const totalAnimals = statuses.reduce((sum, key) => sum + totals[key], 0);
    const healthyPercent = totalAnimals ? Math.round((totals.Good / totalAnimals) * 100) : 0;

    if (healthStatusChartInstance) healthStatusChartInstance.destroy();
    healthStatusChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: statuses,
            datasets: [{
                data: statuses.map(status => totals[status]),
                backgroundColor: statuses.map(status => HEALTH_STATUS_META[status].color),
                borderRadius: 40,
                spacing: 10,
                hoverOffset: 12,
                borderColor: '#e2e8f0',
                borderWidth: 8,
                cutout: '78%',
                radius: '88%'
            }]
        },
        plugins: [healthRingShadowPlugin, healthCenterTextPlugin],
        options: {
            responsive: true,
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
                    }
                },
                healthCenterText: {
                    percent: healthyPercent,
                    label: 'Healthy'
                }
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

// Initialize dashboard when page loads
if (document.getElementById('dashboard-section')) {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}