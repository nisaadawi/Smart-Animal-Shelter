// Initialize dashboard
function initializeDashboard() {
    updateDashboardStats();
    renderSpeciesChart();
    renderHealthStatusChart();
}

// Update dashboard statistics
function updateDashboardStats() {
    const allAnimals = Object.values(animalDatabase).flat();
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

    const allAnimals = Object.values(animalDatabase).flat();
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
}

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
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#64748b' } }
            }
        }
    });
}

// Initialize dashboard when page loads
if (document.getElementById('dashboard-section')) {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}