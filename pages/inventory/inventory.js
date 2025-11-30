// Global shopping list
let shoppingList = [];

// Inventory page functionality
function initializeInventory() {
    console.log('Initializing inventory...');
    renderInventory();
    setupInventoryEventListeners();
    setupShoppingListEventListeners();
    updateShoppingCount();
}

// Render inventory
function renderInventory() {
    const grid = document.getElementById('inventoryGrid');
    if (!grid) {
        console.error('Inventory grid not found!');
        return;
    }
    
    console.log('Rendering inventory items:', inventory);
    
    grid.innerHTML = inventory.map((item, index) => {
        const categoryId = item.id || item.name.toLowerCase().replace(/\s+/g, '-');
        
        return `
        <div class="inventory-item" data-category="${categoryId}">
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
    `}).join('');
}

// Setup event listeners
function setupInventoryEventListeners() {
    const inventoryGrid = document.getElementById('inventoryGrid');
    const inventoryModal = document.getElementById('inventoryModal');
    const closeModal = document.getElementById('closeModal');
    
    if (inventoryGrid) {
        inventoryGrid.addEventListener('click', (e) => {
            const inventoryItem = e.target.closest('.inventory-item');
            if (inventoryItem) {
                const categoryId = inventoryItem.getAttribute('data-category');
                openInventoryModal(categoryId);
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeInventoryModal);
    }
    
    if (inventoryModal) {
        inventoryModal.addEventListener('click', (e) => {
            if (e.target === inventoryModal) {
                closeInventoryModal();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        const inventoryModal = document.getElementById('inventoryModal');
        if (e.key === 'Escape' && inventoryModal && inventoryModal.classList.contains('active')) {
            closeInventoryModal();
        }
    });
}

// Setup shopping list event listeners
function setupShoppingListEventListeners() {
    const shoppingListBtn = document.getElementById('shoppingListBtn');
    const shoppingListModal = document.getElementById('shoppingListModal');
    const closeShoppingList = document.getElementById('closeShoppingList');
    const clearShoppingListBtn = document.getElementById('clearShoppingListBtn');
    const savePdfBtn = document.getElementById('savePdfBtn');

    if (shoppingListBtn) {
        shoppingListBtn.addEventListener('click', openShoppingList);
    }

    if (closeShoppingList) {
        closeShoppingList.addEventListener('click', closeShoppingListModal);
    }

    if (clearShoppingListBtn) {
        clearShoppingListBtn.addEventListener('click', clearShoppingList);
    }

    if (savePdfBtn) {
        savePdfBtn.addEventListener('click', saveShoppingListAsPdf);
    }

    if (shoppingListModal) {
        shoppingListModal.addEventListener('click', (e) => {
            if (e.target === shoppingListModal) {
                closeShoppingListModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        const shoppingListModal = document.getElementById('shoppingListModal');
        if (e.key === 'Escape' && shoppingListModal && shoppingListModal.classList.contains('active')) {
            closeShoppingListModal();
        }
    });
}

// Open inventory modal with quantity selection
// Open inventory modal with quantity selection
function openInventoryModal(categoryId) {
    const inventoryModal = document.getElementById('inventoryModal');
    const modalTitle = document.getElementById('modalTitle');
    const detailIcon = document.getElementById('detailIcon');
    const detailName = document.getElementById('detailName');
    const detailCategory = document.getElementById('detailCategory');
    const stockSummary = document.getElementById('stockSummary');
    const inventoryItemsList = document.getElementById('inventoryItemsList');
    
    if (!inventoryModal) return;
    
    const category = inventory.find(item => {
        const itemId = item.id || item.name.toLowerCase().replace(/\s+/g, '-');
        return itemId === categoryId;
    });
    
    if (!category) {
        console.error('Category not found:', categoryId);
        return;
    }
    
    const detailedItems = getDetailedInventoryItems(categoryId);
    console.log('Detailed items for modal:', detailedItems);
    
    // Update modal header
    modalTitle.textContent = `${category.name} Details`;
    detailIcon.innerHTML = category.icon;
    detailName.textContent = category.name;
    detailCategory.textContent = category.category;
    
    // Update stock summary - add safety check for detailedItems
    const lowStockCount = detailedItems ? detailedItems.filter(item => item.quantity < item.minStock).length : 0;
    const totalItems = detailedItems ? detailedItems.length : 0;
    
    stockSummary.textContent = `${totalItems} items • ${lowStockCount} need restocking`;
    stockSummary.className = `stock-summary ${lowStockCount > 0 ? 'stock-low' : 'stock-ok'}`;
    
    // Render detailed items with quantity selection - handle empty case
    if (!detailedItems || detailedItems.length === 0) {
        inventoryItemsList.innerHTML = `
            <div class="empty-items">
                <div class="icon">📦</div>
                <p>No detailed items found for this category</p>
                <p style="font-size: 14px; margin-top: 8px;">Check back later for updates</p>
            </div>
        `;
    } else {
        inventoryItemsList.innerHTML = detailedItems.map(item => {
            const isLowStock = item.quantity < item.minStock;
            const recommendedQty = Math.max(item.minStock - item.quantity, 1);
            
            return `
            <div class="inventory-item-detail ${isLowStock ? 'low-stock' : ''}">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">
                        Current: ${item.quantity} ${item.unit} (min: ${item.minStock})
                        ${isLowStock ? '<span class="low-stock-badge">LOW STOCK</span>' : ''}
                        ${isLowStock ? `<div class="recommended-quantity">Recommended: ${recommendedQty} ${item.unit}</div>` : ''}
                    </div>
                </div>
                <div class="item-actions">
                    <div class="quantity-selector">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="decreaseQuantity(this)">-</button>
                            <input type="number" class="quantity-input" value="${isLowStock ? recommendedQty : 1}" min="1" max="100" data-item='${JSON.stringify(item)}'>
                            <button class="quantity-btn" onclick="increaseQuantity(this)">+</button>
                        </div>
                        <button class="add-to-list-btn" onclick="addToShoppingList(this)">
                            Add to List
                        </button>
                    </div>
                </div>
            </div>
        `}).join('');
    }
    
    inventoryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Quantity control functions
function increaseQuantity(button) {
    const quantityInput = button.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(quantityInput.value) || 1;
    quantityInput.value = currentValue + 1;
}

function decreaseQuantity(button) {
    const quantityInput = button.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Add item to shopping list
function addToShoppingList(button) {
    const quantitySelector = button.closest('.quantity-selector');
    const quantityInput = quantitySelector.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value) || 1;
    const item = JSON.parse(quantityInput.dataset.item);
    
    const existingItemIndex = shoppingList.findIndex(i => i.name === item.name);
    
    if (existingItemIndex > -1) {
        // Update existing item quantity
        shoppingList[existingItemIndex].quantity += quantity;
        showToast(`Updated quantity of ${item.name} to ${shoppingList[existingItemIndex].quantity}`);
    } else {
        // Add new item to shopping list
        shoppingList.push({
            name: item.name,
            quantity: quantity,
            unit: item.unit,
            category: item.category || 'General',
            dateAdded: new Date().toISOString()
        });
        showToast(`Added ${item.name} to shopping list`);
    }
    
    updateShoppingCount();
}

// Update shopping count in the header
function updateShoppingCount() {
    const shoppingCount = document.getElementById('shoppingCount');
    if (shoppingCount) {
        const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0);
        shoppingCount.textContent = totalItems;
        shoppingCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Open shopping list modal
function openShoppingList() {
    const shoppingListModal = document.getElementById('shoppingListModal');
    if (!shoppingListModal) return;

    renderShoppingItems();
    shoppingListModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close shopping list modal
function closeShoppingListModal() {
    const shoppingListModal = document.getElementById('shoppingListModal');
    if (shoppingListModal) {
        shoppingListModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Render shopping items in the modal
function renderShoppingItems() {
    const shoppingItemsList = document.getElementById('shoppingItemsList');
    const totalShoppingItems = document.getElementById('totalShoppingItems');
    
    if (!shoppingItemsList) return;

    totalShoppingItems.textContent = shoppingList.reduce((sum, item) => sum + item.quantity, 0);

    if (shoppingList.length === 0) {
        shoppingItemsList.innerHTML = `
            <div class="empty-shopping-list">
                <div class="icon">📋</div>
                <p>No items in your shopping list</p>
                <p style="font-size: 14px; margin-top: 8px;">Add items from inventory details</p>
            </div>
        `;
        return;
    }

    shoppingItemsList.innerHTML = shoppingList.map((item, index) => `
        <div class="shopping-item">
            <div class="shopping-item-info">
                <div class="shopping-item-name">${item.name}</div>
                <div class="shopping-item-details">${item.category} • ${item.unit}</div>
            </div>
            <div class="shopping-item-actions">
                <div class="shopping-item-quantity">
                    <strong>${item.quantity}</strong>
                </div>
                <button class="remove-shopping-item" onclick="removeFromShoppingList(${index})" title="Remove item">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// Remove item from shopping list
function removeFromShoppingList(index) {
    if (shoppingList[index]) {
        const itemName = shoppingList[index].name;
        shoppingList.splice(index, 1);
        renderShoppingItems();
        updateShoppingCount();
        showToast(`Removed ${itemName} from shopping list`);
    }
}

// Clear entire shopping list
function clearShoppingList() {
    if (shoppingList.length === 0) {
        showToast('Shopping list is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear all items from the shopping list?')) {
        shoppingList = [];
        renderShoppingItems();
        updateShoppingCount();
        showToast('Shopping list cleared');
    }
}

// Save shopping list as PDF
function saveShoppingListAsPdf() {
    if (shoppingList.length === 0) {
        showToast('No items in shopping list to save');
        return;
    }
    
    try {
        // Use jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text('Animal Shelter Shopping List', 20, 30);
        
        // Date
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
        
        // Group items by category
        const groupedItems = {};
        shoppingList.forEach(item => {
            if (!groupedItems[item.category]) {
                groupedItems[item.category] = [];
            }
            groupedItems[item.category].push(item);
        });
        
        let yPosition = 65;
        
        // Add items by category
        Object.keys(groupedItems).forEach(category => {
            // Category header
            doc.setFontSize(14);
            doc.setTextColor(60, 60, 60);
            doc.text(category.toUpperCase() + ':', 20, yPosition);
            yPosition += 10;
            
            // Items in category
            doc.setFontSize(11);
            groupedItems[category].forEach(item => {
                const itemText = `☐ ${item.name} - ${item.quantity} ${item.unit}`;
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(itemText, 25, yPosition);
                yPosition += 7;
            });
            
            yPosition += 5; // Space between categories
        });
        
        // Total items
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(`Total items: ${shoppingList.length}`, 20, yPosition);
        
        // Save the PDF
        const fileName = `shopping-list-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        showToast(`Shopping list saved as PDF with ${shoppingList.length} items`);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        showToast('Error generating PDF. Please try again.');
        
        // Fallback: Save as text file
        saveShoppingListAsText();
    }
}

// Fallback: Save as text file
function saveShoppingListAsText() {
    const date = new Date().toLocaleDateString();
    let listContent = `Animal Shelter Shopping List\n`;
    listContent += `Generated on: ${date}\n`;
    listContent += `=================================\n\n`;
    
    // Group items by category
    const groupedItems = {};
    shoppingList.forEach(item => {
        if (!groupedItems[item.category]) {
            groupedItems[item.category] = [];
        }
        groupedItems[item.category].push(item);
    });
    
    // Add items by category
    Object.keys(groupedItems).forEach(category => {
        listContent += `${category.toUpperCase()}:\n`;
        groupedItems[category].forEach(item => {
            listContent += `☐ ${item.name} - ${item.quantity} ${item.unit}\n`;
        });
        listContent += '\n';
    });
    
    listContent += `Total items: ${shoppingList.length}`;
    
    // Create and download file
    const blob = new Blob([listContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Close inventory modal
function closeInventoryModal() {
    const inventoryModal = document.getElementById('inventoryModal');
    if (inventoryModal) {
        inventoryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Get detailed items for a category (keep your existing function)
// Get detailed items for a category
function getDetailedInventoryItems(categoryId) {
    console.log('Getting detailed items for:', categoryId);
    
    // Map your actual category IDs to detailed items
    const detailedInventory = {
        // Match the category IDs from your inventory data
        'hay-bales': [
            { name: "Timothy Hay", quantity: 8, unit: "bales", minStock: 15, status: "low" },
            { name: "Alfalfa Hay", quantity: 12, unit: "bales", minStock: 10, status: "ok" },
            { name: "Orchard Grass", quantity: 5, unit: "bales", minStock: 8, status: "low" },
            { name: "Oat Hay", quantity: 18, unit: "bales", minStock: 12, status: "ok" }
        ],
        'raw-meat': [
            { name: "Chicken Breast", quantity: 12, unit: "kg", minStock: 15, status: "low" },
            { name: "Ground Beef", quantity: 18, unit: "kg", minStock: 15, status: "ok" },
            { name: "Turkey", quantity: 20, unit: "kg", minStock: 15, status: "ok" },
            { name: "Salmon Fillets", quantity: 14, unit: "kg", minStock: 10, status: "ok" }
        ],
        'vegetables': [
            { name: "Carrots", quantity: 15, unit: "kg", minStock: 20, status: "low" },
            { name: "Broccoli", quantity: 8, unit: "kg", minStock: 10, status: "low" },
            { name: "Spinach", quantity: 12, unit: "kg", minStock: 15, status: "low" },
            { name: "Potatoes", quantity: 25, unit: "kg", minStock: 20, status: "ok" },
            { name: "Bell Peppers", quantity: 18, unit: "kg", minStock: 15, status: "ok" }
        ],
        'medical-supplies': [
            { name: "Bandages", quantity: 8, unit: "packs", minStock: 15, status: "low" },
            { name: "Antiseptic Solution", quantity: 3, unit: "bottles", minStock: 10, status: "low" },
            { name: "Syringes", quantity: 12, unit: "boxes", minStock: 20, status: "low" },
            { name: "Gloves", quantity: 5, unit: "boxes", minStock: 10, status: "low" },
            { name: "Pain Medication", quantity: 18, unit: "bottles", minStock: 15, status: "ok" }
        ],
        'nectar-blend': [
            { name: "Classic Nectar", quantity: 8, unit: "liters", minStock: 15, status: "low" },
            { name: "Fruit Blend", quantity: 12, unit: "liters", minStock: 10, status: "ok" },
            { name: "Energy Mix", quantity: 5, unit: "liters", minStock: 8, status: "low" },
            { name: "Vitamin Enriched", quantity: 18, unit: "liters", minStock: 12, status: "ok" }
        ],
        'enrichment-toys': [
            { name: "Chew Toys", quantity: 18, unit: "pieces", minStock: 25, status: "low" },
            { name: "Balls", quantity: 30, unit: "pieces", minStock: 20, status: "ok" },
            { name: "Puzzle Feeders", quantity: 12, unit: "pieces", minStock: 15, status: "low" },
            { name: "Rope Toys", quantity: 22, unit: "pieces", minStock: 18, status: "ok" }
        ]
    };
    
    // Try to find matching category
    const items = detailedInventory[categoryId];
    console.log('Found items:', items);
    
    // Return empty array instead of undefined if no items found
    return items || [];
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize inventory page when page loads
if (document.getElementById('inventory-section')) {
    document.addEventListener('DOMContentLoaded', initializeInventory);
}