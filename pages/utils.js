// Global state
let currentSpecies = 'All';
let selectedAnimal = null;
let trackingUpdateInterval = null;
let trackingFilters = new Set(Object.keys(trackingSpeciesMeta));
let trackingViewMode = 'map';
let alertFilters = new Set(Object.keys(severityMeta));
let mapInstance = null;
let markerLayer = null;
let trailLayer = null;
const markerMap = new Map();
const trailMap = new Map();
const movementHistory = new Map();
let trailsEnabled = true;
const trailTimeRange = 1000 * 60 * 60; // 1 hour of history
let mapNeedsFit = true;

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

// Update header quick stats (for all pages)
function updateHeaderStats() {
    if (typeof animalDatabase === 'undefined' || typeof feedingSchedule === 'undefined') {
        return;
    }
    
    const allAnimals = Object.values(animalDatabase).flat();
    const totalAlerts = allAnimals.reduce((sum, a) => sum + (a.alerts?.length || 0), 0);
    const pendingTasks = feedingSchedule.filter(f => f.status === 'pending').length;
    
    const alertsCountEl = document.getElementById('headerAlertsCount');
    const tasksCountEl = document.getElementById('headerTasksCount');
    const notificationBadgeEl = document.getElementById('notificationBadge');
    
    if (alertsCountEl) alertsCountEl.textContent = totalAlerts;
    if (tasksCountEl) tasksCountEl.textContent = pendingTasks;
    if (notificationBadgeEl) {
        notificationBadgeEl.textContent = totalAlerts > 0 ? (totalAlerts > 99 ? '99+' : totalAlerts) : '';
    }
}

// Toggle user menu
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Toggle settings menu
function toggleSettingsMenu() {
    const menu = document.getElementById('settingsMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Close settings menu when clicking outside
document.addEventListener('click', function(event) {
    const settingsMenu = document.getElementById('settingsMenu');
    const settingsBtn = event.target.closest('[onclick*="toggleSettingsMenu"]');
    
    if (settingsMenu && !settingsMenu.contains(event.target) && !settingsBtn) {
        settingsMenu.classList.remove('show');
    }
});

// Settings menu functions
function openSettingsProfile() {
    toggleSettingsMenu();
    if (typeof showToast === 'function') {
        showToast('👤 Opening Profile...');
    }
    // TODO: Open profile modal/page
    console.log('Opening Profile');
}

function openSettingsPreferences() {
    toggleSettingsMenu();
    if (typeof showToast === 'function') {
        showToast('⚙️ Opening Preferences...');
    }
    // TODO: Open preferences modal/page
    console.log('Opening Preferences');
}

function openSettingsNotifications() {
    toggleSettingsMenu();
    window.location.href = '../alerts/alerts.html';
}

function openSettingsHelp() {
    toggleSettingsMenu();
    if (typeof showToast === 'function') {
        showToast('❓ Help & Support - Coming soon!');
    }
    // TODO: Open help page
    console.log('Opening Help & Support');
}

function openSettingsAbout() {
    toggleSettingsMenu();
    if (typeof showToast === 'function') {
        showToast('ℹ️ PawShelter v1.0 - Smart Animal Shelter Management System');
    }
    // TODO: Open about modal
    console.log('Opening About');
}

function handleLogout() {
    toggleSettingsMenu();
    if (confirm('Are you sure you want to log out?')) {
        if (typeof showToast === 'function') {
            showToast('🚪 Logging out...');
        }
        // TODO: Implement actual logout functionality
        setTimeout(() => {
            // Redirect to login page or home
            // window.location.href = '../login.html';
            console.log('Logging out...');
        }, 1000);
    }
}

// Close user menu when clicking outside (removed - user avatar no longer exists)

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    setupModalClose();
    updateHeaderStats();
    // Update stats every 30 seconds
    setInterval(updateHeaderStats, 30000);
});