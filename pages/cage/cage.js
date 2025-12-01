// Cage Monitor functionality

let panX = 0; // Horizontal pan position (pixels)
let panY = 0; // Vertical pan position (pixels)
const panStep = 50; // Pixels to move per button press
const maxPan = 200; // Maximum pan distance in pixels
let cageCurrentSpecies = 'All'; // Default species for cage monitor

// Video sources for each species
const speciesVideos = {
    'Goat': '../../videos/goat.MOV',
    'Sugarglider': '../../videos/sugarglider.MOV',
    'Alligator': '../../videos/alligator.mp4',
    'Snail': '../../videos/snail.MOV',
    'Porcupine': '../../videos/porcupine.MP4',
    'Fox': '../../videos/fox.MP4'
};

// Species display names mapping
const speciesDisplayNames = {
    'All': 'All Species',
    'Goat': 'Goats',
    'Sugarglider': 'Sugar Gliders',
    'Alligator': 'Alligators',
    'Snail': 'Snails',
    'Porcupine': 'Porcupines',
    'Fox': 'Foxes'
};

// Species-specific environmental thresholds
const speciesThresholds = {
    'Goat': {
        minTemp: 10,
        maxTemp: 25,
        optimalTemp: 18,
        minHumidity: 40,
        maxHumidity: 70,
        optimalHumidity: 55,
        tempRange: '(10-25°C)',
        humidityRange: '(40-70%)'
    },
    'Sugarglider': {
        minTemp: 20,
        maxTemp: 28,
        optimalTemp: 24,
        minHumidity: 50,
        maxHumidity: 80,
        optimalHumidity: 65,
        tempRange: '(20-28°C)',
        humidityRange: '(50-80%)'
    },
    'Alligator': {
        minTemp: 25,
        maxTemp: 35,
        optimalTemp: 30,
        minHumidity: 60,
        maxHumidity: 90,
        optimalHumidity: 75,
        tempRange: '(25-35°C)',
        humidityRange: '(60-90%)'
    },
    'Snail': {
        minTemp: 18,
        maxTemp: 26,
        optimalTemp: 22,
        minHumidity: 70,
        maxHumidity: 95,
        optimalHumidity: 85,
        tempRange: '(18-26°C)',
        humidityRange: '(70-95%)'
    },
    'Porcupine': {
        minTemp: 15,
        maxTemp: 25,
        optimalTemp: 20,
        minHumidity: 40,
        maxHumidity: 65,
        optimalHumidity: 50,
        tempRange: '(15-25°C)',
        humidityRange: '(40-65%)'
    },
    'Fox': {
        minTemp: 5,
        maxTemp: 20,
        optimalTemp: 12,
        minHumidity: 30,
        maxHumidity: 60,
        optimalHumidity: 45,
        tempRange: '(5-20°C)',
        humidityRange: '(30-60%)'
    }
};

// Enhanced alert suggestions for different environmental issues
const alertSuggestions = {
    'temperature': {
        'high': {
            title: 'High Temperature Alert',
            message: (species, current, min, max) => `Temperature is too high for ${speciesDisplayNames[species]} (${current}°C). Optimal range: ${min}-${max}°C.`,
            suggestions: [
                'Increase ventilation by setting fan to HIGH',
                'Activate cooling system if available',
                'Reduce direct sunlight exposure',
                'Check air conditioning settings',
                'Provide additional water sources'
            ],
            immediateAction: 'Set fan speed to HIGH'
        },
        'low': {
            title: 'Low Temperature Alert',
            message: (species, current, min, max) => `Temperature is too low for ${speciesDisplayNames[species]} (${current}°C). Optimal range: ${min}-${max}°C.`,
            suggestions: [
                'Activate heating system',
                'Reduce ventilation by setting fan to LOW',
                'Check insulation and close any drafts',
                'Increase ambient room temperature',
                'Provide additional bedding or heat lamps'
            ],
            immediateAction: 'Set fan speed to LOW'
        }
    },
    'humidity': {
        'high': {
            title: 'High Humidity Alert',
            message: (species, current, min, max) => `Humidity is too high for ${speciesDisplayNames[species]} (${current}%). Optimal range: ${min}-${max}%.`,
            suggestions: [
                'Increase ventilation by setting fan to HIGH',
                'Activate dehumidifier if available',
                'Improve air circulation in the habitat',
                'Reduce water sources temporarily',
                'Check for water leaks or spills'
            ],
            immediateAction: 'Set fan speed to HIGH'
        },
        'low': {
            title: 'Low Humidity Alert',
            message: (species, current, min, max) => `Humidity is too low for ${speciesDisplayNames[species]} (${current}%). Optimal range: ${min}-${max}%.`,
            suggestions: [
                'Activate humidifier or misting system',
                'Reduce ventilation by setting fan to LOW',
                'Add water bowls or wet towels to habitat',
                'Use a room humidifier nearby',
                'Increase frequency of misting'
            ],
            immediateAction: 'Set fan speed to LOW'
        }
    }
};

