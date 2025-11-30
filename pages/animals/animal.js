// Animals page functionality
function initializeAnimals() {
    renderAnimals();
}

function filterSpecies(species) {
    currentSpecies = species;
    document.querySelectorAll('.species-tab').forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');
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
    
    const animalList = animalDatabase[currentSpecies] || [];

    if (animalList.length === 0) {
        container.innerHTML = '<div class="animals-empty">No animals found for this species.</div>';
        return;
    }

    const tableHTML = `
        <div class="animals-table-wrapper">
            <table class="animals-table">
                <thead>
                    <tr>
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

        return `
                            <tr class="animal-table-row" onclick="openModal(${animal.id})">
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
                                        <button class="btn-table btn-track" onclick="event.stopPropagation(); trackAnimal(${animal.id}, '${animal.species}')" title="Track Location">📍</button>
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

// Edit animals list function
function editAnimalsList() {
    showToast('✏️ Edit mode - Feature coming soon!');
    // Future: Open edit modal or enable inline editing
}

function trackAnimal(animalId, species) {
    sessionStorage.setItem('selectedAnimalId', animalId);
    sessionStorage.setItem('selectedAnimalSpecies', species);
    window.location.href = '../tracking/tracking.html';
}

// Initialize animals page when page loads
if (document.getElementById('animals-section')) {
    document.addEventListener('DOMContentLoaded', initializeAnimals);
}