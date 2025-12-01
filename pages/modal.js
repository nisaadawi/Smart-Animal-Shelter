// Modal functions
function openModal(id) {
    const allAnimals = Object.values(animalDatabase).flat();
    const animal = allAnimals.find(a => a.id === id);
    if (!animal) return;

    selectedAnimal = animal;
    document.getElementById('modalTitle').textContent = animal.name;
    document.getElementById('modalSubtitle').textContent = animal.species;
    
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = animal.images[0];
    }

    // Tracking info (only if tracking is enabled)
    const trackingInfo = document.getElementById('trackingInfo');
    if (trackingInfo && animal.tracking?.enabled) {
        const battery = animal.tracking.battery ?? 100;
        const batteryDisplay = battery.toFixed(2);
        const batteryStatus = battery >= 50 ? 'good' : battery >= 20 ? 'warning' : 'critical';
        const batteryIcon = battery >= 50 ? '🔋' : battery >= 20 ? '🪫' : '⚠️';
        
        trackingInfo.style.display = 'block';
        trackingInfo.innerHTML = `
            <div class="tracking-info-card">
                <div class="tracking-info-item">
                    <span class="tracking-label">📍 Location</span>
                    <span class="tracking-value">${animal.tracking.location || 'Unknown'}</span>
                </div>
                <div class="tracking-info-item">
                    <span class="tracking-label">🏃 Status</span>
                    <span class="tracking-value status-${animal.tracking.status}">${animal.tracking.status}</span>
                </div>
                <div class="tracking-info-item">
                    <span class="tracking-label">${batteryIcon} Battery</span>
                    <span class="tracking-value battery-${batteryStatus}">${batteryDisplay}%</span>
                </div>
                <div class="tracking-info-item">
                    <span class="tracking-label">🔋 Last Charged</span>
                    <span class="tracking-value">${animal.tracking.lastCharge || 'Recently'}</span>
                </div>
            </div>
        `;
    } else if (trackingInfo) {
        trackingInfo.style.display = 'none';
    }

    // Alerts
    const alertsSection = document.getElementById('alertsSection');
    const modalAlerts = document.getElementById('modalAlerts');
    if (alertsSection && modalAlerts) {
        if (animal.alerts && animal.alerts.length > 0) {
            alertsSection.style.display = 'block';
            
            // Determine severity based on health status
            const severity = animal.health === 'danger' ? 'urgent' : 
                           animal.health === 'warning' ? 'moderate' : 'routine';
            const meta = severityMeta[severity] || severityMeta.moderate;
            
            modalAlerts.innerHTML = animal.alerts.map((alert, index) => {
                // Use first alert for main display, or combine if multiple
                const isFirst = index === 0;
                return `
                <div class="modal-alert-item ${severity}">
                    <div class="modal-alert-header">
                        <span class="modal-alert-pill ${severity}">${meta.icon || '⚠️'} ${meta.label || severity.toUpperCase()}</span>
                        <span class="modal-alert-time">Just now</span>
                    </div>
                    <div class="modal-alert-message">${alert}</div>
                    <div class="modal-alert-animal">${animal.name} (${animal.species})</div>
                    <div class="modal-alert-meta">
                        <span class="modal-alert-tag">📍 ${animal.tracking?.location || 'Shelter grounds'}</span>
                        <span class="modal-alert-tag">❤️ Status: ${animal.health ? animal.health.toUpperCase() : 'OK'}</span>
                    </div>
                    <div class="modal-alert-progress">
                        <div class="modal-alert-progress-fill" style="--progress:${meta.progress || '60%'}"></div>
                    </div>
                    <div class="modal-alert-actions">
                        <button class="btn btn-primary" onclick="closeModal(); window.location.href='tracking.html';">View Details</button>
                        <button class="btn btn-success" onclick="this.closest('.modal-alert-item').style.opacity='0.5';">Acknowledge</button>
                    </div>
                </div>
            `;
            }).join('');
        } else {
            alertsSection.style.display = 'none';
        }
    }

    // Sensors
    let sensorsHtml = '';
    Object.entries(animal.sensors).forEach(([key, sensor]) => {
        sensorsHtml += `
            <div class="sensor-card">
                <div class="sensor-icon">${sensor.icon}</div>
                <div class="sensor-label">${sensor.label}</div>
                <div class="sensor-value">${sensor.value}${sensor.unit}</div>
            </div>
        `;
    });
    document.getElementById('modalSensors').innerHTML = sensorsHtml;

    // Notes
    const modalNotes = document.getElementById('modalNotes');
    if (modalNotes) {
        if (animal.notes && animal.notes.length > 0) {
            modalNotes.innerHTML = animal.notes.map(n =>
                `<div class="note-item"><span class="note-time">${n.time}:</span> ${n.text}</div>`
            ).join('');
        } else {
            modalNotes.innerHTML = '<div class="info-empty">No recent activity recorded</div>';
        }
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
<<<<<<< Updated upstream
=======
}

function openHealthMonitor() {
    if (selectedAnimal) {
        // Store the selected animal ID in sessionStorage for Health Monitor to pick up
        sessionStorage.setItem('selectedAnimalId', selectedAnimal.id);
        sessionStorage.setItem('selectedAnimalSpecies', selectedAnimal.species);
        closeModal();
        window.location.href = '../health/health.html';
    }
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

    // Get the image element
    const modalImage = document.getElementById('modalImage');
    const imageHtml = modalImage ? modalImage.outerHTML : '';
    
    trackingInfo.innerHTML = `
        <div class="tracking-info-main-layout">
            <!-- Left: Image -->
            <div class="tracking-info-image-placeholder">
                ${imageHtml}
            </div>
            
            <!-- Right: 2x2 Grid of Info Cards -->
            <div class="tracking-info-cards-wrapper">
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
        </div>
        
        <!-- Recent Activity - Below main layout -->
        ${recentActivityHtml}
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

function renderBehaviorNotes(animal) {
    const behaviorSection = document.getElementById('behaviorNotesSection');
    const behaviorContent = document.getElementById('behaviorNotesContent');
    if (!behaviorSection || !behaviorContent) return;

    const behaviorNotes = animal.behaviorNotes || null;
    const temperament = animal.temperament || null;
    const aiAlert = animal.aiAlert || null;

    if (!behaviorNotes && !aiAlert) {
        behaviorSection.style.display = 'none';
        behaviorContent.innerHTML = '';
        return;
    }

    behaviorSection.style.display = 'block';
    
    let html = '<div class="behavior-notes-content-wrapper">';
    
    if (temperament) {
        html += `
            <div class="behavior-tag">
                ${temperament}
            </div>
        `;
    }
    
    if (behaviorNotes) {
        html += `
            <div class="behavior-notes-text">
                <strong>${animal.name}:</strong> ${behaviorNotes}
            </div>
        `;
    }
    
    if (aiAlert) {
        html += `
            <div class="behavior-ai-alert">
                <span class="ai-label">AI:</span>
                <span class="ai-message">${aiAlert}</span>
            </div>
        `;
    }
    
    html += '</div>';
    behaviorContent.innerHTML = html;
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
>>>>>>> Stashed changes
}