// Problematic initial environments with specific issues
const problematicEnvironments = {
    'Snail': {
        temperature: 15, // Too cold for snails
        humidity: 60,    // Too dry for snails
        airQuality: 'Fair',
        issues: ['temperature_low', 'humidity_low']
    },
    'Fox': {
        temperature: 23, // Too warm for foxes
        humidity: 65,    // Too humid for foxes
        airQuality: 'Poor',
        issues: ['temperature_high', 'humidity_high']
    }
};

// Environment state - will be updated based on species
let environmentState = {
    temperature: 0,
    humidity: 0,
    airQuality: 'Good',
    lightLevel: 75,
    fanSpeed: 'medium',
    cageLocked: true,
    autoVentilation: false, // Changed to false to require manual fixes
    lastAlert: null
};

// ========== CORE FUNCTIONS ==========

// Switch CCTV feed based on selected species
function switchCCTVFeed(species) {
    const speciesTabs = document.querySelectorAll('.species-tab');
    const speciesNameElement = document.getElementById('currentSpeciesName');
    const allSpeciesView = document.getElementById('allSpeciesView');
    const singleSpeciesView = document.getElementById('singleSpeciesView');
    
    // Update active tab
    speciesTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active to clicked tab
    speciesTabs.forEach(tab => {
        const tabSpecies = tab.getAttribute('data-species');
        if (tabSpecies === species) {
            tab.classList.add('active');
        }
    });
    
    // Update species name in header
    if (speciesNameElement) {
        speciesNameElement.textContent = speciesDisplayNames[species] || species;
    }
    
    if (species === 'All') {
        // Show all species grid view
        allSpeciesView.classList.remove('hidden');
        singleSpeciesView.classList.add('hidden');
        
        cageCurrentSpecies = 'All';
        
        if (typeof showToast === 'function') {
            showToast('Showing all species');
        }
    } else {
        // Show single species view
        allSpeciesView.classList.add('hidden');
        singleSpeciesView.classList.remove('hidden');
        
        // Reset pan position
        panX = 0;
        panY = 0;
        
        // Update video source
        const video = document.getElementById('cctvVideo');
        const placeholder = document.getElementById('cctvPlaceholder');
        
        if (speciesVideos[species]) {
            video.src = speciesVideos[species];
            video.load();
        }
        
        // Reset video position
        video.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
        
        // Reset camera position
        document.getElementById('cameraPosition').textContent = 'Center';
        
        cageCurrentSpecies = species;
        
        // Initialize environment for this species
        initializeSpeciesEnvironment(species);
        
        // Load new video
        video.load();
        
        // Play the video after it loads
        video.onloadeddata = () => {
            if (placeholder) {
                placeholder.classList.add('hidden');
            }
            video.play().catch(err => {
                console.error('Error playing video:', err);
            });
        };
        
        if (typeof showToast === 'function') {
            showToast(`Switched to ${species} habitat`);
        }
    }
}

// Initialize environment for a specific species
function initializeSpeciesEnvironment(species) {
    const thresholds = speciesThresholds[species] || speciesThresholds['Goat'];
    
    // Check if this species has a problematic environment
    if (problematicEnvironments[species]) {
        // Use problematic values for Snail and Fox
        environmentState.temperature = problematicEnvironments[species].temperature;
        environmentState.humidity = problematicEnvironments[species].humidity;
        environmentState.airQuality = problematicEnvironments[species].airQuality;
        
        // Immediately trigger enhanced alerts for problematic environments
        setTimeout(() => {
            triggerInitialAlerts(species);
        }, 1000);
    } else {
        // Set initial values to optimal ranges for other species
        environmentState.temperature = thresholds.optimalTemp;
        environmentState.humidity = thresholds.optimalHumidity;
        environmentState.airQuality = 'Good';
    }
    
    // Update display with species-specific ranges
    updateEnvironmentDisplay();
    updateSpeciesRanges(species);
}

// Trigger initial alerts for problematic environments
function triggerInitialAlerts(species) {
    const thresholds = speciesThresholds[species];
    const problematicEnv = problematicEnvironments[species];
    
    problematicEnv.issues.forEach(issue => {
        const [type, level] = issue.split('_');
        
        if (type === 'temperature') {
            const alert = createTemperatureAlert(species, level, thresholds);
            setTimeout(() => {
                showEnhancedAlert(alert);
            }, 1000);
        } else if (type === 'humidity') {
            const alert = createHumidityAlert(species, level, thresholds);
            setTimeout(() => {
                showEnhancedAlert(alert);
            }, 1500);
        }
    });
}

// ========== ALERT SYSTEM ==========

// Create temperature alert with suggestions
function createTemperatureAlert(species, type, thresholds) {
    const alertConfig = alertSuggestions.temperature[type];
    return {
        type: 'temperature',
        level: type,
        title: alertConfig.title,
        message: alertConfig.message(species, Math.round(environmentState.temperature), thresholds.minTemp, thresholds.maxTemp),
        suggestions: alertConfig.suggestions,
        immediateAction: alertConfig.immediateAction,
        severity: 'critical'
    };
}

