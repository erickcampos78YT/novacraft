class Audio {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.volume = 1.0;
    }
    
    loadSound(name, path) {
        const audio = new Audio(path);
        this.sounds[name] = audio;
    }
    
    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].volume = this.volume;
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        }
    }
    
    playMusic(path, loop = true) {
        if (this.music) {
            this.music.pause();
        }
        
        this.music = new Audio(path);
        this.music.volume = this.volume * 0.5;
        this.music.loop = loop;
        this.music.play();
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}
