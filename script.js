document.addEventListener('DOMContentLoaded', function() {
    // Audio Elements
    const audio = document.getElementById('backgroundAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const musicIndicator = document.getElementById('musicIndicator');
    const currentVolume = document.getElementById('currentVolume');
    const playbackStatus = document.getElementById('playbackStatus');
    const songTitle = document.getElementById('songTitle');
    
    // Set initial volume
    audio.volume = 0.3;
    currentVolume.textContent = '30%';
    
    // Auto-play after user interaction
    let autoPlayAttempted = false;
    
    function attemptAutoPlay() {
        if (!autoPlayAttempted) {
            audio.play().then(() => {
                updatePlayButton(true);
                updateMusicIndicator(true);
                playbackStatus.textContent = 'Playing';
                autoPlayAttempted = true;
            }).catch(error => {
                console.log("Autoplay prevented:", error);
                playbackStatus.textContent = 'Click to play';
                // Show user-friendly message
                const playerControls = document.querySelector('.player-controls');
                const message = document.createElement('div');
                message.className = 'play-message';
                message.innerHTML = '<p>Click the play button to start music</p>';
                message.style.cssText = 'color:#ffcc80; font-size:12px; text-align:center; margin-top:5px;';
                playerControls.appendChild(message);
            });
            autoPlayAttempted = true;
        }
    }
    
    // Attempt autoplay on any user interaction
    document.addEventListener('click', attemptAutoPlay, { once: true });
    document.addEventListener('keydown', attemptAutoPlay, { once: true });
    document.addEventListener('touchstart', attemptAutoPlay, { once: true });
    
    // Play/Pause functionality
    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            updatePlayButton(true);
            updateMusicIndicator(true);
            playbackStatus.textContent = 'Playing';
        } else {
            audio.pause();
            updatePlayButton(false);
            updateMusicIndicator(false);
            playbackStatus.textContent = 'Paused';
        }
    });
    
    // Mute/Unmute functionality
    muteBtn.addEventListener('click', function() {
        audio.muted = !audio.muted;
        if (audio.muted) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBtn.style.color = '#ff5252';
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBtn.style.color = 'white';
        }
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
        currentVolume.textContent = `${Math.round(this.value * 100)}%`;
        
        // Visual feedback for volume change
        const bars = document.querySelectorAll('.music-visualizer .bar');
        bars.forEach((bar, index) => {
            const baseHeight = [8, 12, 16, 12, 8][index];
            const newHeight = baseHeight * (1 + (this.value * 0.5));
            bar.style.height = `${newHeight}px`;
        });
    });
    
    // Update play button icon
    function updatePlayButton(isPlaying) {
        if (isPlaying) {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtn.style.background = '#ff4081';
        } else {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtn.style.background = '#3949ab';
        }
    }
    
    // Update music indicator
    function updateMusicIndicator(isPlaying) {
        if (isPlaying) {
            musicIndicator.innerHTML = '<i class="fas fa-music"></i><span>Music: ON</span>';
            musicIndicator.style.borderColor = 'rgba(100, 181, 246, 0.6)';
            musicIndicator.style.background = 'rgba(57, 73, 171, 0.5)';
        } else {
            musicIndicator.innerHTML = '<i class="fas fa-pause"></i><span>Music: OFF</span>';
            musicIndicator.style.borderColor = 'rgba(255, 82, 82, 0.3)';
            musicIndicator.style.background = 'rgba(255, 82, 82, 0.2)';
        }
    }
    
    // Update song title based on time (simulating playlist)
    function updateSongTitle() {
        const now = new Date();
        const hours = now.getHours();
        
        if (hours < 12) {
            songTitle.textContent = "Morning Vibes";
        } else if (hours < 17) {
            songTitle.textContent = "Afternoon Chill";
        } else {
            songTitle.textContent = "Evening Relaxation";
        }
    }
    
    // Animate music visualizer based on playback
    function animateVisualizer() {
        const bars = document.querySelectorAll('.music-visualizer .bar');
        
        if (!audio.paused && !audio.muted) {
            bars.forEach(bar => {
                bar.style.animationPlayState = 'running';
            });
        } else {
            bars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });
        }
    }
    
    // Check audio state periodically
    setInterval(() => {
        animateVisualizer();
    }, 100);
    
    // Audio event listeners
    audio.addEventListener('play', function() {
        updatePlayButton(true);
        updateMusicIndicator(true);
        playbackStatus.textContent = 'Playing';
        animateVisualizer();
    });
    
    audio.addEventListener('pause', function() {
        updatePlayButton(false);
        updateMusicIndicator(false);
        playbackStatus.textContent = 'Paused';
        animateVisualizer();
    });
    
    audio.addEventListener('volumechange', function() {
        currentVolume.textContent = `${Math.round(audio.volume * 100)}%`;
        volumeSlider.value = audio.volume;
    });
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            const price = this.closest('.product-card').querySelector('.price').textContent;
            
            // Visual feedback
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Added!';
            this.style.background = '#4caf50';
            
            // Play add sound if available
            try {
                const addSound = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
                addSound.volume = 0.1;
                addSound.play();
            } catch(e) {}
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = '';
            }, 1500);
            
            console.log(`Added to cart: ${productName} - ${price}`);
        });
    });
    
    // Quick view functionality
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            alert(`Quick view: ${productName}\nMore details coming soon!`);
        });
    });
    
    // Initialize
    updateSongTitle();
    updatePlayButton(false);
    updateMusicIndicator(false);
    
    // Change song title every hour
    setInterval(updateSongTitle, 3600000);
    
    // Add hover effect to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!audio.paused) {
                audio.volume = Math.min(0.5, audio.volume * 1.2);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!audio.paused) {
                audio.volume = volumeSlider.value;
            }
        });
    });
});