// Create humidity alert with suggestions
function createHumidityAlert(species, type, thresholds) {
    const alertConfig = alertSuggestions.humidity[type];
    return {
        type: 'humidity',
        level: type,
        title: alertConfig.title,
        message: alertConfig.message(species, Math.round(environmentState.humidity), thresholds.minHumidity, thresholds.maxHumidity),
        suggestions: alertConfig.suggestions,
        immediateAction: alertConfig.immediateAction,
        severity: 'critical'
    };
}

// Show enhanced alert with suggestions
function showEnhancedAlert(alert) {
    // Create detailed alert message with suggestions
    let detailedMessage = `${alert.message}\n\n`;
    detailedMessage += `🚨 **Immediate Action Required:** ${alert.immediateAction}\n\n`;
    detailedMessage += `💡 **Recommended Steps:**\n`;
    
    alert.suggestions.forEach((suggestion, index) => {
        detailedMessage += `${index + 1}. ${suggestion}\n`;
    });
    
    if (typeof showToast === 'function') {
        // Show alert notification without auto-executing
        showToast(`🚨 ${alert.title}: Click "Apply Fix" to resolve`, 'critical');
    }
    
    console.log(`ENHANCED ALERT: ${alert.title}`);
    console.log(`Message: ${alert.message}`);
    console.log(`Immediate Action: ${alert.immediateAction}`);
    console.log(`Suggestions:`, alert.suggestions);
    
    // Update the alert panel if it exists
    updateAlertPanel(alert);
}

