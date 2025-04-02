class Chunk {
    constructor(x, z, worldGenerator) {
        this.x = x;
        this.z = z;
        this.worldGenerator = worldGenerator;
        this.size = 16; // 16x16x256 blocos
        this.height = 256;
        this.blocks = new Array(this.size * this.height * this.size).fill(Block.TYPES.AIR);
        this.mesh = null;
        this.isGenerated = false;
        this.isLoaded = false;
    }
    
    // Converter coordenadas locais para índice no array
    getIndex(x, y, z) {
        return y * this.size * this.size + z * this.size + x;
    }
    
    // Obter tipo de bloco em coordenadas locais
    getBlock(x, y, z) {
        if (x < 0 || x >= this.size || y < 0 || y >= this.height || z < 0 || z >= this.size) {
            return Block.TYPES.AIR;
        }
        
        return this.blocks[this.getIndex(x, y, z)];
    }
    
        // Definir tipo de bloco em coordenadas locais
        setBlock(x, y, z, blockType) {
            if (x < 0 || x >= this.size || y < 0 || y >= this.height || z < 0 || z >= this.size) {
                return false;
            }
            
            this.blocks[this.getIndex(x, y, z)] = blockType;
            return true;
        }
        
        // Gerar terreno do chunk
        generate() {
            if (this.isGenerated) return;
            
            // Gerar terreno base
            for (let x = 0; x < this.size; x++) {
                for (let z = 0; z < this.size; z++) {
                    // Coordenadas globais para geração de ruído
                    const worldX = this.x * this.size + x;
                    const worldZ = this.z * this.size + z;
                    
                    // Obter altura do terreno
                    const height = this.worldGenerator.getHeightAt(worldX, worldZ);
                    
                    // Definir blocos de acordo com a altura
                    for (let y = 0; y < this.height; y++) {
                        let blockType = Block.TYPES.AIR;
                        
                        if (y === 0) {
                            // Camada de bedrock no fundo
                            blockType = Block.TYPES.BEDROCK;
                        } else if (y < height - 4) {
                            // Pedra abaixo da superfície
                            blockType = Block.TYPES.STONE;
                        } else if (y < height - 1) {
                            // Terra próximo à superfície
                            blockType = Block.TYPES.DIRT;
                        } else if (y === height - 1) {
                            // Superfície (grama ou areia)
                            if (height < 65) { // Nível do mar = 64
                                blockType = Block.TYPES.SAND;
                            } else {
                                blockType = Block.TYPES.GRASS;
                            }
                        } else if (y < 64 && y < height) {
                            // Água abaixo do nível do mar
                            blockType = Block.TYPES.WATER;
                        }
                        
                        this.setBlock(x, y, z, blockType);
                    }
                }
            }
            
            // Gerar cavernas
            this.worldGenerator.generateCaves(this);
            
            // Gerar árvores
            this.worldGenerator.generateTrees(this);
            
            this.isGenerated = true;
        }
        
        // Criar mesh do chunk para renderização
        createMesh(scene) {
            if (this.mesh) {
                scene.remove(this.mesh);
            }
            
            // Geometria combinada para todos os blocos visíveis
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            const normals = [];
            const uvs = [];
            const indices = [];
            
            // Materiais para diferentes tipos de blocos
            const materials = {};
            const meshes = [];
            
            // Verificar cada bloco no chunk
            for (let x = 0; x < this.size; x++) {
                for (let y = 0; y < this.height; y++) {
                    for (let z = 0; z < this.size; z++) {
                        const blockType = this.getBlock(x, y, z);
                        
                        // Pular blocos de ar
                        if (blockType === Block.TYPES.AIR) continue;
                        
                        // Verificar se o bloco está exposto (tem ar ao redor)
                        const isExposed = this.isBlockExposed(x, y, z);
                        
                        if (isExposed) {
                            // Criar mesh para o bloco
                            const worldX = this.x * this.size + x;
                            const worldZ = this.z * this.size + z;
                            
                            const blockMesh = Block.createMesh(blockType, worldX, y, worldZ);
                            if (blockMesh) {
                                meshes.push(blockMesh);
                            }
                        }
                    }
                }
            }
            
            // Criar grupo para todos os blocos
            this.mesh = new THREE.Group();
            meshes.forEach(mesh => this.mesh.add(mesh));
            
            // Adicionar à cena
            scene.add(this.mesh);
            this.isLoaded = true;
        }
        
        // Verificar se um bloco está exposto ao ar (visível)
        isBlockExposed(x, y, z) {
            // Verificar os seis lados do bloco
            return this.getBlock(x + 1, y, z) === Block.TYPES.AIR ||
                   this.getBlock(x - 1, y, z) === Block.TYPES.AIR ||
                   this.getBlock(x, y + 1, z) === Block.TYPES.AIR ||
                   this.getBlock(x, y - 1, z) === Block.TYPES.AIR ||
                   this.getBlock(x, y, z + 1) === Block.TYPES.AIR ||
                   this.getBlock(x, y, z - 1) === Block.TYPES.AIR;
        }
        
        // Descarregar chunk da memória
        unload(scene) {
            if (this.mesh) {
                scene.remove(this.mesh);
                this.mesh.traverse(child => {
                    if (child.geometry) {
                        child.geometry.dispose();
                    }
                    if (child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(material => material.dispose());
                        } else {
                            child.material.dispose();
                        }
                    }
                });
                this.mesh = null;
            }
            this.isLoaded = false;
        }
    }
    