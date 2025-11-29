// Health Monitor page functionality
let currentHealthSpecies = 'Goat';
let selectedHealthAnimal = null;
let vitalTrendChart = null;
let weightTrendChart = null;
let healthMetricsInterval = null;
let currentSimulatedMetrics = {
    heartRate: null,
    temperature: null,
    humidity: null
};

function initializeHealthMonitor() {
    // Check if an animal was pre-selected from Animals modal
    const selectedAnimalId = sessionStorage.getItem('selectedAnimalId');
    const selectedAnimalSpecies = sessionStorage.getItem('selectedAnimalSpecies');
    
    if (selectedAnimalId && selectedAnimalSpecies) {
        // Clear the session storage
        sessionStorage.removeItem('selectedAnimalId');
        sessionStorage.removeItem('selectedAnimalSpecies');
        
        // Set the species and select the animal
        currentHealthSpecies = selectedAnimalSpecies;
        filterHealthSpecies(selectedAnimalSpecies, false);
        
        // Find and select the animal
        setTimeout(() => {
            selectHealthAnimalById(parseInt(selectedAnimalId), selectedAnimalSpecies);
        }, 100);
    } else {
        // Normal initialization
        filterHealthSpecies('Goat', false);
    }
}

function filterHealthSpecies(species, updateTabs = true) {
    currentHealthSpecies = species;
    
    if (updateTabs) {
        document.querySelectorAll('.species-tab').forEach(t => t.classList.remove('active'));
        event.currentTarget.classList.add('active');
    } else {
        // Update tabs without event
        document.querySelectorAll('.species-tab').forEach(tab => {
            tab.classList.remove('active');
            const tabText = tab.textContent.toLowerCase();
            if ((species === 'Goat' && tabText.includes('goat')) ||
                (species === 'Sugarglider' && tabText.includes('sugar')) ||
                (species === 'Alligator' && tabText.includes('alligator')) ||
                (species === 'Snail' && tabText.includes('snail')) ||
                (species === 'Porcupine' && tabText.includes('porcupine')) ||
                (species === 'Fox' && tabText.includes('fox'))) {
                tab.classList.add('active');
            }
        });
    }
    
    renderAnimalSelection();
}

