let trackingMapPreset = 'all';

// Tracking page functionality
function initializeTracking() {
    try {
        if (typeof animalDatabase === 'undefined') {
            console.error('animalDatabase is not defined');
            return;
        }
        if (typeof trackingSpeciesMeta === 'undefined') {
            console.error('trackingSpeciesMeta is not defined');
            return;
        }

        const allAnimals = Object.values(animalDatabase).flat();
        allAnimals.forEach(animal => {
            if (animal.tracking?.enabled &&
                Number.isFinite(animal.tracking.lat) &&
                Number.isFinite(animal.tracking.lng)) {
                ensureTrackingDefaults(animal);
                recordMovementHistory(animal);
            }
        });

        renderTrackingToolbar();
        renderSpeciesZoomDropdown();
        initializeMap();
        renderTracking();
        startTrackingSimulation();
    } catch (error) {
        console.error('Error initializing tracking:', error);
    }
}

function ensureTrackingDefaults(animal) {
    if (!animal.tracking) return;
    if (typeof animal.tracking.battery !== 'number') {
        animal.tracking.battery = 100;
    }
    if (!animal.tracking.lastCharge) {
        animal.tracking.lastCharge = 'today';
    }
}

function renderTrackingToolbar() {
    const toolbar = document.getElementById('trackingToolbar');
    if (!toolbar) return;
    if (typeof animalDatabase === 'undefined' || typeof trackingSpeciesMeta === 'undefined') return;
    const allAnimals = Object.values(animalDatabase).flat();

    const filters = Object.entries(trackingSpeciesMeta).map(([species, meta]) => {
        const count = allAnimals.filter(a => a.tracking.enabled && a.species === species).length;
        const active = trackingFilters.has(species);
        return `
            <button class="tracking-filter ${active ? 'active' : ''}" onclick="toggleTrackingFilter('${species}')">
                <span>${meta.icon}</span>
                <span>${meta.label}</span>
                <span class="filter-count">${count}</span>
            </button>
        `;
    }).join('');

    // Add button after Alligators (last species)
    const addButton = `
        <button class="tracking-add-btn" onclick="openAnimalAddModal()" title="Add animals to track">
            <span class="add-icon">+</span>
        </button>
    `;

    toolbar.innerHTML = `
        <div class="tracking-filters">${filters}${addButton}</div>
        <div class="tracking-controls-group">
            <div class="tracking-view-toggle">
                <button class="tracking-view-btn ${trailsEnabled ? 'active' : ''}" onclick="toggleTrails(true)">🐾 Trails On</button>
                <button class="tracking-view-btn ${!trailsEnabled ? 'active' : ''}" onclick="toggleTrails(false)">🐾 Trails Off</button>
            </div>
        </div>
    `;
}

function renderSpeciesZoomDropdown() {
    const select = document.getElementById('speciesZoomSelect');
    if (!select) return;
    const allAnimals = Object.values(animalDatabase).flat();

    select.innerHTML = '<option value="all">🌍 Whole Site</option>';

    Object.entries(trackingClusters).forEach(([species, cluster]) => {
        const meta = trackingSpeciesMeta[species] || {};
        const count = allAnimals.filter(a => a.tracking.enabled && a.species === species).length;
        const alertCount = allAnimals.filter(a =>
            a.tracking.enabled &&
            a.species === species &&
            (a.alerts.length > 0 || a.health !== 'good')
        ).length;

        const alertText = alertCount > 0 ? ` ⚠️ ${alertCount}` : '';
        const optionText = `${meta.icon || '📍'} ${meta.label || species} (${count} tracked${alertText})`;

        const option = document.createElement('option');
        option.value = species;
        option.textContent = optionText;
        select.appendChild(option);
    });

    select.value = trackingMapPreset;
}

function handleSpeciesZoom(value) {
    trackingMapPreset = value;
    focusMapPreset(value);
}

