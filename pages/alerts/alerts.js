// Alerts page functionality
function initializeAlerts() {
    renderAlerts();
}

function renderAlertsToolbar(allAlerts) {
    const toolbar = document.getElementById('alertsToolbar');
    if (!toolbar) return;

    const filterButtons = Object.entries(severityMeta).map(([severity, meta]) => {
        const count = allAlerts.filter(a => a.severity === severity).length;
        const active = alertFilters.has(severity);
        return `
            <button class="alert-filter ${active ? 'active' : ''}" onclick="toggleAlertFilter('${severity}')">
                <span>${meta.icon}</span>
                <span>${meta.label}</span>
                <span class="filter-count">${count}</span>
            </button>
        `;
    }).join('');

    toolbar.innerHTML = `
        <div class="alert-filters">${filterButtons}</div>
        <div style="font-weight:700; color:var(--text-secondary);">Filters active: ${alertFilters.size}</div>
    `;
}

function renderAlertsSummary(allAlerts) {
    const summary = document.getElementById('alertsSummary');
    if (!summary) return;

    if (!allAlerts.length) {
        summary.innerHTML = `<div class="alerts-empty">No alerts in the queue. Monitoring in passive mode.</div>`;
        return;
    }

    const urgent = allAlerts.filter(a => a.severity === 'urgent').length;
    const moderate = allAlerts.filter(a => a.severity === 'moderate').length;
    const routine = allAlerts.filter(a => a.severity === 'routine').length;
    const critical = urgent + moderate;

    summary.innerHTML = `
        <div class="alert-summary-card">
            <div class="label">Open Alerts</div>
            <div class="value">${allAlerts.length}</div>
            <div class="meta">${critical} requiring response</div>
        </div>
        <div class="alert-summary-card">
            <div class="label">Severity Mix</div>
            <div class="value">${urgent}/${moderate}/${routine}</div>
            <div class="meta">Urgent / Moderate / Routine</div>
        </div>
        <div class="alert-summary-card">
            <div class="label">Active Filters</div>
            <div class="value">${alertFilters.size}</div>
            <div class="meta">${Array.from(alertFilters).map(s => severityMeta[s].label).join(', ')}</div>
        </div>
    `;
}

function toggleAlertFilter(severity) {
    if (alertFilters.has(severity) && alertFilters.size === 1) {
        showToast('At least one severity must stay visible.');
        return;
    }

    if (alertFilters.has(severity)) {
        alertFilters.delete(severity);
    } else {
        alertFilters.add(severity);
    }

    renderAlerts();
}

// Render alerts
function renderAlerts() {
    const allAnimals = Object.values(animalDatabase).flat();
    const alerts = [];

    allAnimals.forEach(animal => {
        animal.alerts.forEach(alertText => {
            const severity = animal.health === 'danger' ? 'urgent' : 'moderate';
            alerts.push({
                severity,
                message: alertText,
                animal: `${animal.name} (${animal.species})`,
                time: 'Just now',
                animalId: animal.id,
                location: animal.tracking?.location || 'Habitat floor',
                health: animal.health,
                requiresAction: severity !== 'routine'
            });
        });
    });

    // Add routine alerts
    alerts.push({
        severity: 'routine',
        message: 'Fox vaccination due next week',
        animal: 'Foxes',
        time: 'Today',
        location: 'Clinic dashboard',
        requiresAction: false
    });

    renderAlertsToolbar(alerts);
    renderAlertsSummary(alerts);

    const visibleAlerts = alerts.filter(alert => alertFilters.has(alert.severity));

    const grid = document.getElementById('alertsGrid');
    if (!grid) return;

    if (!visibleAlerts.length) {
        grid.innerHTML = `<div class="alerts-empty">No alerts match the current filters.</div>`;
        return;
    }

    grid.innerHTML = visibleAlerts.map(alert => {
        const meta = severityMeta[alert.severity] || {};
        return `
            <div class="alert-item ${alert.severity}">
                <div class="alert-header">
                    <span class="alert-pill ${alert.severity}">${meta.icon || 'ℹ️'} ${meta.label || alert.severity}</span>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-animal">${alert.animal}</div>
                <div class="alert-meta">
                    <span class="alert-tag">📍 ${alert.location || 'Shelter grounds'}</span>
                    <span class="alert-tag">❤️ Status: ${alert.health ? alert.health.toUpperCase() : 'OK'}</span>
                </div>
                <div class="alert-progress">
                    <div class="alert-progress-fill" style="--progress:${meta.progress || '60%'}"></div>
                </div>
                ${alert.animalId ? `
                    <div class="alert-actions">
                        <button class="btn btn-primary" onclick="openModal(${alert.animalId})">View Details</button>
                        <button class="btn btn-success" onclick="acknowledgeAlert(this)">Acknowledge</button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function acknowledgeAlert(btn) {
    btn.closest('.alert-item').style.opacity = '0.5';
    showToast('✅ Alert acknowledged');
    setTimeout(() => {
        btn.closest('.alert-item').remove();
        updateDashboardStats();
    }, 500);
}

// Initialize alerts page when page loads
if (document.getElementById('alerts-section')) {
    document.addEventListener('DOMContentLoaded', initializeAlerts);
}