// Update alert panel in the UI with close button
function updateAlertPanel(alert) {
    // Create or update alert panel in the interface
    let alertPanel = document.getElementById('alertPanel');
    if (!alertPanel) {
        alertPanel = document.createElement('div');
        alertPanel.id = 'alertPanel';
        alertPanel.className = 'alert-panel';
        document.querySelector('.content').prepend(alertPanel);
    }
    
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item ${alert.severity}`;
    alertElement.innerHTML = `
        <div class="alert-header">
            <span class="alert-icon">🚨</span>
            <strong class="alert-title">${alert.title}</strong>
            <button class="alert-close-btn" onclick="this.parentElement.parentElement.remove()">
                <span class="close-icon">×</span>
            </button>
        </div>
        <div class="alert-message">${alert.message}</div>
        <div class="alert-immediate">
            <strong>Recommended Action:</strong> ${alert.immediateAction}
        </div>
        <div class="alert-suggestions">
            <strong>Additional Steps:</strong>
            <ul>
                ${alert.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
            </ul>
        </div>
        <div class="alert-actions">
            <button class="action-btn primary" onclick="handleAlertAction('${alert.type}', '${alert.level}', this)">
                Apply Fix
            </button>
            <button class="dismiss-btn" onclick="this.parentElement.parentElement.remove()">
                Dismiss
            </button>
        </div>
    `;
    
    alertPanel.appendChild(alertElement);
    
    // Auto-remove after 60 seconds (increased from 30)
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 60000);
}

// Handle alert actions when user clicks "Apply Fix"
function handleAlertAction(type, level, buttonElement) {
    // Disable the button to prevent multiple clicks
    if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.textContent = 'Applying...';
        buttonElement.style.opacity = '0.7';
    }
    
    // Execute the appropriate fix based on alert type and level
    if (type === 'temperature') {
        if (level === 'high') {
            setFanSpeed('high');
            showToast('Fix applied: Fan speed set to HIGH', 'success');
        } else if (level === 'low') {
            setFanSpeed('low');
            showToast('Fix applied: Fan speed set to LOW', 'success');
        }
    } else if (type === 'humidity') {
        if (level === 'high') {
            setFanSpeed('high');
            showToast('Fix applied: Fan speed set to HIGH', 'success');
        } else if (level === 'low') {
            setFanSpeed('low');
            showToast('Fix applied: Fan speed set to LOW', 'success');
        }
    }
    
    // Remove the alert after applying fix
    const alertElement = buttonElement.closest('.alert-item');
    if (alertElement) {
        setTimeout(() => {
            alertElement.remove();
        }, 2000);
    }
    
    // Log the action
    console.log(`User applied fix for ${type} ${level} alert`);
}

// Clear all alerts function
function clearAllAlerts() {
    const alertPanel = document.getElementById('alertPanel');
    if (alertPanel) {
        alertPanel.innerHTML = '';
        showToast('All alerts cleared', 'info');
    }
}

// Add clear all button to alert panel
function addClearAllButton() {
    const alertPanel = document.getElementById('alertPanel');
    if (alertPanel && !alertPanel.querySelector('.clear-all-btn')) {
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'clear-all-btn';
        clearAllBtn.innerHTML = 'Clear All Alerts';
        clearAllBtn.onclick = clearAllAlerts;
        alertPanel.insertBefore(clearAllBtn, alertPanel.firstChild);
    }
}

// Check if current environment is within species thresholds and send alerts
function checkEnvironmentStatus(species) {
    const thresholds = speciesThresholds[species] || speciesThresholds['Goat'];
    const now = Date.now();
    
    let activeAlerts = [];
    
    // Check temperature
    if (environmentState.temperature > thresholds.maxTemp) {
        if (!environmentState.lastAlert || now - environmentState.lastAlert > 30000) {
            activeAlerts.push(createTemperatureAlert(species, 'high', thresholds));
            environmentState.lastAlert = now;
        }
    } else if (environmentState.temperature < thresholds.minTemp) {
        if (!environmentState.lastAlert || now - environmentState.lastAlert > 30000) {
            activeAlerts.push(createTemperatureAlert(species, 'low', thresholds));
            environmentState.lastAlert = now;
        }
    }
    
    // Check humidity
    if (environmentState.humidity > thresholds.maxHumidity) {
        if (!environmentState.lastAlert || now - environmentState.lastAlert > 30000) {
            activeAlerts.push(createHumidityAlert(species, 'high', thresholds));
            environmentState.lastAlert = now;
        }
    } else if (environmentState.humidity < thresholds.minHumidity) {
        if (!environmentState.lastAlert || now - environmentState.lastAlert > 30000) {
            activeAlerts.push(createHumidityAlert(species, 'low', thresholds));
            environmentState.lastAlert = now;
        }
    }
    
    // Show alerts
    activeAlerts.forEach(alert => {
        showEnhancedAlert(alert);
    });
    
    // Update status indicators
    updateStatusIndicator('temperature', environmentState.temperature, thresholds.minTemp, thresholds.maxTemp, thresholds.optimalTemp);
    updateStatusIndicator('humidity', environmentState.humidity, thresholds.minHumidity, thresholds.maxHumidity, thresholds.optimalHumidity);
}

// ========== CAMERA CONTROLS ==========

// Move camera in specified direction - explicitly attach to window for global access
window.moveCamera = function moveCamera(direction) {
    const cctvFeed = document.getElementById('cctvFeed');
    const positionIndicator = document.getElementById('cameraPosition');
    const cctvVideo = document.getElementById('cctvVideo');
    
    // Add slide animation
    cctvFeed.classList.add('sliding');
    setTimeout(() => {
        cctvFeed.classList.remove('sliding');
    }, 300);

    // Update pan position based on direction
    switch(direction) {
        case 'up':
            panY = Math.min(maxPan, panY + panStep);
            break;
        case 'down':
            panY = Math.max(-maxPan, panY - panStep);
            break;
        case 'left':
            panX = Math.min(maxPan, panX + panStep);
            break;
        case 'right':
            panX = Math.max(-maxPan, panX - panStep);
            break;
    }

    // Update position indicator
    if (positionIndicator) {
        let xDir = panX > 0 ? '←' : panX < 0 ? '→' : '';
        let yDir = panY > 0 ? '↑' : panY < 0 ? '↓' : '';
        let displayText = '';
        if (xDir || yDir) {
            displayText = `${yDir}${xDir}`;
        } else {
            displayText = 'Center';
        }
        positionIndicator.textContent = displayText;
    }

    // Slide the video based on pan position
    if (cctvVideo && !cctvVideo.classList.contains('hidden')) {
        cctvVideo.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
    }

    // Show toast notification
    if (typeof showToast === 'function') {
        showToast(`Camera panned: ${direction.toUpperCase()}`);
    }
}

// Recording state
let isRecording = false;

// Toggle recording - explicitly attach to window for global access
window.toggleRecording = function toggleRecording() {
    const recordBtn = document.getElementById('recordBtn');
    const recordingBanner = document.getElementById('recordingBanner');
    const recordingText = recordingBanner ? recordingBanner.querySelector('.recording-text') : null;
    const recordingDot = recordingBanner ? recordingBanner.querySelector('.recording-dot') : null;
    
    isRecording = !isRecording;
    
    if (isRecording) {
        recordBtn.classList.add('recording');
        recordBtn.querySelector('.action-label').textContent = 'Stop';
        // Show recording banner
        if (recordingBanner) {
            recordingBanner.style.display = 'flex';
            if (recordingText) {
                recordingText.textContent = 'RECORDING';
            }
            if (recordingDot) {
                recordingDot.style.display = 'inline-block';
            }
        }
        if (typeof showToast === 'function') {
            showToast('Recording started');
        }
    } else {
        recordBtn.classList.remove('recording');
        recordBtn.querySelector('.action-label').textContent = 'Record';
        // Show "Recording saved" in the same banner location
        if (recordingBanner && recordingText) {
            recordingBanner.style.display = 'flex';
            recordingText.textContent = 'Recording saved';
            // Hide the dot for saved message
            if (recordingDot) {
                recordingDot.classList.add('hidden');
            }
            // Hide after 3 seconds
            setTimeout(() => {
                if (recordingBanner) {
                    recordingBanner.classList.add('hidden');
                    // Reset text and dot for next recording
                    if (recordingText) {
                        recordingText.textContent = 'RECORDING';
                    }
                    if (recordingDot) {
                        recordingDot.style.display = 'inline-block';
                    }
                }
            }, 3000);
        }
    }
};

// Take screenshot - explicitly attach to window for global access
window.takeScreenshot = function takeScreenshot() {
    // Show screenshot notification
    const screenshotNotification = document.getElementById('screenshotNotification');
    if (screenshotNotification) {
        screenshotNotification.style.display = 'flex';
        // Hide after 3 seconds
        setTimeout(() => {
            screenshotNotification.classList.add('hidden');
        }, 3000);
    }
    
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast('Screenshot captured');
    }
};

// Center camera - reset pan position to center - explicitly attach to window for global access
window.centerCamera = function centerCamera() {
    const cctvFeed = document.getElementById('cctvFeed');
    const positionIndicator = document.getElementById('cameraPosition');
    const cctvVideo = document.getElementById('cctvVideo');
    
    // Reset pan position
    panX = 0;
    panY = 0;
    
    // Add slide animation
    cctvFeed.classList.add('sliding');
    setTimeout(() => {
        cctvFeed.classList.remove('sliding');
    }, 300);
    
    // Update position indicator
    if (positionIndicator) {
        positionIndicator.textContent = 'Center';
    }
    
    // Reset video position to center
    if (cctvVideo && !cctvVideo.classList.contains('hidden')) {
        cctvVideo.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
    }
    
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast('Camera centered');
    }
};

// ========== ENVIRONMENT CONTROL FUNCTIONS ==========

// Update environment display
function updateEnvironmentDisplay() {
    // Update cage condition values
    const currentTempElement = document.querySelector('[data-metric="temperature"] .metric-value');
    const currentHumidityElement = document.querySelector('[data-metric="humidity"] .metric-value');
    const airQualityElement = document.querySelector('[data-metric="air-quality"] .metric-value');
    
    if (currentTempElement) {
        currentTempElement.textContent = `${Math.round(environmentState.temperature)}°C`;
    }
    
    if (currentHumidityElement) {
        currentHumidityElement.textContent = `${Math.round(environmentState.humidity)}%`;
    }
    
    if (airQualityElement) {
        airQualityElement.textContent = environmentState.airQuality;
    }
    
    // Update controller values
    const currentLightLevelElement = document.getElementById('currentLightLevel');
    const fanSpeedElement = document.getElementById('fanSpeed');
    const lightSlider = document.getElementById('lightSlider');
    
    if (currentLightLevelElement) {
        currentLightLevelElement.textContent = `${environmentState.lightLevel}%`;
    }
    
    if (fanSpeedElement) {
        fanSpeedElement.textContent = environmentState.fanSpeed.charAt(0).toUpperCase() + environmentState.fanSpeed.slice(1);
    }
    
    if (lightSlider) {
        lightSlider.value = environmentState.lightLevel;
    }
    
    // Update cage lock status
    updateCageLockDisplay();
    
    // Update button active states
    updateFanButtons();
    updateLightingPresets();
    
    // Check environment status for current species (only for individual species)
    if (cageCurrentSpecies !== 'All') {
        checkEnvironmentStatus(cageCurrentSpecies);
    }
}

// Update display with species-specific ranges
function updateSpeciesRanges(species) {
    const thresholds = speciesThresholds[species] || speciesThresholds['Goat'];
    
    // Update cage condition cards with ranges
    const tempCard = document.querySelector('[data-metric="temperature"]');
    const humidityCard = document.querySelector('[data-metric="humidity"]');
    
    if (tempCard) {
        const rangeElement = tempCard.querySelector('.metric-range');
        if (!rangeElement) {
            const metricValue = tempCard.querySelector('.metric-value');
            const rangeEl = document.createElement('div');
            rangeEl.className = 'metric-range';
            rangeEl.textContent = thresholds.tempRange;
            metricValue.parentNode.appendChild(rangeEl);
        } else {
            rangeElement.textContent = thresholds.tempRange;
        }
    }
    
    if (humidityCard) {
        const rangeElement = humidityCard.querySelector('.metric-range');
        if (!rangeElement) {
            const metricValue = humidityCard.querySelector('.metric-value');
            const rangeEl = document.createElement('div');
            rangeEl.className = 'metric-range';
            rangeEl.textContent = thresholds.humidityRange;
            metricValue.parentNode.appendChild(rangeEl);
        } else {
            rangeElement.textContent = thresholds.humidityRange;
        }
    }
}

// Update status indicator based on current value
function updateStatusIndicator(metric, currentValue, min, max, optimal) {
    const element = document.querySelector(`[data-metric="${metric}"] .metric-status`);
    if (!element) return;
    
    const tolerance = (max - min) * 0.1;
    
    if (Math.abs(currentValue - optimal) <= tolerance) {
        element.textContent = 'Optimal';
        element.className = 'metric-status optimal';
    } else if (currentValue >= min && currentValue <= max) {
        element.textContent = 'Acceptable';
        element.className = 'metric-status acceptable';
    } else {
        element.textContent = 'Critical';
        element.className = 'metric-status critical';
        
        // Add glow effect for critical status
        const card = element.closest('.condition-card');
        if (card) {
            card.classList.add('glow');
            setTimeout(() => card.classList.remove('glow'), 2000);
        }
    }
}

// Update cage lock display
function updateCageLockDisplay() {
    const lockStatus = document.getElementById('lockStatus');
    const lockToggle = document.getElementById('lockToggle');
    
    if (!lockStatus || !lockToggle) return;
    
    const statusIndicator = lockStatus.querySelector('.status-indicator');
    const statusText = lockStatus.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        if (environmentState.cageLocked) {
            statusIndicator.className = 'status-indicator locked';
            statusText.textContent = 'Locked';
            lockToggle.textContent = 'Unlock Cage';
            lockToggle.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        } else {
            statusIndicator.className = 'status-indicator unlocked';
            statusText.textContent = 'Unlocked';
            lockToggle.textContent = 'Lock Cage';
            lockToggle.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        }
    }
}

// Update fan buttons active state (for initial load)
function updateFanButtons() {
    const fanButtons = document.querySelectorAll('.fan-btn');
    fanButtons.forEach(btn => {
        btn.classList.remove('active');
        
        // Map button text to speed values
        const buttonText = btn.textContent.toLowerCase();
        let buttonSpeed = '';
        
        if (buttonText.includes('low')) {
            buttonSpeed = 'low';
        } else if (buttonText.includes('med')) {
            buttonSpeed = 'medium';
        } else if (buttonText.includes('high')) {
            buttonSpeed = 'high';
        }
        
        if (buttonSpeed === environmentState.fanSpeed) {
            btn.classList.add('active');
        }
    });
}

// Toggle cage lock
function toggleCageLock() {
    environmentState.cageLocked = !environmentState.cageLocked;
    updateCageLockDisplay();
    
    if (typeof showToast === 'function') {
        const message = environmentState.cageLocked ? 'Cage locked' : 'Cage unlocked';
        showToast(message);
    }
    
    console.log(`Cage lock ${environmentState.cageLocked ? 'engaged' : 'released'}`);
}

// Set fan speed and update active state
function setFanSpeed(speed) {
    // Remove active class from all fan buttons
    const fanButtons = document.querySelectorAll('.fan-btn');
    fanButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    const clickedButton = document.querySelector(`[onclick="setFanSpeed('${speed}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    } else {
        // Fallback: try to find by speed mapping
        const buttons = document.querySelectorAll('.fan-btn');
        buttons.forEach(btn => {
            const buttonText = btn.textContent.toLowerCase();
            let buttonSpeed = '';
            
            if (buttonText.includes('low')) {
                buttonSpeed = 'low';
            } else if (buttonText.includes('med')) {
                buttonSpeed = 'medium';
            } else if (buttonText.includes('high')) {
                buttonSpeed = 'high';
            }
            
            if (buttonSpeed === speed) {
                btn.classList.add('active');
            }
        });
    }
    
    // Update fan speed state
    environmentState.fanSpeed = speed;
    updateEnvironmentDisplay();
    
    if (typeof showToast === 'function') {
        showToast(`Fan speed set to ${speed}`);
    }
    
    console.log(`Fan speed set to: ${speed}`);
}

// Set lighting preset and update active state
function setLightingPreset(preset) {
    // Remove active class from all preset buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    const clickedButton = document.querySelector(`[onclick="setLightingPreset('${preset}')"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
    
    // Update lighting state
    switch(preset) {
        case 'night':
            environmentState.lightLevel = 10;
            break;
        case 'day':
            environmentState.lightLevel = 75;
            break;
        case 'uvb':
            environmentState.lightLevel = 50;
            break;
    }
    
    updateEnvironmentDisplay();
    
    if (typeof showToast === 'function') {
        showToast(`Lighting set to ${preset} mode`);
    }
    
    console.log(`Lighting preset: ${preset}, level: ${environmentState.lightLevel}%`);
}

// Adjust light level manually and update preset buttons
function adjustLightLevel(level) {
    environmentState.lightLevel = level;
    
    // Update preset button states when manually adjusting
    updateLightingPresets();
    updateEnvironmentDisplay();
    
    if (typeof showToast === 'function') {
        showToast(`Light level set to ${level}%`);
    }
    
    console.log(`Light level adjusted to: ${level}%`);
}

// Update lighting preset buttons active state (for initial load)
function updateLightingPresets() {
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.classList.remove('active');
        
        // Determine which preset should be active based on current light level
        let activePreset = '';
        if (environmentState.lightLevel <= 15) {
            activePreset = 'night';
        } else if (environmentState.lightLevel >= 70) {
            activePreset = 'day';
        } else {
            activePreset = 'uvb';
        }
        
        // Check if this button matches the active preset
        const buttonPreset = btn.getAttribute('onclick');
        if (buttonPreset && buttonPreset.includes(activePreset)) {
            btn.classList.add('active');
        }
    });
}

