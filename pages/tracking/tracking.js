// Tracking page functionality
function initializeTracking() {
    renderTrackingToolbar();
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
        <div class="tracking-view-toggle">
            <button class="tracking-view-btn ${trackingViewMode === 'map' ? 'active' : ''}" onclick="setTrackingView('map')">Map View</button>
            <button class="tracking-view-btn ${trackingViewMode === 'heat' ? 'active' : ''}" onclick="setTrackingView('heat')">Heat View</button>
        </div>
    `;
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
    markerMap.clear();
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

    stats.innerHTML = `
        <div class="tracking-stat-card">
            <div class="stat-label">Tracked Animals</div>
            <div class="stat-value">${trackedAnimals.length}</div>
            <div class="stat-meta">${moving} moving • ${resting} resting</div>
        </div>
        <div class="tracking-stat-card">
            <div class="stat-label">Active Alerts</div>
            <div class="stat-value">${alerts}</div>
            <div class="stat-meta">${alerts ? 'Immediate attention required' : 'All clear'}</div>
        </div>
        <div class="tracking-stat-card">
            <div class="stat-label">Filter Coverage</div>
            <div class="stat-value">${coverage}%</div>
            <div class="stat-meta">${trackingFilters.size} / ${Object.keys(trackingSpeciesMeta).length} species visible</div>
        </div>
    `;
}

function renderTrackingLegend(allAnimals) {
    const legendEl = document.getElementById('trackingLegend');
    if (!legendEl) return;
    const legendItems = Object.entries(trackingSpeciesMeta).map(([species, meta]) => {
        const count = allAnimals.filter(a => a.tracking.enabled && a.species === species).length;
        if (!count) return '';
        return `
            <div class="legend-item">
                <span class="legend-dot" style="background:${meta.color};"></span>
                ${meta.icon} ${meta.label}
                <span style="font-weight:800; margin-left:4px;">${count}</span>
            </div>
        `;
    }).join('');

    legendEl.innerHTML = legendItems || '<div class="tracking-empty" style="margin:0;">No live devices reporting yet.</div>';
}

function buildAnimalIcon(animal) {
    const meta = trackingSpeciesMeta[animal.species] || {};
    const emoji = meta.icon || '🐾';
    const color = meta.color || '#6366f1';
    const html = `
        <div class="map-pin ${animal.tracking.status}" style="--pin-color:${color}" data-label="${animal.name}">
            <div class="map-pin-inner">${emoji}</div>
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

// Tracking simulation with realistic movement
function startTrackingSimulation() {
    if (trackingUpdateInterval) clearInterval(trackingUpdateInterval);

    trackingUpdateInterval = setInterval(() => {
        const allAnimals = Object.values(animalDatabase).flat();
        allAnimals.forEach(animal => {
            if (!animal.tracking.enabled) return;

            if (animal.tracking.status === 'moving' &&
                Number.isFinite(animal.tracking.lat) &&
                Number.isFinite(animal.tracking.lng)) {
                const centerLat = animal.tracking.center?.lat ?? animal.tracking.lat;
                const centerLng = animal.tracking.center?.lng ?? animal.tracking.lng;
                const radius = animal.tracking.radius ?? 0.0002;
                const jitter = radius * 0.6;
                animal.tracking.lat = clamp(centerLat + (Math.random() - 0.5) * jitter, centerLat - radius, centerLat + radius);
                animal.tracking.lng = clamp(centerLng + (Math.random() - 0.5) * jitter, centerLng - radius, centerLng + radius);
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
    renderTrackingStats(trackedAnimals);

    const listContainer = document.getElementById('trackingList');
    const emptyOverlay = document.getElementById('mapEmptyState');

    const trackedCountEl = document.getElementById('trackedCount');
    if (trackedCountEl) trackedCountEl.textContent = trackedAnimals.length;

    if (listContainer) {
        if (!trackedAnimals.length) {
            listContainer.innerHTML = `<div class="tracking-empty">No live trackers match the current filters.</div>`;
        } else {
            listContainer.innerHTML = trackedAnimals.map(animal => `
                <div class="tracking-item" onclick="openModal(${animal.id})">
                    <img src="${animal.images[0]}" class="tracking-avatar" alt="${animal.name}">
                    <div class="tracking-info">
                        <div class="tracking-name">${animal.name}</div>
                        <div class="tracking-location">📍 ${animal.tracking.location}</div>
                        <div class="tracking-location">⏱️ Last fed ${animal.lastFed}</div>
                    </div>
                    <div class="tracking-status status-${animal.tracking.status}">
                        ${animal.tracking.status}
                    </div>
                </div>
            `).join('');
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