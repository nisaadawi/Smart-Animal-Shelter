// Reports page functionality
let generatedReports = JSON.parse(localStorage.getItem('pawshelterReports') || '[]');

let currentPreviewReportId = null;

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

                compliance: 98,
                animals: allAnimals.slice(0, 10).map(a => ({
                    name: a.name,
                    species: a.species,
                    lastFed: a.lastFed || 'N/A',
                    schedule: '3x / day',
                    status: a.lastFed && a.lastFed.includes('ago') ? 'On track' : 'Check schedule'
                }))
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


                resolved: 0,
                summaryBySpecies: Object.values(animalDatabase).map(group => group[0]).map(a => ({
                    species: a.species,
                    totalAnimals: allAnimals.filter(x => x.species === a.species).length,
                    activeAlerts: allAnimals.filter(x => x.species === a.species && Array.isArray(x.alerts) && x.alerts.length > 0).length
                }))
            };

        case 'inventory':
            return {
                totalItems: typeof inventoryDatabase !== 'undefined' ? Object.keys(inventoryDatabase).length : 0,
                lowStock: 4,
                outOfStock: 0,


                lastUpdated: new Date().toISOString(),
                items: [
                    { name: 'Hay Bales', category: 'Feed', stock: 45, status: 'Good' },
                    { name: 'Raw Meat', category: 'Feed', stock: 15, status: 'Low' },
                    { name: 'Medical Supplies', category: 'Health', stock: 25, status: 'Warning' },
                    { name: 'Enrichment Toys', category: 'Equipment', stock: 18, status: 'Good' }
                ]
            };

        case 'system':
            return {
                uptime: '100%',
                cameras: 24,
                sensors: allAnimals.length * 3,
                devices: allAnimals.filter(a => a.tracking?.enabled).length,


                status: 'operational',
                components: [
                    { name: 'Application Server', status: 'Online', notes: 'All services operational' },
                    { name: 'Database', status: 'Online', notes: 'Automated backups enabled' },
                    { name: 'Tracking Service', status: 'Online', notes: 'No connectivity issues' }
                ]
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


                    <button class="report-list-btn delete" onclick="deleteReport(${report.id})" title="Delete this generated report">
                        ✖
                    </button>
                </div>
            </div>
        `;
    }).join('');
}



// View report - render professional preview in panel
function viewReport(reportId) {
    const report = generatedReports.find(r => r.id === reportId);
    if (!report) {
        showToast('❌ Report not found');
        return;
    }



    const previewPanel = document.getElementById('reportPreviewPanel');
    const previewContainer = document.getElementById('reportPreview');

    if (!previewPanel || !previewContainer) {
        // Fallback to simple alert if preview container is missing
        alert(`${report.name}\n\nGenerated: ${new Date(report.generatedAt).toLocaleString()}\n\nData: ${JSON.stringify(report.data, null, 2)}`);
        return;
    }

    currentPreviewReportId = reportId;

    const generatedAt = new Date(report.generatedAt);
    const formattedDate = generatedAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const formattedTime = generatedAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Build type-specific sections
    const summaryHtml = buildReportSummary(report);
    const tableHtml = buildReportTable(report);

    previewContainer.innerHTML = `
        <div id="reportPreviewContent">
            <div class="report-preview-header">
                <div class="report-preview-title-block">
                    <div class="report-preview-title">${report.icon} ${report.name}</div>
                    <div class="report-preview-meta">
                        Generated on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong><br>
                        Generated by <strong>${report.generatedBy}</strong>
                    </div>
                </div>
                <div class="report-preview-badge">
                    <span>Smart Summary</span>
                </div>
            </div>
            ${summaryHtml}
            ${tableHtml}
            <div class="report-preview-footer-note">
                This is a simulated report with dummy data for demonstration purposes.
            </div>
        </div>
    `;



    previewPanel.style.display = 'block';
    previewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`👁️ Previewing ${report.name}`);
}

// Build summary tiles for a report
function buildReportSummary(report) {
    const data = report.data || {};

    const tiles = [];

    switch (report.type) {
        case 'health':
            tiles.push({ label: 'Total Animals', value: data.total ?? '-', sub: 'All monitored animals' });
            tiles.push({ label: 'Healthy', value: data.good ?? '-', sub: 'Good health status' });
            tiles.push({ label: 'Warnings', value: data.warning ?? '-', sub: 'Need closer monitoring' });
            tiles.push({ label: 'Critical', value: data.danger ?? '-', sub: 'Require immediate action' });
            break;
        case 'feeding':
            tiles.push({ label: 'Total Animals', value: data.totalAnimals ?? '-', sub: 'With feeding schedules' });
            tiles.push({ label: 'Fed Recently', value: data.lastFedToday ?? '-', sub: 'Fed today / recently' });
            tiles.push({ label: 'Need Attention', value: data.needsFeeding ?? '-', sub: 'Possibly overdue' });
            tiles.push({ label: 'Compliance', value: (data.compliance ?? 0) + '%', sub: 'Schedule adherence' });
            break;
        case 'tracking':
            tiles.push({ label: 'Tracked', value: data.tracked ?? '-', sub: 'With active trackers' });
            tiles.push({ label: 'Not Tracked', value: data.notTracked ?? '-', sub: 'Without trackers' });
            tiles.push({ label: 'Low Battery', value: data.lowBattery ?? '-', sub: '<20% battery' });
            break;
        case 'alerts':
            tiles.push({ label: 'Total Alerts', value: data.totalAlerts ?? '-', sub: 'All severities' });
            tiles.push({ label: 'Critical', value: data.critical ?? '-', sub: 'Danger health status' });
            tiles.push({ label: 'Warnings', value: data.warnings ?? '-', sub: 'Health warnings' });
            tiles.push({ label: 'Resolved', value: data.resolved ?? 0, sub: 'Marked as resolved' });
            break;
        case 'inventory':
            tiles.push({ label: 'Total Items', value: data.totalItems ?? '-', sub: 'In inventory' });
            tiles.push({ label: 'Low Stock', value: data.lowStock ?? '-', sub: 'Below threshold' });
            tiles.push({ label: 'Out of Stock', value: data.outOfStock ?? '-', sub: 'Need immediate restock' });
            break;
        case 'system':
            tiles.push({ label: 'Uptime', value: data.uptime ?? '-', sub: 'Overall availability' });
            tiles.push({ label: 'Cameras', value: data.cameras ?? '-', sub: 'Online CCTV units' });
            tiles.push({ label: 'Sensors', value: data.sensors ?? '-', sub: 'Environment & health sensors' });
            tiles.push({ label: 'Tracked Devices', value: data.devices ?? '-', sub: 'Active tracking devices' });
            break;
        default:
            break;
    }

    if (!tiles.length) return '';

    const tilesHtml = tiles.map(tile => `
        <div class="report-preview-summary-card">
            <div class="report-preview-summary-label">${tile.label}</div>
            <div class="report-preview-summary-value">${tile.value}</div>
            <div class="report-preview-summary-subtext">${tile.sub}</div>
        </div>
    `).join('');

    return `<div class="report-preview-summary-grid">${tilesHtml}</div>`;
}

// Build main table for a report
function buildReportTable(report) {
    const data = report.data || {};

    let headers = [];
    let rows = [];
    let title = '';

    switch (report.type) {
        case 'health':
            title = 'Animal Health Overview';
            headers = ['Name', 'Species', 'Health Status', 'Last Check'];
            rows = (data.animals || []).slice(0, 12).map(a => [
                a.name,
                a.species,
                a.health,
                a.lastCheck
            ]);
            break;
        case 'feeding':
            title = 'Feeding Compliance by Animal';
            headers = ['Name', 'Species', 'Last Fed', 'Schedule', 'Status'];
            rows = (data.animals || []).slice(0, 12).map(a => [
                a.name,
                a.species,
                a.lastFed,
                a.schedule,
                a.status
            ]);
            break;
        case 'tracking':
            title = 'Tracking Devices Overview';
            headers = ['Name', 'Location', 'Battery %', 'Status'];
            rows = (data.locations || []).slice(0, 12).map(a => [
                a.name,
                a.location,
                a.battery + '%',
                a.status
            ]);
            break;
        case 'alerts':
            title = 'Alerts by Species';
            headers = ['Species', 'Total Animals', 'Animals with Alerts'];
            rows = (data.summaryBySpecies || []).map(s => [
                s.species,
                s.totalAnimals,
                s.activeAlerts
            ]);
            break;
        case 'inventory':
            title = 'Inventory Snapshot';
            headers = ['Item', 'Category', 'Stock', 'Status'];
            rows = (data.items || []).map(i => [
                i.name,
                i.category,
                i.stock,
                i.status
            ]);
            break;
        case 'system':
            title = 'System Components';
            headers = ['Component', 'Status', 'Notes'];
            rows = (data.components || []).map(c => [
                c.name,
                c.status,
                c.notes
            ]);
            break;
        default:
            break;
    }

    if (!headers.length || !rows.length) {
        return `
            <div class="report-preview-section-title">Raw Data</div>
            <div class="report-preview-table-wrapper">
                <pre style="margin: 0; padding: 12px; font-family: monospace; font-size: 11px; white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
    }

    const headHtml = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    const bodyHtml = rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');

    return `
        <div class="report-preview-section-title">${title}</div>
        <div class="report-preview-table-wrapper">
            <table class="report-preview-table">
                <thead>${headHtml}</thead>
                <tbody>${bodyHtml}</tbody>
            </table>
        </div>
    `;
}

