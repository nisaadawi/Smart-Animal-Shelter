// Reports page functionality
let generatedReports = JSON.parse(localStorage.getItem('pawshelterReports') || '[]');

// Initialize reports page
function initializeReports() {
    renderReportsList();
    updateHeaderStats();
}

// Generate report function
function generateReport(type) {
    const reportTypes = {
        health: { icon: '❤️', name: 'Health Report', color: '#ef4444' },
        feeding: { icon: '🍽️', name: 'Feeding Report', color: '#10b981' },
        tracking: { icon: '📍', name: 'Tracking Report', color: '#3b82f6' },
        alerts: { icon: '🚨', name: 'Alerts Report', color: '#f59e0b' },
        inventory: { icon: '📦', name: 'Inventory Report', color: '#8b5cf6' },
        system: { icon: '⚙️', name: 'System Report', color: '#64748b' }
    };

    const reportType = reportTypes[type];
    if (!reportType) {
        showToast('❌ Invalid report type');
        return;
    }

    // Show loading state
    showToast(`📊 Generating ${reportType.name}...`);

    // Simulate report generation (in real app, this would be an API call)
    setTimeout(() => {
        const report = {
            id: Date.now(),
            type: type,
            name: reportType.name,
            icon: reportType.icon,
            generatedAt: new Date().toISOString(),
            generatedBy: 'Khairul Johari',
            status: 'completed',
            data: generateReportData(type)
        };

        // Add to reports list
        generatedReports.unshift(report);
        if (generatedReports.length > 20) {
            generatedReports = generatedReports.slice(0, 20);
        }

        // Save to localStorage
        localStorage.setItem('pawshelterReports', JSON.stringify(generatedReports));

        // Refresh list
        renderReportsList();

        // Show success
        showToast(`✅ ${reportType.name} generated successfully!`);
    }, 1500);
}

// Generate report data based on type
function generateReportData(type) {
    const allAnimals = Object.values(animalDatabase).flat();
    
    switch(type) {
        case 'health':
            const healthStats = {
                total: allAnimals.length,
                good: allAnimals.filter(a => a.health === 'good').length,
                warning: allAnimals.filter(a => a.health === 'warning').length,
                danger: allAnimals.filter(a => a.health === 'danger').length,
                animals: allAnimals.map(a => ({
                    name: a.name,
                    species: a.species,
                    health: a.health,
                    lastCheck: a.lastHealthCheck || 'N/A'
                }))
            };
            return healthStats;

        case 'feeding':
            const feedingStats = {
                totalAnimals: allAnimals.length,
                lastFedToday: allAnimals.filter(a => {
                    const lastFed = a.lastFed || 'Never';
                    return lastFed.includes('Today') || lastFed.includes('ago');
                }).length,
                needsFeeding: allAnimals.filter(a => {
                    const lastFed = a.lastFed || 'Never';
                    return lastFed.includes('ago') && parseInt(lastFed) > 8;
                }).length,
                compliance: 98
            };
            return feedingStats;

        case 'tracking':
            const trackingStats = {
                tracked: allAnimals.filter(a => a.tracking?.enabled).length,
                notTracked: allAnimals.filter(a => !a.tracking?.enabled).length,
                lowBattery: allAnimals.filter(a => {
                    const battery = a.tracking?.battery ?? 100;
                    return battery < 20;
                }).length,
                locations: allAnimals.filter(a => a.tracking?.enabled).map(a => ({
                    name: a.name,
                    location: a.tracking.location || 'Unknown',
                    battery: a.tracking.battery ?? 100,
                    status: a.tracking.status || 'Unknown'
                }))
            };
            return trackingStats;

        case 'alerts':
            const alertCount = allAnimals.reduce((sum, a) => {
                return sum + (Array.isArray(a.alerts) ? a.alerts.length : 0);
            }, 0);
            return {
                totalAlerts: alertCount,
                critical: allAnimals.filter(a => a.health === 'danger').length,
                warnings: allAnimals.filter(a => a.health === 'warning').length,
                resolved: 0
            };

        case 'inventory':
            return {
                totalItems: typeof inventoryDatabase !== 'undefined' ? Object.keys(inventoryDatabase).length : 0,
                lowStock: 4,
                outOfStock: 0,
                lastUpdated: new Date().toISOString()
            };

        case 'system':
            return {
                uptime: '100%',
                cameras: 24,
                sensors: allAnimals.length * 3,
                devices: allAnimals.filter(a => a.tracking?.enabled).length,
                status: 'operational'
            };

        default:
            return { message: 'Report data' };
    }
}

// Render reports list
function renderReportsList() {
    const reportsList = document.getElementById('reportsList');
    if (!reportsList) return;

    if (generatedReports.length === 0) {
        reportsList.innerHTML = `
            <div class="reports-empty">
                <div class="reports-empty-icon">📊</div>
                <div class="reports-empty-text">No reports generated yet</div>
                <p style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">
                    Generate your first report using the cards above
                </p>
            </div>
        `;
        return;
    }

    reportsList.innerHTML = generatedReports.map(report => {
        const date = new Date(report.generatedAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
            <div class="report-list-item">
                <div class="report-list-info">
                    <div class="report-list-icon">${report.icon}</div>
                    <div class="report-list-details">
                        <div class="report-list-name">${report.name}</div>
                        <div class="report-list-meta">
                            <span>📅 ${formattedDate}</span>
                            <span>🕐 ${formattedTime}</span>
                            <span>👤 ${report.generatedBy}</span>
                        </div>
                    </div>
                </div>
                <div class="report-list-actions">
                    <button class="report-list-btn view" onclick="viewReport(${report.id})">
                        👁️ View
                    </button>
                    <button class="report-list-btn download" onclick="downloadReport(${report.id})">
                        ⬇️ Download
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// View report
function viewReport(reportId) {
    const report = generatedReports.find(r => r.id === reportId);
    if (!report) {
        showToast('❌ Report not found');
        return;
    }

    // Create modal content
    const modalContent = `
        <div style="padding: 24px; max-width: 800px;">
            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 8px; background: linear-gradient(135deg, var(--text-primary), var(--primary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${report.icon} ${report.name}
            </h2>
            <p style="color: var(--text-secondary); margin-bottom: 24px;">
                Generated on ${new Date(report.generatedAt).toLocaleString()}
            </p>
            <div style="background: rgba(99, 102, 241, 0.05); padding: 24px; border-radius: 12px; font-family: monospace; white-space: pre-wrap; overflow-x: auto;">
${JSON.stringify(report.data, null, 2)}
            </div>
        </div>
    `;

    // Show modal (simplified version - you could enhance this)
    alert(`${report.name}\n\nGenerated: ${new Date(report.generatedAt).toLocaleString()}\n\nData: ${JSON.stringify(report.data, null, 2)}`);
    
    showToast(`👁️ Viewing ${report.name}`);
}

// Download report
function downloadReport(reportId) {
    const report = generatedReports.find(r => r.id === reportId);
    if (!report) {
        showToast('❌ Report not found');
        return;
    }

    // Create downloadable content
    const content = `
${report.name}
Generated: ${new Date(report.generatedAt).toLocaleString()}
Generated by: ${report.generatedBy}

${'='.repeat(50)}

${JSON.stringify(report.data, null, 2)}
    `.trim();

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`⬇️ ${report.name} downloaded`);
}

// Refresh reports
function refreshReports() {
    renderReportsList();
    showToast('🔄 Reports list refreshed');
}

// Initialize on page load
if (document.getElementById('reports-section')) {
    document.addEventListener('DOMContentLoaded', initializeReports);
}

