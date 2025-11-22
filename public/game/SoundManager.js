class SoundManager {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        this.menuAudio = document.getElementById('menuMusic');
    }

    playFrequency(freq, duration = 0.15) {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.1;
        osc.connect(gain);
        gain.connect(this.context.destination);
        osc.start();
        osc.stop(this.context.currentTime + duration);
    }

    playCatch() {
        this.playFrequency(880);
    }

    playMenu() {
        this.playFrequency(440);
    }

    playHover() {
        this.playFrequency(660);
    }

    startMenuMusic() {
        if (this.menuAudio) {
            this.menuAudio.volume = 0.3;
            this.menuAudio.play().catch(() => {});
        }
    }

    stopMenuMusic() {
        if (this.menuAudio) {
            this.menuAudio.pause();
            this.menuAudio.currentTime = 0;
        }
    }
}

window.soundManager = new SoundManager();
