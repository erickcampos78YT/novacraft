class Input {
    constructor() {
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            down: false
        };
        this.pointerLocked = false;
    }
    
    setupEvents(player, world) {
        // Configurar eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Configurar eventos de mouse
        document.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            
            if (e.button === 0) { // Botão esquerdo
                this.handleBlockBreak(player, world);
            } else if (e.button === 2) { // Botão direito
                this.handleBlockPlace(player, world);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.pointerLocked) {
                player.rotate(e.movementX, e.movementY);
            }
        });
        
        // Configurar pointer lock
        document.getElementById('game-container').addEventListener('click', () => {
            if (!this.pointerLocked) {
                document.body.requestPointerLock();
            }
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.pointerLocked = document.pointerLockElement !== null;
        });
        
        // Prevenir menu de contexto
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    isKeyPressed(keyCode) {
        return this.keys[keyCode] === true;
    }
    
    handleBlockBreak(player, world) {
        // Lógica para quebrar blocos
    }
    
    handleBlockPlace(player, world) {
        // Lógica para colocar blocos
    }
}
