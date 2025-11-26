// Modal functions
function openModal(id) {
    const allAnimals = Object.values(animalDatabase).flat();
    const animal = allAnimals.find(a => a.id === id);
    if (!animal) return;

    selectedAnimal = animal;
    document.getElementById('modalTitle').textContent = animal.name;
    document.getElementById('modalSubtitle').textContent = animal.species;
    document.getElementById('modalImage').src = animal.images[0];

    // Emergency panel for dangerous animals
    const emergencyPanel = document.getElementById('emergencyPanel');
    if (animal.safety) {
        emergencyPanel.innerHTML = `
            <div class="emergency-panel">
                <div class="emergency-title">⚠️ Safety Controls</div>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="btn btn-danger" onclick="emergencyLock()">🔒 Emergency Lock</button>
                    <button class="btn btn-danger" onclick="supervisorAlert()">📢 Alert Supervisor</button>
                </div>
            </div>
        `;
    } else {
        emergencyPanel.innerHTML = '';
    }

    // CCTV feed display
    const cctvFeed = document.getElementById('cctvFeed');
    if (!animal.cctv) {
        cctvFeed.style.display = 'none';
    } else {
        cctvFeed.style.display = 'block';
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
    document.getElementById('modalNotes').innerHTML = animal.notes.map(n =>
        `<div class="note-item"><span class="note-time">${n.time}:</span> ${n.text}</div>`
    ).join('');

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