// Animals page functionality
function initializeAnimals() {
    renderAnimals();
}

function filterSpecies(species) {
    currentSpecies = species;
    document.querySelectorAll('.species-tab').forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderAnimals();
}

// Render animals grid
function renderAnimals() {
    const grid = document.getElementById('animalsGrid');
    if (!grid) return;
    
    const animalList = animalDatabase[currentSpecies] || [];

    grid.innerHTML = animalList.map(animal => {
        const alerts = Array.isArray(animal.alerts) ? animal.alerts : [];
        const sensors = animal.sensors || {};
        const tracking = animal.tracking || {};

        const hasAlerts = alerts.length > 0 || animal.health === 'danger';
        const devices = [];
        if (sensors.heartRate) devices.push('❤️');
        if (sensors.temp || sensors.baskingTemp) devices.push('🌡️');
        if (animal.cctv) devices.push('📹');
        if (tracking.enabled) devices.push('📍');
        if (animal.safety) devices.push('🔒');

        return `
            <div class="animal-card ${hasAlerts ? 'has-alert' : ''}" onclick="openModal(${animal.id})">
                <div class="animal-image-wrapper">
                    <img src="${animal.images[0]}" class="animal-image" alt="${animal.name}">
                    ${tracking.enabled ? '<div class="tracking-badge live">LIVE TRACKING</div>' : ''}
                    <div class="health-badge ${animal.health}">
                        ${animal.health === 'good' ? '✓' : animal.health === 'warning' ? '⚠️' : '🔴'}
                    </div>
                </div>
                <div class="animal-content">
                    <div class="animal-header">
                        <div>
                            <div class="animal-name">${animal.name}</div>
                            <div class="animal-species">${animal.species}</div>
                        </div>
                    </div>
                    <div class="animal-stats">
                        <div class="stat-item">
                            <div class="stat-item-label">Last Fed</div>
                            <div class="stat-item-value">${animal.lastFed}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-item-label">Health Status</div>
                            <div class="stat-item-value">${animal.health.toUpperCase()}</div>
                        </div>
                    </div>
                    <div class="animal-devices">
                        ${devices.map(icon => `<div class="device-icon">${icon}</div>`).join('')}
                    </div>
                    <div class="animal-actions">
                        <button class="btn btn-primary">👁️ View Details</button>
                        <button class="btn btn-success" onclick="event.stopPropagation(); feedNow('${animal.name}')">🍽️ Feed</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function feedNow(name) {
    showToast(`✅ ${name} has been fed successfully!`);
    setTimeout(() => {
        updateDashboardStats();
        renderAnimals();
    }, 500);
}

// Initialize animals page when page loads
if (document.getElementById('animals-section')) {
    document.addEventListener('DOMContentLoaded', initializeAnimals);
}