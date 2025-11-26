// Feeding page functionality
function initializeFeeding() {
    renderFeeding();
}

// Render feeding schedule
function renderFeeding() {
    const grid = document.getElementById('feedingSchedule');
    if (!grid) return;
    
    grid.innerHTML = feedingSchedule.map(item => `
        <div class="schedule-item">
            <div class="schedule-time">${item.icon} ${item.time}</div>
            <div class="schedule-details">
                <div class="schedule-animal">${item.animal}</div>
                <div class="schedule-meal">${item.meal}</div>
            </div>
            <div class="schedule-status status-${item.status}">
                ${item.status === 'completed' ? '✓ Completed' : '⏱️ Pending'}
            </div>
        </div>
    `).join('');
}

// Initialize feeding page when page loads
if (document.getElementById('feeding-section')) {
    document.addEventListener('DOMContentLoaded', initializeFeeding);
}