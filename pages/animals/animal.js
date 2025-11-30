// Animals page functionality
let selectedAnimalId = null;
let selectedAnimalSpecies = null;

function initializeAnimals() {
    renderAnimals();
    
    // Auto-scroll to active tab on mobile when page loads
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            const activeTab = document.querySelector('.species-tab.active');
            if (activeTab) {
                const tabsContainer = activeTab.parentElement;
                const tabOffsetLeft = activeTab.offsetLeft;
                const containerWidth = tabsContainer.offsetWidth;
                const tabWidth = activeTab.offsetWidth;
                
                // Center the active tab
                const targetScroll = tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2);
                
                tabsContainer.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

function filterSpecies(species) {
    currentSpecies = species;
    document.querySelectorAll('.species-tab').forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    // Auto-scroll to active tab on mobile for better UX
    if (window.innerWidth <= 768) {
        const activeTab = event.currentTarget;
        const tabsContainer = activeTab.parentElement;
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        
        // Calculate scroll position to center the active tab
        const scrollLeft = tabsContainer.scrollLeft;
        const tabOffsetLeft = activeTab.offsetLeft;
        const tabWidth = activeTab.offsetWidth;
        const containerWidth = tabsContainer.offsetWidth;
        
        // Center the active tab in viewport
        const targetScroll = tabOffsetLeft - (containerWidth / 2) + (tabWidth / 2);
        
        tabsContainer.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }
    
    renderAnimals();
}

// Helper function to calculate age from DOB
function calculateAge(dob) {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    return `${years}y ${months}m`;
}

// Helper function to format DOB
function formatDOB(dob) {
    if (!dob) return 'Unknown';
    const date = new Date(dob);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Helper function to generate ID tag from name and species
function generateIDTag(name, species, id) {
    const speciesPrefix = {
        'Goat': 'GO',
        'Sugarglider': 'SG',
        'Alligator': 'AL',
        'Snail': 'SN',
        'Porcupine': 'PQ',
        'Fox': 'FX'
    };
    const prefix = speciesPrefix[species] || 'AN';
    const num = String(id).padStart(2, '0');
    return `${prefix}-${num}`;
}

// Render animals table
function renderAnimals() {
    const container = document.getElementById('animalsTableContainer');
    if (!container) return;
    
    // Get all animals if "All" is selected, otherwise filter by species
    let animalList = [];
    if (currentSpecies === 'All') {
        animalList = Object.values(animalDatabase).flat();
    } else {
        animalList = animalDatabase[currentSpecies] || [];
    }

    if (animalList.length === 0) {
        container.innerHTML = '<div class="animals-empty">No animals found for this species.</div>';
        return;
    }

    const tableHTML = `
        <div class="animals-table-wrapper">
            <table class="animals-table">
                <thead>
                    <tr>
                        <th class="col-select">SELECT</th>
                        <th class="col-image">IMAGE</th>
                        <th class="col-name">NAME / ID TAG</th>
                        <th class="col-species">SPECIES & BREED</th>
                        <th class="col-dob">DOB / AGE</th>
                        <th class="col-sex">SEX</th>
                        <th class="col-health">HEALTH STATUS</th>
                        <th class="col-actions">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    ${animalList.map(animal => {
                        const idTag = generateIDTag(animal.name, animal.species, animal.id);
                        const breed = animal.breed || 'N/A';
                        const dob = animal.dob || null;
                        const age = dob ? calculateAge(dob) : 'Unknown';
                        const dobFormatted = dob ? formatDOB(dob) : 'Unknown';
                        const sexRaw = animal.sex || 'Unknown';
                        const sex = sexRaw.toLowerCase();
                        const sexIcon = sex === 'female' ? '♀️' : sex === 'male' ? '♂️' : '👥';
                        const sexDisplay = sexIcon ? `${sexIcon} ${sex.charAt(0).toUpperCase() + sex.slice(1)}` : sexRaw;
                        const healthStatus = animal.health || 'good';

        const isSelected = selectedAnimalId === animal.id && selectedAnimalSpecies === animal.species;
        return `
                            <tr class="animal-table-row ${isSelected ? 'selected' : ''}" onclick="openModal(${animal.id})" data-animal-id="${animal.id}" data-animal-species="${animal.species}">
                                <td class="col-select" onclick="event.stopPropagation()">
                                    <input type="checkbox" 
                                           class="animal-select-checkbox" 
                                           data-animal-id="${animal.id}" 
                                           data-animal-species="${animal.species}"
                                           ${isSelected ? 'checked' : ''}
                                           onchange="handleCheckboxChange(${animal.id}, '${animal.species}', this)">
                                </td>
                                <td class="col-image" onclick="event.stopPropagation()">
                                    <div class="animal-table-image">
                                        <img src="${animal.images[0]}" alt="${animal.name}" class="table-animal-image">
                                    </div>
                                </td>
                                <td class="col-name">
                                    <div class="animal-table-name">
                                        <span class="table-icon">🏷️</span>
                                        <div>
                                            <div class="name-value">${animal.name}</div>
                                            <div class="id-tag">${idTag}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="col-species">
                                    <div class="animal-table-species">
                                        <span class="table-icon">🐾</span>
                                        <div>
                                            <div class="species-value">${animal.species}</div>
                                            <div class="breed-value">${breed}</div>
                    </div>
                </div>
                                </td>
                                <td class="col-dob">
                                    <div class="animal-table-dob">
                                        <span class="table-icon">📅</span>
                        <div>
                                            <div class="age-value">${age}</div>
                                            <div class="dob-value">${dobFormatted}</div>
                        </div>
                    </div>
                                </td>
                                <td class="col-sex">
                                    <div class="animal-table-sex">
                                        <div class="sex-value">${sexDisplay}</div>
                                    </div>
                                </td>
                                <td class="col-health" onclick="event.stopPropagation()">
                                    <span class="health-status-badge ${healthStatus} clickable" 
                                          onclick="openHealthMonitorFromTable(${animal.id}, '${animal.species}')"
                                          title="Click to view health details">
                                        ${healthStatus === 'good' ? '✓ GOOD' : healthStatus === 'warning' ? '⚠ WARNING' : '🔴 DANGER'}
                                    </span>
                                </td>
                                <td class="col-actions" onclick="event.stopPropagation()">
                                    <div class="table-actions">
                                        <button class="btn-table btn-view" onclick="openModal(${animal.id})" title="View Details">👁️</button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            </div>
        `;
    
    container.innerHTML = tableHTML;
}

// Navigate to health monitor from table
function openHealthMonitorFromTable(animalId, species) {
    sessionStorage.setItem('selectedAnimalId', animalId);
    sessionStorage.setItem('selectedAnimalSpecies', species);
    window.location.href = '../health/health.html';
}

function trackAnimal(animalId, species) {
    sessionStorage.setItem('selectedAnimalId', animalId);
    sessionStorage.setItem('selectedAnimalSpecies', species);
    window.location.href = '../tracking/tracking.html';
}

// Edit animal function
function editAnimal(animalId, species) {
    // Find the animal in the database
    const animalList = animalDatabase[species] || [];
    const animal = animalList.find(a => a.id === animalId);
    
    if (!animal) {
        showToast('❌ Animal not found');
        return;
    }

    // Populate the edit form
    document.getElementById('editAnimalId').value = animal.id;
    document.getElementById('editAnimalName').value = animal.name || '';
    document.getElementById('editAnimalSpecies').value = animal.species || '';
    document.getElementById('editAnimalBreed').value = animal.breed || '';
    document.getElementById('editAnimalDOB').value = animal.dob || '';
    document.getElementById('editAnimalSex').value = animal.sex || 'Unknown';
    document.getElementById('editAnimalHealth').value = animal.health || 'good';
    document.getElementById('editAnimalOriginalSpecies').value = species;
    document.getElementById('editAnimalSubtitle').textContent = `Editing: ${animal.name}`;

    // Open the edit modal
    document.getElementById('editAnimalModal').classList.add('active');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editAnimalModal').classList.remove('active');
    document.getElementById('editAnimalForm').reset();
}

// Save animal edit
function saveAnimalEdit(event) {
    event.preventDefault();
    
    const form = event.target;
    const animalId = parseInt(form.id.value);
    const originalSpecies = form.originalSpecies.value;
    const newSpecies = form.species.value;
    const name = form.name.value.trim();
    const breed = form.breed.value.trim();
    const dob = form.dob.value;
    const sex = form.sex.value;
    const health = form.health.value;

    // Find the animal in the original species array
    const originalList = animalDatabase[originalSpecies] || [];
    const animalIndex = originalList.findIndex(a => a.id === animalId);
    
    if (animalIndex === -1) {
        showToast('❌ Animal not found');
        return;
    }

    const animal = originalList[animalIndex];

    // Update animal properties
    animal.name = name;
    animal.breed = breed || 'N/A';
    animal.dob = dob || null;
    animal.sex = sex;
    animal.health = health;

    // If species changed, move the animal to the new species array
    if (newSpecies !== originalSpecies) {
        animal.species = newSpecies;
        
        // Remove from original species array
        originalList.splice(animalIndex, 1);
        
        // Add to new species array
        if (!animalDatabase[newSpecies]) {
            animalDatabase[newSpecies] = [];
        }
        animalDatabase[newSpecies].push(animal);
    }

    closeEditModal();
    showToast(`✅ ${name} updated successfully`);
    
    // Clear selection
    selectedAnimalId = null;
    selectedAnimalSpecies = null;
    updateHeaderButtons();
    
    // Uncheck all checkboxes
    document.querySelectorAll('.animal-select-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    // Re-render the animals table
    renderAnimals();
    
    // Update dashboard if function exists
    if (typeof updateDashboardStats === 'function') {
        updateDashboardStats();
    }
}

// Delete animal function
function deleteAnimal(animalId, species) {
    // Find the animal
    const animalList = animalDatabase[species] || [];
    const animal = animalList.find(a => a.id === animalId);
    
    if (!animal) {
        showToast('❌ Animal not found');
        return;
    }

    // Confirm deletion
    const animalName = animal.name;
    if (!confirm(`Are you sure you want to delete ${animalName}? This action cannot be undone.`)) {
        return;
    }

    // Remove the animal from the database
    const animalIndex = animalList.findIndex(a => a.id === animalId);
    if (animalIndex !== -1) {
        animalList.splice(animalIndex, 1);
        showToast(`✅ ${animalName} has been deleted`);
        
        // Clear selection
        selectedAnimalId = null;
        selectedAnimalSpecies = null;
        updateHeaderButtons();
        
        // Uncheck all checkboxes
        document.querySelectorAll('.animal-select-checkbox').forEach(cb => {
            cb.checked = false;
        });
        
        // Re-render the animals table
        renderAnimals();
        
        // Update dashboard if function exists
        if (typeof updateDashboardStats === 'function') {
            updateDashboardStats();
        }
    } else {
        showToast('❌ Failed to delete animal');
    }
}

// Handle checkbox change for animal selection
function handleCheckboxChange(animalId, species, checkbox) {
    if (checkbox.checked) {
        // Uncheck all other checkboxes (single selection)
        document.querySelectorAll('.animal-select-checkbox').forEach(cb => {
            if (cb !== checkbox) {
                cb.checked = false;
                const row = cb.closest('.animal-table-row');
                if (row) row.classList.remove('selected');
            }
        });
        
        // Select this animal
        selectedAnimalId = animalId;
        selectedAnimalSpecies = species;
        const row = checkbox.closest('.animal-table-row');
        if (row) row.classList.add('selected');
    } else {
        // Deselect
        selectedAnimalId = null;
        selectedAnimalSpecies = null;
        const row = checkbox.closest('.animal-table-row');
        if (row) row.classList.remove('selected');
    }
    
    // Update header buttons
    updateHeaderButtons();
}

// Update header buttons state
function updateHeaderButtons() {
    const editBtn = document.getElementById('editSelectedAnimal');
    const deleteBtn = document.getElementById('deleteSelectedAnimal');
    const hasSelection = selectedAnimalId !== null && selectedAnimalSpecies !== null;
    
    if (editBtn) editBtn.disabled = !hasSelection;
    if (deleteBtn) deleteBtn.disabled = !hasSelection;
}

// Edit selected animal from header
function editSelectedAnimal() {
    if (selectedAnimalId && selectedAnimalSpecies) {
        editAnimal(selectedAnimalId, selectedAnimalSpecies);
    } else {
        showToast('⚠️ Please select an animal first');
    }
}

// Delete selected animal from header
function deleteSelectedAnimal() {
    if (selectedAnimalId && selectedAnimalSpecies) {
        deleteAnimal(selectedAnimalId, selectedAnimalSpecies);
    } else {
        showToast('⚠️ Please select an animal first');
    }
}

// Initialize animals page when page loads
if (document.getElementById('animals-section')) {
    document.addEventListener('DOMContentLoaded', initializeAnimals);
}