class UI {
    constructor(inventory) {
        this.inventory = inventory;
        this.debugInfo = {
            fps: 0,
            position: { x: 0, y: 0, z: 0 },
            chunk: { x: 0, z: 0 }
        };
        
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        this.createDebugOverlay();
    }
    
    createDebugOverlay() {
        const debugOverlay = document.createElement('div');
        debugOverlay.id = 'debug-overlay';
        debugOverlay.style.position = 'absolute';
        debugOverlay.style.top = '10px';
        debugOverlay.style.left = '10px';
        debugOverlay.style.color = 'white';
        debugOverlay.style.fontFamily = 'monospace';
        debugOverlay.style.fontSize = '14px';
        debugOverlay.style.textShadow = '1px 1px 1px black';
        debugOverlay.style.display = 'none';
        
        document.getElementById('ui-overlay').appendChild(debugOverlay);
    }
    
    setupEvents() {
        // Mostrar/ocultar informações de debug com F3
        document.addEventListener('keydown', (e) => {
            if (e.code === 'F3') {
                const debugOverlay = document.getElementById('debug-overlay');
                debugOverlay.style.display = debugOverlay.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    update() {
        // Atualizar FPS
        const now = performance.now();
        this.frameCount++;
        
        if (now - this.lastFpsUpdate > 1000) {
            this.debugInfo.fps = Math.round(this.frameCount * 1000 / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
        
        // Atualizar informações de debug
        this.updateDebugInfo();
        
        // Atualizar barra de inventário
        this.inventory.updateUI();
    }
    
    updateDebugInfo() {
        const debugOverlay = document.getElementById('debug-overlay');
        
        if (debugOverlay.style.display !== 'none') {
            debugOverlay.innerHTML = `
                NovaCraft | FPS: ${this.debugInfo.fps}<br>
                Position: X: ${this.debugInfo.position.x.toFixed(2)} Y: ${this.debugInfo.position.y.toFixed(2)} Z: ${this.debugInfo.position.z.toFixed(2)}<br>
                Chunk: X: ${this.debugInfo.chunk.x} Z: ${this.debugInfo.chunk.z}
            `;
        }
    }
    
    setPlayerPosition(position) {
        this.debugInfo.position = position;
        this.debugInfo.chunk.x = Math.floor(position.x / 16);
        this.debugInfo.chunk.z = Math.floor(position.z / 16);
    }
}
