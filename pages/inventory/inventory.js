(function() {
    'use strict';
    
    // Global shopping list
    let shoppingList = [];
    
    // DOM Elements cache
    let elements = {};
    
    // Initialize inventory
    function initializeInventory() {
        console.log('Initializing inventory...');
        
        // Cache DOM elements
        cacheElements();
        
        // Render inventory categories
        renderInventoryCategories();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update shopping count
        updateShoppingCount();
    }
    
    // Cache DOM elements
    function cacheElements() {
        elements = {
            categoryFilters: document.getElementById('categoryFilters'),
            inventoryGrid: document.getElementById('inventoryGrid'),
            shoppingListBtn: document.getElementById('shoppingListBtn'),
            shoppingCount: document.getElementById('shoppingCount'),
            inventoryModal: document.getElementById('inventoryModal'),
            closeModal: document.getElementById('closeModal'),
            shoppingListModal: document.getElementById('shoppingListModal'),
            closeShoppingList: document.getElementById('closeShoppingList'),
            clearShoppingListBtn: document.getElementById('clearShoppingListBtn'),
            savePdfBtn: document.getElementById('savePdfBtn'),
            modalTitle: document.getElementById('modalTitle'),
            detailIcon: document.getElementById('detailIcon'),
            detailName: document.getElementById('detailName'),
            detailCategory: document.getElementById('detailCategory'),
            stockSummary: document.getElementById('stockSummary'),
            inventoryItemsContainer: document.getElementById('inventoryItemsContainer'),
            shoppingListDate: document.getElementById('shoppingListDate'),
            totalItemsCount: document.getElementById('totalItemsCount'),
            totalCategoriesCount: document.getElementById('totalCategoriesCount'),
            shoppingItemsContainer: document.getElementById('shoppingItemsContainer'),
            pdfPreviewModal: document.getElementById('pdfPreviewModal'),
            closePdfPreview: document.getElementById('closePdfPreview'),
            pdfPreviewContent: document.getElementById('pdfPreviewContent'),
            previewDate: document.getElementById('previewDate'),
            cancelPdfBtn: document.getElementById('cancelPdfBtn'),
            downloadPdfBtn: document.getElementById('downloadPdfBtn'),
            toast: document.getElementById('toast')
        };
        
        console.log('Elements cached:', Object.keys(elements));
    }
    
    // Render inventory categories using DOM manipulation
    function renderInventoryCategories() {
        if (!elements.categoryFilters || !elements.inventoryGrid) return;
        
        // Clear existing content
        elements.categoryFilters.innerHTML = '';
        elements.inventoryGrid.innerHTML = '';
        
        // Get unique categories from inventory data
        const categories = [...new Set(inventory.map(item => item.category))];
        
        // Create "All Categories" button
        const allBtn = createCategoryFilterButton('all', '📦', 'All Categories', true);
        elements.categoryFilters.appendChild(allBtn);
        
        // Create category filter buttons
        categories.forEach(category => {
            const icon = getCategoryIcon(category);
            const btn = createCategoryFilterButton(
                category.toLowerCase().replace(/\s+/g, '-'),
                icon,
                category,
                false
            );
            elements.categoryFilters.appendChild(btn);
        });
        
        // Create category containers
        categories.forEach(category => {
            const categoryContainer = createCategoryContainer(category);
            elements.inventoryGrid.appendChild(categoryContainer);
        });
    }
    
    // Create category filter button using DOM
    function createCategoryFilterButton(category, icon, text, isActive) {
        const button = document.createElement('button');
        button.className = 'category-filter-btn';
        button.dataset.category = category;
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'filter-icon';
        iconSpan.textContent = icon;
        
        const textSpan = document.createElement('span');
        textSpan.className = 'filter-text';
        textSpan.textContent = text;
        
        button.appendChild(iconSpan);
        button.appendChild(textSpan);
        
        if (isActive) {
            button.classList.add('active');
        }
        
        return button;
    }
    
    // Create category container using DOM
    function createCategoryContainer(category) {
        const categoryItems = inventory.filter(item => item.category === category);
        const lowStockCount = categoryItems.filter(item => item.stock < item.min).length;
        const okCount = categoryItems.length - lowStockCount;
        const config = getCategoryConfig(category);
        
        // Create container div
        const container = document.createElement('div');
        container.className = 'category-container';
        container.dataset.category = category.toLowerCase().replace(/\s+/g, '-');
        
        // Create header
        const header = document.createElement('div');
        header.className = 'category-container-header';
        
        // Create header left section
        const headerLeft = document.createElement('div');
        headerLeft.className = 'category-header-left';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'category-icon-large';
        iconDiv.textContent = config.icon;
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'category-info';
        
        const title = document.createElement('h3');
        title.className = 'category-title';
        title.textContent = category;
        
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'category-summary';
        
        // Low stock stat
        const lowStat = document.createElement('span');
        lowStat.className = 'category-stat low';
        
        const lowIcon = document.createElement('span');
        lowIcon.textContent = '⚠️';
        
        const lowText = document.createElement('span');
        lowText.textContent = ` ${lowStockCount} need restocking`;
        
        lowStat.appendChild(lowIcon);
        lowStat.appendChild(lowText);
        
        // OK stock stat
        const okStat = document.createElement('span');
        okStat.className = 'category-stat ok';
        
        const okIcon = document.createElement('span');
        okIcon.textContent = '✅';
        
        const okText = document.createElement('span');
        okText.textContent = ` ${okCount} in stock`;
        
        okStat.appendChild(okIcon);
        okStat.appendChild(okText);
        
        // Assemble summary
        summaryDiv.appendChild(lowStat);
        summaryDiv.appendChild(okStat);
        
        // Assemble info
        infoDiv.appendChild(title);
        infoDiv.appendChild(summaryDiv);
        
        // Assemble header left
        headerLeft.appendChild(iconDiv);
        headerLeft.appendChild(infoDiv);
        
        // Assemble header
        header.appendChild(headerLeft);
        
        // Create items container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'category-items-container';
        
        // Add inventory items
        categoryItems.forEach(item => {
            const itemElement = createInventoryItem(item);
            itemsContainer.appendChild(itemElement);
        });
        
        // Assemble container
        container.appendChild(header);
        container.appendChild(itemsContainer);
        
        return container;
    }
    
    // Create inventory item using DOM
    function createInventoryItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        
        // Generate ID from name (create slug: "Medical Supplies" -> "medical-supplies")
        const itemId = item.name.toLowerCase().replace(/\s+/g, '-');
        itemDiv.dataset.itemId = itemId;
        
        // Icon
        const iconDiv = document.createElement('div');
        iconDiv.className = 'inventory-icon';
        iconDiv.textContent = item.icon;
        
        // Details
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'inventory-details';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'inventory-name';
        nameDiv.textContent = item.name;
        
        detailsDiv.appendChild(nameDiv);
        
        // Stock status
        const stockDiv = document.createElement('div');
        stockDiv.className = 'inventory-stock';
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `stock-status ${item.stock < item.min ? 'stock-low' : 'stock-ok'}`;
        statusDiv.textContent = item.stock < item.min ? 'Alert' : 'Good';
        
        stockDiv.appendChild(statusDiv);
        
        // Assemble item
        itemDiv.appendChild(iconDiv);
        itemDiv.appendChild(detailsDiv);
        itemDiv.appendChild(stockDiv);
        
        return itemDiv;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Category filter buttons
        if (elements.categoryFilters) {
            elements.categoryFilters.addEventListener('click', handleCategoryFilter);
        }
        
        // Inventory items
        if (elements.inventoryGrid) {
            elements.inventoryGrid.addEventListener('click', handleInventoryItemClick);
        }
        
        // Shopping list button
        if (elements.shoppingListBtn) {
            elements.shoppingListBtn.addEventListener('click', openShoppingList);
        }
        
        // Modal close buttons
        if (elements.closeModal) {
            elements.closeModal.addEventListener('click', closeInventoryModal);
        }
        
        if (elements.closeShoppingList) {
            elements.closeShoppingList.addEventListener('click', closeShoppingListModal);
        }
        
        // Shopping list actions
        if (elements.clearShoppingListBtn) {
            elements.clearShoppingListBtn.addEventListener('click', clearShoppingList);
        }
        
        // PDF BUTTONS - CRITICAL PART!
        if (elements.savePdfBtn) {
            console.log('Setting up savePdfBtn click handler');
            elements.savePdfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('📄 Generate PDF button clicked!');
                previewShoppingListPdf();
            });
        }
        
        if (elements.downloadPdfBtn) {
            elements.downloadPdfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('📥 Download PDF button clicked');
                saveShoppingListAsPdf();
            });
        }
        
        if (elements.cancelPdfBtn) {
            elements.cancelPdfBtn.addEventListener('click', closePdfPreview);
        }
        
        if (elements.closePdfPreview) {
            elements.closePdfPreview.addEventListener('click', closePdfPreview);
        }
        
        // Event delegation for dynamic elements
        document.addEventListener('click', handleDynamicElements);
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeInventoryModal();
                closeShoppingListModal();
                closePdfPreview();
            }
        });
        
        // Close modals on outside click
        document.addEventListener('click', (e) => {
            if (elements.pdfPreviewModal && e.target === elements.pdfPreviewModal) {
                closePdfPreview();
            }
        });
    }
    
    // Handle dynamic elements (event delegation)
    function handleDynamicElements(e) {
        // Close modals on outside click
        if (elements.inventoryModal && e.target === elements.inventoryModal) {
            closeInventoryModal();
        }
        
        if (elements.shoppingListModal && e.target === elements.shoppingListModal) {
            closeShoppingListModal();
        }
        
        // Quantity buttons in inventory modal
        if (e.target.classList.contains('quantity-btn')) {
            handleQuantityButton(e.target);
        }
        
        // Add to list buttons
        if (e.target.classList.contains('add-to-list-btn')) {
            handleAddToList(e.target);
        }
        
        // Remove shopping item buttons
        if (e.target.classList.contains('shopping-item-remove')) {
            const itemElement = e.target.closest('.shopping-category-item');
            if (itemElement) {
                const index = Array.from(itemElement.parentElement.children).indexOf(itemElement);
                removeFromShoppingList(index);
            }
        }
    }
    
    // Event handlers
    function handleCategoryFilter(e) {
        const button = e.target.closest('.category-filter-btn');
        if (!button) return;
        
        // Update active state
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Filter categories
        const category = button.dataset.category;
        document.querySelectorAll('.category-container').forEach(container => {
            const containerCategory = container.getAttribute('data-category');
            if (category === 'all' || containerCategory === category) {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
            }
        });
    }
    
    function handleInventoryItemClick(e) {
        const inventoryItem = e.target.closest('.inventory-item');
        if (inventoryItem) {
            // Try to get item name from the DOM element
            const itemNameElement = inventoryItem.querySelector('.inventory-name');
            if (itemNameElement) {
                const itemName = itemNameElement.textContent;
                // Convert to slug for ID lookup
                const itemId = itemName.toLowerCase().replace(/\s+/g, '-');
                openInventoryModal(itemId);
            }
        }
    }
    
    function handleQuantityButton(button) {
        const quantityInput = button.closest('.quantity-controls').querySelector('.quantity-input');
        const currentValue = parseInt(quantityInput.value) || 1;
        
        if (button.classList.contains('increase')) {
            quantityInput.value = currentValue + 1;
        } else if (button.classList.contains('decrease')) {
            quantityInput.value = Math.max(1, currentValue - 1);
        }
    }
    
    function handleAddToList(button) {
        const quantityInput = button.closest('.quantity-selector').querySelector('.quantity-input');
        const itemData = quantityInput.dataset.item;
        
        if (!itemData) return;
        
        const item = JSON.parse(itemData);
        const quantity = parseInt(quantityInput.value) || 1;
        
        addItemToShoppingList(item, quantity);
    }
    
    function openInventoryModal(itemId) {
        console.log('Looking for item with ID (slug):', itemId);
        
        // Convert slug to name: "medical-supplies" → "Medical Supplies"
        const itemName = itemId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        console.log('Looking for item with name:', itemName);
        
        // Find by name (since your data doesn't have IDs)
        const item = inventory.find(i => i.name === itemName);
        
        if (!item) {
            console.error('❌ Item not found! Showing empty modal.');
            elements.modalTitle.textContent = 'Item Not Found';
            elements.detailName.textContent = 'ID: ' + itemId;
            elements.inventoryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            return;
        }
        
        console.log('✅ Found item:', item);
        
        // Get detailed items
        const detailedItems = getDetailedInventoryItems(itemId);
        console.log('Detailed items:', detailedItems);
        
        // Update modal content
        elements.modalTitle.textContent = `${item.name} Details`;
        elements.detailIcon.textContent = item.icon;
        elements.detailName.textContent = item.name;
        elements.detailCategory.textContent = item.category;
        
        // Update stock summary
        const lowStockCount = detailedItems.filter(d => d.quantity < d.minStock).length;
        elements.stockSummary.textContent = `${detailedItems.length} items • ${lowStockCount} need restocking`;
        elements.stockSummary.className = `stock-summary ${lowStockCount > 0 ? 'stock-low' : 'stock-ok'}`;
        
        // Clear and populate items
        elements.inventoryItemsContainer.innerHTML = '';
        detailedItems.forEach(detail => {
            const itemElement = createInventoryDetailItem(detail);
            elements.inventoryItemsContainer.appendChild(itemElement);
        });
        
        // Show modal
        elements.inventoryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Modal should be visible!');
    }
    
    // Create inventory detail item using DOM
    function createInventoryDetailItem(detail) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item-detail';
        
        if (detail.quantity < detail.minStock) {
            itemDiv.classList.add('low-stock');
        }
        
        // Item info section
        const infoDiv = document.createElement('div');
        infoDiv.className = 'item-info';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'item-name';
        nameDiv.textContent = detail.name;
        
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'item-quantity';
        
        const currentSpan = document.createElement('span');
        currentSpan.className = 'current-stock';
        currentSpan.textContent = `Current: ${detail.quantity} ${detail.unit}`;
        
        const minSpan = document.createElement('span');
        minSpan.className = 'min-stock';
        minSpan.textContent = ` (min: ${detail.minStock})`;
        
        quantityDiv.appendChild(currentSpan);
        quantityDiv.appendChild(minSpan);
        
        // Low stock badge
        const lowStockBadge = document.createElement('span');
        lowStockBadge.className = 'low-stock-badge';
        lowStockBadge.textContent = 'LOW STOCK';
        lowStockBadge.style.display = detail.quantity < detail.minStock ? 'inline' : 'none';
        
        quantityDiv.appendChild(lowStockBadge);
        
        // Recommended quantity
        if (detail.quantity < detail.minStock) {
            const recommendedDiv = document.createElement('div');
            recommendedDiv.className = 'recommended-quantity';
            const recommendedQty = Math.max(detail.minStock - detail.quantity, 1);
            recommendedDiv.textContent = `Recommended: ${recommendedQty} ${detail.unit}`;
            quantityDiv.appendChild(recommendedDiv);
        }
        
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(quantityDiv);
        
        // Item actions section
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';
        
        const quantitySelector = document.createElement('div');
        quantitySelector.className = 'quantity-selector';
        
        const quantityControls = document.createElement('div');
        quantityControls.className = 'quantity-controls';
        
        // Decrease button
        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'quantity-btn decrease';
        decreaseBtn.textContent = '-';
        
        // Quantity input
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.className = 'quantity-input';
        quantityInput.value = detail.quantity < detail.minStock ? 
            Math.max(detail.minStock - detail.quantity, 1) : 1;
        quantityInput.min = 1;
        quantityInput.max = 100;
        quantityInput.dataset.item = JSON.stringify(detail);
        
        // Increase button
        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'quantity-btn increase';
        increaseBtn.textContent = '+';
        
        // Add to list button
        const addBtn = document.createElement('button');
        addBtn.className = 'add-to-list-btn';
        addBtn.textContent = 'Add to List';
        
        // Assemble quantity controls
        quantityControls.appendChild(decreaseBtn);
        quantityControls.appendChild(quantityInput);
        quantityControls.appendChild(increaseBtn);
        
        // Assemble quantity selector
        quantitySelector.appendChild(quantityControls);
        quantitySelector.appendChild(addBtn);
        
        // Assemble actions
        actionsDiv.appendChild(quantitySelector);
        
        // Assemble item
        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(actionsDiv);
        
        return itemDiv;
    }
    
    // Open shopping list
    function openShoppingList() {
        updateShoppingListUI();
        elements.shoppingListModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Update shopping list UI
    function updateShoppingListUI() {
        // Update date
        elements.shoppingListDate.textContent = 
            new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
            });
        
        // Update summary
        const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0);
        const categories = [...new Set(shoppingList.map(item => item.category))];
        
        elements.totalItemsCount.textContent = totalItems;
        elements.totalCategoriesCount.textContent = categories.length;
        
        // Update shopping items container
        elements.shoppingItemsContainer.innerHTML = '';
        
        if (shoppingList.length === 0) {
            createEmptyShoppingList();
        } else {
            // Group by category and render
            const groupedItems = shoppingList.reduce((groups, item) => {
                if (!groups[item.category]) groups[item.category] = [];
                groups[item.category].push(item);
                return groups;
            }, {});
            
            Object.entries(groupedItems).forEach(([category, items]) => {
                const categoryElement = createShoppingCategory(category, items);
                elements.shoppingItemsContainer.appendChild(categoryElement);
            });
        }
    }
    
    // Create empty shopping list message
    function createEmptyShoppingList() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-shopping-list';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.textContent = '📋';
        
        const title = document.createElement('h3');
        title.textContent = 'Your shopping list is empty';
        
        const message = document.createElement('p');
        message.textContent = 'Add items from inventory details by clicking on categories';
        
        emptyDiv.appendChild(iconDiv);
        emptyDiv.appendChild(title);
        emptyDiv.appendChild(message);
        
        elements.shoppingItemsContainer.appendChild(emptyDiv);
    }
    
    // Create shopping category using DOM
    function createShoppingCategory(category, items) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'shopping-category';
        
        const color = getCategoryColor(category);
        categoryDiv.style.borderLeft = `4px solid ${color}`;
        
        // Category header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'shopping-category-header';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'shopping-category-name';
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'shopping-category-icon';
        iconDiv.textContent = getCategoryIcon(category);
        
        const nameText = document.createElement('span');
        nameText.className = 'category-name-text';
        nameText.textContent = category;
        
        nameDiv.appendChild(iconDiv);
        nameDiv.appendChild(nameText);
        
        const countDiv = document.createElement('div');
        countDiv.className = 'shopping-category-count';
        
        const countText = document.createElement('span');
        countText.className = 'item-count';
        countText.textContent = items.length;
        countText.textContent += ' items';
        
        countDiv.appendChild(countText);
        
        headerDiv.appendChild(nameDiv);
        headerDiv.appendChild(countDiv);
        
        // Items container
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'shopping-category-items';
        
        // Add items
        items.forEach((item, index) => {
            const itemElement = createShoppingItem(item, index);
            itemsContainer.appendChild(itemElement);
        });
        
        // Assemble category
        categoryDiv.appendChild(headerDiv);
        categoryDiv.appendChild(itemsContainer);
        
        return categoryDiv;
    }
    
    // Create shopping item using DOM
    function createShoppingItem(item, index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shopping-category-item';
        
        // Item name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'shopping-item-name';
        nameDiv.textContent = item.name;
        
        // Quantity badge
        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'shopping-item-quantity-badge';
        
        const quantityDiv = document.createElement('div');
        quantityDiv.className = 'shopping-item-quantity';
        quantityDiv.textContent = `${item.quantity} ${item.unit}`;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'shopping-item-remove';
        removeBtn.title = 'Remove item';
        removeBtn.textContent = '🗑️';
        removeBtn.dataset.index = index;
        
        badgeDiv.appendChild(quantityDiv);
        badgeDiv.appendChild(removeBtn);
        
        // Assemble item
        itemDiv.appendChild(nameDiv);
        itemDiv.appendChild(badgeDiv);
        
        return itemDiv;
    }
    
    // Shopping list functions
    function addItemToShoppingList(item, quantity) {
        const existingIndex = shoppingList.findIndex(i => i.name === item.name);
        
        if (existingIndex > -1) {
            shoppingList[existingIndex].quantity += quantity;
            showToast(`Updated ${item.name} quantity to ${shoppingList[existingIndex].quantity}`);
        } else {
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
    
    function removeFromShoppingList(index) {
        if (index >= 0 && index < shoppingList.length) {
            const itemName = shoppingList[index].name;
            shoppingList.splice(index, 1);
            updateShoppingListUI();
            updateShoppingCount();
            showToast(`Removed ${itemName} from shopping list`);
        }
    }
    
    function clearShoppingList() {
        if (shoppingList.length === 0) {
            showToast('Shopping list is already empty');
            return;
        }
        
        if (confirm('Are you sure you want to clear all items from the shopping list?')) {
            shoppingList = [];
            updateShoppingListUI();
            updateShoppingCount();
            showToast('Shopping list cleared');
        }
    }
    
    function updateShoppingCount() {
        if (elements.shoppingCount) {
            const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0);
            elements.shoppingCount.textContent = totalItems;
            elements.shoppingCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // Close modals
    function closeInventoryModal() {
        if (elements.inventoryModal) {
            elements.inventoryModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function closeShoppingListModal() {
        if (elements.shoppingListModal) {
            elements.shoppingListModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
function previewShoppingListPdf() {
    console.log('🎯 previewShoppingListPdf function called!');
    console.log('📊 Shopping list items:', shoppingList.length);
    
    if (shoppingList.length === 0) {
        showToast('No items in shopping list to preview');
        return;
    }
    
    // First, close any other open modals
    closeInventoryModal();
    closeShoppingListModal();
    
    // Update preview date
    const now = new Date();
    if (elements.previewDate) {
        elements.previewDate.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Generate preview HTML
    const previewHtml = generatePdfPreviewHtml();
    console.log('✅ Generated preview HTML');
    
    if (elements.pdfPreviewContent) {
        elements.pdfPreviewContent.innerHTML = previewHtml;
        console.log('✅ Updated preview content');
    }
    
    // ================= VERTICAL CENTERING ONLY =================
    // Only vertical center, keep horizontal alignment as is
    
    // 1. Apply styles to FORCE vertical centering
    elements.pdfPreviewModal.style.cssText = `
    display: flex !important;
    position: fixed !important;
    top: 0px !important;
    left: 0px !important;
    width: 100vw !important;
    height: 100vh !important;
    align-items: center !important;           /* Vertical center */
    justify-content: center !important;       /* Horizontal center - CHANGED THIS LINE */
    background: rgba(0, 0, 0, 0.95) !important;
    backdrop-filter: blur(10px) !important;
    z-index: 99999 !important;
    opacity: 1 !important;
    visibility: visible !important;
    pointer-events: all !important;
    padding: 20px !important;
    margin: 0px !important;
    box-sizing: border-box !important;
    `;
    
    // 2. Force body styles to prevent scrolling
    document.body.style.cssText = `
        overflow: hidden !important;
        position: fixed !important;
        width: 100% !important;
        height: 100% !important;
    `;
    
    // 3. Get modal content and center it VERTICALLY ONLY
    const modalContent = elements.pdfPreviewModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.cssText = `
            /* Display & Position */
            display: block !important;
            position: relative !important;
            
            /* VERTICAL CENTERING - NO horizontal centering */
            margin: 0 !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            
            /* Sizing */
            width: 90% !important;
            max-width: 800px !important;
            max-height: 90vh !important;
            min-height: 400px !important;
            
            /* Appearance */
            background: white !important;
            border-radius: 20px !important;
            box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6) !important;
            
            /* Visibility */
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: all !important;
            
            /* Overflow & Layout */
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
        `;
        
        // Center modal content vertically within the modal
        modalContent.style.alignSelf = 'center !important';
    }
    
    // 4. Ensure modal body takes remaining space
    const modalBody = elements.pdfPreviewModal.querySelector('.modal-body');
    if (modalBody) {
        modalBody.style.cssText = `
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            opacity: 1 !important;
            visibility: visible !important;
            max-height: calc(90vh - 70px) !important;
            overflow-y: auto !important;
            padding: 24px !important;
            width: 100% !important;
            box-sizing: border-box !important;
        `;
    }
    
    // 5. Center the PDF preview content VERTICALLY ONLY
    if (elements.pdfPreviewContent) {
        elements.pdfPreviewContent.style.cssText = `
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            box-sizing: border-box !important;
        `;
        
        // Style the PDF container
        const pdfContainer = elements.pdfPreviewContent.querySelector('.pdf-preview-container');
        if (pdfContainer) {
            pdfContainer.style.cssText = `
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                text-align: left !important;  /* Keep text left-aligned */
                background: white !important;
                border-radius: 12px !important;
                padding: 24px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
                box-sizing: border-box !important;
            `;
        }
    }
    
    // 6. Add active class
    elements.pdfPreviewModal.classList.add('active');
    
    console.log('✅ PDF preview modal shown (vertically centered)');
}
    
    function debugModalVisibility() {
    console.log('=== MODAL VISIBILITY DEBUG ===');
    console.log('1. pdfPreviewModal exists:', !!elements.pdfPreviewModal);
    console.log('2. Has "active" class:', elements.pdfPreviewModal.classList.contains('active'));
    
    const style = window.getComputedStyle(elements.pdfPreviewModal);
    console.log('3. Computed styles:');
    console.log('   - display:', style.display);
    console.log('   - visibility:', style.visibility);
    console.log('   - opacity:', style.opacity);
    console.log('   - z-index:', style.zIndex);
    console.log('   - position:', style.position);
    
    // Check if any parent is hidden
    let parent = elements.pdfPreviewModal.parentElement;
    let depth = 0;
    while (parent && depth < 10) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.display === 'none') {
            console.log(`4. Parent at depth ${depth} is hidden:`, parent);
        }
        parent = parent.parentElement;
        depth++;
    }
}

    // GENERATE PDF PREVIEW HTML
    function generatePdfPreviewHtml() {
        console.log('🔄 Generating PDF preview HTML...');
        
        if (shoppingList.length === 0) {
            return `
                <div class="pdf-empty-state">
                    <div class="icon">📋</div>
                    <h3>No items in shopping list</h3>
                    <p>Add items from inventory to preview the PDF</p>
                </div>
            `;
        }
        
        // Group items by category
        const groupedItems = shoppingList.reduce((groups, item) => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
            return groups;
        }, {});
        
        // Calculate totals
        const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0);
        const categories = Object.keys(groupedItems).length;
        
        // Generate HTML for categories
        let categoriesHtml = '';
        Object.entries(groupedItems).forEach(([category, items]) => {
            const icon = getCategoryIcon(category);
            
            let itemsHtml = '';
            items.forEach(item => {
                itemsHtml += `
                    <div class="pdf-preview-item">
                        <div class="pdf-item-name">${item.name}</div>
                        <div class="pdf-item-qty">${item.quantity} ${item.unit}</div>
                    </div>
                `;
            });
            
            categoriesHtml += `
                <div class="pdf-category-section">
                    <div class="pdf-category-title">
                        <span class="pdf-category-icon">${icon}</span>
                        <span>${category}</span>
                    </div>
                    <div class="pdf-category-items">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        });
        
        return `
            <div class="pdf-preview-container">
                <div class="pdf-header">
                    <h2 class="pdf-title">Animal Shelter Shopping List</h2>
                    <p class="pdf-date">Generated on: ${new Date().toLocaleDateString()}</p>
                </div>
                
                <div class="pdf-stats">
                    <div class="pdf-stat">
                        <div class="pdf-stat-value">${totalItems}</div>
                        <div class="pdf-stat-label">Total Items</div>
                    </div>
                    <div class="pdf-stat">
                        <div class="pdf-stat-value">${categories}</div>
                        <div class="pdf-stat-label">Categories</div>
                    </div>
                </div>
                
                <div class="pdf-content">
                    ${categoriesHtml}
                </div>
                
                <div class="pdf-footer">
                    <p>Generated by PawShelter Inventory Management System</p>
                </div>
            </div>
        `;
    }
    
    // CLOSE PDF PREVIEW
    function closePdfPreview() {
        console.log('Closing PDF preview (brute force)');
        
        // Remove inline styles
        elements.pdfPreviewModal.style.cssText = '';
        elements.pdfPreviewModal.classList.remove('active');
        
        // Reset modal content styles
        const modalContent = elements.pdfPreviewModal.querySelector('.modal-content');
        if (modalContent) modalContent.style.cssText = '';
        
        const modalHeader = elements.pdfPreviewModal.querySelector('.modal-header');
        if (modalHeader) modalHeader.style.cssText = '';
        
        const modalBody = elements.pdfPreviewModal.querySelector('.modal-body');
        if (modalBody) modalBody.style.cssText = '';
        
        // Reset body styles
        document.body.style.cssText = '';
        
        document.body.style.overflow = '';
    }
        
    // SAVE SHOPPING LIST AS PDF
    function saveShoppingListAsPdf() {
        console.log('📄 saveShoppingListAsPdf function called');
        
        if (shoppingList.length === 0) {
            showToast('No items in shopping list to save');
            return;
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add logo/header
            doc.setFillColor(79, 70, 229); // #4f46e5
            doc.rect(0, 0, 210, 40, 'F');
            
            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('Animal Shelter Shopping List', 105, 25, { align: 'center' });
            
            // Date
            doc.setTextColor(255, 255, 255, 0.9);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });
            
            // Reset text color
            doc.setTextColor(0, 0, 0);
            
            // Summary section
            const totalItems = shoppingList.reduce((sum, item) => sum + item.quantity, 0);
            const categories = [...new Set(shoppingList.map(item => item.category))].length;
            
            doc.setFontSize(12);
            doc.text('Summary:', 20, 55);
            
            // Summary boxes
            doc.setFillColor(249, 250, 251); // #f9fafb
            doc.roundedRect(20, 60, 55, 20, 3, 3, 'F');
            doc.roundedRect(80, 60, 55, 20, 3, 3, 'F');
            doc.roundedRect(140, 60, 55, 20, 3, 3, 'F');
            
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(totalItems.toString(), 47, 72, { align: 'center' });
            doc.text(categories.toString(), 107, 72, { align: 'center' });
            doc.text(shoppingList.length.toString(), 167, 72, { align: 'center' });
            
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('Total Items', 47, 77, { align: 'center' });
            doc.text('Categories', 107, 77, { align: 'center' });
            doc.text('Unique Items', 167, 77, { align: 'center' });
            
            // Group items by category
            const groupedItems = shoppingList.reduce((groups, item) => {
                if (!groups[item.category]) groups[item.category] = [];
                groups[item.category].push(item);
                return groups;
            }, {});
            
            let yPosition = 90;
            
            // Add items by category
            Object.entries(groupedItems).forEach(([category, items]) => {
                // Check if we need a new page
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                // Category header
                doc.setFillColor(79, 70, 229); // #4f46e5
                doc.roundedRect(20, yPosition, 170, 8, 2, 2, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(category, 25, yPosition + 5.5);
                
                yPosition += 12;
                
                // Items in category
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                
                items.forEach((item, index) => {
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    // Item name with checkbox
                    doc.text(`☐ ${item.name}`, 25, yPosition);
                    
                    // Quantity
                    doc.setFont('helvetica', 'bold');
                    doc.text(`${item.quantity} ${item.unit}`, 170, yPosition, { align: 'right' });
                    doc.setFont('helvetica', 'normal');
                    
                    yPosition += 7;
                    
                    // Add subtle separator between items
                    if (index < items.length - 1) {
                        doc.setDrawColor(229, 231, 235); // #e5e7eb
                        doc.line(25, yPosition - 1, 185, yPosition - 1);
                        yPosition += 2;
                    }
                });
                
                yPosition += 10; // Space between categories
            });
            
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(107, 114, 128); // #6b7280
            doc.text('Generated by PawShelter Inventory Management System', 105, 285, { align: 'center' });
            
            // Save the PDF
            const fileName = `shopping-list-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            // Close preview modal
            closePdfPreview();
            
            showToast(`PDF downloaded with ${shoppingList.length} items`);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            showToast('Error generating PDF. Please try again.');
        }
    }
    
    // Helper functions
    function getCategoryIcon(category) {
        const iconMap = {
            'Feed': '🌱',
            'Food Supplies': '🍎',
            'Health': '🏥',
            'Medical': '💊',
            'Animal Care': '🐾',
            'Shelter Operations': '🏠',
            'Facility': '🏢'
        };
        return iconMap[category] || '📦';
    }
    
    function getCategoryConfig(category) {
        const config = {
            'Feed': { icon: '🌱', color: '#4299e1' },
            'Food Supplies': { icon: '🍎', color: '#4299e1' },
            'Health': { icon: '🏥', color: '#ed64a6' },
            'Medical': { icon: '💊', color: '#ed64a6' },
            'Animal Care': { icon: '🐾', color: '#48bb78' },
            'Shelter Operations': { icon: '🏠', color: '#9f7aea' },
            'Facility': { icon: '🏢', color: '#38b2ac' }
        };
        return config[category] || { icon: '📦', color: '#667eea' };
    }
    
    function getCategoryColor(category) {
        const colorMap = {
            'Feed': '#4299e1',
            'Food Supplies': '#4299e1',
            'Health': '#ed64a6',
            'Medical': '#ed64a6',
            'Animal Care': '#48bb78',
            'Shelter Operations': '#9f7aea',
            'Facility': '#38b2ac',
            'General': '#667eea'
        };
        return colorMap[category] || '#667eea';
    }
    
    function showToast(message) {
        if (elements.toast) {
            elements.toast.textContent = message;
            elements.toast.classList.add('show');
            
            setTimeout(() => {
                elements.toast.classList.remove('show');
            }, 3000);
        }
    }
    
    // Get detailed inventory items
    function getDetailedInventoryItems(categoryId) {
        console.log('Getting detailed items for:', categoryId);
        
        const detailedInventory = {
            'hay-bales': [
                { name: "Timothy Hay", quantity: 8, unit: "bales", minStock: 10, category: "Feed", status: "low" },
                { name: "Alfalfa Hay", quantity: 12, unit: "bales", minStock: 10, category: "Feed", status: "ok" },
                { name: "Orchard Grass", quantity: 5, unit: "bales", minStock: 10, category: "Feed", status: "low" },
                { name: "Oat Hay", quantity: 18, unit: "bales", minStock: 10, category: "Feed", status: "ok" }
            ],
            'raw-meat': [
                { name: "Chicken Breast", quantity: 12, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" },
                { name: "Ground Beef", quantity: 18, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" },
                { name: "Turkey", quantity: 20, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" },
                { name: "Salmon Fillets", quantity: 14, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" }
            ],
            'vegetables': [
                { name: "Carrots", quantity: 15, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" },
                { name: "Broccoli", quantity: 8, unit: "kg", minStock: 10, category: "Food Supplies", status: "low" },
                { name: "Spinach", quantity: 12, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" },
                { name: "Potatoes", quantity: 25, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" },
                { name: "Bell Peppers", quantity: 18, unit: "kg", minStock: 10, category: "Food Supplies", status: "ok" }
            ],
            'medical-supplies': [
                { name: "Bandages", quantity: 8, unit: "packs", minStock: 10, category: "Medical", status: "low" },
                { name: "Antiseptic Solution", quantity: 3, unit: "bottles", minStock: 10, category: "Medical", status: "low" },
                { name: "Syringes", quantity: 12, unit: "boxes", minStock: 10, category: "Medical", status: "ok" },
                { name: "Gloves", quantity: 5, unit: "boxes", minStock: 10, category: "Medical", status: "low" },
                { name: "Pain Medication", quantity: 18, unit: "bottles", minStock: 10, category: "Medical", status: "ok" }
            ],
            'nectar-blend': [
                { name: "Classic Nectar", quantity: 19, unit: "liters", minStock: 10, category: "Feed", status: "ok" },
                { name: "Fruit Blend", quantity: 12, unit: "liters", minStock: 10, category: "Feed", status: "ok" },
                { name: "Energy Mix", quantity: 15, unit: "liters", minStock: 10, category: "Feed", status: "ok" },
                { name: "Vitamin Enriched", quantity: 18, unit: "liters", minStock: 10, category: "Feed", status: "ok" }
            ],
            'enrichment-toys': [
                { name: "Chew Toys", quantity: 18, unit: "pieces", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Balls", quantity: 30, unit: "pieces", minStock: 10, category: "Animal Care", status: "ok" },
                { name: "Puzzle Feeders", quantity: 12, unit: "pieces", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Rope Toys", quantity: 22, unit: "pieces", minStock: 10, category: "Animal Care", status: "ok" }
            ],
            'cleaning-supplies': [
                { name: "Disinfectant", quantity: 15, unit: "gallons", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Bleach", quantity: 13, unit: "gallons", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Mop Heads", quantity: 8, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "low" },
                { name: "Trash Bags", quantity: 12, unit: "rolls", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Paper Towels", quantity: 15, unit: "rolls", minStock: 10, category: "Shelter Operations", status: "ok" }
            ],
            'bedding-and-blankets': [
                { name: "Dog Blankets", quantity: 25, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Cat Beds", quantity: 15, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Towels", quantity: 35, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Puppy Pads", quantity: 20, unit: "packs", minStock: 10, category: "Shelter Operations", status: "ok" }
            ],
            'crates-and-carriers': [
                { name: "Large Dog Crates", quantity: 18, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Medium Dog Crates", quantity: 10, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Cat Carriers", quantity: 12, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Small Animal Carriers", quantity: 16, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" }
            ],
            'food-and-water-bowls': [
                { name: "Stainless Steel Bowls", quantity: 5, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "low" },
                { name: "Ceramic Bowls", quantity: 15, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Slow Feeder Bowls", quantity: 8, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "low" },
                { name: "Water Bowls", quantity: 30, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" }
            ],
            'litter-and-litter-boxes': [
                { name: "Large Litter Boxes", quantity: 18, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Clumping Cat Litter", quantity: 12, unit: "bags", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Scoops", quantity: 10, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Litter Mats", quantity: 16, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" }
            ],
            'grooming-supplies': [
                { name: "Dog Brushes", quantity: 12, unit: "pieces", minStock: 10, category: "Animal Care", status: "ok" },
                { name: "Cat Brushes", quantity: 10, unit: "pieces", minStock: 10, category: "Animal Care", status: "ok" },
                { name: "Pet Shampoo", quantity: 8, unit: "bottles", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Nail Clippers", quantity: 6, unit: "pairs", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Ear Cleaner", quantity: 4, unit: "bottles", minStock: 10, category: "Animal Care", status: "low" }
            ],
            'pest-control': [
                { name: "Flea Medication", quantity: 15, unit: "doses", minStock: 10, category: "Animal Care", status: "ok" },
                { name: "Tick Spray", quantity: 8, unit: "bottles", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Flea/Tick Collars", quantity: 12, unit: "pieces", minStock: 10, category: "Animal Care", status: "ok" },
                { name: "Rodent Traps", quantity: 10, unit: "pieces", minStock: 10, category: "Shelter Operations", status: "ok" }
            ],
            'training-supplies': [
                { name: "Leashes", quantity: 25, unit: "pieces", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Collars", quantity: 30, unit: "pieces", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Harnesses", quantity: 15, unit: "pieces", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Clickers", quantity: 20, unit: "pieces", minStock: 10, category: "Animal Care", status: "low" },
                { name: "Treat Pouches", quantity: 10, unit: "pieces", minStock: 10, category: "Animal Care", status: "low" }
            ],
            'first-aid-kit': [
                { name: "Bandages", quantity: 8, unit: "packs", minStock: 10, category: "Medical", status: "low" },
                { name: "Antiseptic Wipes", quantity: 12, unit: "packs", minStock: 10, category: "Medical", status: "low" },
                { name: "Syringes", quantity: 15, unit: "pieces", minStock: 10, category: "Medical", status: "low" },
                { name: "Thermometer", quantity: 3, unit: "pieces", minStock: 10, category: "Medical", status: "low" },
                { name: "Emergency Blanket", quantity: 5, unit: "pieces", minStock: 10, category: "Medical", status: "low" }
            ],
            'vaccines-and-dewormers': [
                { name: "Rabies Vaccine", quantity: 15, unit: "doses", minStock: 10, category: "Medical", status: "low" },
                { name: "Distemper Vaccine", quantity: 18, unit: "doses", minStock: 10, category: "Medical", status: "low" },
                { name: "Dewormer Pills", quantity: 25, unit: "doses", minStock: 10, category: "Medical", status: "low" },
                { name: "Flea Prevention", quantity: 20, unit: "doses", minStock: 10, category: "Medical", status: "low" }
            ],
            'quarantine-supplies': [
                { name: "Disposable Gloves", quantity: 8, unit: "boxes", minStock: 10, category: "Medical", status: "low" },
                { name: "Face Masks", quantity: 12, unit: "boxes", minStock: 10, category: "Medical", status: "low" },
                { name: "Disposable Gowns", quantity: 10, unit: "pieces", minStock: 10, category: "Medical", status: "low" },
                { name: "Sanitizer", quantity: 6, unit: "bottles", minStock: 10, category: "Medical", status: "low" }
            ],
            'maintenance-tools': [
                { name: "Brooms", quantity: 18, unit: "pieces", minStock: 10, category: "Facility", status: "ok" },
                { name: "Rakes", quantity: 16, unit: "pieces", minStock: 10, category: "Facility", status: "ok" },
                { name: "Garden Hoses", quantity: 14, unit: "pieces", minStock: 10, category: "Facility", status: "ok" },
                { name: "Shovels", quantity: 15, unit: "pieces", minStock: 10, category: "Facility", status: "ok" },
                { name: "Utility Knives", quantity: 10, unit: "pieces", minStock: 10, category: "Facility", status: "ok" }
            ],
            'laundry-supplies': [
                { name: "Laundry Detergent", quantity: 12, unit: "bottles", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Bleach", quantity: 18, unit: "bottles", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Dryer Sheets", quantity: 15, unit: "boxes", minStock: 10, category: "Shelter Operations", status: "ok" },
                { name: "Stain Remover", quantity: 16, unit: "bottles", minStock: 10, category: "Shelter Operations", status: "ok" }
            ],
            'office-supplies': [
                { name: "Printer Paper", quantity: 15, unit: "reams", minStock: 10, category: "Facility", status: "ok" },
                { name: "Pens", quantity: 40, unit: "pieces", minStock: 10, category: "Facility", status: "ok" },
                { name: "Printer Ink", quantity: 8, unit: "cartridges", minStock: 10, category: "Facility", status: "low" },
                { name: "File Folders", quantity: 25, unit: "pieces", minStock: 10, category: "Facility", status: "ok" },
                { name: "Notepads", quantity: 20, unit: "pieces", minStock: 10, category: "Facility", status: "ok" }
            ]
        };
        
        return detailedInventory[categoryId] || [];
    }
    
    // Add debug function
    function debugPdf() {
        console.log('1. shoppingList:', shoppingList);
        console.log('2. savePdfBtn:', document.getElementById('savePdfBtn'));
        console.log('3. previewShoppingListPdf function exists:', typeof previewShoppingListPdf === 'function');
        console.log('4. pdfPreviewModal:', document.getElementById('pdfPreviewModal'));
        
        // Test if event listener is attached
        const btn = document.getElementById('savePdfBtn');
        if (btn) {
            console.log('5. Button click event listeners:', btn.onclick);
            console.log('6. Button event listeners count:', btn.getEventListeners ? btn.getEventListeners('click') : 'No getEventListeners');
        }
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🏁 DOM loaded, initializing inventory...');
        initializeInventory();
        
        // Add debug button temporarily
        const debugBtn = document.createElement('button');
        debugBtn.style.position = 'fixed';
        debugBtn.style.top = '10px';
        debugBtn.style.right = '10px';
        debugBtn.style.zIndex = '99999';
        debugBtn.style.background = 'red';
        debugBtn.style.color = 'white';
        debugBtn.style.padding = '10px';
        debugBtn.style.border = 'none';
        debugBtn.style.borderRadius = '5px';
        debugBtn.style.cursor = 'pointer';
        debugBtn.onclick = debugPdf;
        document.body.appendChild(debugBtn);
        
        // Auto-remove debug button after 30 seconds
        setTimeout(() => {
            if (debugBtn.parentNode) {
                debugBtn.parentNode.removeChild(debugBtn);
            }
        }, 30000);
    });
    
})();