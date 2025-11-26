// Inventory page functionality
function initializeInventory() {
    renderInventory();
}

// Render inventory
function renderInventory() {
    const grid = document.getElementById('inventoryGrid');
    if (!grid) return;
    
    grid.innerHTML = inventory.map(item => `
        <div class="inventory-item">
            <div class="inventory-icon">${item.icon}</div>
            <div class="inventory-details">
                <div class="inventory-name">${item.name}</div>
                <div class="inventory-category">${item.category}</div>
            </div>
            <div class="inventory-stock">
                <div class="stock-level">${item.stock}</div>
                <div class="stock-status ${item.stock < item.min ? 'stock-low' : 'stock-ok'}">
                    ${item.stock < item.min ? 'Low Stock' : 'In Stock'}
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize inventory page when page loads
if (document.getElementById('inventory-section')) {
    document.addEventListener('DOMContentLoaded', initializeInventory);
}