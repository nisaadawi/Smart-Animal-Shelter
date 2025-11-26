// Environment page functionality
function initializeEnvironment() {
    renderRooms();
}

// Render environment rooms
function renderRooms() {
    const grid = document.getElementById('roomsGrid');
    if (!grid) return;
    
    grid.innerHTML = rooms.map(room => `
        <div class="room-card">
            <div class="room-header">
                <div class="room-name">${room.name}</div>
                <div class="room-status ${room.status}"></div>
            </div>
            <div class="room-metrics">
                <div class="metric">
                    <div class="metric-label">🌡️ Temperature</div>
                    <div class="metric-value">${room.temp}°C</div>
                </div>
                <div class="metric">
                    <div class="metric-label">💧 Humidity</div>
                    <div class="metric-value">${room.humidity}%</div>
                </div>
                <div class="metric">
                    <div class="metric-label">🌬️ Air Quality</div>
                    <div class="metric-value">${room.aqi} AQI</div>
                </div>
            </div>
            <div class="temp-control">
                <button class="temp-btn" onclick="adjustTemp(${room.id}, -1)">−</button>
                <div class="temp-slider">
                    <div class="temp-slider-fill" style="width: ${(room.temp / 35) * 100}%"></div>
                </div>
                <button class="temp-btn" onclick="adjustTemp(${room.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
}

function adjustTemp(id, delta) {
    const room = rooms.find(r => r.id === id);
    if (room) {
        room.temp += delta;
        room.temp = Math.max(15, Math.min(35, room.temp));

        // Update status based on target
        const diff = Math.abs(room.temp - room.target);
        room.status = diff > 3 ? 'danger' : diff > 1 ? 'warning' : 'good';

        renderRooms();
        showToast(`${room.name} temperature adjusted to ${room.temp}°C`);
    }
}

// Initialize environment page when page loads
if (document.getElementById('environment-section')) {
    document.addEventListener('DOMContentLoaded', initializeEnvironment);
}