let trackingMapPreset = 'all';

// Tracking page functionality
function initializeTracking() {
    // Initialize movement history for all tracked animals
    const allAnimals = Object.values(animalDatabase).flat();
    allAnimals.forEach(animal => {
        if (animal.tracking?.enabled && 
            Number.isFinite(animal.tracking.lat) && 
            Number.isFinite(animal.tracking.lng)) {
            recordMovementHistory(animal);
        }
    });
    
    renderTrackingToolbar();
    renderSpeciesZoomDropdown();
    initializeMap();
    renderTracking();
    startTrackingSimulation();
}

function renderTrackingToolbar() {
    const toolbar = document.getElementById('trackingToolbar');
    if (!toolbar) return;
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

    toolbar.innerHTML = `
        <div class="tracking-filters">${filters}</div>
        <div class="tracking-controls-group">
            <div class="tracking-view-toggle">
                <button class="tracking-view-btn ${!trailsEnabled ? 'active' : ''}" onclick="toggleTrails()">🐾 Trails Off</button>
                <button class="tracking-view-btn ${trailsEnabled ? 'active' : ''}" onclick="toggleTrails()">🐾 Trails On</button>
            </div>
        </div>
    `;
}

function renderSpeciesZoomDropdown() {
    const select = document.getElementById('speciesZoomSelect');
    if (!select) return;
    const allAnimals = Object.values(animalDatabase).flat();

    // Clear existing options except "All"
    select.innerHTML = '<option value="all">🌍 Whole Site</option>';

    // Add species options
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

    // Set current selection
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
    const coverage = Math.round((trackingFilters.size / Object.keys(trackingSpeciesMeta).length) * 100);
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

function toggleTrails() {
    trailsEnabled = !trailsEnabled;
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
        if (history.length < 2) return; // Need at least 2 points for a trail

        const meta = trackingSpeciesMeta[animal.species] || {};
        const baseColor = meta.color || '#6366f1';
        
        // Filter history to visible time range
        const visibleHistory = history.filter(point => 
            (now - point.timestamp) <= trailTimeRange
        );

        if (visibleHistory.length < 2) return;

        const latLngs = visibleHistory.map(point => [point.lat, point.lng]);
        
        activeTrailIds.add(animal.id);

        // Calculate opacity based on recency (newer = more opaque)
        const newestTime = visibleHistory[visibleHistory.length - 1].timestamp;
        const oldestTime = visibleHistory[0].timestamp;
        const timeSpan = newestTime - oldestTime;
        
        // Base opacity with slight fade for older segments
        const baseOpacity = 0.65;
        const minOpacity = 0.3;

        if (trailMap.has(animal.id)) {
            const existingTrail = trailMap.get(animal.id);
            existingTrail.setLatLngs(latLngs);
            existingTrail.setStyle({
                color: baseColor,
                opacity: baseOpacity
            });
        } else {
            const trail = L.polyline(latLngs, {
                color: baseColor,
                weight: 3,
                opacity: baseOpacity,
                smoothFactor: 1,
                dashArray: '8, 4',
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

    // Remove trails for animals no longer visible
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

// Record movement history for trails
function recordMovementHistory(animal) {
    if (!animal.tracking.enabled || 
        !Number.isFinite(animal.tracking.lat) || 
        !Number.isFinite(animal.tracking.lng)) {
        return;
    }

    if (!movementHistory.has(animal.id)) {
        movementHistory.set(animal.id, []);
    }

    const history = movementHistory.get(animal.id);
    const now = Date.now();
    
    history.push({
        lat: animal.tracking.lat,
        lng: animal.tracking.lng,
        timestamp: now,
        status: animal.tracking.status
    });

    // Keep only last hour of history
    const cutoff = now - trailTimeRange;
    while (history.length > 0 && history[0].timestamp < cutoff) {
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

            // Simulate battery drain (very slow - 0.1% per update cycle)
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
                
                // Record movement for trails
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

    renderTrackingLegend(allAnimals);
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
        // remove markers if grid is empty
        markerMap.forEach(marker => markerLayer.removeLayer(marker));
        markerMap.clear();
        return;
    }

    if (emptyOverlay) emptyOverlay.classList.add('hidden');

    // Render movement trails if enabled
    if (trailsEnabled && trailLayer) {
        renderMovementTrails(trackedAnimals);
    } else if (trailLayer) {
        // Clear trails if disabled
        trailMap.forEach(trail => trailLayer.removeLayer(trail));
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

// Initialize tracking page when page loads
if (document.getElementById('tracking-section')) {
    document.addEventListener('DOMContentLoaded', initializeTracking);
}