// Handle light slider change
function handleLightSliderChange() {
    const slider = document.getElementById('lightSlider');
    if (slider) {
        const level = parseInt(slider.value);
        adjustLightLevel(level);
    }
}

// Toggle auto ventilation
function toggleAutoVentilation() {
    environmentState.autoVentilation = !environmentState.autoVentilation;
    
    if (typeof showToast === 'function') {
        const message = environmentState.autoVentilation ? 'Auto ventilation enabled' : 'Auto ventilation disabled';
        showToast(message);
    }
    
    console.log(`Auto ventilation: ${environmentState.autoVentilation}`);
}

// Simulate environment changes (for demo purposes)
function simulateEnvironmentChanges() {
    if (cageCurrentSpecies === 'All') return; // Don't simulate for All Species view
    
    const thresholds = speciesThresholds[cageCurrentSpecies] || speciesThresholds['Goat'];
    
    // For problematic species, make the environment fluctuate around the problematic values
    if (cageCurrentSpecies === 'Snail' || cageCurrentSpecies === 'Fox') {
        const problematicEnv = problematicEnvironments[cageCurrentSpecies];
        const tempChange = (Math.random() - 0.5) * 1.0;
        const humidityChange = (Math.random() - 0.5) * 2.0;
        
        environmentState.temperature = Math.max(
            thresholds.minTemp - 5, 
            Math.min(thresholds.maxTemp + 5, problematicEnv.temperature + tempChange)
        );
        environmentState.humidity = Math.max(
            thresholds.minHumidity - 10, 
            Math.min(thresholds.maxHumidity + 10, problematicEnv.humidity + humidityChange)
        );
    } else {
        // Normal fluctuations for other species
        const tempChange = (Math.random() - 0.5) * 0.8;
        const humidityChange = (Math.random() - 0.5) * 1.5;
        
        environmentState.temperature = Math.max(
            thresholds.minTemp - 2, 
            Math.min(thresholds.maxTemp + 2, environmentState.temperature + tempChange)
        );
        environmentState.humidity = Math.max(
            thresholds.minHumidity - 5, 
            Math.min(thresholds.maxHumidity + 5, environmentState.humidity + humidityChange)
        );
    }
    
    // Update air quality based on conditions
    if (environmentState.temperature > thresholds.maxTemp || environmentState.humidity > thresholds.maxHumidity) {
        environmentState.airQuality = 'Poor';
    } else if (environmentState.temperature < thresholds.minTemp || environmentState.humidity < thresholds.minHumidity) {
        environmentState.airQuality = 'Fair';
    } else {
        environmentState.airQuality = 'Good';
    }
    
    updateEnvironmentDisplay();
}

