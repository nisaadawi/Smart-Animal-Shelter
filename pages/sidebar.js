// Sidebar functionality - HTML and CSS embedded to work with file:// protocol

// Sidebar HTML and CSS (embedded)
const sidebarHTML = `<style>
/* SIDEBAR CSS VARIABLES */
:root {
    --primary: #6366f1;
    --purple: #8b5cf6;
    --danger: #ef4444;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --text-light: #94a3b8;
    --border: #e2e8f0;
    --radius-md: 12px;
    --sidebar-width: 280px;
}

/* SIDEBAR */
.sidebar {
    width: var(--sidebar-width);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-right: 1px solid var(--border);
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
    transition: transform 0.3s ease;
    box-shadow: 4px 0 24px rgba(0,0,0,0.08);
}

.sidebar.collapsed {
    transform: translateX(-100%);
}

.logo {
    padding: 28px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
}

.logo-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary), var(--purple));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.logo-text h1 {
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
}

.logo-text p {
    font-size: 12px;
    color: var(--text-secondary);
}

.nav-section {
    padding: 20px 12px;
}

.nav-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: var(--text-light);
    padding: 0 12px 10px;
    font-weight: 700;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    margin: 3px 0;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.25s ease;
    color: var(--text-secondary);
    font-weight: 500;
    position: relative;
    text-decoration: none;
}

.nav-item:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08));
    color: var(--primary);
    transform: translateX(4px);
}

.nav-item.active {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
    color: var(--primary);
    font-weight: 600;
}

.nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 24px;
    background: linear-gradient(180deg, var(--primary), var(--purple));
    border-radius: 0 4px 4px 0;
}

.nav-icon {
    font-size: 20px;
    width: 24px;
    text-align: center;
}

.nav-badge {
    margin-left: auto;
    background: var(--danger);
    color: white;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: 700;
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
    .sidebar {
        transform: translateX(-100%);
    }

    .sidebar.open {
        transform: translateX(0);
    }
}
</style>

<aside class="sidebar" id="sidebar">
    <div class="logo">
        <div class="logo-icon">🐾</div>
        <div class="logo-text">
            <h1>Smart Shelter</h1>
            <p>Khairul Johari</p>
        </div>
    </div>

    <div class="nav-section">
        <div class="nav-title">Main</div>
        <a class="nav-item" href="../dashboard/dashboard.html">
            <span class="nav-icon">📊</span> Dashboard
        </a>
        <a class="nav-item" href="../animals/animals.html">
            <span class="nav-icon">🐾</span> Animals
        </a>
        <a class="nav-item" href="../tracking/tracking.html">
            <span class="nav-icon">📍</span> Live Tracking
        </a>
        <a class="nav-item" href="../alerts/alerts.html">
            <span class="nav-icon">🚨</span> Alerts
        </a>
    </div>

    <div class="nav-section">
        <div class="nav-title">Operations</div>
        <a class="nav-item" href="../feeding/feeding.html">🍽️ Feeding</a>
        <a class="nav-item" href="../health/health.html">❤️ Health Monitor</a>
        <a class="nav-item" href="../environment/environment.html">🌡️ Environment</a>
        <a class="nav-item" href="../inventory/inventory.html">📦 Inventory</a>
    </div>

    <div class="nav-section">
        <div class="nav-title">System</div>
        <a class="nav-item" href="../reports/reports.html">
            <span class="nav-icon">📈</span> Reports
        </a>
    </div>
</aside>`;

// Load sidebar
function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container') || document.querySelector('.app');
    if (!sidebarContainer) {
        console.error('Sidebar container not found');
        return;
    }

    // Insert sidebar HTML directly (works with file:// protocol, no CORS issues)
    sidebarContainer.insertAdjacentHTML('afterbegin', sidebarHTML);
    
    // Set active nav item based on current page
    setActiveNavItem();
}

// Set active navigation item based on current page
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || currentPath.split('/').slice(-2).join('/');
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href) {
            const hrefPage = href.split('/').pop();
            // Match if current page matches the href page
            if (currentPage === hrefPage || 
                (currentPage === 'dashboard.html' && hrefPage === 'dashboard.html') ||
                (currentPage.includes('animals') && hrefPage.includes('animals')) ||
                (currentPage.includes('tracking') && hrefPage.includes('tracking')) ||
                (currentPage.includes('alerts') && hrefPage.includes('alerts')) ||
                (currentPage.includes('feeding') && hrefPage.includes('feeding')) ||
                (currentPage.includes('health') && hrefPage.includes('health')) ||
                (currentPage.includes('environment') && hrefPage.includes('environment')) ||
                (currentPage.includes('inventory') && hrefPage.includes('inventory')) ||
                (currentPage.includes('reports') && hrefPage.includes('reports'))) {
                item.classList.add('active');
            }
        }
    });
}

// Navigation
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Initialize sidebar on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load sidebar if container exists
    if (document.getElementById('sidebar-container') || document.querySelector('.app')) {
        loadSidebar();
    }
});