// Close preview panel
function closeReportPreview() {
    const previewPanel = document.getElementById('reportPreviewPanel');
    const previewContainer = document.getElementById('reportPreview');
    if (previewPanel && previewContainer) {
        previewPanel.style.display = 'none';
        previewContainer.innerHTML = '';
        currentPreviewReportId = null;
    }
}

// Download current preview as PDF
function downloadReportPdf() {
    const report = generatedReports.find(r => r.id === currentPreviewReportId);
    if (!report) {
        showToast('❌ No report selected to export');
        return;
    }

    const filename = report.name.replace(/\s+/g, '_') + '_Report.pdf';

    // Use jsPDF as primary method - it's reliable and doesn't have CORS/tainted canvas issues
    // Check for jsPDF in both possible locations (UMD bundle exposes it differently)
    const jsPDFLib = window.jspdf?.jsPDF || (window.jspdf && typeof window.jspdf.jsPDF === 'function' ? window.jspdf.jsPDF : null);
    
    if (jsPDFLib || (window.jspdf && typeof window.jspdf.jsPDF === 'function')) {
        try {
            generateReportPdfWithJsPdf(report, filename);
            return;
        } catch (error) {
            console.error('Error generating PDF with jsPDF:', error);
            showToast('❌ PDF generation failed. Please try again.');
            // Fall through to html2pdf fallback
        }
    }

    // Fallback: Try html2pdf but it may fail due to CORS
    const previewContent = document.getElementById('reportPreviewContent');
    if (typeof html2pdf !== 'undefined' && previewContent && previewContent.innerHTML.trim() !== '') {
        showToast('⬇️ Generating PDF from preview...');
        const opt = {
            margin:       10,
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: false, 
                allowTaint: true,
                logging: false,
                windowWidth: previewContent.scrollWidth,
                windowHeight: previewContent.scrollHeight
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(previewContent).save()
            .then(() => {
                showToast('✅ PDF downloaded successfully');
            })
            .catch(err => {
                console.error('html2pdf failed:', err);
                showToast('❌ PDF download failed. Using data-driven method...');
                // Final fallback: use jsPDF data-driven method even if library check failed
                try {
                    generateReportPdfWithJsPdf(report, filename);
                } catch (fallbackError) {
                    console.error('Fallback PDF generation failed:', fallbackError);
                    showToast('❌ PDF generation failed. Please refresh and try again.');
                }
            });
        return;
    }

    // If preview doesn't exist, generate PDF directly from data
    if (!previewContent || previewContent.innerHTML.trim() === '') {
        showToast('📊 Generating PDF from data...');
        try {
            generateReportPdfWithJsPdf(report, filename);
            return;
        } catch (error) {
            console.error('Error generating PDF:', error);
    showToast('❌ PDF library not available. Please refresh the page.');
        }
    } else {
        showToast('❌ PDF library not available. Please refresh the page.');
    }
}

// Helper: data-driven jsPDF export - generates PDF with all dummy data
function generateReportPdfWithJsPdf(report, filename) {
    try {
        // Try multiple ways to access jsPDF (UMD bundle compatibility)
        let jsPDF;
        if (window.jspdf && window.jspdf.jsPDF) {
            jsPDF = window.jspdf.jsPDF;
        } else if (window.jspdf && typeof window.jspdf.jsPDF === 'function') {
            jsPDF = window.jspdf.jsPDF;
        } else if (window.jsPDF) {
            jsPDF = window.jsPDF;
        } else {
            throw new Error('jsPDF library not found');
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        let currentY = margin;
        let pageNumber = 1;

        // Draw professional footer (defined first as it's used in addPageIfNeeded)
        const drawFooter = () => {
            const footerY = pageHeight - 15;
            const footerTextY = footerY + 4;
            
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, footerY, pageWidth - margin, footerY);
            
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont(undefined, 'normal');
            
            // Left: Company name - aligned (footer text at footerY + 4, which is ~4mm from top of footer area)
            doc.text('PawShelter - Smart Animal Shelter', margin, footerTextY);
            
            // Center: Confidential notice - aligned
            const confText = 'CONFIDENTIAL - For Internal Use Only';
            const confWidth = doc.getTextWidth(confText);
            doc.text(confText, (pageWidth - confWidth) / 2, footerTextY);
            
            // Right: Page number - aligned
            const pageText = `Page ${pageNumber}`;
            const pageWidth_text = doc.getTextWidth(pageText);
            doc.text(pageText, pageWidth - margin - pageWidth_text, footerTextY);
        };

        // Helper function to add new page
        const addPageIfNeeded = () => {
            if (currentY > pageHeight - 30) {
                doc.addPage();
                currentY = margin;
                pageNumber++;
                drawHeader();
                drawFooter();
                currentY = margin + 25; // Account for header
            }
        };

        // Draw professional header
        const drawHeader = () => {
            // Header background bar
            doc.setFillColor(99, 102, 241);
            doc.rect(0, 0, pageWidth, 25, 'F');
            
            // Logo/Brand area (left side) - properly aligned
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            // Calculate proper Y position for vertical centering (header is 25mm, center is ~12.5mm)
            doc.text('PawShelter', margin, 12.5);
            
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');
            // Truncate subtitle if too long
            const subtitle = 'Smart Animal Shelter Management System';
            const maxSubtitleWidth = pageWidth - (margin * 2) - 120; // Leave space for right side
            const subtitleLines = doc.splitTextToSize(subtitle, maxSubtitleWidth);
            doc.text(subtitleLines[0], margin, 19);
            
            // Report icon only (right side) - no title text, just icon for visual indicator
            doc.setFontSize(16);
            const iconText = report.icon;
            const iconWidth = doc.getTextWidth(iconText);
            doc.text(iconText, pageWidth - margin - iconWidth, 12.5);
            
            currentY = 35; // Start content below header
        };

        // Draw header and footer on first page
        drawHeader();
        drawFooter();

        // Title section with better styling and alignment
        currentY += 5;
        const titleBoxHeight = 10;
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY, contentWidth, titleBoxHeight, 'F');
        
        doc.setFontSize(18);
        doc.setTextColor(30, 41, 59);
        doc.setFont(undefined, 'bold');
        // Center text vertically in the box (currentY is top, add half height for center)
        doc.text(report.name, margin + 4, currentY + 5);
        currentY += titleBoxHeight + 5;

        // Meta information in a styled box - properly aligned
        const generatedAt = new Date(report.generatedAt);
        const dateStr = generatedAt.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        const timeStr = generatedAt.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        const metaBoxHeight = 14;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.rect(margin, currentY, contentWidth, metaBoxHeight, 'S');
        
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated on: ${dateStr} at ${timeStr}`, margin + 4, currentY + 5);
        doc.text(`Generated by: ${report.generatedBy}`, margin + 4, currentY + 10);
        
        currentY += metaBoxHeight + 8;

        const data = report.data || {};
        console.log('PDF Generation - Report data:', data); // Debug log
        let headers = [];
        let rows = [];
        let summaryText = [];

    switch (report.type) {
        case 'health':
            summaryText = [
                `Total Animals: ${data.total ?? '-'}`,
                `Healthy: ${data.good ?? '-'}`,
                `Warnings: ${data.warning ?? '-'}`,
                `Critical: ${data.danger ?? '-'}`
            ];
            headers = ['Name', 'Species', 'Health Status', 'Last Check'];
            rows = (data.animals || []).slice(0, 25).map(a => [
                a.name || '-',
                a.species || '-',
                a.health || '-',
                a.lastCheck || 'N/A'
            ]);
            break;
        case 'feeding':
            summaryText = [
                `Total Animals: ${data.totalAnimals ?? '-'}`,
                `Fed Recently: ${data.lastFedToday ?? '-'}`,
                `Need Attention: ${data.needsFeeding ?? '-'}`,
                `Compliance: ${(data.compliance ?? 0)}%`
            ];
            headers = ['Name', 'Species', 'Last Fed', 'Schedule', 'Status'];
            rows = (data.animals || []).slice(0, 25).map(a => [
                a.name || '-',
                a.species || '-',
                a.lastFed || 'N/A',
                a.schedule || '-',
                a.status || '-'
            ]);
            break;
        case 'tracking':
            summaryText = [
                `Tracked: ${data.tracked ?? '-'}`,
                `Not Tracked: ${data.notTracked ?? '-'}`,
                `Low Battery: ${data.lowBattery ?? '-'}`
            ];
            headers = ['Name', 'Location', 'Battery %', 'Status'];
            rows = (data.locations || []).slice(0, 25).map(a => [
                a.name || '-',
                a.location || 'Unknown',
                String(a.battery ?? '') + '%',
                a.status || 'Unknown'
            ]);
            break;
        case 'alerts':
            summaryText = [
                `Total Alerts: ${data.totalAlerts ?? '-'}`,
                `Critical: ${data.critical ?? '-'}`,
                `Warnings: ${data.warnings ?? '-'}`,
                `Resolved: ${data.resolved ?? 0}`
            ];
            headers = ['Species', 'Total Animals', 'Animals with Alerts'];
            rows = (data.summaryBySpecies || []).map(s => [
                s.species || '-',
                String(s.totalAnimals ?? '-'),
                String(s.activeAlerts ?? '-')
            ]);
            break;
        case 'inventory':
            summaryText = [
                `Total Items: ${data.totalItems ?? '-'}`,
                `Low Stock: ${data.lowStock ?? '-'}`,
                `Out of Stock: ${data.outOfStock ?? '-'}`
            ];
            headers = ['Item', 'Category', 'Stock', 'Status'];
            rows = (data.items || []).map(i => [
                i.name || '-',
                i.category || '-',
                String(i.stock ?? '-'),
                i.status || '-'
            ]);
            break;
        case 'system':
            summaryText = [
                `Uptime: ${data.uptime ?? '-'}`,
                `Cameras: ${data.cameras ?? '-'}`,
                `Sensors: ${data.sensors ?? '-'}`,
                `Tracked Devices: ${data.devices ?? '-'}`
            ];
            headers = ['Component', 'Status', 'Notes'];
            rows = (data.components || []).map(c => [
                c.name || '-',
                c.status || '-',
                c.notes || '-'
            ]);
            break;
        default:
            summaryText = ['Report Data Summary'];
            headers = ['Field', 'Value'];
            rows = Object.entries(data).slice(0, 25).map(([key, value]) => [
                key,
                typeof value === 'object' ? JSON.stringify(value) : String(value)
            ]);
            break;
    }

    // Validate we have data
    if (!data || Object.keys(data).length === 0) {
        doc.setFontSize(12);
        doc.setTextColor(239, 68, 68);
        doc.text('Error: No data available for this report', 20, currentY);
        doc.save(filename);
        showToast('⚠️ Report generated but contains no data');
        return;
    }

    // Add professional summary section with cards
    if (summaryText.length > 0) {
        addPageIfNeeded();
        
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.setFont(undefined, 'bold');
        doc.text('Executive Summary', margin, currentY);
        currentY += 8;

        // Create summary cards in a grid (2 columns)
        const cardsPerRow = 2;
        const cardWidth = (contentWidth - 4) / cardsPerRow; // 4mm gap between cards
        const cardHeight = 18;
        
        summaryText.forEach((text, index) => {
            addPageIfNeeded();
            
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            const cardX = margin + (col * (cardWidth + 4));
            const cardY = currentY + (row * (cardHeight + 4));
            
            // Card background
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 2, 2, 'FD');
            
            // Card accent bar
            doc.setFillColor(99, 102, 241);
            doc.rect(cardX, cardY, cardWidth, 3, 'F');
            
            // Parse text (format: "Label: Value")
            const parts = String(text).split(':');
            const label = parts[0]?.trim() || '';
            const value = parts[1]?.trim() || '';
            
            // Label - properly aligned
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont(undefined, 'normal');
            doc.text(label, cardX + 4, cardY + 7);
            
            // Value - properly aligned
            doc.setFontSize(14);
            doc.setTextColor(30, 41, 59);
            doc.setFont(undefined, 'bold');
            doc.text(value, cardX + 4, cardY + 13);
        });
        
        // Move to next section
        const numRows = Math.ceil(summaryText.length / cardsPerRow);
        currentY += (numRows * (cardHeight + 4)) + 8;
    }

    // Add professional table section
    console.log('PDF Generation - Report Type:', report.type);
    console.log('PDF Generation - Data:', data);
    console.log('PDF Generation - Headers:', headers, 'Rows:', rows);
    
    if (headers.length > 0 && rows.length > 0) {
        addPageIfNeeded();
        
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.setFont(undefined, 'bold');
        doc.text('Detailed Data', margin, currentY);
        currentY += 8;

        // Calculate column widths - more intelligent distribution
        const numCols = headers.length;
        const tableWidth = contentWidth;
        
        // Define column width ratios (optimized for better alignment and readability)
        const widthRatios = {
            2: [0.5, 0.5],
            3: [0.3, 0.3, 0.4],
            4: [0.22, 0.28, 0.28, 0.22], // NAME, SPECIES, HEALTH STATUS, LAST CHECK - optimized
            5: [0.18, 0.22, 0.22, 0.22, 0.16]
        };
        
        const ratios = widthRatios[numCols] || Array(numCols).fill(1 / numCols);
        const colWidths = ratios.map(r => tableWidth * r);
        
        // Draw professional table header - properly aligned
        const headerHeight = 8;
        const headerY = currentY - headerHeight + 2;
        // Calculate center Y for header text (accounting for font baseline)
        const headerTextY = headerY + (headerHeight / 2) - 1;
        
        doc.setFillColor(99, 102, 241);
        doc.roundedRect(margin, headerY, tableWidth, headerHeight, 1, 1, 'F');
        
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        
        let colX = margin;
        headers.forEach((header, i) => {
            const headerText = String(header || '').toUpperCase();
            const maxWidth = colWidths[i] - 8; // More padding for better alignment
            const displayHeader = doc.splitTextToSize(headerText, maxWidth)[0];
            // Center align text in header cell both horizontally and vertically
            const cellCenterX = colX + (colWidths[i] / 2);
            const textWidth = doc.getTextWidth(displayHeader);
            doc.text(displayHeader, cellCenterX - (textWidth / 2), headerTextY);
            colX += colWidths[i];
        });
        
        currentY += 3;

        // Draw professional data rows
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);
        doc.setFont(undefined, 'normal');
        
        if (rows.length === 0) {
            doc.setTextColor(71, 85, 105);
            doc.text('No data rows available', margin, currentY);
            currentY += 6;
        } else {
            // Define row height constant (used throughout table drawing)
            const rowHeight = 7;
            
            // Draw table border
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            
            rows.forEach((row, rowIndex) => {
                addPageIfNeeded();
                
                // Alternate row background for better readability
            if (rowIndex % 2 === 0) {
                doc.setFillColor(248, 250, 252);
                    doc.rect(margin, currentY - rowHeight + 2, tableWidth, rowHeight, 'F');
                }
                
                // Draw row border
                doc.setDrawColor(241, 245, 249);
                doc.line(margin, currentY - rowHeight + 2, margin + tableWidth, currentY - rowHeight + 2);
                
                // Draw cell content - properly aligned with vertical centering
                // Calculate cell center Y position (row starts at currentY - rowHeight + 2)
                const cellTopY = currentY - rowHeight + 2;
                const cellCenterY = cellTopY + (rowHeight / 2);
                // Adjust for font baseline (jsPDF text is positioned at baseline, need to offset)
                const cellTextY = cellCenterY - 1.5; // Fine-tuned offset for perfect vertical centering
                
                let colX = margin;
                row.forEach((cell, colIndex) => {
                    const cellText = String(cell || '-');
                    const maxWidth = colWidths[colIndex] - 10; // More padding for better alignment
                    
                    // Use splitTextToSize for proper text wrapping
                    const lines = doc.splitTextToSize(cellText, maxWidth);
                    const displayText = lines[0]; // Show first line, truncate if needed
                    
                    // Color code health status
                    if (cellText.toLowerCase() === 'good' || cellText.toLowerCase() === 'healthy') {
                        doc.setTextColor(34, 197, 94);
                    } else if (cellText.toLowerCase() === 'warning') {
                        doc.setTextColor(251, 191, 36);
                    } else if (cellText.toLowerCase() === 'danger' || cellText.toLowerCase() === 'critical') {
                        doc.setTextColor(239, 68, 68);
                    } else {
                        doc.setTextColor(30, 41, 59);
                    }
                    
                    try {
                        // Left align text in cells with consistent padding
                        // Use different padding for first column vs others for better visual alignment
                        const cellPadding = colIndex === 0 ? 5 : 5; // Consistent padding
                        doc.text(displayText, colX + cellPadding, cellTextY);
                    } catch (e) {
                        console.warn('Error adding cell text:', e, displayText);
                    }
                    
                    colX += colWidths[colIndex];
                });
                
                // Reset text color
                doc.setTextColor(30, 41, 59);
                currentY += rowHeight;
            });
            
            // Draw vertical divider lines between columns for better alignment
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.3);
            let dividerX = margin;
            for (let i = 1; i < headers.length; i++) {
                dividerX += colWidths[i - 1];
                // Draw divider from header to bottom of table
                const tableStartY = headerY;
                const tableEndY = currentY - rowHeight + 2;
                doc.line(dividerX, tableStartY, dividerX, tableEndY);
            }
            
            // Draw final table border with proper dimensions
            const totalTableHeight = (rows.length * 7) + 6;
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.rect(margin, currentY - totalTableHeight, tableWidth, totalTableHeight, 'S');
        }
        currentY += 8;
    } else {
        // If no table data, show message
        addPageIfNeeded();
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text('No detailed data available for this report.', margin, currentY);
        currentY += 10;
        
        // Show raw data as fallback in a styled box
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY, contentWidth, 40, 'FD');
        
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.setFont(undefined, 'monospace');
        const dataStr = JSON.stringify(data, null, 2);
        const dataLines = doc.splitTextToSize(dataStr, contentWidth - 6);
        dataLines.slice(0, 15).forEach((line, idx) => {
            addPageIfNeeded();
            doc.text(line, margin + 3, currentY + 5 + (idx * 4));
        });
        currentY += 45;
    }

    // Add professional footer note
    addPageIfNeeded();
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 5;
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont(undefined, 'italic');
    doc.text(
        'This report was generated automatically by the PawShelter system. ' +
        'Data is current as of the generation time and may be subject to change.',
        margin,
        currentY,
        { maxWidth: contentWidth, align: 'justify' }
    );
    currentY += 6;
    
    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.setFont(undefined, 'normal');
    doc.text(
        '© ' + new Date().getFullYear() + ' PawShelter. All rights reserved. | ' +
        'This is a simulated report with demonstration data.',
        margin,
        currentY,
        { maxWidth: contentWidth, align: 'center' }
    );

    // Final validation before saving
    if (currentY <= margin + 5) {
        // PDF is essentially empty, add a message
        doc.setFontSize(12);
        doc.setTextColor(239, 68, 68);
        doc.text('Warning: This report contains no data.', margin, currentY);
        currentY += 10;
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text('Please regenerate the report to ensure data is available.', margin, currentY);
    }

    // Update footer on all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        pageNumber = i;
        drawFooter();
    }

    doc.save(filename);
    showToast('✅ Professional PDF downloaded successfully');
    console.log('PDF saved:', filename);
    } catch (error) {
        console.error('Error generating PDF:', error);
        console.error('Error stack:', error.stack);
        showToast('❌ Error generating PDF: ' + error.message);
    }
}

// Delete a generated report
function deleteReport(reportId) {
    const report = generatedReports.find(r => r.id === reportId);
    if (!report) {
        showToast('❌ Report not found');
        return;
    }

    // Ask for confirmation before deleting
    const confirmed = confirm(`Are you sure you want to delete "${report.name}" from Recent Reports?`);
    if (!confirmed) {
        return; // User cancelled, do nothing
    }

    const index = generatedReports.findIndex(r => r.id === reportId);
    if (index === -1) {
        showToast('❌ Report not found');
        return;
    }

    const [removed] = generatedReports.splice(index, 1);
    localStorage.setItem('pawshelterReports', JSON.stringify(generatedReports));

    // If the deleted report is currently previewed, close the preview
    if (currentPreviewReportId === reportId) {
        closeReportPreview();
    }

    renderReportsList();
    showToast(`🗑️ Deleted ${removed.name}`);
}
// Download report
function downloadReport(reportId) {
    const report = generatedReports.find(r => r.id === reportId);
    if (!report) {
        showToast('❌ Report not found');
        return;
    }

    // Validate report has data
    if (!report.data || Object.keys(report.data).length === 0) {
        showToast('⚠️ Report has no data. Regenerating...');
        // Regenerate report data
        report.data = generateReportData(report.type);
        localStorage.setItem('pawshelterReports', JSON.stringify(generatedReports));
    }

    // Ensure preview is built for this report so PDF layout matches on-screen design
    if (currentPreviewReportId !== reportId) {
        viewReport(reportId);
        // Wait a bit longer for DOM to update
        setTimeout(() => {
            downloadReportPdf();
        }, 500);
    } else {
    // Use the same PDF exporter as the preview button
    setTimeout(() => {
        downloadReportPdf();
        }, 100);
    }
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