// Switch main view when clicking on any card
function switchToMainView(species) {
    // Remove active class from all cards
    const allCards = document.querySelectorAll('.side-cctv-card, .bottom-cctv-card');
    allCards.forEach(card => {
        card.classList.remove('active');
    });
    
    // Create and show main view for selected species
    createAndShowMainView(species);
    
    // Update bottom card if it exists
    const bottomCards = document.querySelectorAll('.bottom-cctv-card');
    bottomCards.forEach(card => {
        card.classList.remove('active');
        const header = card.querySelector('h4');
        if (header && header.textContent.includes(species)) {
            card.classList.add('active');
        }
    });
    
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast(`${speciesDisplayNames[species]} now in main view`);
    }
}

// Create and show main view dynamically
function createAndShowMainView(species) {
    const mainViewContainer = document.querySelector('.main-cctv-section');
    if (!mainViewContainer) return;
    
    // Create new main view
    const mainCard = document.createElement('div');
    mainCard.className = 'main-cctv-card active';
    mainCard.id = `main${species}View`;
    
    mainCard.innerHTML = `
        <div class="cctv-feed-header">
            <span class="animal-icon">${getAnimalIcon(species)}</span>
            <h3>${species} Enclosure</h3>
            <span class="main-label">MAIN VIEW</span>
        </div>
        <div class="cctv-feed-wrapper main-video-wrapper">
            <video class="cctv-video main-video" autoplay loop muted playsinline>
                <source src="${speciesVideos[species]}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="cctv-overlay">
                <span class="rec-dot"></span>
                <span>LIVE</span>
            </div>
        </div>
        <button class="view-details-btn" onclick="switchCCTVFeed('${species}')">
            <span class="btn-icon">🔍</span>
            View Cage Details
        </button>
    `;
    
    // Remove existing main view and add new one
    const existingMain = mainViewContainer.querySelector('.main-cctv-card');
    if (existingMain) {
        mainViewContainer.removeChild(existingMain);
    }
    mainViewContainer.appendChild(mainCard);
    
    // Load and play the video
    const video = mainCard.querySelector('.main-video');
    if (video) {
        video.load();
        video.play().catch(err => {
            console.error('Error playing video:', err);
        });
    }
}

