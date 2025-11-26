// Cage Monitor functionality

let panX = 0; // Horizontal pan position (pixels)
let panY = 0; // Vertical pan position (pixels)
const panStep = 50; // Pixels to move per button press
const maxPan = 200; // Maximum pan distance in pixels
let cageCurrentSpecies = 'Porcupine'; // Default species for cage monitor

// Video sources for each species
const speciesVideos = {
    'Goat': '../../videos/goat.MOV',
    'Sugarglider': '../../videos/sugarglider.MOV',
    'Alligator': '../../videos/alligator.mp4',
    'Snail': '../../videos/snail.MOV',
    'Porcupine': '../../videos/porcupine.MP4',
    'Fox': '../../videos/fox.MP4'
};

// Species display names mapping
const speciesDisplayNames = {
    'Goat': 'Goats',
    'Sugarglider': 'Sugar Gliders',
    'Alligator': 'Alligators',
    'Snail': 'Snails',
    'Porcupine': 'Porcupines',
    'Fox': 'Foxes'
};

// Switch CCTV feed based on selected species
function switchCCTVFeed(species) {
    const cctvVideo = document.getElementById('cctvVideo');
    const cctvPlaceholder = document.getElementById('cctvPlaceholder');
    const speciesTabs = document.querySelectorAll('.species-tab');
    const speciesNameElement = document.getElementById('currentSpeciesName');
    
    if (!cctvVideo) {
        console.error('CCTV video element not found');
        return;
    }
    
    // Update active tab - remove active from all first
    speciesTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active to clicked tab
    speciesTabs.forEach(tab => {
        const tabSpecies = tab.getAttribute('data-species');
        if (tabSpecies === species) {
            tab.classList.add('active');
        }
    });
    
    // Update species name in header
    if (speciesNameElement) {
        speciesNameElement.textContent = speciesDisplayNames[species] || species;
    }
    
    // Reset pan position
    panX = 0;
    panY = 0;
    
    // Update video source
    const videoSrc = speciesVideos[species] || speciesVideos['Porcupine'];
    
    // Show placeholder while loading
    if (cctvPlaceholder) {
        cctvPlaceholder.classList.remove('hidden');
    }
    
    // Update video source and load
    cctvVideo.src = videoSrc;
    cageCurrentSpecies = species;
    
    // Reset video position
    cctvVideo.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
    
    // Load new video
    cctvVideo.load();
    
    // Play the video after it loads
    cctvVideo.onloadeddata = () => {
        if (cctvPlaceholder) {
            cctvPlaceholder.classList.add('hidden');
        }
        cctvVideo.play().catch(err => {
            console.error('Error playing video:', err);
        });
    };
    
    if (typeof showToast === 'function') {
        showToast(`Switched to ${species} CCTV feed`);
    }
}

// Move camera in specified direction
function moveCamera(direction) {
    const cctvFeed = document.getElementById('cctvFeed');
    const positionIndicator = document.getElementById('cameraPosition');
    const cctvVideo = document.getElementById('cctvVideo');
    
    // Add slide animation
    cctvFeed.classList.add('sliding');
    setTimeout(() => {
        cctvFeed.classList.remove('sliding');
    }, 300);

    // Update pan position based on direction
    switch(direction) {
        case 'up':
            panY = Math.min(maxPan, panY + panStep);
            break;
        case 'down':
            panY = Math.max(-maxPan, panY - panStep);
            break;
        case 'left':
            panX = Math.min(maxPan, panX + panStep);
            break;
        case 'right':
            panX = Math.max(-maxPan, panX - panStep);
            break;
    }

    // Update position indicator
    if (positionIndicator) {
        let xDir = panX > 0 ? '←' : panX < 0 ? '→' : '';
        let yDir = panY > 0 ? '↑' : panY < 0 ? '↓' : '';
        let displayText = '';
        if (xDir || yDir) {
            displayText = `${yDir}${xDir}`;
        } else {
            displayText = 'Center';
        }
        positionIndicator.textContent = displayText;
    }

    // Slide the video based on pan position
    if (cctvVideo && !cctvVideo.classList.contains('hidden')) {
        cctvVideo.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
    }

    // Show toast notification
    if (typeof showToast === 'function') {
        showToast(`Camera panned: ${direction.toUpperCase()}`);
    }
}

// Recording state
let isRecording = false;

