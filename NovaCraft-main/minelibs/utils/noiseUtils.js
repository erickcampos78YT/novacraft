class NoiseUtils {
    constructor() {
        this.simplex = new SimplexNoise();
        this.perlin = new PerlinNoise();
    }
    
    // Gera um valor de ruído 2D entre 0 e 1
    getNoise2D(x, y, scale = 0.01, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
        let amplitude = 1;
        let frequency = 1;
        let noiseValue = 0;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            const sampleX = x * scale * frequency;
            const sampleY = y * scale * frequency;
            
            const value = this.simplex.noise2D(sampleX, sampleY);
            noiseValue += value * amplitude;
            
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        
        // Normalizar para [0, 1]
        noiseValue = (noiseValue / maxValue + 1) / 2;
        return noiseValue;
    }
    
    // Gera um valor de ruído 3D entre 0 e 1
    getNoise3D(x, y, z, scale = 0.01, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
        let amplitude = 1;
        let frequency = 1;
        let noiseValue = 0;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            const sampleX = x * scale * frequency;
            const sampleY = y * scale * frequency;
            const sampleZ = z * scale * frequency;
            
            const value = this.simplex.noise3D(sampleX, sampleY, sampleZ);
            noiseValue += value * amplitude;
            
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }
        
        // Normalizar para [0, 1]
        noiseValue = (noiseValue / maxValue + 1) / 2;
        return noiseValue;
    }
    
    // Gera um valor de ruído de Perlin 2D entre 0 e 1
    getPerlinNoise2D(x, y, scale = 0.01) {
        return this.perlin.noise(x * scale, y * scale);
    }
}
