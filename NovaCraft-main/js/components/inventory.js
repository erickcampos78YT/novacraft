class Inventory {
    constructor() {
        this.slots = Array(9).fill(null);
        this.selectedSlot = 0;
        
        // Preencher inventário com blocos padrão
        this.slots[0] = Block.TYPES.GRASS;
        this.slots[1] = Block.TYPES.DIRT;
        this.slots[2] = Block.TYPES.STONE;
        this.slots[3] = Block.TYPES.WOOD;
        this.slots[4] = Block.TYPES.LEAVES;
        this.slots[5] = Block.TYPES.SAND;
        this.slots[6] = Block.TYPES.GLASS;
        this.slots[7] = Block.TYPES.WATER;
        
        // Configurar eventos de seleção
        this.setupEvents();
    }
    
    setupEvents() {
        // Mudar slot selecionado com roda do mouse
        document.addEventListener('wheel', (e) => {
            if (e.deltaY < 0) {
                // Rolar para cima
                this.selectedSlot = (this.selectedSlot - 1 + this.slots.length) % this.slots.length;
            } else {
                // Rolar para baixo
                this.selectedSlot = (this.selectedSlot + 1) % this.slots.length;
            }
            
            this.updateUI();
        });
        
        // Mudar slot selecionado com teclas numéricas
        document.addEventListener('keydown', (e) => {
            if (e.code.startsWith('Digit')) {
                const digit = parseInt(e.code.substring(5));
                if (digit >= 1 && digit <= this.slots.length) {
                    this.selectedSlot = digit - 1;
                    this.updateUI();
                }
            }
        });
    }
    
    getSelectedBlock() {
        return this.slots[this.selectedSlot];
    }
    
    updateUI() {
        // Atualizar interface do inventário
        const inventoryBar = document.getElementById('inventory-bar');
        
        // Limpar barra de inventário
        inventoryBar.innerHTML = '';
        
        // Criar slots
        for (let i = 0; i < this.slots.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (i === this.selectedSlot) {
                slot.classList.add('selected');
            }
            
            if (this.slots[i] !== null) {
                // Adicionar ícone do bloco
                const blockType = this.slots[i];
                const blockImage = document.createElement('img');
                blockImage.src = new Block(blockType).texture;
                blockImage.style.width = '100%';
                blockImage.style.height = '100%';
                slot.appendChild(blockImage);
            }
            
            inventoryBar.appendChild(slot);
        }
    }
}
