class Block {
    constructor(type) {
        this.type = type;
        this.transparent = this.isTransparent(type);
        this.solid = this.isSolid(type);
        this.texture = this.getTextureForType(type);
    }
    
    static TYPES = {
        AIR: 0,
        GRASS: 1,
        DIRT: 2,
        STONE: 3,
        WOOD: 4,
        LEAVES: 5,
        WATER: 6,
        SAND: 7,
        GLASS: 8,
        BEDROCK: 9
    };
    
    static createBlockGeometry() {
        return new THREE.BoxGeometry(1, 1, 1);
    }
    
    static createBlockMaterial(type) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(Block.prototype.getTextureForType(type));
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        
        return new THREE.MeshLambertMaterial({ 
            map: texture,
            transparent: Block.prototype.isTransparent(type)
        });
    }
    
    static createMesh(type, x, y, z) {
        if (type === Block.TYPES.AIR) return null;
        
        const geometry = Block.createBlockGeometry();
        const material = Block.createBlockMaterial(type);
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(x, y, z);
        mesh.userData.blockType = type;
        
        return mesh;
    }
    
    isTransparent(type) {
        return [
            Block.TYPES.AIR,
            Block.TYPES.GLASS,
            Block.TYPES.LEAVES,
            Block.TYPES.WATER
        ].includes(type);
    }
    
    isSolid(type) {
        return type !== Block.TYPES.AIR && type !== Block.TYPES.WATER;
    }
    
    getTextureForType(type) {
        switch(type) {
            case Block.TYPES.GRASS: return 'assets/textures/grass.png';
            case Block.TYPES.DIRT: return 'assets/textures/dirt.png';
            case Block.TYPES.STONE: return 'assets/textures/stone.png';
            case Block.TYPES.WOOD: return 'assets/textures/wood.png';
            case Block.TYPES.LEAVES: return 'assets/textures/leaves.png';
            case Block.TYPES.WATER: return 'assets/textures/water.png';
            case Block.TYPES.SAND: return 'assets/textures/sand.png';
            case Block.TYPES.GLASS: return 'assets/textures/glass.png';
            case Block.TYPES.BEDROCK: return 'assets/textures/bedrock.png';
            default: return 'assets/textures/missing.png';
        }
    }
}
