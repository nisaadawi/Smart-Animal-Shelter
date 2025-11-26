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
                '../../images/goat/Jebat.jpg'
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
                '../../images/goat/Puteh.jpg'
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
                '../../images/goat/Leman.jpg'
            ],
            imageFocus: 'center 20%',
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
                '../../images/sugarglider/Mimi.jpg'
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
                '../../images/sugarglider/Cici.jpg'
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
                '../../images/sugarglider/Miki.jpg'
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
                '../../images/alligators/Awang.jpg'
            ],
            imageFocus: 'center 20%',
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
                '../../images/alligators/Sulong.jpg'
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
                '../../images/snail/Mondok.jpg'
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
                '../../images/snail/Koko.jpg'
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
                '../../images/snail/Tutu.jpg'
            ],
            imageFocus: 'center 25%',
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
                '../../images/porcupine/Togo.jpg'
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
                '../../images/porcupine/Dodo.jpg'
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
                '../../images/porcupine/Odin.jpg'
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
                '../../images/fox/Pandan.jpg'
            ],
            imageFocus: 'center 90%',
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
                '../../images/fox/Jebat.jpg'
            ],
            imageFocus: 'center 15%',
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

const SMART_TREND_LABELS = ['-6d', '-5d', '-4d', '-3d', '-2d', '-1d', 'Today'];