function initializeMap() {
    if (mapInstance) return;
    const mapElement = document.getElementById('trackingMap');
    if (!mapElement) return;

    const farmCenter = [3.1125, 101.7915];
    mapInstance = L.map('trackingMap', {
        zoomControl: false,
        attributionControl: false,
        minZoom: 16,
        maxZoom: 19
    }).setView(farmCenter, 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(mapInstance);

    const bounds = L.latLngBounds([3.108, 101.786], [3.118, 101.797]);
    mapInstance.setMaxBounds(bounds.pad(0.02));

    markerLayer = L.layerGroup().addTo(mapInstance);
    trailLayer = L.layerGroup().addTo(mapInstance);
    markerMap.clear();
    trailMap.clear();
    setTimeout(() => mapInstance.invalidateSize(), 200);
}

function renderTrackingStats(trackedAnimals) {
    const stats = document.getElementById('trackingStats');
    if (!stats) return;

    if (!trackedAnimals.length) {
        stats.innerHTML = `<div class="tracking-empty">Select a species to visualize activity on the map.</div>`;
        return;
    }

    const moving = trackedAnimals.filter(a => a.tracking.status === 'moving').length;
    const resting = trackedAnimals.length - moving;
    const alerts = trackedAnimals.filter(a => a.alerts.length > 0 || a.health !== 'good').length;
    const lowBattery = trackedAnimals.filter(a => (a.tracking.battery ?? 100) < 20).length;
    const avgBattery = trackedAnimals.length > 0
        ? trackedAnimals.reduce((sum, a) => sum + (a.tracking.battery ?? 100), 0) / trackedAnimals.length
        : 0;
    const avgBatteryDisplay = avgBattery.toFixed(2);

    stats.innerHTML = `
        <div class="tracking-stat-card">
            <div class="stat-label">Tracked Animals</div>
            <div class="stat-value">${trackedAnimals.length}</div>
            <div class="stat-meta">${moving} moving • ${resting} resting</div>
        </div>
        <div class="tracking-stat-card">
            <div class="stat-label">Battery Status</div>
            <div class="stat-value">${avgBatteryDisplay}%</div>
            <div class="stat-meta">${lowBattery > 0 ? `⚠️ ${lowBattery} need charging` : 'All devices charged'}</div>
        </div>
        <div class="tracking-stat-card">
            <div class="stat-label">Active Alerts</div>
            <div class="stat-value">${alerts}</div>
            <div class="stat-meta">${alerts ? 'Immediate attention required' : 'All clear'}</div>
        </div>
    `;
}

function renderTrackingLegend(allAnimals) {
    const legendEl = document.getElementById('trackingLegend');
    if (!legendEl) return;
    const legendItems = Object.entries(trackingSpeciesMeta).map(([species, meta]) => {
        const count = allAnimals.filter(a => a.tracking.enabled && a.species === species).length;
        const alerts = allAnimals.filter(a =>
            a.tracking.enabled &&
            a.species === species &&
            (a.alerts.length > 0 || a.health !== 'good')
        ).length;
        if (!count) return '';
        return `
            <div class="legend-item ${alerts ? 'alert' : ''}">
                <span class="legend-dot" style="background:${meta.color};"></span>
                ${meta.icon} ${meta.label}
                <span style="font-weight:800; margin-left:4px;">${count}</span>
                ${alerts ? `<span class="legend-alert-badge">⚠️ ${alerts}</span>` : ''}
            </div>
        `;
    }).join('');

    legendEl.innerHTML = legendItems || '<div class="tracking-empty" style="margin:0;">No live devices reporting yet.</div>';
}

function buildAnimalIcon(animal) {
    const meta = trackingSpeciesMeta[animal.species] || {};
    const emoji = meta.icon || '🐾';
    const color = meta.color || '#6366f1';
    const hasAlert = animal.alerts.length > 0 || animal.health !== 'good';
    const battery = animal.tracking.battery ?? 100;
    const lowBattery = battery < 20;
    const batteryIndicator = lowBattery ? '<span class="pin-battery-low">⚠️</span>' : '';
    const html = `
        <div class="map-pin ${animal.tracking.status} ${hasAlert ? 'has-alert' : ''}" style="--pin-color:${color}" data-label="${animal.name}">
            <div class="map-pin-inner">${emoji}</div>
            ${hasAlert ? '<span class="pin-alert-dot"></span>' : ''}
            ${batteryIndicator}
        </div>
    `;
    return L.divIcon({
        className: 'map-pin-wrapper',
        html,
        iconSize: [48, 48],
        iconAnchor: [24, 24]
    });
}

function toggleTrackingFilter(species) {
    if (trackingFilters.has(species) && trackingFilters.size === 1) {
        showToast('At least one species must stay visible.');
        return;
    }

    if (trackingFilters.has(species)) {
        trackingFilters.delete(species);
    } else {
        trackingFilters.add(species);
    }

    mapNeedsFit = true;
    renderTracking();
    renderTrackingToolbar();
}

function setTrackingView(mode) {
    trackingViewMode = mode;
    renderTracking();
    renderTrackingToolbar();
}

function toggleTrails(forceState) {
    if (typeof forceState === 'boolean') {
        if (trailsEnabled === forceState) return;
        trailsEnabled = forceState;
    } else {
        trailsEnabled = !trailsEnabled;
    }

    renderTrackingToolbar();
    renderTracking();
    showToast(trailsEnabled ? 'Movement trails enabled' : 'Movement trails disabled');
}

function renderMovementTrails(trackedAnimals) {
    if (!trailLayer || !mapInstance) return;

    const now = Date.now();
    const activeTrailIds = new Set();

    trackedAnimals.forEach(animal => {
        if (!movementHistory.has(animal.id)) return;

        const history = movementHistory.get(animal.id);
        if (history.length < 2) return;

        const visibleHistory = history.filter(point =>
            (now - point.timestamp) <= trailTimeRange &&
            Number.isFinite(point.lat) &&
            Number.isFinite(point.lng)
        );

        if (visibleHistory.length < 2) return;

        // Clean and validate coordinates - remove duplicates and invalid points
        const validPoints = [];
        const seenPoints = new Set();
        const minDistance = 0.00001; // Minimum distance between points to prevent duplicates

        visibleHistory.forEach(point => {
            const key = `${point.lat.toFixed(6)},${point.lng.toFixed(6)}`;
            
            // Check if this point is valid and not a duplicate
            if (
                Number.isFinite(point.lat) &&
                Number.isFinite(point.lng) &&
                Math.abs(point.lat) <= 90 &&
                Math.abs(point.lng) <= 180
            ) {
                // Check minimum distance from previous point
                if (validPoints.length === 0) {
                    validPoints.push(point);
                    seenPoints.add(key);
                } else {
                    const lastPoint = validPoints[validPoints.length - 1];
                    const distance = Math.sqrt(
                        Math.pow(point.lat - lastPoint.lat, 2) +
                        Math.pow(point.lng - lastPoint.lng, 2)
                    );
                    
                    if (distance >= minDistance && !seenPoints.has(key)) {
                        validPoints.push(point);
                        seenPoints.add(key);
                    }
                }
            }
        });

        if (validPoints.length < 2) return;

        const latLngs = validPoints.map(point => [point.lat, point.lng]);
        activeTrailIds.add(animal.id);

        if (trailMap.has(animal.id)) {
            const existingTrail = trailMap.get(animal.id);
            existingTrail.setLatLngs(latLngs);
            existingTrail.setStyle({
                color: trackingSpeciesMeta[animal.species]?.color || '#6366f1',
                opacity: 0.65,
                weight: 3,
                smoothFactor: 2
            });
        } else {
            const trail = L.polyline(latLngs, {
                color: trackingSpeciesMeta[animal.species]?.color || '#6366f1',
                weight: 3,
                opacity: 0.65,
                smoothFactor: 2,
                lineCap: 'round',
                lineJoin: 'round'
            }).addTo(trailLayer);

            trail.bindTooltip(`${animal.name}'s movement path`, {
                permanent: false,
                direction: 'top',
                className: 'trail-tooltip'
            });

            trailMap.set(animal.id, trail);
        }
    });

    trailMap.forEach((trail, id) => {
        if (!activeTrailIds.has(id)) {
            trailLayer.removeLayer(trail);
            trailMap.delete(id);
        }
    });
}

function focusMapPreset(preset) {
    trackingMapPreset = preset;
    const select = document.getElementById('speciesZoomSelect');
    if (select) select.value = preset;
    initializeMap();
    if (!mapInstance) return;

    if (preset === 'all') {
        const latLngs = [];
        Object.values(animalDatabase).flat().forEach(animal => {
            if (animal.tracking?.enabled &&
                Number.isFinite(animal.tracking.lat) &&
                Number.isFinite(animal.tracking.lng)) {
                latLngs.push([animal.tracking.lat, animal.tracking.lng]);
            }
        });

        if (!latLngs.length) {
            showToast('No live trackers available yet.');
            return;
        }

        mapInstance.flyToBounds(L.latLngBounds(latLngs).pad(0.2), { duration: 0.6, maxZoom: 18 });
        mapNeedsFit = false;
        return;
    }

    const presetCluster = trackingClusters[preset];
    if (!presetCluster) return;
    const radius = presetCluster.radius ?? 0.0004;
    const bounds = L.latLngBounds(
        [presetCluster.lat - radius, presetCluster.lng - radius],
        [presetCluster.lat + radius, presetCluster.lng + radius]
    );
    mapInstance.flyToBounds(bounds, { duration: 0.6, maxZoom: 18 });
    mapNeedsFit = false;
}

function recordMovementHistory(animal) {
    if (!animal.tracking?.enabled ||
        !Number.isFinite(animal.tracking.lat) ||
        !Number.isFinite(animal.tracking.lng)) {
        return;
    }

    // Validate coordinates are within valid ranges
    if (
        Math.abs(animal.tracking.lat) > 90 ||
        Math.abs(animal.tracking.lng) > 180 ||
        !Number.isFinite(animal.tracking.lat) ||
        !Number.isFinite(animal.tracking.lng)
    ) {
        return;
    }

    if (!movementHistory.has(animal.id)) {
        movementHistory.set(animal.id, []);
    }

    const history = movementHistory.get(animal.id);
    const now = Date.now();

    // Only add point if it's different from the last point (avoid duplicates)
    const minDistance = 0.00001;
    if (history.length > 0) {
        const lastPoint = history[history.length - 1];
        const distance = Math.sqrt(
            Math.pow(animal.tracking.lat - lastPoint.lat, 2) +
            Math.pow(animal.tracking.lng - lastPoint.lng, 2)
        );
        
        // Skip if too close to last point (likely duplicate)
        if (distance < minDistance) {
            return;
        }
    }

    history.push({
        lat: animal.tracking.lat,
        lng: animal.tracking.lng,
        timestamp: now,
        status: animal.tracking.status
    });

    const cutoff = now - trailTimeRange;
    while (history.length > 0 && history[0].timestamp < cutoff) {
        history.shift();
    }
    
    // Limit history size to prevent memory issues
    if (history.length > 500) {
        history.shift();
    }
}

// Tracking simulation with realistic movement
function startTrackingSimulation() {
    if (trackingUpdateInterval) clearInterval(trackingUpdateInterval);

    trackingUpdateInterval = setInterval(() => {
        const allAnimals = Object.values(animalDatabase).flat();
        allAnimals.forEach(animal => {
            if (!animal.tracking.enabled) return;

            ensureTrackingDefaults(animal);

            if (animal.tracking.battery !== undefined && animal.tracking.battery > 0) {
                const drainRate = animal.tracking.status === 'moving' ? 0.15 : 0.08;
                animal.tracking.battery = Math.max(0, animal.tracking.battery - drainRate);
            }

            if (animal.tracking.status === 'moving' &&
                Number.isFinite(animal.tracking.lat) &&
                Number.isFinite(animal.tracking.lng)) {
                const centerLat = animal.tracking.center?.lat ?? animal.tracking.lat;
                const centerLng = animal.tracking.center?.lng ?? animal.tracking.lng;
                const radius = animal.tracking.radius ?? 0.0002;
                const jitter = radius * 0.6;
                animal.tracking.lat = clamp(centerLat + (Math.random() - 0.5) * jitter, centerLat - radius, centerLat + radius);
                animal.tracking.lng = clamp(centerLng + (Math.random() - 0.5) * jitter, centerLng - radius, centerLng + radius);

                recordMovementHistory(animal);
            }

            if (Math.random() < (animal.tracking.status === 'moving' ? 0.025 : 0.05)) {
                animal.tracking.status = animal.tracking.status === 'moving' ? 'resting' : 'moving';
            }
        });

        if (document.getElementById('tracking-section')) {
            renderTracking();
        }
    }, 4000);
}

// Render tracking map
function renderTracking() {
    initializeMap();
    const mapCard = document.getElementById('mapCard');
    if (mapCard) {
        mapCard.classList.toggle('heat-mode', trackingViewMode === 'heat');
    }

    const allAnimals = Object.values(animalDatabase).flat();
    const trackedAnimals = allAnimals.filter(a => a.tracking.enabled && trackingFilters.has(a.species));

    // Legend removed - using filter buttons instead
    renderSpeciesZoomDropdown();
    renderTrackingStats(trackedAnimals);

    const listContainer = document.getElementById('trackingList');
    const emptyOverlay = document.getElementById('mapEmptyState');

    const trackedCountEl = document.getElementById('trackedCount');
    if (trackedCountEl) trackedCountEl.textContent = trackedAnimals.length;

    if (listContainer) {
        if (!trackedAnimals.length) {
            listContainer.innerHTML = `<div class="tracking-empty">No live trackers match the current filters.</div>`;
        } else {
            listContainer.innerHTML = trackedAnimals.map(animal => {
                const battery = animal.tracking.battery ?? 100;
                const batteryDisplay = battery.toFixed(2);
                const batteryStatus = battery >= 50 ? 'good' : battery >= 20 ? 'warning' : 'critical';
                const batteryIcon = battery >= 50 ? '🔋' : battery >= 20 ? '🪫' : '⚠️';
                return `
                <div class="tracking-item" onclick="openModal(${animal.id})">
                    <img src="${animal.images[0]}" class="tracking-avatar" alt="${animal.name}">
                    <div class="tracking-info">
                        <div class="tracking-name">${animal.name}</div>
                        <div class="tracking-location">📍 ${animal.tracking.location}</div>
                        <div class="tracking-location">⏱️ Last fed ${animal.lastFed}</div>
                        <div class="tracking-battery battery-${batteryStatus}">
                            ${batteryIcon} ${batteryDisplay}% • Charged ${animal.tracking.lastCharge || 'recently'}
                        </div>
                    </div>
                    <div class="tracking-status-group">
                        <div class="tracking-status status-${animal.tracking.status}">
                            ${animal.tracking.status}
                        </div>
                    </div>
                </div>
            `;
            }).join('');
        }
    }

    if (!markerLayer || !mapInstance) {
        if (!trackedAnimals.length) {
            if (emptyOverlay) emptyOverlay.classList.remove('hidden');
            mapNeedsFit = true;
        } else {
            if (emptyOverlay) emptyOverlay.classList.add('hidden');
        }
        return;
    }

    if (!trackedAnimals.length) {
        if (emptyOverlay) emptyOverlay.classList.remove('hidden');
        mapNeedsFit = true;
        markerMap.forEach(marker => markerLayer.removeLayer(marker));
        markerMap.clear();
        if (trailLayer) {
            trailLayer.clearLayers();
            trailMap.clear();
        }
        return;
    }

    if (emptyOverlay) emptyOverlay.classList.add('hidden');

    if (trailsEnabled && trailLayer) {
        renderMovementTrails(trackedAnimals);
    } else if (trailLayer) {
        trailLayer.clearLayers();
        trailMap.clear();
    }

    const activeIds = new Set();
    const latLngs = [];
    trackedAnimals.forEach(animal => {
        if (!Number.isFinite(animal.tracking.lat) || !Number.isFinite(animal.tracking.lng)) return;
        const icon = buildAnimalIcon(animal);
        const position = [animal.tracking.lat, animal.tracking.lng];
        activeIds.add(animal.id);

        if (markerMap.has(animal.id)) {
            const marker = markerMap.get(animal.id);
            marker.setLatLng(position);
            marker.setIcon(icon);
        } else {
            const marker = L.marker(position, { icon });
            marker.on('click', () => openModal(animal.id));
            markerLayer.addLayer(marker);
            markerMap.set(animal.id, marker);
        }

        latLngs.push(position);
    });

    markerMap.forEach((marker, id) => {
        if (!activeIds.has(id)) {
            markerLayer.removeLayer(marker);
            markerMap.delete(id);
        }
    });

    if (latLngs.length && mapNeedsFit) {
        const bounds = L.latLngBounds(latLngs).pad(0.18);
        mapInstance.flyToBounds(bounds, { duration: 0.6, maxZoom: 18 });
        mapNeedsFit = false;
    }
}

// Add animals modal function
function openAnimalAddModal() {
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast('➕ Add animals feature - Coming soon! You can add new animals to track here.');
    }
    
    // TODO: Implement full add modal functionality
    // This could open a modal to:
    // - Add new animals to tracking
    // - Configure tracking settings for new animals
    // - Assign tracking devices to animals
    console.log('Add animals modal - to be implemented');
}

// Initialize tracking page when page loads
if (document.getElementById('tracking-section')) {
    document.addEventListener('DOMContentLoaded', initializeTracking);
}