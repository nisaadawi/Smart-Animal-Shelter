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
            breed: 'Boer Mix',
            dob: '2021-03-14',
            sex: 'Male',
            images: [
                '../../images/goat/Jebat.jpg'
            ],
            health: 'good',
            lastFed: '1h ago',
            behaviorNotes: 'Calm herd leader; responds to whistle commands',
            temperament: 'CALM HERD LEADER; RESPONDS TO WHISTLE COMMANDS',
            aiAlert: null,
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
            breed: 'Nubian',
            dob: '2020-08-22',
            sex: 'Female',
            images: [
                '../../images/goat/Puteh.jpg'
            ],
            health: 'warning',
            lastFed: '4h ago',
            behaviorNotes: 'Gentle and social, prefers company of other goats',
            temperament: 'GENTLE; SOCIAL',
            aiAlert: null,
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
            breed: 'Alpine',
            dob: '2019-11-05',
            sex: 'Male',
            images: [
                '../../images/goat/Leman.jpg'
            ],
            health: 'good',
            lastFed: '3h ago',
            behaviorNotes: 'Active and playful, enjoys climbing structures',
            temperament: 'ACTIVE; PLAYFUL',
            aiAlert: null,
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
            breed: 'Standard',
            dob: '2022-05-10',
            sex: 'Female',
            images: [
                '../../images/sugarglider/Mimi.jpg'
            ],
            health: 'good',
            lastFed: '2h ago',
            behaviorNotes: 'Nocturnal and active at night, enjoys gliding between perches',
            temperament: 'NOCTURNAL; ACTIVE',
            aiAlert: null,
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
            breed: 'Standard',
            dob: '2022-07-18',
            sex: 'Female',
            images: [
                '../../images/sugarglider/Cici.jpg'
            ],
            health: 'good',
            lastFed: '1h ago',
            behaviorNotes: 'Social and bonds well with handlers, enjoys bonding pouch time',
            temperament: 'SOCIAL; BONDING',
            aiAlert: null,
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
            breed: 'Standard',
            dob: '2021-12-03',
            sex: 'Male',
            images: [
                '../../images/sugarglider/Miki.jpg'
            ],
            health: 'good',
            lastFed: '3h ago',
            behaviorNotes: 'Calm and docile, prefers quiet environments',
            temperament: 'CALM; DOCILE',
            aiAlert: null,
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
            breed: 'American Alligator',
            dob: '2018-06-15',
            sex: 'Male',
            images: [
                '../../images/alligators/Awang.jpg'
            ],
            health: 'good',
            lastFed: '1 day ago',
            behaviorNotes: 'Dominant male, prefers basking during day, active hunter',
            temperament: 'DOMINANT; ACTIVE HUNTER',
            aiAlert: null,
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
            breed: 'American Alligator',
            dob: '2019-04-20',
            sex: 'Male',
            images: [
                '../../images/alligators/Sulong.jpg'
            ],
            health: 'warning',
            lastFed: '3 days ago',
            behaviorNotes: 'Recently showing decreased appetite, monitoring closely',
            temperament: 'CAUTIOUS; DECREASED APPETITE',
            aiAlert: 'AI: Hydration dipped overnight—offer an extra water check',
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
            breed: 'Achatina Fulica',
            dob: '2020-01-12',
            sex: 'Hermaphrodite',
            images: [
                '../../images/snail/Mondok.jpg'
            ],
            health: 'good',
            lastFed: '10h ago',
            behaviorNotes: 'Active feeder, enjoys fresh vegetables and calcium sources',
            temperament: 'ACTIVE FEEDER',
            aiAlert: null,
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
            breed: 'Achatina Fulica',
            dob: '2021-03-25',
            sex: 'Hermaphrodite',
            images: [
                '../../images/snail/Koko.jpg'
            ],
            health: 'good',
            lastFed: '8h ago',
            behaviorNotes: 'Prefers moist substrate, active during humid conditions',
            temperament: 'MOISTURE PREFERRING',
            aiAlert: null,
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
            breed: 'Achatina Fulica',
            dob: '2019-09-08',
            sex: 'Hermaphrodite',
            images: [
                '../../images/snail/Tutu.jpg'
            ],
            health: 'good',
            lastFed: '6h ago',
            behaviorNotes: 'Strong shell development, regular calcium intake observed',
            temperament: 'HEALTHY SHELL',
            aiAlert: null,
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
            breed: 'African Crested',
            dob: '2020-07-14',
            sex: 'Male',
            images: [
                '../../images/porcupine/Togo.jpg'
            ],
            health: 'good',
            lastFed: '3h ago',
            behaviorNotes: 'Active and curious, enjoys enrichment toys and puzzle feeders',
            temperament: 'ACTIVE; CURIOUS',
            aiAlert: null,
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
            breed: 'African Crested',
            dob: '2019-11-30',
            sex: 'Female',
            images: [
                '../../images/porcupine/Dodo.jpg'
            ],
            health: 'warning',
            lastFed: '7h ago',
            behaviorNotes: 'Reduced enrichment usage, may need additional stimulation',
            temperament: 'REDUCED ACTIVITY',
            aiAlert: null,
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
            breed: 'African Crested',
            dob: '2018-12-05',
            sex: 'Male',
            images: [
                '../../images/porcupine/Odin.jpg'
            ],
            health: 'danger',
            lastFed: '9h ago',
            behaviorNotes: 'Minimal activity observed, elevated temperature, vet consultation scheduled',
            temperament: 'MINIMAL ACTIVITY; ELEVATED TEMP',
            aiAlert: 'AI: Elevated temperature detected—immediate veterinary attention recommended',
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
            breed: 'Vulpes Vulpes',
            dob: '2021-02-18',
            sex: 'Female',
            images: [
                '../../images/fox/Pandan.jpg'
            ],
            health: 'good',
            lastFed: '6h ago',
            behaviorNotes: 'High energy, enjoys hunt simulation and enrichment activities',
            temperament: 'HIGH ENERGY; ACTIVE',
            aiAlert: null,
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
            breed: 'Vulpes Vulpes',
            dob: '2020-09-12',
            sex: 'Male',
            images: [
                '../../images/fox/Jebat.jpg'
            ],
            health: 'good',
            lastFed: '6h ago',
            behaviorNotes: 'Active and alert, responds well to training, secure perimeter required',
            temperament: 'ACTIVE; ALERT',
            aiAlert: null,
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