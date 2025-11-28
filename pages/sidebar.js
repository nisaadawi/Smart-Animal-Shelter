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

/* SIDEBAR - ENHANCED */
.sidebar {
    width: var(--sidebar-width);
    background: linear-gradient(180deg, 
        rgba(255, 255, 255, 0.98) 0%, 
        rgba(255, 255, 255, 0.95) 50%,
        rgba(248, 250, 252, 0.98) 100%);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    border-right: 1px solid rgba(226, 232, 240, 0.6);
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 100;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
    box-shadow: 
        4px 0 32px rgba(99, 102, 241, 0.12),
        0 0 0 1px rgba(255, 255, 255, 0.5) inset;
}

.sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(135deg, 
        rgba(99, 102, 241, 0.08) 0%, 
        rgba(139, 92, 246, 0.05) 50%,
        transparent 100%);
    pointer-events: none;
    z-index: 0;
}

.sidebar.collapsed {
    transform: translateX(-100%);
}

/* Custom Scrollbar */
.sidebar::-webkit-scrollbar {
    width: 6px;
}

.sidebar::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--primary), var(--purple));
    border-radius: 10px;
    opacity: 0.3;
    transition: opacity 0.3s ease;
}

.sidebar:hover::-webkit-scrollbar-thumb {
    opacity: 0.6;
}

/* SIDEBAR PROFILE SECTION */
.sidebar-profile {
    padding: 24px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid rgba(226, 232, 240, 0.5);
    background: linear-gradient(135deg, 
        rgba(99, 102, 241, 0.08) 0%, 
        rgba(139, 92, 246, 0.06) 100%);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
    margin-bottom: 8px;
    box-shadow: 0 2px 12px rgba(99, 102, 241, 0.06);
}

.sidebar-profile::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(99, 102, 241, 0.3), 
        transparent);
}

.sidebar-profile:hover {
    background: linear-gradient(135deg, 
        rgba(99, 102, 241, 0.12), 
        rgba(139, 92, 246, 0.1));
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
    transform: translateY(-1px);
}

.profile-avatar {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, var(--primary), var(--purple));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 18px;
    box-shadow: 
        0 8px 24px rgba(99, 102, 241, 0.4),
        0 4px 12px rgba(139, 92, 246, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.4);
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.profile-avatar::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.profile-avatar:hover::before {
    opacity: 1;
}

.profile-avatar:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 
        0 12px 32px rgba(99, 102, 241, 0.5),
        0 6px 16px rgba(139, 92, 246, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.profile-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.profile-name {
    font-size: 17px;
    font-weight: 800;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.2px;
    line-height: 1.3;
}

.profile-role {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.3px;
    text-transform: capitalize;
}

/* NAV SECTION - ENHANCED */
.nav-section {
    padding: 20px 12px;
    position: relative;
    z-index: 1;
}

.nav-section:first-of-type {
    padding-top: 24px;
}

.nav-title {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-light);
    padding: 0 16px 14px;
    font-weight: 800;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-title::before {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, 
        transparent, 
        rgba(148, 163, 184, 0.3), 
        transparent);
}

/* NAV ITEM - ENHANCED */
.nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    margin: 4px 8px;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 14px;
    position: relative;
    text-decoration: none;
    overflow: hidden;
}

.nav-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, 
        rgba(99, 102, 241, 0.15), 
        rgba(139, 92, 246, 0.1));
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 14px;
}

.nav-item:hover::before {
    width: 100%;
}

.nav-item:hover {
    color: var(--primary);
    transform: translateX(6px);
    background: linear-gradient(135deg, 
        rgba(99, 102, 241, 0.1), 
        rgba(139, 92, 246, 0.08));
    box-shadow: 
        0 4px 16px rgba(99, 102, 241, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.nav-item.active {
    background: linear-gradient(135deg, 
        rgba(99, 102, 241, 0.18), 
        rgba(139, 92, 246, 0.12));
    color: var(--primary);
    font-weight: 700;
    box-shadow: 
        0 6px 20px rgba(99, 102, 241, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 0 0 1px rgba(99, 102, 241, 0.1);
    transform: translateX(4px);
}

.nav-item.active::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 32px;
    background: linear-gradient(180deg, var(--primary), var(--purple));
    border-radius: 0 6px 6px 0;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
    animation: activePulse 2s ease-in-out infinite;
}

@keyframes activePulse {
    0%, 100% { opacity: 1; transform: translateY(-50%) scaleY(1); }
    50% { opacity: 0.8; transform: translateY(-50%) scaleY(0.95); }
}

.nav-icon {
    font-size: 22px;
    width: 28px;
    height: 28px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.nav-item:hover .nav-icon {
    transform: scale(1.15) rotate(5deg);
}

.nav-item.active .nav-icon {
    transform: scale(1.1);
    filter: drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3));
}

.nav-badge {
    margin-left: auto;
    background: linear-gradient(135deg, var(--danger), #dc2626);
    color: white;
    font-size: 10px;
    padding: 4px 10px;
    border-radius: 12px;
    font-weight: 800;
    box-shadow: 
        0 4px 12px rgba(239, 68, 68, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1;
    animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
    .sidebar {
        transform: translateX(-100%);
        box-shadow: 8px 0 40px rgba(0, 0, 0, 0.15);
    }

    .sidebar.open {
        transform: translateX(0);
    }
}

@media (max-width: 768px) {
    .sidebar-profile {
        padding: 20px 16px;
        gap: 12px;
    }

    .profile-avatar {
        width: 48px;
        height: 48px;
        font-size: 16px;
    }

    .profile-name {
        font-size: 14px;
    }

    .profile-role {
        font-size: 11px;
    }

}
</style>

<aside class="sidebar" id="sidebar">
    <div class="sidebar-profile" onclick="toggleUserMenu()">
        <div class="profile-avatar">KJ</div>
        <div class="profile-info">
            <div class="profile-name">Khairul Johari</div>
            <div class="profile-role">Shelter's owner</div>
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
        <a class="nav-item" href="../cage/cage.html">🏠 Cage Monitor</a>
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
                (currentPage.includes('cage') && hrefPage.includes('cage')) ||
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
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) {
        // Check if we're on mobile/tablet (viewport <= 1024px)
        const isMobile = window.innerWidth <= 1024;
        
        if (isMobile) {
            // Mobile/tablet: toggle 'open' class
            sidebar.classList.toggle('open');
        } else {
            // Desktop: toggle 'collapsed' class
            sidebar.classList.toggle('collapsed');
            
            // Adjust main content margin when sidebar is collapsed
            if (mainContent) {
                if (sidebar.classList.contains('collapsed')) {
                    mainContent.classList.add('expanded');
                } else {
                    mainContent.classList.remove('expanded');
                }
            }
        }
    }
}

// Handle window resize to adjust sidebar state
function handleResize() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && mainContent) {
        const isMobile = window.innerWidth <= 1024;
        
        if (isMobile) {
            // On mobile: remove collapsed class, use open class instead
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        } else {
            // On desktop: remove open class (mobile behavior)
            sidebar.classList.remove('open');
        }
    }
}

// Initialize sidebar on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load sidebar if container exists
    if (document.getElementById('sidebar-container') || document.querySelector('.app')) {
        loadSidebar();
    }
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
});
