// Implementação do ruído Perlin
class PerlinNoise {
    constructor(seed) {
        this.seed = seed || Math.random();
        this.gradients = {};
        this.memory = {};
    }
    
    noise(x, y, z = 0) {
        // Converter para inteiros
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        const zi = Math.floor(z);
        
        // Frações para interpolação
        const xf = x - xi;
        const yf = y - yi;
        const zf = z - zi;
        
        // Suavizar transições
        const u = this.fade(xf);
        const v = this.fade(yf);
        const w = this.fade(zf);
        
        // Gerar gradientes aleatórios nos vértices do cubo
        const p000 = this.gradient(xi, yi, zi);
        const p100 = this.gradient(xi + 1, yi, zi);
        const p010 = this.gradient(xi, yi + 1, zi);
        const p110 = this.gradient(xi + 1, yi + 1, zi);
        const p001 = this.gradient(xi, yi, zi + 1);
        const p101 = this.gradient(xi + 1, yi, zi + 1);
        const p011 = this.gradient(xi, yi + 1, zi + 1);
        const p111 = this.gradient(xi + 1, yi + 1, zi + 1);
        
        // Calcular produtos escalares
        const x0y0z0 = this.dot(p000, xf, yf, zf);
        const x1y0z0 = this.dot(p100, xf - 1, yf, zf);
        const x0y1z0 = this.dot(p010, xf, yf - 1, zf);
        const x1y1z0 = this.dot(p110, xf - 1, yf - 1, zf);
        const x0y0z1 = this.dot(p001, xf, yf, zf - 1);
        const x1y0z1 = this.dot(p101, xf - 1, yf, zf - 1);
        const x0y1z1 = this.dot(p011, xf, yf - 1, zf - 1);
        const x1y1z1 = this.dot(p111, xf - 1, yf - 1, zf - 1);
        
        // Interpolação trilinear
        const x0 = this.lerp(x0y0z0, x0y1z0, v);
        const x1 = this.lerp(x1y0z0, x1y1z0, v);
        const y0 = this.lerp(x0, x1, u);
        
        const x0z1 = this.lerp(x0y0z1, x0y1z1, v);
        const x1z1 = this.lerp(x1y0z1, x1y1z1, v);
        const y1 = this.lerp(x0z1, x1z1, u);
        
        // Resultado final entre [-1, 1]
        const result = this.lerp(y0, y1, w);
        
        // Normalizar para [0, 1]
        return (result + 1) / 2;
    }
    
    // Função de suavização
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    // Interpolação linear
    lerp(a, b, t) {
        return a + t * (b - a);
    }
    
    // Produto escalar
    dot(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    }
    
    // Gerar gradiente aleatório
    gradient(x, y, z) {
        const key = `${x},${y},${z}`;
        
        if (!this.gradients[key]) {
            // Usar hash para gerar gradiente consistente
            const random = this.seededRandom(x, y, z);
            
            // Vetor unitário aleatório
            const theta = random * Math.PI * 2;
            const phi = Math.acos(2 * this.seededRandom(y, z, x) - 1);
            
            const sinPhi = Math.sin(phi);
            this.gradients[key] = [
                sinPhi * Math.cos(theta),
                sinPhi * Math.sin(theta),
                Math.cos(phi)
            ];
        }
        
        return this.gradients[key];
    }
    
    // Gerador de números aleatórios com seed
    seededRandom(x, y, z) {
        const seed = (this.seed * 1000000) | 0;
        const value = (x * 3761 + y * 4177 + z * 5227 + seed) % 1000;
        return ((Math.sin(value) + 1) / 2);
    }
}
