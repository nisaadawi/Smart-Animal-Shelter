  // Tracking cluster centers keep species grouped
        const trackingClusters = {
            Goat: { lat: 3.1131, lng: 101.7898, radius: 0.0004 },
            'Red Fox': { lat: 3.1146, lng: 101.7909, radius: 0.00035 },
            Porcupine: { lat: 3.1158, lng: 101.7929, radius: 0.0003 },
            Alligator: { lat: 3.1167, lng: 101.7951, radius: 0.00025 }
        };

        // Enhanced animal database with species-specific requirements matching the full draft
        const animalDatabase = {
            Goat: [
                {
                    id: 1,
                    name: 'Jebat',
                    species: 'Goat',
                    images: [
                        'images/goat/Jebat.jpg'
                    ],
                    health: 'good',
                    lastFed: '1h ago',
                    sensors: {
                        heartRate: { value: 74, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 38.4, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'Active', unit: '', icon: '📊', label: 'Activity' },
                        airQuality: { value: 44, unit: 'AQI', icon: '🌬️', label: 'Air Quality' },
                        weight: { value: 44, unit: 'kg', icon: '⚖️', label: 'Weight' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Goat.lat + 0.0001,
                        lng: trackingClusters.Goat.lng - 0.0002,
                        center: { ...trackingClusters.Goat },
                        radius: trackingClusters.Goat.radius,
                        location: 'East Pasture',
                        status: 'moving'
                    },
                    cctv: true,
                    alerts: [],
                    notes: [
                        { time: '09:00', text: 'Morning feeding completed, excellent appetite' },
                        { time: '10:15', text: 'Joined herd enrichment session' }
                    ]
                },
                {
                    id: 2,
                    name: 'Puteh',
                    species: 'Goat',
                    images: [
                        'images/goat/Puteh.jpg'
                    ],
                    health: 'warning',
                    lastFed: '4h ago',
                    sensors: {
                        heartRate: { value: 83, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 39.1, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'Low', unit: '', icon: '📊', label: 'Activity' },
                        airQuality: { value: 43, unit: 'AQI', icon: '🌬️', label: 'Air Quality' },
                        weight: { value: 39, unit: 'kg', icon: '⚖️', label: 'Weight' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Goat.lat + 0.0005,
                        lng: trackingClusters.Goat.lng + 0.0003,
                        center: { ...trackingClusters.Goat },
                        radius: trackingClusters.Goat.radius,
                        location: 'East Pasture',
                        status: 'resting'
                    },
                    cctv: true,
                    alerts: ['Decreased appetite - Monitor closely'],
                    notes: [
                        { time: '08:00', text: 'Slight decrease in appetite, vet notified' },
                        { time: '11:00', text: 'Started antibiotic treatment' }
                    ]
                },
                {
                    id: 3,
                    name: 'Leman',
                    species: 'Goat',
                    images: [
                        'images/goat/Leman.jpg'
                    ],
                    health: 'good',
                    lastFed: '3h ago',
                    sensors: {
                        heartRate: { value: 78, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 38.6, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'Grazing', unit: '', icon: '📊', label: 'Activity' },
                        airQuality: { value: 41, unit: 'AQI', icon: '🌬️', label: 'Air Quality' },
                        weight: { value: 47, unit: 'kg', icon: '⚖️', label: 'Weight' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Goat.lat - 0.00015,
                        lng: trackingClusters.Goat.lng - 0.0004,
                        center: { ...trackingClusters.Goat },
                        radius: trackingClusters.Goat.radius,
                        location: 'West Pasture',
                        status: 'moving'
                    },
                    cctv: true,
                    alerts: [],
                    notes: [
                        { time: '07:30', text: 'Completed morning health check' },
                        { time: '10:45', text: 'Led herd to shaded area' }
                    ]
                }
            ],
            Sugarglider: [
                {
                    id: 4,
                    name: 'Mimi',
                    species: 'Sugar Glider',
                    images: [
                        'images/sugarglider/Mimi.jpg'
                    ],
                    health: 'good',
                    lastFed: '2h ago',
                    sensors: {
                        temp: { value: 24.5, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        humidity: { value: 61, unit: '%', icon: '💧', label: 'Humidity' },
                        activity: { value: 'Nocturnal', unit: '', icon: '🌙', label: 'Activity' },
                        lightLevel: { value: 'Low', unit: '', icon: '💡', label: 'Light Level' }
                    },
                    tracking: { enabled: false },
                    cctv: false,
                    alerts: [],
                    notes: [
                        { time: '20:00', text: 'Climbed enrichment branches' },
                        { time: '22:30', text: 'Consumed nectar blend' }
                    ]
                },
                {
                    id: 5,
                    name: 'Cici',
                    species: 'Sugar Glider',
                    images: [
                        'images/sugarglider/Cici.jpg'
                    ],
                    health: 'good',
                    lastFed: '1h ago',
                    sensors: {
                        temp: { value: 24.1, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        humidity: { value: 63, unit: '%', icon: '💧', label: 'Humidity' },
                        activity: { value: 'Active', unit: '', icon: '🌙', label: 'Activity' },
                        lightLevel: { value: 'Dim', unit: '', icon: '💡', label: 'Light Level' }
                    },
                    tracking: { enabled: false },
                    cctv: false,
                    alerts: [],
                    notes: [
                        { time: '21:00', text: 'Glided between perches, good coordination' }
                    ]
                },
                {
                    id: 6,
                    name: 'Miki',
                    species: 'Sugar Glider',
                    images: [
                        'images/sugarglider/Miki.jpg'
                    ],
                    health: 'good',
                    lastFed: '3h ago',
                    sensors: {
                        temp: { value: 24.8, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        humidity: { value: 60, unit: '%', icon: '💧', label: 'Humidity' },
                        activity: { value: 'Calm', unit: '', icon: '🌙', label: 'Activity' },
                        lightLevel: { value: 'Low', unit: '', icon: '💡', label: 'Light Level' }
                    },
                    tracking: { enabled: false },
                    cctv: false,
                    alerts: [],
                    notes: [
                        { time: '19:30', text: 'Bonding pouch session completed' },
                        { time: '23:00', text: 'Finished fruit mix' }
                    ]
                }
            ],
            Alligator: [
                {
                    id: 7,
                    name: 'Awang',
                    species: 'Alligator',
                    images: [
                        'images/alligators/Awang.jpg'
                    ],
                    health: 'good',
                    lastFed: '1 day ago',
                    sensors: {
                        baskingTemp: { value: 32, unit: '°C', icon: '☀️', label: 'Basking Temp' },
                        waterTemp: { value: 26, unit: '°C', icon: '🌊', label: 'Water Temp' },
                        humidity: { value: 75, unit: '%', icon: '💧', label: 'Humidity' },
                        waterPH: { value: 7.2, unit: 'pH', icon: '⚗️', label: 'Water pH' },
                        lockStatus: { value: 'Secured', unit: '', icon: '🔒', label: 'Lock Status' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Alligator.lat - 0.0004,
                        lng: trackingClusters.Alligator.lng - 0.0003,
                        center: { ...trackingClusters.Alligator },
                        radius: trackingClusters.Alligator.radius,
                        location: 'Marsh Basin',
                        status: 'moving'
                    },
                    cctv: true,
                    safety: true,
                    alerts: [],
                    notes: [
                        { time: 'Yesterday', text: 'Fed whole chicken, normal appetite' },
                        { time: '10:00', text: 'Basking behavior observed' }
                    ]
                },
                {
                    id: 8,
                    name: 'Sulong',
                    species: 'Alligator',
                    images: [
                        'images/alligators/Sulong.jpg'
                    ],
                    health: 'warning',
                    lastFed: '3 days ago',
                    sensors: {
                        baskingTemp: { value: 30, unit: '°C', icon: '☀️', label: 'Basking Temp' },
                        waterTemp: { value: 24, unit: '°C', icon: '🌊', label: 'Water Temp' },
                        humidity: { value: 72, unit: '%', icon: '💧', label: 'Humidity' },
                        waterPH: { value: 7.0, unit: 'pH', icon: '⚗️', label: 'Water pH' },
                        lockStatus: { value: 'Secured', unit: '', icon: '🔒', label: 'Lock Status' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Alligator.lat + 0.0002,
                        lng: trackingClusters.Alligator.lng - 0.0001,
                        center: { ...trackingClusters.Alligator },
                        radius: trackingClusters.Alligator.radius,
                        location: 'South Wetlands',
                        status: 'resting'
                    },
                    cctv: true,
                    safety: true,
                    alerts: ['Refused food for 3 days - Vet consultation required'],
                    notes: [
                        { time: '3 days ago', text: 'Refused food, monitoring closely' },
                        { time: 'Today', text: 'Vet scheduled for tomorrow' }
                    ]
                }
            ],
            Snail: [
                {
                    id: 9,
                    name: 'Mondok',
                    species: 'Giant Snail',
                    images: [
                        'images/snail/Mondok.jpg'
                    ],
                    health: 'good',
                    lastFed: '10h ago',
                    sensors: {
                        humidity: { value: 86, unit: '%', icon: '💧', label: 'Humidity' },
                        temp: { value: 22, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        substrate: { value: 'Moist', unit: '', icon: '🪨', label: 'Substrate' }
                    },
                    tracking: { enabled: false },
                    cctv: false,
                    alerts: [],
                    notes: [
                        { time: 'Last night', text: 'Consumed lettuce and vegetables' }
                    ]
                },
                {
                    id: 10,
                    name: 'Koko',
                    species: 'Giant Snail',
                    images: [
                        'images/snail/Koko.jpg'
                    ],
                    health: 'good',
                    lastFed: '8h ago',
                    sensors: {
                        humidity: { value: 84, unit: '%', icon: '💧', label: 'Humidity' },
                        temp: { value: 21, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        substrate: { value: 'Even', unit: '', icon: '🪨', label: 'Substrate' }
                    },
                    tracking: { enabled: false },
                    cctv: false,
                    alerts: [],
                    notes: [
                        { time: 'Morning', text: 'Replenished calcium source' }
                    ]
                },
                {
                    id: 11,
                    name: 'Tutu',
                    species: 'Giant Snail',
                    images: [
                        'images/snail/Tutu.jpg'
                    ],
                    health: 'good',
                    lastFed: '6h ago',
                    sensors: {
                        humidity: { value: 88, unit: '%', icon: '💧', label: 'Humidity' },
                        temp: { value: 22, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        substrate: { value: 'Fresh moss', unit: '', icon: '🪨', label: 'Substrate' }
                    },
                    tracking: { enabled: false },
                    cctv: false,
                    alerts: [],
                    notes: [
                        { time: 'Afternoon', text: 'Observed eggshell strengthening exercise' }
                    ]
                }
            ],
            Porcupine: [
                {
                    id: 12,
                    name: 'Togo',
                    species: 'Porcupine',
                    images: [
                        'images/porcupine/Togo.jpg'
                    ],
                    health: 'good',
                    lastFed: '3h ago',
                    sensors: {
                        heartRate: { value: 84, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 37.1, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'Active', unit: '', icon: '📊', label: 'Activity' },
                        enrichment: { value: 'Used', unit: '', icon: '🎾', label: 'Enrichment' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Porcupine.lat + 0.00012,
                        lng: trackingClusters.Porcupine.lng - 0.00015,
                        center: { ...trackingClusters.Porcupine },
                        radius: trackingClusters.Porcupine.radius,
                        location: 'Central Area',
                        status: 'moving'
                    },
                    cctv: true,
                    alerts: [],
                    notes: [
                        { time: '08:00', text: 'Enjoyed vegetables and chew toys' },
                        { time: '12:00', text: 'Active exploration behavior' }
                    ]
                },
                {
                    id: 13,
                    name: 'Dodo',
                    species: 'Porcupine',
                    images: [
                        'images/porcupine/Dodo.jpg'
                    ],
                    health: 'warning',
                    lastFed: '7h ago',
                    sensors: {
                        heartRate: { value: 90, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 38.1, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'Low', unit: '', icon: '📊', label: 'Activity' },
                        enrichment: { value: 'Unused', unit: '', icon: '🎾', label: 'Enrichment' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Porcupine.lat,
                        lng: trackingClusters.Porcupine.lng + 0.00018,
                        center: { ...trackingClusters.Porcupine },
                        radius: trackingClusters.Porcupine.radius,
                        location: 'Central Area',
                        status: 'resting'
                    },
                    cctv: true,
                    alerts: ['Reduced enrichment usage - schedule play session'],
                    notes: [
                        { time: '11:30', text: 'Encouraged to explore new puzzle feeder' }
                    ]
                },
                {
                    id: 14,
                    name: 'Odin',
                    species: 'Porcupine',
                    images: [
                        'images/porcupine/Odin.jpg'
                    ],
                    health: 'danger',
                    lastFed: '9h ago',
                    sensors: {
                        heartRate: { value: 96, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 38.6, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'Minimal', unit: '', icon: '📊', label: 'Activity' },
                        enrichment: { value: 'Unused', unit: '', icon: '🎾', label: 'Enrichment' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters.Porcupine.lat - 0.0002,
                        lng: trackingClusters.Porcupine.lng + 0.00025,
                        center: { ...trackingClusters.Porcupine },
                        radius: trackingClusters.Porcupine.radius,
                        location: 'Central Area',
                        status: 'resting'
                    },
                    cctv: true,
                    alerts: ['Elevated temperature (38.6°C) - Vet notified'],
                    notes: [
                        { time: '12:00', text: 'Elevated temp detected - vet notified' },
                        { time: '14:00', text: 'Monitoring closely, treatment started' }
                    ]
                }
            ],
            Fox: [
                {
                    id: 15,
                    name: 'Pandan',
                    species: 'Red Fox',
                    images: [
                        'images/fox/Pandan.jpg'
                    ],
                    health: 'good',
                    lastFed: '6h ago',
                    sensors: {
                        heartRate: { value: 120, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 38.7, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'High', unit: '', icon: '📊', label: 'Activity' },
                        perimeterStatus: { value: 'Secure', unit: '', icon: '🔒', label: 'Perimeter' },
                        weight: { value: 6.3, unit: 'kg', icon: '⚖️', label: 'Weight' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters['Red Fox'].lat - 0.0006,
                        lng: trackingClusters['Red Fox'].lng - 0.0002,
                        center: { ...trackingClusters['Red Fox'] },
                        radius: trackingClusters['Red Fox'].radius,
                        location: 'North Enclosure',
                        status: 'moving'
                    },
                    cctv: true,
                    safety: true,
                    alerts: [],
                    notes: [
                        { time: '07:00', text: 'Morning hunt simulation completed' },
                        { time: '09:00', text: 'High energy levels, enrichment provided' }
                    ]
                },
                {
                    id: 16,
                    name: 'Jebat',
                    species: 'Red Fox',
                    images: [
                        'images/fox/Jebat.jpg'
                    ],
                    health: 'good',
                    lastFed: '6h ago',
                    sensors: {
                        heartRate: { value: 115, unit: 'bpm', icon: '❤️', label: 'Heart Rate' },
                        temp: { value: 38.4, unit: '°C', icon: '🌡️', label: 'Temperature' },
                        activity: { value: 'Active', unit: '', icon: '📊', label: 'Activity' },
                        perimeterStatus: { value: 'Secure', unit: '', icon: '🔒', label: 'Perimeter' },
                        weight: { value: 5.9, unit: 'kg', icon: '⚖️', label: 'Weight' }
                    },
                    tracking: {
                        enabled: true,
                        lat: trackingClusters['Red Fox'].lat + 0.00035,
                        lng: trackingClusters['Red Fox'].lng + 0.0001,
                        center: { ...trackingClusters['Red Fox'] },
                        radius: trackingClusters['Red Fox'].radius,
                        location: 'North Enclosure',
                        status: 'moving'
                    },
                    cctv: true,
                    safety: true,
                    alerts: [],
                    notes: [
                        { time: '06:30', text: 'Early morning activity observed' },
                        { time: '08:00', text: 'Fed raw meat with vitamins' }
                    ]
                }
            ]
        };

        const feedingSchedule = [
            { time: '06:00', animal: 'Foxes', meal: 'Raw meat + vitamins', status: 'completed', icon: '🦊' },
            { time: '08:00', animal: 'Goats', meal: 'Hay + grain mix', status: 'completed', icon: '🐐' },
            { time: '10:00', animal: 'Porcupines', meal: 'Vegetables + fruits', status: 'pending', icon: '🦔' },
            { time: '14:00', animal: 'Sugar Gliders', meal: 'Nectar blend', status: 'pending', icon: '🐿️' },
            { time: '18:00', animal: 'Alligators', meal: 'Whole fish (supervised)', status: 'pending', icon: '🐊' },
            { time: '22:00', animal: 'Snails', meal: 'Fresh vegetables', status: 'pending', icon: '🐌' }
        ];

        const rooms = [
            { id: 1, name: 'Goat Enclosure', temp: 22, humidity: 55, aqi: 45, status: 'good', target: 22 },
            { id: 2, name: 'Sugar Glider Room', temp: 24, humidity: 60, aqi: 40, status: 'good', target: 24 },
            { id: 3, name: 'Alligator Pool', temp: 28, humidity: 80, aqi: 50, status: 'good', target: 28 },
            { id: 4, name: 'Porcupine Habitat', temp: 20, humidity: 50, aqi: 55, status: 'warning', target: 22 },
            { id: 5, name: 'Fox Enclosure', temp: 18, humidity: 45, aqi: 42, status: 'good', target: 18 },
            { id: 6, name: 'Snail Terrarium', temp: 22, humidity: 85, aqi: 38, status: 'good', target: 22 }
        ];

        const inventory = [
            { name: 'Hay Bales', category: 'Feed', stock: 45, min: 20, icon: '🌾' },
            { name: 'Raw Meat', category: 'Feed', stock: 15, min: 20, icon: '🍖' },
            { name: 'Vegetables', category: 'Feed', stock: 8, min: 15, icon: '🥬' },
            { name: 'Medical Supplies', category: 'Health', stock: 25, min: 30, icon: '💊' },
            { name: 'Nectar Blend', category: 'Feed', stock: 12, min: 10, icon: '🍯' },
            { name: 'Enrichment Toys', category: 'Equipment', stock: 18, min: 15, icon: '🎾' }
        ];

        const trackingSpeciesMeta = {
            Goat: { label: 'Goats', icon: '🐐', color: '#f97316' },
            'Red Fox': { label: 'Foxes', icon: '🦊', color: '#ec4899' },
            Porcupine: { label: 'Porcupines', icon: '🦔', color: '#0ea5e9' },
            Alligator: { label: 'Alligators', icon: '🐊', color: '#22d3ee' }
        };

        const severityMeta = {
            urgent: { label: 'Urgent', icon: '⚡', progress: '90%' },
            moderate: { label: 'Moderate', icon: '⚠️', progress: '65%' },
            routine: { label: 'Routine', icon: '📘', progress: '40%' }
        };

        let currentSpecies = 'Goat';
        let selectedAnimal = null;
        let trackingUpdateInterval = null;
        let trackingFilters = new Set(Object.keys(trackingSpeciesMeta));
        let trackingViewMode = 'map';
        let alertFilters = new Set(Object.keys(severityMeta));
        let mapInstance = null;
        let markerLayer = null;
        const markerMap = new Map();
        let mapNeedsFit = true;
        let speciesChartInstance = null;
        let healthStatusChartInstance = null;

        // Initialize on load
        document.addEventListener('DOMContentLoaded', () => {
            initializeApp();
        });

        function initializeApp() {
            updateDashboardStats();
            renderAnimals();
            renderFeeding();
            renderRooms();
            renderInventory();
            renderAlerts();
            renderTrackingToolbar();
            initializeMap();
            renderTracking();
            startTrackingSimulation();
        }

        // Update dashboard statistics
        function updateDashboardStats() {
            const allAnimals = Object.values(animalDatabase).flat();
            const needAttention = allAnimals.filter(a => a.health === 'warning' || a.health === 'danger' || a.alerts.length > 0).length;
            const trackingActive = allAnimals.filter(a => a.tracking.enabled).length;
            const pendingTasks = feedingSchedule.filter(f => f.status === 'pending').length;

            document.getElementById('totalAnimals').textContent = allAnimals.length;
            document.getElementById('needAttention').textContent = needAttention;
            document.getElementById('tasksPending').textContent = pendingTasks;
            document.getElementById('trackingActive').textContent = trackingActive;

            // Update badges
            const totalAlerts = allAnimals.reduce((sum, a) => sum + a.alerts.length, 0);
            document.getElementById('alertBadge').textContent = totalAlerts;

            const lowStock = inventory.filter(i => i.stock < i.min).length;
            document.getElementById('inventoryBadge').textContent = lowStock;

            renderSpeciesChart(allAnimals);
            renderHealthStatusChart(allAnimals);
        }

        function renderSpeciesChart(allAnimals) {
            const canvas = document.getElementById('speciesChart');
            if (!canvas || !window.Chart) return;

            const counts = {};
            allAnimals.forEach(animal => {
                counts[animal.species] = (counts[animal.species] || 0) + 1;
            });

            const labels = Object.keys(counts);
            const data = labels.map(label => counts[label]);
            const colors = labels.map(label => trackingSpeciesMeta[label]?.color || '#6366f1');

            if (speciesChartInstance) speciesChartInstance.destroy();
            speciesChartInstance = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Animals',
                        data,
                        backgroundColor: colors,
                        borderRadius: 12,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { color: '#94a3b8', stepSize: 1 },
                            grid: { color: 'rgba(148, 163, 184, 0.3)', drawBorder: false }
                        },
                        x: {
                            ticks: { color: '#64748b' },
                            grid: { display: false }
                        }
                    }
                }
            });
        }

        function renderHealthStatusChart(allAnimals) {
            const canvas = document.getElementById('healthStatusChart');
            if (!canvas || !window.Chart) return;

            const totals = { Good: 0, Warning: 0, Danger: 0 };
            allAnimals.forEach(animal => {
                if (animal.health === 'good') totals.Good += 1;
                else if (animal.health === 'warning') totals.Warning += 1;
                else totals.Danger += 1;
            });

            if (healthStatusChartInstance) healthStatusChartInstance.destroy();
            healthStatusChartInstance = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Good', 'Warning', 'Danger'],
                    datasets: [{
                        data: [totals.Good, totals.Warning, totals.Danger],
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: '#64748b' } }
                    }
                }
            });
        }

        // Navigation
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
        }

        function showSection(section) {
            document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
            document.getElementById(section + '-section').classList.add('active');

            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            const clickedItem = event?.currentTarget;
            if (clickedItem) clickedItem.classList.add('active');

            if (window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.remove('open');
            }

            if (section === 'tracking') {
                initializeMap();
                setTimeout(() => mapInstance?.invalidateSize(), 150);
                renderTracking();
            }
        }

        function renderTrackingToolbar() {
            const toolbar = document.getElementById('trackingToolbar');
            if (!toolbar) return;
            const allAnimals = Object.values(animalDatabase).flat();

            const filters = Object.entries(trackingSpeciesMeta).map(([species, meta]) => {
                const count = allAnimals.filter(a => a.tracking.enabled && a.species === species).length;
                const active = trackingFilters.has(species);
                return `
                    <button class="tracking-filter ${active ? 'active' : ''}" onclick="toggleTrackingFilter('${species}')">
                        <span>${meta.icon}</span>
                        <span>${meta.label}</span>
                        <span class="filter-count">${count}</span>
                    </button>
                `;
            }).join('');

            toolbar.innerHTML = `
                <div class="tracking-filters">${filters}</div>
                <div class="tracking-view-toggle">
                    <button class="tracking-view-btn ${trackingViewMode === 'map' ? 'active' : ''}" onclick="setTrackingView('map')">Map View</button>
                    <button class="tracking-view-btn ${trackingViewMode === 'heat' ? 'active' : ''}" onclick="setTrackingView('heat')">Heat View</button>
                </div>
            `;
        }

        function initializeMap() {
            if (mapInstance) return;
            const mapElement = document.getElementById('trackingMap');
            if (!mapElement) return;

            const farmCenter = [3.1125, 101.7915];
            mapInstance = L.map('trackingMap', {
                zoomControl: false,
                attributionControl: false,
                minZoom: 16,
                maxZoom: 19
            }).setView(farmCenter, 17);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19
            }).addTo(mapInstance);

            const bounds = L.latLngBounds([3.108, 101.786], [3.118, 101.797]);
            mapInstance.setMaxBounds(bounds.pad(0.02));

            markerLayer = L.layerGroup().addTo(mapInstance);
            markerMap.clear();
            setTimeout(() => mapInstance.invalidateSize(), 200);
        }

        function renderTrackingStats(trackedAnimals) {
            const stats = document.getElementById('trackingStats');
            if (!stats) return;

            if (!trackedAnimals.length) {
                stats.innerHTML = `<div class="tracking-empty">Select a species to visualize activity on the map.</div>`;
                return;
            }

            const moving = trackedAnimals.filter(a => a.tracking.status === 'moving').length;
            const resting = trackedAnimals.length - moving;
            const alerts = trackedAnimals.filter(a => a.alerts.length > 0 || a.health !== 'good').length;
            const coverage = Math.round((trackingFilters.size / Object.keys(trackingSpeciesMeta).length) * 100);

            stats.innerHTML = `
                <div class="tracking-stat-card">
                    <div class="stat-label">Tracked Animals</div>
                    <div class="stat-value">${trackedAnimals.length}</div>
                    <div class="stat-meta">${moving} moving • ${resting} resting</div>
                </div>
                <div class="tracking-stat-card">
                    <div class="stat-label">Active Alerts</div>
                    <div class="stat-value">${alerts}</div>
                    <div class="stat-meta">${alerts ? 'Immediate attention required' : 'All clear'}</div>
                </div>
                <div class="tracking-stat-card">
                    <div class="stat-label">Filter Coverage</div>
                    <div class="stat-value">${coverage}%</div>
                    <div class="stat-meta">${trackingFilters.size} / ${Object.keys(trackingSpeciesMeta).length} species visible</div>
                </div>
            `;
        }

        function renderTrackingLegend(allAnimals) {
            const legendEl = document.getElementById('trackingLegend');
            if (!legendEl) return;
            const legendItems = Object.entries(trackingSpeciesMeta).map(([species, meta]) => {
                const count = allAnimals.filter(a => a.tracking.enabled && a.species === species).length;
                if (!count) return '';
                return `
                    <div class="legend-item">
                        <span class="legend-dot" style="background:${meta.color};"></span>
                        ${meta.icon} ${meta.label}
                        <span style="font-weight:800; margin-left:4px;">${count}</span>
                    </div>
                `;
            }).join('');

            legendEl.innerHTML = legendItems || '<div class="tracking-empty" style="margin:0;">No live devices reporting yet.</div>';
        }

        function buildAnimalIcon(animal) {
            const meta = trackingSpeciesMeta[animal.species] || {};
            const emoji = meta.icon || '🐾';
            const color = meta.color || '#6366f1';
            const html = `
                <div class="map-pin ${animal.tracking.status}" style="--pin-color:${color}" data-label="${animal.name}">
                    <div class="map-pin-inner">${emoji}</div>
                </div>
            `;
            return L.divIcon({
                className: 'map-pin-wrapper',
                html,
                iconSize: [48, 48],
                iconAnchor: [24, 24]
            });
        }

        function toggleTrackingFilter(species) {
            if (trackingFilters.has(species) && trackingFilters.size === 1) {
                showToast('At least one species must stay visible.');
                return;
            }

            if (trackingFilters.has(species)) {
                trackingFilters.delete(species);
            } else {
                trackingFilters.add(species);
            }

            mapNeedsFit = true;
            renderTracking();
            renderTrackingToolbar();
        }

        function setTrackingView(mode) {
            trackingViewMode = mode;
            renderTracking();
            renderTrackingToolbar();
        }

        function renderAlertsToolbar(allAlerts) {
            const toolbar = document.getElementById('alertsToolbar');
            if (!toolbar) return;

            const filterButtons = Object.entries(severityMeta).map(([severity, meta]) => {
                const count = allAlerts.filter(a => a.severity === severity).length;
                const active = alertFilters.has(severity);
                return `
                    <button class="alert-filter ${active ? 'active' : ''}" onclick="toggleAlertFilter('${severity}')">
                        <span>${meta.icon}</span>
                        <span>${meta.label}</span>
                        <span class="filter-count">${count}</span>
                    </button>
                `;
            }).join('');

            toolbar.innerHTML = `
                <div class="alert-filters">${filterButtons}</div>
                <div style="font-weight:700; color:var(--text-secondary);">Filters active: ${alertFilters.size}</div>
            `;
        }

        function renderAlertsSummary(allAlerts) {
            const summary = document.getElementById('alertsSummary');
            if (!summary) return;

            if (!allAlerts.length) {
                summary.innerHTML = `<div class="alerts-empty">No alerts in the queue. Monitoring in passive mode.</div>`;
                return;
            }

            const urgent = allAlerts.filter(a => a.severity === 'urgent').length;
            const moderate = allAlerts.filter(a => a.severity === 'moderate').length;
            const routine = allAlerts.filter(a => a.severity === 'routine').length;
            const critical = urgent + moderate;

            summary.innerHTML = `
                <div class="alert-summary-card">
                    <div class="label">Open Alerts</div>
                    <div class="value">${allAlerts.length}</div>
                    <div class="meta">${critical} requiring response</div>
                </div>
                <div class="alert-summary-card">
                    <div class="label">Severity Mix</div>
                    <div class="value">${urgent}/${moderate}/${routine}</div>
                    <div class="meta">Urgent / Moderate / Routine</div>
                </div>
                <div class="alert-summary-card">
                    <div class="label">Active Filters</div>
                    <div class="value">${alertFilters.size}</div>
                    <div class="meta">${Array.from(alertFilters).map(s => severityMeta[s].label).join(', ')}</div>
                </div>
            `;
        }

        function toggleAlertFilter(severity) {
            if (alertFilters.has(severity) && alertFilters.size === 1) {
                showToast('At least one severity must stay visible.');
                return;
            }

            if (alertFilters.has(severity)) {
                alertFilters.delete(severity);
            } else {
                alertFilters.add(severity);
            }

            renderAlerts();
        }

        function filterSpecies(species) {
            currentSpecies = species;
            document.querySelectorAll('.species-tab').forEach(t => t.classList.remove('active'));
            event.currentTarget.classList.add('active');
            renderAnimals();
        }

        // Render animals grid
        function renderAnimals() {
            const grid = document.getElementById('animalsGrid');
            const animalList = animalDatabase[currentSpecies] || [];

            grid.innerHTML = animalList.map(animal => {
                const hasAlerts = animal.alerts.length > 0 || animal.health === 'danger';
                const devices = [];
                if (animal.sensors.heartRate) devices.push('❤️');
                if (animal.sensors.temp || animal.sensors.baskingTemp) devices.push('🌡️');
                if (animal.cctv) devices.push('📹');
                if (animal.tracking.enabled) devices.push('📍');
                if (animal.safety) devices.push('🔒');

                return `
                    <div class="animal-card ${hasAlerts ? 'has-alert' : ''}" onclick="openModal(${animal.id})">
                        <div class="animal-image-wrapper">
                            <img src="${animal.images[0]}" class="animal-image" alt="${animal.name}">
                            ${animal.tracking.enabled ? '<div class="tracking-badge live">LIVE TRACKING</div>' : ''}
                            <div class="health-badge ${animal.health}">
                                ${animal.health === 'good' ? '✓' : animal.health === 'warning' ? '⚠️' : '🔴'}
                            </div>
                        </div>
                        <div class="animal-content">
                            <div class="animal-header">
                                <div>
                                    <div class="animal-name">${animal.name}</div>
                                    <div class="animal-species">${animal.species}</div>
                                </div>
                            </div>
                            <div class="animal-stats">
                                <div class="stat-item">
                                    <div class="stat-item-label">Last Fed</div>
                                    <div class="stat-item-value">${animal.lastFed}</div>
                                </div>
                                <div class="stat-item">
                                    <div class="stat-item-label">Health Status</div>
                                    <div class="stat-item-value">${animal.health.toUpperCase()}</div>
                                </div>
                            </div>
                            <div class="animal-devices">
                                ${devices.map(icon => `<div class="device-icon">${icon}</div>`).join('')}
                            </div>
                            <div class="animal-actions">
                                <button class="btn btn-primary">👁️ View Details</button>
                                <button class="btn btn-success" onclick="event.stopPropagation(); feedNow('${animal.name}')">🍽️ Feed</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Tracking simulation with realistic movement
        function startTrackingSimulation() {
            if (trackingUpdateInterval) clearInterval(trackingUpdateInterval);

            trackingUpdateInterval = setInterval(() => {
                const allAnimals = Object.values(animalDatabase).flat();
                allAnimals.forEach(animal => {
                    if (!animal.tracking.enabled) return;

                    if (animal.tracking.status === 'moving' &&
                        Number.isFinite(animal.tracking.lat) &&
                        Number.isFinite(animal.tracking.lng)) {
                        const centerLat = animal.tracking.center?.lat ?? animal.tracking.lat;
                        const centerLng = animal.tracking.center?.lng ?? animal.tracking.lng;
                        const radius = animal.tracking.radius ?? 0.0002;
                        const jitter = radius * 0.6;
                        animal.tracking.lat = clamp(centerLat + (Math.random() - 0.5) * jitter, centerLat - radius, centerLat + radius);
                        animal.tracking.lng = clamp(centerLng + (Math.random() - 0.5) * jitter, centerLng - radius, centerLng + radius);
                    }

                    if (Math.random() < (animal.tracking.status === 'moving' ? 0.025 : 0.05)) {
                            animal.tracking.status = animal.tracking.status === 'moving' ? 'resting' : 'moving';
                    }
                });

                if (document.getElementById('tracking-section').classList.contains('active')) {
                    renderTracking();
                }
            }, 4000);
        }

        // Render tracking map
        function renderTracking() {
            initializeMap();
            const mapCard = document.getElementById('mapCard');
            if (mapCard) {
                mapCard.classList.toggle('heat-mode', trackingViewMode === 'heat');
            }

            const allAnimals = Object.values(animalDatabase).flat();
            const trackedAnimals = allAnimals.filter(a => a.tracking.enabled && trackingFilters.has(a.species));

            renderTrackingLegend(allAnimals);
            renderTrackingStats(trackedAnimals);

            const listContainer = document.getElementById('trackingList');
            const emptyOverlay = document.getElementById('mapEmptyState');

            document.getElementById('trackedCount').textContent = trackedAnimals.length;

            if (listContainer) {
                if (!trackedAnimals.length) {
                    listContainer.innerHTML = `<div class="tracking-empty">No live trackers match the current filters.</div>`;
                } else {
                    listContainer.innerHTML = trackedAnimals.map(animal => `
                <div class="tracking-item" onclick="openModal(${animal.id})">
                    <img src="${animal.images[0]}" class="tracking-avatar" alt="${animal.name}">
                    <div class="tracking-info">
                        <div class="tracking-name">${animal.name}</div>
                        <div class="tracking-location">📍 ${animal.tracking.location}</div>
                        <div class="tracking-location">⏱️ Last fed ${animal.lastFed}</div>
                    </div>
                    <div class="tracking-status status-${animal.tracking.status}">
                        ${animal.tracking.status}
                    </div>
                </div>
            `).join('');
                }
            }

            if (!markerLayer || !mapInstance) {
                if (!trackedAnimals.length) {
                    emptyOverlay?.classList.remove('hidden');
                    mapNeedsFit = true;
                } else {
                    emptyOverlay?.classList.add('hidden');
                }
                return;
            }

            if (!trackedAnimals.length) {
                emptyOverlay?.classList.remove('hidden');
                mapNeedsFit = true;
                // remove markers if grid is empty
                markerMap.forEach(marker => markerLayer.removeLayer(marker));
                markerMap.clear();
                return;
            }

            emptyOverlay?.classList.add('hidden');

            const activeIds = new Set();
            const latLngs = [];
            trackedAnimals.forEach(animal => {
                if (!Number.isFinite(animal.tracking.lat) || !Number.isFinite(animal.tracking.lng)) return;
                const icon = buildAnimalIcon(animal);
                const position = [animal.tracking.lat, animal.tracking.lng];
                activeIds.add(animal.id);

                if (markerMap.has(animal.id)) {
                    const marker = markerMap.get(animal.id);
                    marker.setLatLng(position);
                    marker.setIcon(icon);
                } else {
                    const marker = L.marker(position, { icon });
                    marker.on('click', () => openModal(animal.id));
                    markerLayer.addLayer(marker);
                    markerMap.set(animal.id, marker);
                }

                latLngs.push(position);
            });

            markerMap.forEach((marker, id) => {
                if (!activeIds.has(id)) {
                    markerLayer.removeLayer(marker);
                    markerMap.delete(id);
                }
            });

            if (latLngs.length && mapNeedsFit) {
                const bounds = L.latLngBounds(latLngs).pad(0.18);
                mapInstance.flyToBounds(bounds, { duration: 0.6, maxZoom: 18 });
                mapNeedsFit = false;
            }
        }

        // Render feeding schedule
        function renderFeeding() {
            const grid = document.getElementById('feedingSchedule');
            grid.innerHTML = feedingSchedule.map(item => `
                <div class="schedule-item">
                    <div class="schedule-time">${item.icon} ${item.time}</div>
                    <div class="schedule-details">
                        <div class="schedule-animal">${item.animal}</div>
                        <div class="schedule-meal">${item.meal}</div>
                    </div>
                    <div class="schedule-status status-${item.status}">
                        ${item.status === 'completed' ? '✓ Completed' : '⏱️ Pending'}
                    </div>
                </div>
            `).join('');
        }

        // Render environment rooms
        function renderRooms() {
            const grid = document.getElementById('roomsGrid');
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

        // Render inventory
        function renderInventory() {
            const grid = document.getElementById('inventoryGrid');
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

        // Render alerts
        function renderAlerts() {
            const allAnimals = Object.values(animalDatabase).flat();
            const alerts = [];

            allAnimals.forEach(animal => {
                animal.alerts.forEach(alertText => {
                    const severity = animal.health === 'danger' ? 'urgent' : 'moderate';
                    alerts.push({
                        severity,
                        message: alertText,
                        animal: `${animal.name} (${animal.species})`,
                        time: 'Just now',
                        animalId: animal.id,
                        location: animal.tracking?.location || 'Habitat floor',
                        health: animal.health,
                        requiresAction: severity !== 'routine'
                    });
                });
            });

            // Add routine alerts
            alerts.push({
                severity: 'routine',
                message: 'Fox vaccination due next week',
                animal: 'Foxes',
                time: 'Today',
                location: 'Clinic dashboard',
                requiresAction: false
            });

            renderAlertsToolbar(alerts);
            renderAlertsSummary(alerts);

            const visibleAlerts = alerts.filter(alert => alertFilters.has(alert.severity));

            const grid = document.getElementById('alertsGrid');
            if (!visibleAlerts.length) {
                grid.innerHTML = `<div class="alerts-empty">No alerts match the current filters.</div>`;
                return;
            }

            grid.innerHTML = visibleAlerts.map(alert => {
                const meta = severityMeta[alert.severity] || {};
                return `
                <div class="alert-item ${alert.severity}">
                    <div class="alert-header">
                            <span class="alert-pill ${alert.severity}">${meta.icon || 'ℹ️'} ${meta.label || alert.severity}</span>
                            <span class="alert-time">${alert.time}</span>
                    </div>
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-animal">${alert.animal}</div>
                        <div class="alert-meta">
                            <span class="alert-tag">📍 ${alert.location || 'Shelter grounds'}</span>
                            <span class="alert-tag">❤️ Status: ${alert.health ? alert.health.toUpperCase() : 'OK'}</span>
                        </div>
                        <div class="alert-progress">
                            <div class="alert-progress-fill" style="--progress:${meta.progress || '60%'}"></div>
                        </div>
                    ${alert.animalId ? `
                        <div class="alert-actions">
                            <button class="btn btn-primary" onclick="openModal(${alert.animalId})">View Details</button>
                            <button class="btn btn-success" onclick="acknowledgeAlert(this)">Acknowledge</button>
                        </div>
                    ` : ''}
                </div>
                `;
            }).join('');
        }

        // Modal functions
        function openModal(id) {
            const allAnimals = Object.values(animalDatabase).flat();
            const animal = allAnimals.find(a => a.id === id);
            if (!animal) return;

            selectedAnimal = animal;
            document.getElementById('modalTitle').textContent = animal.name;
            document.getElementById('modalSubtitle').textContent = animal.species;
            document.getElementById('modalImage').src = animal.images[0];

            // Emergency panel for dangerous animals
            const emergencyPanel = document.getElementById('emergencyPanel');
            if (animal.safety) {
                emergencyPanel.innerHTML = `
                    <div class="emergency-panel">
                        <div class="emergency-title">⚠️ Safety Controls</div>
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            <button class="btn btn-danger" onclick="emergencyLock()">🔒 Emergency Lock</button>
                            <button class="btn btn-danger" onclick="supervisorAlert()">📢 Alert Supervisor</button>
                        </div>
                    </div>
                `;
            } else {
                emergencyPanel.innerHTML = '';
            }

            // CCTV feed display
            const cctvFeed = document.getElementById('cctvFeed');
            if (!animal.cctv) {
                cctvFeed.style.display = 'none';
            } else {
                cctvFeed.style.display = 'block';
            }

            // Sensors
            let sensorsHtml = '';
            Object.entries(animal.sensors).forEach(([key, sensor]) => {
                sensorsHtml += `
                    <div class="sensor-card">
                        <div class="sensor-icon">${sensor.icon}</div>
                        <div class="sensor-label">${sensor.label}</div>
                        <div class="sensor-value">${sensor.value}${sensor.unit}</div>
                    </div>
                `;
            });
            document.getElementById('modalSensors').innerHTML = sensorsHtml;

            // Notes
            document.getElementById('modalNotes').innerHTML = animal.notes.map(n =>
                `<div class="note-item"><span class="note-time">${n.time}:</span> ${n.text}</div>`
            ).join('');

            document.getElementById('animalModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('animalModal').classList.remove('active');
        }

        // Actions
        function feedNow(name) {
            showToast(`✅ ${name} has been fed successfully!`);
            setTimeout(() => {
                updateDashboardStats();
                renderAnimals();
            }, 500);
        }

        function feedAnimal() {
            if (selectedAnimal) {
                showToast(`✅ ${selectedAnimal.name} has been fed!`);
                closeModal();
                setTimeout(() => {
                    updateDashboardStats();
                    renderAnimals();
                }, 500);
            }
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

        function emergencyLock() {
            showToast(`🔒 Emergency lock activated for ${selectedAnimal.name}'s enclosure`);
        }

        function supervisorAlert() {
            showToast(`📢 Supervisor has been alerted about ${selectedAnimal.name}`);
        }

        function acknowledgeAlert(btn) {
            btn.closest('.alert-item').style.opacity = '0.5';
            showToast('✅ Alert acknowledged');
            setTimeout(() => {
                btn.closest('.alert-item').remove();
                updateDashboardStats();
            }, 500);
        }

        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        // Close modal on outside click
        document.getElementById('animalModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });