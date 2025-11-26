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
        const hasAlerts = animal.alerts.length > 0 || animal.health === 'danger';
        const devices = [];
        if (animal.safety) devices.push('🔒');
        const profile = animal.profile || {};
        const behaviorProfile = animal.behaviorProfile || {};
        const idTag = profile.idTag || 'ID pending';
        const speciesBreed = `${animal.species}${profile.breed ? ` • ${profile.breed}` : ''}`;
        const dobAge = profile.age && profile.dob
            ? `${profile.age} • ${profile.dob}`
            : profile.age || profile.dob || '—';
        const enclosure = profile.enclosure || 'Assigning habitat…';
        const sex = profile.sex || '—';
        const behaviorSummary = behaviorProfile.summary || 'Behavior data syncing…';
        const behaviorAlert = behaviorProfile.alert || 'AI assistant calibrating signals…';

        const imageStyle = animal.imageFocus ? `style="object-position:${animal.imageFocus}"` : '';

        return `
            <div class="animal-card ${hasAlerts ? 'has-alert' : ''}" onclick="openModal(${animal.id})">
                <div class="animal-image-wrapper">
                    <img src="${animal.images[0]}" class="animal-image" alt="${animal.name}" ${imageStyle}>

                    <div class="health-badge ${animal.health}">
                        ${animal.health === 'good' ? '✓' : animal.health === 'warning' ? '⚠️' : '🔴'}
                    </div>
                </div>
                <div class="animal-content">
                    <div class="animal-header">
                        <div>
                            <div class="animal-name">${animal.name}</div>
                            <div class="id-tag">${idTag}</div>
                        </div>
                        <span class="health-chip ${animal.health}">${animal.health.toUpperCase()}</span>
                    </div>
                    <div class="animal-species">${speciesBreed}</div>
                    <div class="animal-meta-grid">
                        <div class="meta-card">
                            <div class="meta-label">📅 DOB / Age</div>
                            <div class="meta-value">${dobAge}</div>
                        </div>
                        <div class="meta-card">
                            <div class="meta-label">🚻 Sex</div>
                            <div class="meta-value">${sex}</div>
                        </div>
                        <div class="meta-card">
                            <div class="meta-label">🃏 Cage / Zone</div>
                            <div class="meta-value">${enclosure}</div>
                        </div>
                        <div class="meta-card">
                            <div class="meta-label">⏱ Last Fed</div>
                            <div class="meta-value">${animal.lastFed}</div>
                        </div>
                    </div>
                    <div class="behavior-chip">${behaviorSummary}</div>
                    <div class="animal-devices">
                        ${devices.map(icon => `<div class="device-icon">${icon}</div>`).join('')}
                    </div>
                    <div class="ai-alert">
                        <span class="ai-label">Behavior alert</span>
                        <span class="ai-text">${behaviorAlert}</span>
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