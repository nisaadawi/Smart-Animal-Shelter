// Modal functions
function openModal(id) {
    const allAnimals = Object.values(animalDatabase).flat();
    const animal = allAnimals.find(a => a.id === id);
    if (!animal) return;

    selectedAnimal = animal;
    document.getElementById('modalTitle').textContent = animal.name;
    document.getElementById('modalSubtitle').textContent = animal.species;
    document.getElementById('modalImage').src = animal.images[0];

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
}