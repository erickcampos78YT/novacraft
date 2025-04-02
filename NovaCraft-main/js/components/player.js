class Player {
    constructor() {
        // Configuração da câmera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 0); // Altura dos olhos
        
        // Propriedades físicas
        this.height = 1.8;
        this.width = 0.6;
        this.position = new THREE.Vector3(0, 20, 0); // Posição inicial
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.speed = 5.0;
        this.jumpForce = 8.0;
        this.onGround = false;
        
        // Propriedades de rotação
        this.rotation = {
            x: 0, // Pitch (olhar para cima/baixo)
            y: 0  // Yaw (olhar para esquerda/direita)
        };
        
        // Propriedades de interação
        this.reach = 5.0; // Distância de alcance para interagir com blocos
        this.selectedBlock = 0; // Tipo de bloco selecionado
    }
    
    update(deltaTime, input, world) {
        this.handleMovement(deltaTime, input, world);
        this.updateCamera();
    }
    
    handleMovement(deltaTime, input, world) {
        // Movimento baseado na direção da câmera
        const moveDirection = new THREE.Vector3(0, 0, 0);
        
        if (input.isKeyPressed('KeyW')) moveDirection.z -= 1;
        if (input.isKeyPressed('KeyS')) moveDirection.z += 1;
        if (input.isKeyPressed('KeyA')) moveDirection.x -= 1;
        if (input.isKeyPressed('KeyD')) moveDirection.x += 1;
        
        if (moveDirection.length() > 0) {
            moveDirection.normalize();
            
            // Aplicar rotação da câmera ao movimento
            const rotationY = new THREE.Quaternion();
            rotationY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation.y);
            moveDirection.applyQuaternion(rotationY);
            
            // Aplicar velocidade
            moveDirection.multiplyScalar(this.speed * deltaTime);
            
            // Mover o jogador
            this.position.add(moveDirection);
        }
        
        // Pulo
        if (input.isKeyPressed('Space') && this.onGround) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
        }
    }
    
    rotate(dx, dy) {
        // Sensibilidade do mouse
        const sensitivity = 0.002;
        
        // Atualizar rotação
        this.rotation.y -= dx * sensitivity;
        this.rotation.x -= dy * sensitivity;
        
        // Limitar rotação vertical para evitar que a câmera gire completamente
        this.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.rotation.x));
    }
    
    updateCamera() {
        // Atualizar posição da câmera
        this.camera.position.copy(this.position);
        this.camera.position.y += this.height - 0.2; // Ajustar para altura dos olhos
        
        // Atualizar rotação da câmera
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.x = this.rotation.x;
        this.camera.rotation.y = this.rotation.y;
    }
    
    getRayFromCamera() {
        // Criar raio a partir da câmera para interação com blocos
        const raycaster = new THREE.Raycaster();
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        raycaster.set(this.camera.position, direction);
        return raycaster;
    }
    
    getTargetBlock(world) {
        // Obter bloco que o jogador está olhando
        const raycaster = this.getRayFromCamera();
        const intersects = raycaster.intersectObjects(world.getBlockObjects(), true);
        
        if (intersects.length > 0 && intersects[0].distance <= this.reach) {
            return {
                position: intersects[0].point,
                normal: intersects[0].face.normal,
                object: intersects[0].object
            };
        }
        
        return null;
    }
}