// Toggle recording
function toggleRecording() {
    const recordBtn = document.getElementById('recordBtn');
    isRecording = !isRecording;
    
    if (isRecording) {
        recordBtn.classList.add('recording');
        recordBtn.querySelector('.action-label').textContent = 'Stop';
        if (typeof showToast === 'function') {
            showToast('Recording started');
        }
        // Here you would start actual recording functionality
        // For now, it's just a visual indicator
    } else {
        recordBtn.classList.remove('recording');
        recordBtn.querySelector('.action-label').textContent = 'Record';
        if (typeof showToast === 'function') {
            showToast('Recording stopped');
        }
        // Here you would stop recording and save the file
    }
}

// Take screenshot
function takeScreenshot() {
    const cctvFeed = document.getElementById('cctvFeed');
    const cctvVideo = document.getElementById('cctvVideo');
    
    if (!cctvFeed) return;
    
    try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match the feed
        canvas.width = cctvFeed.offsetWidth;
        canvas.height = cctvFeed.offsetHeight;
        
        // If video is visible, try to capture it
        if (cctvVideo && !cctvVideo.classList.contains('hidden') && cctvVideo.readyState >= 2) {
            // Calculate the visible portion of the video based on pan position
            const video = cctvVideo;
            const videoWidth = video.videoWidth || video.offsetWidth;
            const videoHeight = video.videoHeight || video.offsetHeight;
            const scale = Math.max(canvas.width / videoWidth, canvas.height / videoHeight) * 1.5; // 1.5 because video is 150%
            
            // Calculate source rectangle (what part of the video to show)
            const sourceX = (videoWidth / 2) - (canvas.width / 2 / scale) - (panX / scale);
            const sourceY = (videoHeight / 2) - (canvas.height / 2 / scale) - (panY / scale);
            const sourceWidth = canvas.width / scale;
            const sourceHeight = canvas.height / scale;
            
            // Draw the video portion
            ctx.drawImage(
                video,
                sourceX, sourceY, sourceWidth, sourceHeight,
                0, 0, canvas.width, canvas.height
            );
        } else {
            // Draw black background if no video
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Convert to blob and download
        canvas.toBlob(function(blob) {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cctv-screenshot-${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                if (typeof showToast === 'function') {
                    showToast('Screenshot saved');
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast('Screenshot failed');
                }
            }
        }, 'image/png');
    } catch (error) {
        console.error('Screenshot error:', error);
        if (typeof showToast === 'function') {
            showToast('Screenshot failed');
        }
    }
}

// Center camera - reset pan position to center
function centerCamera() {
    const cctvFeed = document.getElementById('cctvFeed');
    const positionIndicator = document.getElementById('cameraPosition');
    const cctvVideo = document.getElementById('cctvVideo');
    
    // Reset pan position
    panX = 0;
    panY = 0;
    
    // Add slide animation
    cctvFeed.classList.add('sliding');
    setTimeout(() => {
        cctvFeed.classList.remove('sliding');
    }, 300);
    
    // Update position indicator
    if (positionIndicator) {
        positionIndicator.textContent = 'Center';
    }
    
    // Reset video position to center
    if (cctvVideo && !cctvVideo.classList.contains('hidden')) {
        cctvVideo.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
    }
    
    // Show toast notification
    if (typeof showToast === 'function') {
        showToast('Camera centered');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const positionIndicator = document.getElementById('cameraPosition');
    if (positionIndicator) {
        positionIndicator.textContent = 'Center';
    }
    
    // Initialize species name in header
    const speciesNameElement = document.getElementById('currentSpeciesName');
    if (speciesNameElement) {
        speciesNameElement.textContent = speciesDisplayNames[cageCurrentSpecies] || 'Porcupines';
    }

    // Hide placeholder if video loads successfully
    const cctvVideo = document.getElementById('cctvVideo');
    const cctvPlaceholder = document.getElementById('cctvPlaceholder');
    
    if (cctvVideo) {
        // Set up video load handler
        const handleVideoLoad = () => {
            if (cctvPlaceholder) {
                cctvPlaceholder.classList.add('hidden');
            }
            // Initialize video position
            cctvVideo.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px))`;
        };
        
        cctvVideo.addEventListener('loadeddata', handleVideoLoad);
        cctvVideo.addEventListener('error', () => {
            if (cctvPlaceholder) {
                cctvPlaceholder.classList.remove('hidden');
            }
            console.error('Error loading video:', cctvVideo.src);
        });
        
        // If video is already loaded
        if (cctvVideo.readyState >= 2) {
            handleVideoLoad();
        }
    }
});

