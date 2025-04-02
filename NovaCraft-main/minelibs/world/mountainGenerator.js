class MountainGenerator {
    constructor(noiseUtils) {
        this.noiseUtils = noiseUtils;
        this.baseHeight = 64; // Altura base do terreno
        this.mountainHeight = 48; // Altura máxima das montanhas
        this.scale = 0.005; // Escala do ruído
    }
    
    // Gerar altura do terreno em uma coordenada
    getHeightAt(x, z) {
        // Ruído base para terreno ondulado
        const baseNoise = this.noiseUtils.getNoise2D(
            x, 
            z, 
            this.scale, 
            4, // octaves
            0.5, // persistence
            2.0  // lacunarity
        );
        
        // Ruído para montanhas
        const mountainNoise = this.noiseUtils.getNoise2D(
            x, 
            z, 
            this.scale * 0.5, 
            2, // octaves
            0.6, // persistence
            2.0  // lacunarity
        );
        
        // Combinar ruídos para criar terreno variado
        let height = this.baseHeight;
        
        // Adicionar ondulações base
        height += baseNoise * 10;
        
        // Adicionar montanhas onde o ruído é alto
        if (mountainNoise > 0.6) {
            const mountainFactor = (mountainNoise - 0.6) / 0.4; // Normalizar para [0, 1]
            height += mountainFactor * this.mountainHeight * Math.pow(mountainNoise, 2);
        }
        
        return Math.floor(height);
    }
}
