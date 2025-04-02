class WorldGenerator {
    constructor() {
        this.noiseUtils = new NoiseUtils();
        this.mountainGenerator = new MountainGenerator(this.noiseUtils);
        this.caveGenerator = new CaveGenerator(this.noiseUtils);
        this.scene = new THREE.Scene();
        this.chunks = {};
        this.loadDistance = 3; // Distância de carregamento em chunks
        
        // Configurar iluminação
        this.setupLighting();
    }
    
    setupLighting() {
        // Luz ambiente
        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        this.scene.add(ambientLight);
        
        // Luz direcional (sol)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 0.5).normalize();
        this.scene.add(directionalLight);
        
        // Cor de fundo (céu)
        this.scene.background = new THREE.Color(0x87CEEB);
        
        // Névoa para simular distância de renderização
        this.scene.fog = new THREE.Fog(0x87CEEB, 20, 16 * this.loadDistance);
    }
    
    // Obter altura do terreno em uma coordenada
    getHeightAt(x, z) {
        return this.mountainGenerator.getHeightAt(x, z);
    }
    
    // Gerar cavernas em um chunk
    generateCaves(chunk) {
        this.caveGenerator.generateCaves(chunk);
    }
    
    // Gerar árvores em um chunk
    generateTrees(chunk) {
        // Chance de árvore por bloco de superfície
        const treeChance = 0.005;
        
        for (let x = 0; x < chunk.size; x++) {
            for (let z = 0; z < chunk.size; z++) {
                // Encontrar a superfície
                for (let y = chunk.height - 1; y > 0; y--) {
                    const blockType = chunk.getBlock(x, y, z);
                    
                    // Se encontrou um bloco de grama
                    if (blockType === Block.TYPES.GRASS) {
                        // Verificar se deve gerar uma árvore
                        if (Math.random() < treeChance) {
                            this.generateTree(chunk, x, y + 1, z);
                        }
                        break;
                    } else if (blockType !== Block.TYPES.AIR) {
                        // Se não for ar nem grama, pular para o próximo bloco
                        break;
                    }
                }
            }
        }
    }
    
    // Gerar uma árvore em uma posição
    generateTree(chunk, x, y, z) {
        // Verificar se há espaço para a árvore
        if (x < 2 || x > chunk.size - 3 || z < 2 || z > chunk.size - 3 || y > chunk.height - 6) {
            return;
        }
        
        // Altura do tronco (3-5 blocos)
        const trunkHeight = 3 + Math.floor(Math.random() * 3);
        
        // Gerar tronco
        for (let i = 0; i < trunkHeight; i++) {
            chunk.setBlock(x, y + i, z, Block.TYPES.WOOD);
        }
        
        // Gerar folhas (3x3x3)
        for (let ox = -2; ox <= 2; ox++) {
            for (let oz = -2; oz <= 2; oz++) {
                for (let oy = 0; oy <= 2; oy++) {
                    // Distância do centro
                    const dist = Math.sqrt(ox * ox + oz * oz + oy * oy);
                    
                    // Folhas em formato aproximado de esfera
                    if (dist < 2.5) {
                        const lx = x + ox;
                        const ly = y + trunkHeight - 1 + oy;
                        const lz = z + oz;
                        
                        // Verificar limites do chunk
                        if (lx >= 0 && lx < chunk.size && ly >= 0 && ly < chunk.height && lz >= 0 && lz < chunk.size) {
                            // Não substituir o tronco
                            if (chunk.getBlock(lx, ly, lz) === Block.TYPES.AIR) {
                                chunk.setBlock(lx, ly, lz, Block.TYPES.LEAVES);
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Obter ou criar um chunk
    getChunk(x, z) {
        const key = `${x},${z}`;
        
        if (!this.chunks[key]) {
            this.chunks[key] = new Chunk(x, z, this);
        }
        
        return this.chunks[key];
    }
    
    // Atualizar chunks com base na posição do jogador
    update(playerPosition) {
        // Converter posição do jogador para coordenadas de chunk
        const playerChunkX = Math.floor(playerPosition.x / 16);
        const playerChunkZ = Math.floor(playerPosition.z / 16);
        
        // Carregar chunks próximos
        for (let x = playerChunkX - this.loadDistance; x <= playerChunkX + this.loadDistance; x++) {
            for (let z = playerChunkZ - this.loadDistance; z <= playerChunkZ + this.loadDistance; z++) {
                const chunk = this.getChunk(x, z);
                
                // Gerar terreno se ainda não foi gerado
                if (!chunk.isGenerated) {
                    chunk.generate();
                }
                
                // Criar mesh se ainda não foi carregado
                if (!chunk.isLoaded) {
                    chunk.createMesh(this.scene);
                }
            }
        }
        
        // Descarregar chunks distantes
        for (const key in this.chunks) {
            const [chunkX, chunkZ] = key.split(',').map(Number);
            
            const distance = Math.max(
                Math.abs(chunkX - playerChunkX),
                Math.abs(chunkZ - playerChunkZ)
            );
            
            if (distance > this.loadDistance) {
                this.chunks[key].unload(this.scene);
            }
        }
    }
    
    // Obter objetos de blocos para detecção de colisão
    getBlockObjects() {
        const objects = [];
        
        for (const key in this.chunks) {
            const chunk = this.chunks[key];
            
            if (chunk.mesh) {
                chunk.mesh.children.forEach(child => {
                    objects.push(child);
                });
            }
        }
        
        return objects;
    }
}