// Update main view with new species
function updateMainView(species) {
    const mainView = document.querySelector('.main-cctv-card.active');
    if (!mainView) return;
    
    // Update header
    const icon = mainView.querySelector('.animal-icon');
    const title = mainView.querySelector('h3');
    
    if (icon) icon.textContent = getAnimalIcon(species);
    if (title) title.textContent = `${species} Enclosure`;
    
    // Update video
    const video = mainView.querySelector('.cctv-video');
    if (video && speciesVideos[species]) {
        video.src = speciesVideos[species];
        video.load();
    }
}

// Helper function to get animal icon
function getAnimalIcon(species) {
    const iconMap = {
        'Goat': '🐐',
        'Sugarglider': '🐿️',
        'Alligator': '🐊',
        'Snail': '🐌',
        'Porcupine': '🦔',
        'Fox': '🦊'
    };
    return iconMap[species] || '🐾';
}

// Initialize main view
function initializeMultiView() {
    // Create main views for all species
    const mainViewContainer = document.querySelector('.main-cctv-view');
    if (!mainViewContainer) return;

    // Ensure all PiP cards have active state on Goat initially
    const goatPip = document.querySelector('[onclick="switchToMainView(\'Goat\')"]');
    if (goatPip) {
        goatPip.classList.add('active');
    }
    
    const speciesList = ['Goat', 'Sugarglider', 'Alligator', 'Snail', 'Porcupine', 'Fox'];
    
    speciesList.forEach((species, index) => {
        if (species === 'Goat') return; // Goat already exists
        
        const mainCard = document.createElement('div');
        mainCard.className = 'main-cctv-card';
        mainCard.id = `main${species}View`;
        mainCard.onclick = () => switchToMainView(species);
        mainCard.style.display = 'none';
        
        mainCard.innerHTML = `
            <div class="cctv-feed-header">
                <span class="animal-icon">${getAnimalIcon(species)}</span>
                <h3>${species} Enclosure</h3>
                <span class="main-label">VIEWING</span>
            </div>
            <div class="cctv-feed-wrapper">
                <video class="cctv-video" autoplay loop muted playsinline>
                    <source src="${speciesVideos[species]}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="cctv-overlay">
                    <span class="rec-dot"></span>
                    <span>LIVE</span>
                </div>
            </div>
        `;
        
        mainViewContainer.appendChild(mainCard);
    });
}

