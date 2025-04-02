// Implementação do ruído Simplex
class SimplexNoise {
    constructor(seed) {
        this.grad3 = [
            [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
            [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
            [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
        ];
        
        this.p = [];
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.floor(Math.random() * 256);
        }
        
        // Duplicar o array para evitar overflow
        this.perm = new Array(512);
        this.permMod12 = new Array(512);
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }
    
    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }
    
    dot3(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z;
    }
    
    noise2D(xin, yin) {
        // Constantes do ruído Simplex
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;
        
        // Skew input space
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        
                // Determinar qual triângulo
                let i1, j1;
                if (x0 > y0) {
                    i1 = 1;
                    j1 = 0;
                } else {
                    i1 = 0;
                    j1 = 1;
                }
                
                // Coordenadas relativas dos vértices
                const x1 = x0 - i1 + G2;
                const y1 = y0 - j1 + G2;
                const x2 = x0 - 1.0 + 2.0 * G2;
                const y2 = y0 - 1.0 + 2.0 * G2;
                
                // Índices de hash
                const ii = i & 255;
                const jj = j & 255;
                
                // Calcular contribuição de cada vértice
                let n0 = 0, n1 = 0, n2 = 0;
                
                // Primeiro vértice
                let t0 = 0.5 - x0 * x0 - y0 * y0;
                if (t0 >= 0) {
                    t0 *= t0;
                    const gi0 = this.permMod12[ii + this.perm[jj]];
                    n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
                }
                
                // Segundo vértice
                let t1 = 0.5 - x1 * x1 - y1 * y1;
                if (t1 >= 0) {
                    t1 *= t1;
                    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1]];
                    n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
                }
                
                // Terceiro vértice
                let t2 = 0.5 - x2 * x2 - y2 * y2;
                if (t2 >= 0) {
                    t2 *= t2;
                    const gi2 = this.permMod12[ii + 1 + this.perm[jj + 1]];
                    n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
                }
                
                // Somar contribuições e escalar para [-1, 1]
                return 70.0 * (n0 + n1 + n2);
            }
            
            noise3D(xin, yin, zin) {
                // Constantes do ruído Simplex
                const F3 = 1.0 / 3.0;
                const G3 = 1.0 / 6.0;
                
                // Skew input space
                const s = (xin + yin + zin) * F3;
                const i = Math.floor(xin + s);
                const j = Math.floor(yin + s);
                const k = Math.floor(zin + s);
                
                const t = (i + j + k) * G3;
                const X0 = i - t;
                const Y0 = j - t;
                const Z0 = k - t;
                
                const x0 = xin - X0;
                const y0 = yin - Y0;
                const z0 = zin - Z0;
                
                // Determinar qual tetraedro
                let i1, j1, k1;
                let i2, j2, k2;
                
                if (x0 >= y0) {
                    if (y0 >= z0) {
                        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
                    } else if (x0 >= z0) {
                        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
                    } else {
                        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
                    }
                } else {
                    if (y0 < z0) {
                        i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
                    } else if (x0 < z0) {
                        i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
                    } else {
                        i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
                    }
                }
                
                // Coordenadas relativas dos vértices
                const x1 = x0 - i1 + G3;
                const y1 = y0 - j1 + G3;
                const z1 = z0 - k1 + G3;
                
                const x2 = x0 - i2 + 2.0 * G3;
                const y2 = y0 - j2 + 2.0 * G3;
                const z2 = z0 - k2 + 2.0 * G3;
                
                const x3 = x0 - 1.0 + 3.0 * G3;
                const y3 = y0 - 1.0 + 3.0 * G3;
                const z3 = z0 - 1.0 + 3.0 * G3;
                
                // Índices de hash
                const ii = i & 255;
                const jj = j & 255;
                const kk = k & 255;
                
                // Calcular contribuição de cada vértice
                let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
                
                // Primeiro vértice
                let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
                if (t0 >= 0) {
                    t0 *= t0;
                    const gi0 = this.permMod12[ii + this.perm[jj + this.perm[kk]]];
                    n0 = t0 * t0 * this.dot3(this.grad3[gi0], x0, y0, z0);
                }
                
                // Segundo vértice
                let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
                if (t1 >= 0) {
                    t1 *= t1;
                    const gi1 = this.permMod12[ii + i1 + this.perm[jj + j1 + this.perm[kk + k1]]];
                    n1 = t1 * t1 * this.dot3(this.grad3[gi1], x1, y1, z1);
                }
                
                // Terceiro vértice
                let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
                if (t2 >= 0) {
                    t2 *= t2;
                    const gi2 = this.permMod12[ii + i2 + this.perm[jj + j2 + this.perm[kk + k2]]];
                    n2 = t2 * t2 * this.dot3(this.grad3[gi2], x2, y2, z2);
                }
                
                // Quarto vértice
                let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
                if (t3 >= 0) {
                    t3 *= t3;
                    const gi3 = this.permMod12[ii + 1 + this.perm[jj + 1 + this.perm[kk + 1]]];
                    n3 = t3 * t3 * this.dot3(this.grad3[gi3], x3, y3, z3);
                }
                
                // Somar contribuições e escalar para [-1, 1]
                return 32.0 * (n0 + n1 + n2 + n3);
            }
        }
        