const animalProfileMeta = {
    1: {
        profile: {
            idTag: 'GO-01',
            breed: 'Boer Mix',
            dob: 'Mar 14, 2021',
            age: '3y 8m',
            sex: 'Female',
            enclosure: 'Pasture East • Pen 4'
        },
        behavior: {
            summary: 'Calm herd leader; responds to whistle commands.',
            alert: 'AI: Hydration dipped overnight—offer an extra water check.'
        },
        smartMetrics: {
            vitalTrend: [72, 73, 74, 73, 75, 74, 73],
            weightCurve: [43.0, 43.2, 43.3, 43.5, 43.6, 43.8, 44.0],
            feedingMinutes: 50,
            medicationMinutes: 360
        }
    },
    2: {
        profile: {
            idTag: 'GO-02',
            breed: 'Saanen',
            dob: 'Oct 02, 2020',
            age: '4y 1m',
            sex: 'Female',
            enclosure: 'Recovery Paddock • Vet Lane 1'
        },
        behavior: {
            summary: 'Gentle but lethargic; prefers quiet companions.',
            alert: 'AI: Appetite suppression trend flagged—continue antibiotics.'
        },
        smartMetrics: {
            vitalTrend: [83, 84, 85, 84, 83, 82, 82],
            weightCurve: [39.5, 39.3, 39.2, 39.1, 38.9, 38.8, 38.7],
            feedingMinutes: 30,
            medicationMinutes: 120
        }
    },
    3: {
        profile: {
            idTag: 'GO-03',
            breed: 'Kalahari Red',
            dob: 'Jan 18, 2021',
            age: '3y 10m',
            sex: 'Male',
            enclosure: 'Pasture West • Pen 1'
        },
        behavior: {
            summary: 'Explorative grazer with high curiosity.',
            alert: 'AI: Increased roaming after midnight—inspect fencing.'
        },
        smartMetrics: {
            vitalTrend: [78, 79, 80, 79, 78, 79, 80],
            weightCurve: [47.1, 47.2, 47.4, 47.5, 47.6, 47.8, 47.9],
            feedingMinutes: 80,
            medicationMinutes: 480
        }
    },
    4: {
        profile: {
            idTag: 'SG-01',
            breed: 'Classic Gray',
            dob: 'May 25, 2022',
            age: '2y 6m',
            sex: 'Female',
            enclosure: 'Nocturnal Dome • Pod 3'
        },
        behavior: {
            summary: 'Bonded pair leader; vocal during enrichment.',
            alert: 'AI: Circadian rhythm stable—maintain light schedule.'
        },
        smartMetrics: {
            vitalTrend: [24.4, 24.5, 24.7, 24.6, 24.4, 24.5, 24.6],
            weightCurve: [0.11, 0.112, 0.113, 0.114, 0.115, 0.116, 0.117],
            feedingMinutes: 120,
            medicationMinutes: 720
        }
    },
    5: {
        profile: {
            idTag: 'SG-02',
            breed: 'Leucistic',
            dob: 'Jul 14, 2022',
            age: '2y 4m',
            sex: 'Female',
            enclosure: 'Nocturnal Dome • Pod 2'
        },
        behavior: {
            summary: 'Playful glider; initiates group activities.',
            alert: 'AI: Energy spikes pre-feeding—prep puzzle feeders earlier.'
        },
        smartMetrics: {
            vitalTrend: [24.0, 24.1, 24.2, 24.3, 24.2, 24.1, 24.2],
            weightCurve: [0.10, 0.101, 0.102, 0.103, 0.104, 0.105, 0.106],
            feedingMinutes: 90,
            medicationMinutes: 600
        }
    },
    6: {
        profile: {
            idTag: 'SG-03',
            breed: 'Mosaic',
            dob: 'Apr 09, 2022',
            age: '2y 7m',
            sex: 'Male',
            enclosure: 'Nocturnal Dome • Pod 4'
        },
        behavior: {
            summary: 'Calm observer; prefers elevated perches.',
            alert: 'AI: Social grooming down 6%—observe tonight.'
        },
        smartMetrics: {
            vitalTrend: [24.7, 24.8, 24.9, 24.8, 24.6, 24.7, 24.8],
            weightCurve: [0.115, 0.116, 0.117, 0.118, 0.119, 0.12, 0.121],
            feedingMinutes: 150,
            medicationMinutes: 720
        }
    },
    7: {
        profile: {
            idTag: 'AL-01',
            breed: 'American Alligator',
            dob: 'Aug 11, 2015',
            age: '10y 3m',
            sex: 'Male',
            enclosure: 'Marsh Basin • Pool A'
        },
        behavior: {
            summary: 'Dominant basker; alert but calm with keepers.',
            alert: 'AI: Thermal profile ideal—continue basking cycle.'
        },
        smartMetrics: {
            vitalTrend: [31.2, 31.8, 32.0, 31.6, 32.1, 32.4, 32.0],
            weightCurve: [178, 179, 179.5, 180, 180.5, 181, 181.5],
            feedingMinutes: 360,
            medicationMinutes: 1440
        }
    },
    8: {
        profile: {
            idTag: 'AL-02',
            breed: 'American Alligator',
            dob: 'May 02, 2014',
            age: '11y 6m',
            sex: 'Female',
            enclosure: 'South Wetlands • Pool B'
        },
        behavior: {
            summary: 'Low-activity basker; favors shade.',
            alert: 'AI: Feeding refusal trend escalated—vet visit queued.'
        },
        smartMetrics: {
            vitalTrend: [30.5, 30.2, 30.0, 30.1, 30.3, 30.2, 30.0],
            weightCurve: [165.2, 165.0, 164.8, 164.7, 164.5, 164.3, 164.1],
            feedingMinutes: 180,
            medicationMinutes: 90
        }
    },
    9: {
        profile: {
            idTag: 'SN-01',
            breed: 'Achatina fulica',
            dob: 'Feb 10, 2023',
            age: '1y 9m',
            sex: 'Hermaphrodite',
            enclosure: 'Terrarium Delta • Stack 2'
        },
        behavior: {
            summary: 'Night climber; thrives with heavy mist cycles.',
            alert: 'AI: Prefers higher humidity—extend foggers by 5 min.'
        },
        smartMetrics: {
            vitalTrend: [22.0, 22.1, 22.0, 22.2, 22.1, 22.0, 22.1],
            weightCurve: [0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48],
            feedingMinutes: 300,
            medicationMinutes: 1440
        }
    },
    10: {
        profile: {
            idTag: 'SN-02',
            breed: 'Achatina immaculata',
            dob: 'Mar 21, 2023',
            age: '1y 8m',
            sex: 'Hermaphrodite',
            enclosure: 'Terrarium Delta • Stack 3'
        },
        behavior: {
            summary: 'Steady grazer; frequents calcium ledge.',
            alert: 'AI: Midday slowdown—rotate enrichment moss.'
        },
        smartMetrics: {
            vitalTrend: [21.8, 21.9, 22.0, 22.1, 22.0, 21.9, 21.8],
            weightCurve: [0.40, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46],
            feedingMinutes: 240,
            medicationMinutes: 1320
        }
    },
    11: {
        profile: {
            idTag: 'SN-03',
            breed: 'Achatina achatina',
            dob: 'Jan 05, 2023',
            age: '1y 10m',
            sex: 'Hermaphrodite',
            enclosure: 'Terrarium Delta • Stack 1'
        },
        behavior: {
            summary: 'Exploratory forager; aerates substrate nightly.',
            alert: 'AI: Moisture interaction optimal—keep routine steady.'
        },
        smartMetrics: {
            vitalTrend: [22.3, 22.2, 22.4, 22.5, 22.4, 22.3, 22.4],
            weightCurve: [0.38, 0.39, 0.40, 0.41, 0.42, 0.43, 0.44],
            feedingMinutes: 180,
            medicationMinutes: 1000
        }
    },
    12: {
        profile: {
            idTag: 'PQ-01',
            breed: 'Malayan Porcupine',
            dob: 'Sep 09, 2018',
            age: '7y 2m',
            sex: 'Male',
            enclosure: 'Central Habitat • Burrow A'
        },
        behavior: {
            summary: 'Friendly explorer; loves puzzle feeders.',
            alert: 'AI: Enrichment response +8%—add scent cues.'
        },
        smartMetrics: {
            vitalTrend: [84, 83, 85, 84, 83, 82, 84],
            weightCurve: [10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1],
            feedingMinutes: 120,
            medicationMinutes: 420
        }
    },
    13: {
        profile: {
            idTag: 'PQ-02',
            breed: 'Malayan Porcupine',
            dob: 'Jun 18, 2019',
            age: '6y 5m',
            sex: 'Female',
            enclosure: 'Central Habitat • Burrow B'
        },
        behavior: {
            summary: 'Reserved; prefers solo feeding windows.',
            alert: 'AI: Enrichment avoidance persists—schedule trainer play.'
        },
        smartMetrics: {
            vitalTrend: [90, 91, 90, 89, 88, 88, 87],
            weightCurve: [9.8, 9.7, 9.6, 9.5, 9.4, 9.3, 9.2],
            feedingMinutes: 45,
            medicationMinutes: 180
        }
    },
    14: {
        profile: {
            idTag: 'PQ-03',
            breed: 'Malayan Porcupine',
            dob: 'Dec 03, 2017',
            age: '7y 11m',
            sex: 'Male',
            enclosure: 'Central Habitat • Isolation Ward'
        },
        behavior: {
            summary: 'Sound-sensitive; limited movement during day.',
            alert: 'AI: Elevated body heat trend—vet notified.'
        },
        smartMetrics: {
            vitalTrend: [96, 97, 96, 95, 95, 94, 94],
            weightCurve: [11.2, 11.1, 11.0, 10.9, 10.8, 10.7, 10.6],
            feedingMinutes: 30,
            medicationMinutes: 60
        }
    },
    15: {
        profile: {
            idTag: 'FX-01',
            breed: 'Red Fox',
            dob: 'Apr 17, 2019',
            age: '6y 7m',
            sex: 'Female',
            enclosure: 'North Enclosure • Runway 2'
        },
        behavior: {
            summary: 'High-energy sprinter; loves scent trails.',
            alert: 'AI: Adrenaline spike pre-dawn—add cool-down walk.'
        },
        smartMetrics: {
            vitalTrend: [120, 121, 122, 121, 120, 119, 118],
            weightCurve: [6.1, 6.2, 6.2, 6.3, 6.3, 6.4, 6.4],
            feedingMinutes: 70,
            medicationMinutes: 420
        }
    },
    16: {
        profile: {
            idTag: 'FX-02',
            breed: 'Cross Fox',
            dob: 'Mar 08, 2020',
            age: '5y 8m',
            sex: 'Male',
            enclosure: 'North Enclosure • Runway 1'
        },
        behavior: {
            summary: 'Curious stalker; vocal at dusk.',
            alert: 'AI: Mild anxiety near visitors—limit proximity.'
        },
        smartMetrics: {
            vitalTrend: [115, 114, 115, 116, 115, 114, 113],
            weightCurve: [5.7, 5.8, 5.8, 5.9, 6.0, 6.0, 6.1],
            feedingMinutes: 95,
            medicationMinutes: 360
        }
    }
};

Object.values(animalDatabase).forEach(speciesList => {
    speciesList.forEach(animal => {
        const meta = animalProfileMeta[animal.id];
        if (meta) {
            animal.profile = meta.profile;
            animal.behaviorProfile = meta.behavior;
            animal.smartMetrics = {
                trendLabels: SMART_TREND_LABELS,
                vitalTrend: meta.smartMetrics.vitalTrend,
                weightCurve: meta.smartMetrics.weightCurve,
                feedingMinutes: meta.smartMetrics.feedingMinutes,
                medicationMinutes: meta.smartMetrics.medicationMinutes
            };
        }
    });
});

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