// ========== INITIALIZATION ==========

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const positionIndicator = document.getElementById('cameraPosition');
    if (positionIndicator) {
        positionIndicator.textContent = 'Center';
    }
    
    // Initialize species name in header
    const speciesNameElement = document.getElementById('currentSpeciesName');
    if (speciesNameElement) {
        speciesNameElement.textContent = 'All Species';
    }

    // Show All Species view by default
    document.getElementById('allSpeciesView').classList.remove('hidden');
    document.getElementById('singleSpeciesView').classList.add('hidden');
    
    // Hide placeholder if video loads successfully
    const cctvVideo = document.getElementById('cctvVideo');
    const cctvPlaceholder = document.getElementById('cctvPlaceholder');
    
    if (cctvVideo) {
        // Set up video load handler
        const handleVideoLoad = () => {
            if (cctvPlaceholder) {
                cctvPlaceholder.classList.add('hidden');
            }
            // Initialize video position
            cctvVideo.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
        };
        
        cctvVideo.addEventListener('loadeddata', handleVideoLoad);
        cctvVideo.addEventListener('error', () => {
            if (cctvPlaceholder) {
                cctvPlaceholder.classList.remove('hidden');
            }
            console.error('Error loading video:', cctvVideo.src);
        });
        
        // If video is already loaded
        if (cctvVideo.readyState >= 2) {
            handleVideoLoad();
        }
    }
    
    // Set up event listeners
    const lightSlider = document.getElementById('lightSlider');
    if (lightSlider) {
        lightSlider.addEventListener('input', handleLightSliderChange);
    }
    
    // Add alert indicators to Snail and Fox tabs
    const snailTab = document.querySelector('[data-species="Snail"]');
    const foxTab = document.querySelector('[data-species="Fox"]');
    
    if (snailTab && !snailTab.querySelector('.alert-indicator')) {
        const snailAlert = document.createElement('span');
        snailAlert.className = 'alert-indicator';
        snailAlert.innerHTML = '⚠️';
        snailAlert.style.marginLeft = '8px';
        snailAlert.style.animation = 'pulse 1s infinite';
        snailTab.appendChild(snailAlert);
    }
    
    if (foxTab && !foxTab.querySelector('.alert-indicator')) {
        const foxAlert = document.createElement('span');
        foxAlert.className = 'alert-indicator';
        foxAlert.innerHTML = '⚠️';
        foxAlert.style.marginLeft = '8px';
        foxAlert.style.animation = 'pulse 1s infinite';
        foxTab.appendChild(foxAlert);
    }
    
    // Initialize button active states
    updateFanButtons();
    updateLightingPresets();
    
    // Simulate environment changes every 8 seconds (for demo)
    setInterval(simulateEnvironmentChanges, 8000);
    
    console.log('Cage Monitor initialized with All Species view');
    
    // Add clear all button to alert panel
    setTimeout(() => {
        addClearAllButton();
    }, 2000);
    
    // Initialize multi-view if all species view exists
    if (document.getElementById('allSpeciesView')) {
        initializeMultiView();
    }
});