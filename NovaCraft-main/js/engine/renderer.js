class Renderer {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        
        document.getElementById('game-container').appendChild(this.renderer.domElement);
    }
    
    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
}
