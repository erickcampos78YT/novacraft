class CaveGenerator {
    constructor(noiseUtils) {
        this.noiseUtils = noiseUtils;
        this.threshold = 0.3; // Limiar para geração de cavernas
        this.scale = 0.03; // Escala do ruído
    }
    
    // Gerar cavernas em um chunk
    generateCaves(chunk) {
        // Parâmetros para cavernas
        const frequency = 0.01;
        const amplitude = 0.6;
        
        // Percorrer todos os blocos do chunk
        for (let x = 0; x < chunk.size; x++) {
            for (let z = 0; z < chunk.size; z++) {
                // Coordenadas globais
                const worldX = chunk.x * chunk.size + x;
                const worldZ = chunk.z * chunk.size + z;
                
                // Gerar cavernas apenas abaixo de certa altura
                for (let y = 5; y < 60; y++) {
                    // Obter valor de ruído 3D
                    const noise = this.noiseUtils.getNoise3D(
                        worldX, 
                        y, 
                        worldZ, 
                        this.scale, 
                        3, // octaves
                        0.5, // persistence
                        2.0  // lacunarity
                    );
                    
                    // Se o ruído estiver acima do limiar, criar uma caverna (ar)
                    if (noise > this.threshold && chunk.getBlock(x, y, z) !== Block.TYPES.AIR) {
                        chunk.setBlock(x, y, z, Block.TYPES.AIR);
                    }
                }
            }
        }
    }
}
