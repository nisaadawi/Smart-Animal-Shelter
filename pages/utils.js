// Global state
let currentSpecies = 'Goat';
let selectedAnimal = null;
let trackingUpdateInterval = null;
let trackingFilters = new Set(Object.keys(trackingSpeciesMeta));
let trackingViewMode = 'map';
let alertFilters = new Set(Object.keys(severityMeta));
let mapInstance = null;
let markerLayer = null;
const markerMap = new Map();
let mapNeedsFit = true;
let speciesChartInstance = null;
let healthStatusChartInstance = null;

// Utility functions
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Sidebar functions moved to sidebar.js

// Close modal on outside click
function setupModalClose() {
    const modal = document.getElementById('animalModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setupModalClose();
});