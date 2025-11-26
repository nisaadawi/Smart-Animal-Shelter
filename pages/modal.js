const insightCharts = {};
const countdownTimers = {};
const insightColors = {
    vitals: {
        border: 'rgba(99, 102, 241, 1)',
        fillStart: 'rgba(99, 102, 241, 0.25)',
        fillEnd: 'rgba(99, 102, 241, 0.05)'
    },
    weight: {
        border: 'rgba(16, 185, 129, 1)',
        fillStart: 'rgba(16, 185, 129, 0.25)',
        fillEnd: 'rgba(16, 185, 129, 0.05)'
    }
};

// Modal functions
function openModal(id) {
    const allAnimals = Object.values(animalDatabase).flat();
    const animal = allAnimals.find(a => a.id === id);
    if (!animal) return;

    resetSmartInsights();
    selectedAnimal = animal;
    setText('modalTitle', animal.name);
    setText('modalSubtitle', animal.species);
    const modalImage = document.getElementById('modalImage');
    if (modalImage) {
        modalImage.src = animal.images[0];
        modalImage.style.objectPosition = animal.imageFocus || 'center';
    }

    renderEmergencyPanel(animal);
    populateIdentity(animal);
    renderSensors(animal);
    renderBehavior(animal);
    renderSmartInsights(animal);
    renderNotes(animal);

    document.getElementById('animalModal').classList.add('active');
}

function closeModal() {
    resetSmartInsights();
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

function renderEmergencyPanel(animal) {
    const emergencyPanel = document.getElementById('emergencyPanel');
    if (!emergencyPanel) return;

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
}

function populateIdentity(animal) {
    const profile = animal.profile || {};
    const idTag = profile.idTag || 'ID pending';
    const speciesBreed = `${animal.species}${profile.breed ? ` • ${profile.breed}` : ''}`;
    const dobAge = profile.age && profile.dob
        ? `${profile.age} • ${profile.dob}`
        : profile.age || profile.dob || '—';

    setText('identityNameTag', `${animal.name} • ${idTag}`);
    setText('identitySpecies', speciesBreed);
    setText('identityAge', dobAge);
    setText('identitySex', profile.sex || '—');
    setText('identityZone', profile.enclosure || 'Assigning habitat…');
}

function renderSensors(animal) {
    const sensorsContainer = document.getElementById('modalSensors');
    if (!sensorsContainer) return;

    const excludedSensors = ['heartRate', 'temp', 'baskingTemp', 'waterTemp'];
    if (!animal.sensors) {
        sensorsContainer.innerHTML = '<div class="sensor-empty">Sensors offline – awaiting sync.</div>';
        return;
    }

    const sensorCards = Object.entries(animal.sensors)
        .filter(([key]) => !excludedSensors.includes(key))
        .map(([, sensor]) => `
            <div class="sensor-card">
                <div class="sensor-icon">${sensor.icon}</div>
                <div class="sensor-label">${sensor.label}</div>
                <div class="sensor-value">${sensor.value}${sensor.unit}</div>
            </div>
        `)
        .join('');

    sensorsContainer.innerHTML = sensorCards || '<div class="sensor-empty">Live vitals removed for privacy.</div>';
}

function renderBehavior(animal) {
    const behavior = animal.behaviorProfile || {};
    const summary = behavior.summary || 'Behavioral insights syncing…';
    const alert = behavior.alert || 'AI assistant calibrating signals…';
    const mood = summary.split(/[.!?]/)[0] || 'Behavior syncing…';

    setText('behaviorSummary', summary);
    setText('behaviorAlert', alert);
    setText('behaviorMood', mood);
}

function renderSmartInsights(animal) {
    const metrics = animal.smartMetrics || {};
    renderTrendChart(
        'vitalTrendChart',
        metrics.trendLabels,
        metrics.vitalTrend,
        insightColors.vitals
    );
    renderTrendChart(
        'weightTrendChart',
        metrics.trendLabels,
        metrics.weightCurve,
        insightColors.weight
    );

    startCountdownTimer('feedingTimer', metrics.feedingMinutes);
    startCountdownTimer('medTimer', metrics.medicationMinutes);
}

function renderNotes(animal) {
    const notesContainer = document.getElementById('modalNotes');
    if (!notesContainer) return;

    if (!Array.isArray(animal.notes) || !animal.notes.length) {
        notesContainer.innerHTML = '<div class="note-item">No recent activity logged.</div>';
        return;
    }

    notesContainer.innerHTML = animal.notes.map(n =>
        `<div class="note-item"><span class="note-time">${n.time}:</span> ${n.text}</div>`
    ).join('');
}

function renderTrendChart(canvasId, labels = [], values = [], colors) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const card = canvas.closest('.insight-card');
    const hasData = Array.isArray(labels) && labels.length && Array.isArray(values) && values.length;

    if (!hasData || typeof Chart === 'undefined') {
        if (card) card.classList.add('insight-card--empty');
        destroyChart(canvasId);
        return;
    }

    if (card) card.classList.remove('insight-card--empty');
    destroyChart(canvasId);

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, colors.fillStart);
    gradient.addColorStop(1, colors.fillEnd);

    insightCharts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                data: values,
                tension: 0.4,
                borderColor: colors.border,
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            }
        }
    });
}

function startCountdownTimer(elementId, minutes) {
    const el = document.getElementById(elementId);
    if (!el) return;

    if (countdownTimers[elementId]) {
        clearInterval(countdownTimers[elementId]);
    }

    if (typeof minutes !== 'number') {
        el.textContent = '—';
        return;
    }

    const target = Date.now() + minutes * 60000;
    const update = () => {
        const diff = target - Date.now();
        if (diff <= 0) {
            el.textContent = 'Due now';
            clearInterval(countdownTimers[elementId]);
            return;
        }

        el.textContent = formatCountdown(diff);
    };

    update();
    countdownTimers[elementId] = setInterval(update, 1000);
}

function formatCountdown(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const hourPart = hours > 0 ? `${hours}h ` : '';
    return `${hourPart}${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

function resetSmartInsights() {
    Object.keys(insightCharts).forEach(key => destroyChart(key));
    Object.keys(countdownTimers).forEach(key => {
        clearInterval(countdownTimers[key]);
        delete countdownTimers[key];
    });
}

function destroyChart(key) {
    if (insightCharts[key]) {
        insightCharts[key].destroy();
        delete insightCharts[key];
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}