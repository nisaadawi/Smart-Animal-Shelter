// Modal functions
function openModal(id) {
    const allAnimals = Object.values(animalDatabase).flat();
    const animal = allAnimals.find(a => a.id === id);
    if (!animal) return;

    selectedAnimal = animal;
    document.getElementById('modalTitle').textContent = animal.name;
    document.getElementById('modalSubtitle').textContent = animal.species;
    document.getElementById('modalImage').src = animal.images[0];

    renderTrackingDetails(animal);
    renderAlerts(animal);

    // Hide duplicate sensor section since it's now in tracking details
    const modalSensors = document.getElementById('modalSensors');
    if (modalSensors) {
        modalSensors.innerHTML = '';
        modalSensors.style.display = 'none';
    }

    // Hide duplicate notes section - will be shown in tracking details if available
    const modalNotes = document.getElementById('modalNotes');
    if (modalNotes) {
        modalNotes.innerHTML = '';
        modalNotes.style.display = 'none';
    }

    document.getElementById('animalModal').classList.add('active');
}

function closeModal() {
    document.getElementById('animalModal').classList.remove('active');
}

function feedAnimal() {
    if (selectedAnimal) {
        showToast(`✅ ${selectedAnimal.name} has been fed!`);
        closeModal();
        setTimeout(() => {
            updateDashboardStats();
            if (typeof renderAnimals === 'function') renderAnimals();
        }, 500);
    }
}

function emergencyLock() {
    showToast(`🔒 Emergency lock activated for ${selectedAnimal.name}'s enclosure`);
}

function supervisorAlert() {
    showToast(`📢 Supervisor has been alerted about ${selectedAnimal.name}`);
}

