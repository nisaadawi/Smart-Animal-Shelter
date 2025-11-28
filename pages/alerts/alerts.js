// Alerts page functionality
let alertsInitialized = false;

function initializeAlerts() {
    if (alertsInitialized) {
        console.log('Alerts already initialized, skipping');
        return;
    }
    
    console.log('=== ALERTS INITIALIZATION START ===');
    console.log('Checking dependencies...');
    console.log('typeof animalDatabase:', typeof animalDatabase);
    console.log('typeof severityMeta:', typeof severityMeta);
    console.log('typeof alertFilters:', typeof alertFilters);
    console.log('typeof renderAlerts:', typeof renderAlerts);
    
    try {
        console.log('Calling renderAlertsPage()...');
        renderAlertsPage();
        console.log('renderAlertsPage() completed successfully');
        alertsInitialized = true;
    } catch (error) {
        console.error('=== ERROR IN initializeAlerts ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error:', error);
        
        const grid = document.getElementById('alertsGrid');
        const toolbar = document.getElementById('alertsToolbar');
        const summary = document.getElementById('alertsSummary');
        
        console.log('Grid element:', grid);
        console.log('Toolbar element:', toolbar);
        console.log('Summary element:', summary);
        
        if (grid) {
            grid.innerHTML = `<div class="alerts-empty" style="color: red; padding: 20px;">
                <strong>Error loading alerts:</strong><br>
                ${error.message}<br>
                <small>Check console for details</small>
            </div>`;
        }
    }
    console.log('=== ALERTS INITIALIZATION END ===');
}

function getAllAnimalsForAlerts() {
    if (typeof animalDatabase === 'undefined') {
        console.warn('animalDatabase is not available. Ensure data.js is loaded before alerts.js');
        return [];
    }
    return Object.values(animalDatabase)
        .reduce((acc, list) => acc.concat(list || []), []);
}

function renderAlertsToolbar(allAlerts) {
    const toolbar = document.getElementById('alertsToolbar');
    if (!toolbar) {
        console.error('alertsToolbar element not found!');
        return;
    }

    if (typeof severityMeta === 'undefined') {
        console.error('severityMeta not defined in renderAlertsToolbar');
        return;
    }

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
    console.log('Toolbar rendered');
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

    renderAlertsPage();
}

// Render alerts page
function renderAlertsPage() {
    console.log('🚨🚨🚨 RENDER ALERTS PAGE CALLED 🚨🚨🚨');
    console.log('🚨 Timestamp:', new Date().toISOString());
    
    // Check if required globals exist
    console.log('🔵 Checking severityMeta...', typeof severityMeta);
    if (typeof severityMeta === 'undefined') {
        console.error('❌ severityMeta is not defined! Check if data.js is loaded.');
        return;
    }
    console.log('🔵 Checking alertFilters...', typeof alertFilters);
    if (typeof alertFilters === 'undefined') {
        console.error('❌ alertFilters is not defined! Check if utils.js is loaded.');
        return;
    }
    
    console.log('🔵 Calling getAllAnimalsForAlerts()...');
    const allAnimals = getAllAnimalsForAlerts();
    console.log(`🔵 Found ${allAnimals.length} animals`);
    
    const alerts = [];

    allAnimals.forEach(animal => {
        (animal.alerts || []).forEach(alertText => {
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

    console.log(`🔵 Generated ${alerts.length} total alerts`);
    console.log('🔵 AlertFilters:', alertFilters);
    console.log('🔵 AlertFilters size:', alertFilters.size);
    console.log('🔵 AlertFilters contents:', Array.from(alertFilters));

    console.log('🔵 Calling renderAlertsToolbar...');
    renderAlertsToolbar(alerts);
    console.log('🔵 Calling renderAlertsSummary...');
    renderAlertsSummary(alerts);

    console.log('🔵 Filtering alerts...');
    const visibleAlerts = alerts.filter(alert => {
        const hasFilter = alertFilters.has(alert.severity);
        console.log(`  Alert "${alert.message}" (${alert.severity}): filter has it? ${hasFilter}`);
        return hasFilter;
    });
    console.log(`🔵 Filtered to ${visibleAlerts.length} visible alerts`);

    console.log('🔵 Getting alertsGrid element...');
    const grid = document.getElementById('alertsGrid');
    console.log('🔵 Grid element:', grid);
    if (!grid) {
        console.error('❌ alertsGrid element not found!');
        return;
    }

    if (!visibleAlerts.length) {
        console.log('⚠️ No visible alerts, showing empty message');
        grid.innerHTML = `<div class="alerts-empty">No alerts match the current filters.</div>`;
        return;
    }

    console.log('🔵 Rendering alert items...');
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
    console.log('Alert items rendered successfully');
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
console.log('alerts.js script loaded');
console.log('Checking for alerts-section element...');
const alertsSection = document.getElementById('alerts-section');
console.log('alerts-section found:', !!alertsSection);

if (alertsSection) {
    console.log('Setting up initialization listeners...');
    
    // Try immediate initialization if DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('DOM already ready, initializing immediately');
        setTimeout(initializeAlerts, 100);
    } else {
        console.log('DOM not ready, waiting for DOMContentLoaded');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded fired, initializing...');
            initializeAlerts();
        });
    }
    
    window.addEventListener('load', () => {
        console.log('Window load event fired');
        if (!alertsInitialized) {
            console.log('Not initialized yet, initializing now...');
            initializeAlerts();
        }
    });
} else {
    console.warn('alerts-section element not found!');
}