function renderAnimalSelection() {
    const grid = document.getElementById('animalSelectionGrid');
    if (!grid) return;
    
    const animalList = animalDatabase[currentHealthSpecies] || [];
    
    grid.innerHTML = animalList.map(animal => {
        const healthStatus = animal.health || 'good';
        
        return `
            <div class="health-animal-card" onclick="selectHealthAnimalById(${animal.id}, '${currentHealthSpecies}')">
                <img src="${animal.images[0]}" class="health-animal-image" alt="${animal.name}">
                <div class="health-animal-card-content">
                    <div class="health-animal-name">${animal.name}</div>
                    <div class="health-animal-species">${animal.species}</div>
                    <div class="health-animal-status ${healthStatus}">
                        ${healthStatus.toUpperCase()}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Show selection grid, hide detail view
    grid.style.display = 'grid';
    const detailView = document.getElementById('healthDetailView');
    if (detailView) detailView.style.display = 'none';
    selectedHealthAnimal = null;
    
    // Stop metrics simulation when returning to selection
    stopHealthMetricsSimulation();
}

function selectHealthAnimalById(animalId, species) {
    const animalList = animalDatabase[species] || [];
    const animal = animalList.find(a => a.id === animalId);
    
    if (!animal) return;
    
    selectedHealthAnimal = animal;
    
    // Hide selection grid, show detail view
    const grid = document.getElementById('animalSelectionGrid');
    if (grid) grid.style.display = 'none';
    
    const detailView = document.getElementById('healthDetailView');
    if (detailView) detailView.style.display = 'block';
    
    renderHealthAnimalHeader();
    renderHealthMetrics();
    renderHealthCharts();
    renderVaccinationSchedule();
    
    // Start real-time metrics simulation
    startHealthMetricsSimulation();
}

function renderHealthAnimalHeader() {
    if (!selectedHealthAnimal) return;
    
    const headerEl = document.getElementById('healthAnimalHeader');
    if (!headerEl) return;
    
    const animal = selectedHealthAnimal;
    const healthStatus = animal.health || 'good';
    const statusIcon = healthStatus === 'good' ? '✓' : healthStatus === 'warning' ? '⚠️' : '🔴';
    const tracking = animal.tracking || {};
    const lastFed = animal.lastFed || 'Unknown';
    
    // Get current animal's index in species list for navigation
    const animalList = animalDatabase[currentHealthSpecies] || [];
    const currentIndex = animalList.findIndex(a => a.id === animal.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < animalList.length - 1;
    const previousAnimal = hasPrevious ? animalList[currentIndex - 1] : null;
    const nextAnimal = hasNext ? animalList[currentIndex + 1] : null;
    
    headerEl.innerHTML = `
        <button class="health-back-button" onclick="goBackToSelection()" title="Back to Selection">
            <span class="health-back-icon">&lt;</span>
        </button>
        <div class="health-animal-header-content">
            <div class="health-animal-image-wrapper">
                <img src="${animal.images[0]}" class="health-animal-header-image" alt="${animal.name}">
                <div class="health-nav-arrows">
                    <button class="health-nav-arrow ${!hasPrevious ? 'disabled' : ''}" 
                            onclick="${hasPrevious ? `selectHealthAnimalById(${previousAnimal.id}, '${currentHealthSpecies}')` : ''}" 
                            title="${hasPrevious ? previousAnimal.name : 'No previous animal'}"
                            ${!hasPrevious ? 'disabled' : ''}>
                        <span>&lt;</span>
                    </button>
                    <button class="health-nav-arrow ${!hasNext ? 'disabled' : ''}" 
                            onclick="${hasNext ? `selectHealthAnimalById(${nextAnimal.id}, '${currentHealthSpecies}')` : ''}" 
                            title="${hasNext ? nextAnimal.name : 'No next animal'}"
                            ${!hasNext ? 'disabled' : ''}>
                        <span>&gt;</span>
                    </button>
                </div>
            </div>
            <div class="health-animal-header-info">
                <div class="health-animal-header-top">
                    <div>
                        <div class="health-animal-header-name">${animal.name}</div>
                        <div class="health-animal-header-species">${animal.species}</div>
                    </div>
                    <div class="health-animal-header-status ${healthStatus}">
                        ${statusIcon} ${healthStatus.toUpperCase()}
                    </div>
                </div>
                <div class="health-animal-header-meta">
                    <div class="health-animal-meta-item">
                        <span class="health-meta-icon">🍽️</span>
                        <span class="health-meta-label">Last Fed</span>
                        <span class="health-meta-value">${lastFed}</span>
                    </div>
                    ${tracking.enabled ? `
                    <div class="health-animal-meta-item">
                        <span class="health-meta-icon">📍</span>
                        <span class="health-meta-label">Location</span>
                        <span class="health-meta-value">${tracking.location || 'Unknown'}</span>
                    </div>
                    ` : ''}
                    ${animal.cctv ? `
                    <div class="health-animal-meta-item">
                        <span class="health-meta-icon">📹</span>
                        <span class="health-meta-label">CCTV</span>
                        <span class="health-meta-value">Active</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function goBackToSelection() {
    selectedHealthAnimal = null;
    const grid = document.getElementById('animalSelectionGrid');
    if (grid) grid.style.display = 'grid';
    
    const detailView = document.getElementById('healthDetailView');
    if (detailView) detailView.style.display = 'none';
    
    // Stop metrics simulation
    stopHealthMetricsSimulation();
    
    // Destroy charts if they exist
    if (vitalTrendChart) {
        vitalTrendChart.destroy();
        vitalTrendChart = null;
    }
    if (weightTrendChart) {
        weightTrendChart.destroy();
        weightTrendChart = null;
    }
}

// Generate random simulated values for real-time metrics
function generateSimulatedMetrics() {
    if (!selectedHealthAnimal) return;
    
    const animal = selectedHealthAnimal;
    const sensors = animal.sensors || {};
    
    // Initialize base values from animal data or defaults
    const baseHeartRate = sensors.heartRate?.value || 75;
    const baseTemp = sensors.temp?.value || sensors.baskingTemp?.value || 38.0;
    const baseHumidity = sensors.humidity?.value || 50;
    
    // Generate realistic random values with small variations
    // Heart Rate: ±3-5 bpm variation, more realistic
    if (!currentSimulatedMetrics.heartRate) {
        currentSimulatedMetrics.heartRate = baseHeartRate;
    } else {
        // Gradual change ±2-5 bpm
        const change = (Math.random() - 0.5) * 6;
        currentSimulatedMetrics.heartRate = Math.max(
            baseHeartRate - 10,
            Math.min(baseHeartRate + 15, currentSimulatedMetrics.heartRate + change)
        );
    }
    
    // Temperature: ±0.2-0.5°C variation
    if (!currentSimulatedMetrics.temperature) {
        currentSimulatedMetrics.temperature = baseTemp;
    } else {
        const change = (Math.random() - 0.5) * 0.6;
        currentSimulatedMetrics.temperature = Math.max(
            baseTemp - 1,
            Math.min(baseTemp + 1.5, currentSimulatedMetrics.temperature + change)
        );
    }
    
    // Humidity: ±2-5% variation
    if (!currentSimulatedMetrics.humidity) {
        currentSimulatedMetrics.humidity = baseHumidity;
    } else {
        const change = (Math.random() - 0.5) * 8;
        currentSimulatedMetrics.humidity = Math.max(
            baseHumidity - 15,
            Math.min(baseHumidity + 15, currentSimulatedMetrics.humidity + change)
        );
    }
}

function renderHealthMetrics() {
    if (!selectedHealthAnimal) return;
    
    const grid = document.getElementById('healthMetricsGrid');
    if (!grid) return;
    
    const animal = selectedHealthAnimal;
    const sensors = animal.sensors || {};
    
    // Generate/update simulated values
    generateSimulatedMetrics();
    
    // Collect all available health metrics
    const metrics = [];
    
    if (sensors.heartRate) {
        const value = Math.round(currentSimulatedMetrics.heartRate);
        metrics.push({
            icon: sensors.heartRate.icon || '❤️',
            label: sensors.heartRate.label || 'Heart Rate',
            value: `${value}${sensors.heartRate.unit || 'bpm'}`,
            status: 'good'
        });
    }
    
    if (sensors.temp || sensors.baskingTemp) {
        const tempSensor = sensors.temp || sensors.baskingTemp;
        const value = currentSimulatedMetrics.temperature.toFixed(1);
        metrics.push({
            icon: tempSensor.icon || '🌡️',
            label: tempSensor.label || 'Temperature',
            value: `${value}${tempSensor.unit || '°C'}`,
            status: 'good'
        });
    }
    
    if (sensors.activity) {
        metrics.push({
            icon: sensors.activity.icon || '📊',
            label: sensors.activity.label || 'Activity',
            value: sensors.activity.value || 'Active',
            status: 'good'
        });
    }
    
    if (sensors.airQuality) {
        const value = sensors.airQuality.value || 44;
        metrics.push({
            icon: sensors.airQuality.icon || '🌬️',
            label: sensors.airQuality.label || 'Air Quality',
            value: `${value}${sensors.airQuality.unit || 'AQI'}`,
            status: 'good',
            iconType: 'air-quality'
        });
    }
    
    if (sensors.weight) {
        metrics.push({
            icon: sensors.weight.icon || '⚖️',
            label: sensors.weight.label || 'Weight',
            value: `${sensors.weight.value}${sensors.weight.unit || ''}`,
            status: 'good',
            iconType: 'weight'
        });
    }
    
    if (sensors.humidity) {
        const value = Math.round(currentSimulatedMetrics.humidity);
        metrics.push({
            icon: sensors.humidity.icon || '💧',
            label: sensors.humidity.label || 'Humidity',
            value: `${value}${sensors.humidity.unit || '%'}`,
            status: 'good',
            iconType: 'humidity'
        });
    }
    
    if (sensors.substrate) {
        metrics.push({
            icon: sensors.substrate.icon || '🪨',
            label: sensors.substrate.label || 'Substrate',
            value: sensors.substrate.value || 'Good',
            status: 'good'
        });
    }
    
    if (sensors.enrichment) {
        metrics.push({
            icon: sensors.enrichment.icon || '🎾',
            label: sensors.enrichment.label || 'Enrichment',
            value: sensors.enrichment.value || 'Used',
            status: 'good'
        });
    }
    
    if (sensors.perimeterStatus) {
        metrics.push({
            icon: sensors.perimeterStatus.icon || '🔒',
            label: sensors.perimeterStatus.label || 'Perimeter',
            value: sensors.perimeterStatus.value || 'Secure',
            status: 'good'
        });
    }
    
    grid.innerHTML = metrics.map(metric => `
        <div class="health-stat-card">
            <div class="health-stat-icon ${metric.status} ${metric.iconType || ''}">${metric.icon}</div>
            <div class="health-stat-value">${metric.value}</div>
            <div class="health-stat-label">${metric.label}</div>
        </div>
    `).join('');
}

// Start real-time simulation updates
function startHealthMetricsSimulation() {
    // Clear any existing interval
    if (healthMetricsInterval) {
        clearInterval(healthMetricsInterval);
        healthMetricsInterval = null;
    }
    
    // Reset simulated values when starting
    currentSimulatedMetrics = {
        heartRate: null,
        temperature: null,
        humidity: null
    };
    
    // Initial render
    generateSimulatedMetrics();
    renderHealthMetrics();
    
    // Update every 3 seconds to simulate real-time data
    healthMetricsInterval = setInterval(() => {
        if (selectedHealthAnimal) {
            generateSimulatedMetrics();
            renderHealthMetrics();
        } else {
            // Stop if no animal selected
            stopHealthMetricsSimulation();
        }
    }, 3000);
}

// Stop real-time simulation
function stopHealthMetricsSimulation() {
    if (healthMetricsInterval) {
        clearInterval(healthMetricsInterval);
        healthMetricsInterval = null;
    }
    currentSimulatedMetrics = {
        heartRate: null,
        temperature: null,
        humidity: null
    };
}

function renderHealthCharts() {
    if (!selectedHealthAnimal) return;
    
    const chartsGrid = document.getElementById('healthChartsGrid');
    if (!chartsGrid) return;
    
    const animal = selectedHealthAnimal;
    
    // Generate realistic trend data (7 days) with natural variations
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const baseHeartRate = animal.sensors?.heartRate?.value || 80;
    const baseWeight = animal.sensors?.weight?.value || 40;
    
    // Generate heart rate data with realistic trend and variations
    const vitalData = [];
    let currentHR = baseHeartRate;
    for (let i = 0; i < days.length; i++) {
        // Small gradual trend (slight increase/decrease over time)
        const trend = (Math.random() - 0.5) * 0.5; // Small trend
        // Natural daily variation
        const dailyVar = (Math.random() - 0.5) * 8; // ±4 bpm variation
        // Time-of-day effect (higher in morning, lower at night)
        const timeEffect = Math.sin((i / days.length) * Math.PI * 2) * 3;
        // Random spike or dip (occasional)
        const spike = Math.random() > 0.85 ? (Math.random() > 0.5 ? 8 : -8) : 0;
        
        currentHR += trend + dailyVar + timeEffect + spike;
        // Keep within reasonable bounds
        currentHR = Math.max(baseHeartRate * 0.7, Math.min(baseHeartRate * 1.3, currentHR));
        vitalData.push(Math.round(currentHR));
    }
    
    // Generate weight data with gradual trend
    const weightData = [];
    let currentWeight = baseWeight;
    const weightTrend = (Math.random() - 0.45) * 0.15; // Slight gradual change
    for (let i = 0; i < days.length; i++) {
        // Small gradual change (animal might gain/lose weight slowly)
        currentWeight += weightTrend;
        // Daily fluctuation (water weight, feeding timing, etc.)
        const dailyVar = (Math.random() - 0.5) * 0.4; // ±0.2 kg variation
        currentWeight += dailyVar;
        // Keep within reasonable bounds
        currentWeight = Math.max(baseWeight * 0.95, Math.min(baseWeight * 1.05, currentWeight));
        weightData.push(parseFloat(currentWeight.toFixed(1)));
    }
    
    chartsGrid.innerHTML = `
        <div class="health-chart-card">
            <div class="health-chart-header">
                <div class="health-chart-title">Vital Sign Trends</div>
                <div class="health-chart-subtitle">7-day monitoring</div>
            </div>
            <div class="health-chart-container">
                <canvas id="vitalTrendChart"></canvas>
            </div>
        </div>
        <div class="health-chart-card">
            <div class="health-chart-header">
                <div class="health-chart-title">Weight Curve</div>
                <div class="health-chart-subtitle">Growth & nutrition</div>
            </div>
            <div class="health-chart-container">
                <canvas id="weightTrendChart"></canvas>
            </div>
        </div>
    `;
    
    // Render vital trend chart
    setTimeout(() => {
        const vitalCtx = document.getElementById('vitalTrendChart');
        if (vitalCtx && typeof Chart !== 'undefined') {
            if (vitalTrendChart) vitalTrendChart.destroy();
            
            vitalTrendChart = new Chart(vitalCtx, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: [{
                        label: 'Heart Rate (bpm)',
                        data: vitalData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(99, 102, 241, 0.1)'
                            },
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            }
                        }
                    }
                }
            });
        }
    }, 100);
    
    // Render weight trend chart
    setTimeout(() => {
        const weightCtx = document.getElementById('weightTrendChart');
        if (weightCtx && typeof Chart !== 'undefined') {
            if (weightTrendChart) weightTrendChart.destroy();
            
            weightTrendChart = new Chart(weightCtx, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: [{
                        label: 'Weight (kg)',
                        data: weightData,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#f59e0b',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: { size: 14, weight: 'bold' },
                            bodyFont: { size: 13 },
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(99, 102, 241, 0.1)'
                            },
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: { size: 11 },
                                color: '#64748b'
                            }
                        }
                    }
                }
            });
        }
    }, 150);
}

function renderVaccinationSchedule() {
    if (!selectedHealthAnimal) return;
    
    const scheduleEl = document.getElementById('vaccinationSchedule');
    if (!scheduleEl) return;
    
    const animal = selectedHealthAnimal;
    
    // Sample vaccination schedule - in real app, this would come from data
    const schedule = [
        {
            icon: '🩺',
            animal: `${animal.name} - Rabies Vaccine`,
            details: 'Due: Next month',
            status: 'Upcoming'
        },
        {
            icon: '💊',
            animal: `${animal.name} - Annual Checkup`,
            details: 'Scheduled for next week',
            status: 'Pending'
        }
    ];
    
    scheduleEl.innerHTML = schedule.map(item => `
        <div class="schedule-item">
            <div class="schedule-time">${item.icon}</div>
            <div class="schedule-details">
                <div class="schedule-animal">${item.animal}</div>
                <div class="schedule-meal">${item.details}</div>
            </div>
            <div class="schedule-status status-pending">${item.status}</div>
        </div>
    `).join('');
}

// Initialize when page loads
if (document.getElementById('health-section')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHealthMonitor);
    } else {
        initializeHealthMonitor();
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopHealthMetricsSimulation();
});