function renderTrackingDetails(animal) {
    const trackingInfo = document.getElementById('trackingInfo');
    if (!trackingInfo) return;

    if (!animal.tracking?.enabled) {
        trackingInfo.innerHTML = `
            <div class="tracking-info-placeholder">
                <span>📡 Tracker offline</span>
                <p>This animal does not have a live tracker assigned.</p>
            </div>
        `;
        return;
    }

    const battery = animal.tracking.battery ?? 100;
    const batteryColor = battery >= 50 ? '#10b981' : battery >= 20 ? '#f59e0b' : '#ef4444';
    const status = (animal.tracking.status || 'Unknown').toLowerCase();
    const statusIcon = status === 'moving' ? '🏃' : '🚶';
    const isMoving = status === 'moving';
    const isResting = status === 'resting';
    
    // Top row: LOCATION and STATUS
    const topRowMetrics = [
        { label: 'LOCATION', value: animal.tracking.location || 'Unknown', icon: '📍' },
        { label: 'STATUS', value: status, icon: statusIcon, highlightMoving: isMoving, highlightResting: isResting }
    ];
    
    // Bottom row: BATTERY and LAST CHARGED
    const bottomRowMetrics = [
        { label: 'BATTERY', value: `${battery.toFixed(2)}%`, icon: '🔋', color: batteryColor },
        { label: 'LAST CHARGED', value: animal.tracking.lastCharge || 'today', icon: '🔋', isLastCharged: true }
    ];
    
    // Health metrics grid (only important ones)
    const healthMetrics = [];
    if (animal.sensors) {
        const prioritySensors = ['heartRate', 'temp', 'activity', 'airQuality', 'weight'];
        prioritySensors.forEach(key => {
            if (animal.sensors[key]) {
                const sensor = animal.sensors[key];
                const value = sensor.unit ? `${sensor.value}${sensor.unit}` : sensor.value;
                const colorMap = {
                    'heartRate': '#ef4444',
                    'temp': '#ec4899',
                    'activity': '#10b981',
                    'airQuality': '#06b6d4',
                    'weight': '#f59e0b'
                };
                healthMetrics.push({
                    label: sensor.label.toUpperCase(),
                    value: value,
                    icon: sensor.icon,
                    color: colorMap[key] || '#64748b'
                });
            }
        });
    }

    // Recent Activity from notes
    let recentActivityHtml = '';
    if (animal.notes && animal.notes.length > 0) {
        const recentNotes = animal.notes.slice(0, 3);
        recentActivityHtml = `
            <div class="recent-activity-section">
                <div class="recent-activity-header">
                    <span class="recent-activity-icon">📝</span>
                    <h3 class="recent-activity-title">Recent Activity</h3>
                </div>
                <div class="recent-activity-list">
                    ${recentNotes.map(note => `
                        <div class="recent-activity-item">
                            <span class="activity-time">${note.time}:</span>
                            <span class="activity-text">${note.text}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    trackingInfo.innerHTML = `
        <div class="tracking-info-container">
            <!-- Tracking Info: Background Container with 2x2 Grid Layout -->
            <div class="tracking-info-wrapper">
                <div class="tracking-info-grid">
                    <!-- Top Row: LOCATION and STATUS -->
                    <div class="tracking-info-row">
                        ${topRowMetrics.map(metric => `
                            <div class="tracking-info-card">
                                <div class="tracking-card-icon">${metric.icon}</div>
                                <div class="tracking-card-content">
                                    <div class="tracking-card-label">${metric.label}</div>
                                    <div class="tracking-card-value ${metric.highlightMoving ? 'status-moving' : ''} ${metric.highlightResting ? 'status-resting' : ''}">${metric.value}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Bottom Row: BATTERY and LAST CHARGED -->
                    <div class="tracking-info-row">
                        ${bottomRowMetrics.map(metric => `
                            <div class="tracking-info-card">
                                <div class="tracking-card-icon">${metric.icon}</div>
                                <div class="tracking-card-content">
                                    <div class="tracking-card-label">${metric.label}</div>
                                    <div class="tracking-card-value ${metric.color === '#10b981' ? 'battery-good' : metric.color === '#f59e0b' ? 'battery-warning' : metric.color === '#ef4444' ? 'battery-low' : ''} ${metric.isLastCharged ? 'last-charged' : ''}">${metric.value}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Health Metrics Grid -->
            ${healthMetrics.length > 0 ? `
                <div class="health-metrics-grid">
                    ${healthMetrics.map(metric => `
                        <div class="health-metric-card" style="--metric-color: ${metric.color}">
                            <div class="health-card-icon">${metric.icon}</div>
                            <div class="health-card-content">
                                <div class="health-card-label">${metric.label}</div>
                                <div class="health-card-value">${metric.value}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <!-- Recent Activity -->
            ${recentActivityHtml}
        </div>
    `;
}

function renderAlerts(animal) {
    const alertsSection = document.getElementById('alertsSection');
    const modalAlerts = document.getElementById('modalAlerts');
    if (!alertsSection || !modalAlerts) return;

    if (!animal.alerts || animal.alerts.length === 0) {
        alertsSection.style.display = 'none';
        modalAlerts.innerHTML = '';
        return;
    }

    alertsSection.style.display = 'block';
    
    // Determine severity based on health status
    const severity = animal.health === 'danger' ? 'urgent' : 
                     animal.health === 'warning' ? 'moderate' : 'routine';
    const meta = typeof severityMeta !== 'undefined' ? severityMeta[severity] : 
                 { label: 'Alert', icon: '⚠️', progress: '60%' };
    
    // Get alert message (first alert or default)
    const alertMessage = animal.alerts[0] || 'Health alert detected';
    const location = animal.tracking?.location || 'Unknown location';
    const healthStatus = animal.health ? animal.health.toUpperCase() : 'OK';
    
    modalAlerts.innerHTML = `
        <div class="modal-alert-card ${severity}">
            <div class="modal-alert-header">
                <span class="modal-alert-pill ${severity}">
                    ${meta.icon || '⚠️'} ${meta.label || 'ALERT'}
                </span>
                <span class="modal-alert-time">Just now</span>
            </div>
            <div class="modal-alert-message">${alertMessage}</div>
            <div class="modal-alert-animal">${animal.name} (${animal.species})</div>
            <div class="modal-alert-meta">
                <span class="modal-alert-tag">📍 ${location}</span>
                <span class="modal-alert-tag">❤️ Status: ${healthStatus}</span>
            </div>
            <div class="modal-alert-progress">
                <div class="modal-alert-progress-fill" style="--progress: ${meta.progress || '60%'}"></div>
            </div>
            <div class="modal-alert-actions">
                <button class="btn btn-primary" onclick="closeModal(); if(typeof renderTracking === 'function') renderTracking();">View Details</button>
                <button class="btn btn-success" onclick="acknowledgeModalAlert(this)">Acknowledge</button>
            </div>
        </div>
    `;
}

function acknowledgeModalAlert(btn) {
    const alertCard = btn.closest('.modal-alert-card');
    if (alertCard) {
        alertCard.style.opacity = '0.5';
        alertCard.style.pointerEvents = 'none';
        showToast('✅ Alert acknowledged');
        setTimeout(() => {
            const alertsSection = document.getElementById('alertsSection');
            if (alertsSection) {
                alertsSection.style.display = 'none';
            }
        }, 500);
    }
}