// Classe principal do jogo
class Game {
    constructor() {
        this.renderer = null;
        this.physics = null;
        this.input = null;
        this.audio = null;
        this.player = null;
        this.world = null;
        this.ui = null;
        this.inventory = null;
        this.clock = new THREE.Clock();
    }

    init() {
        console.log('Inicializando NovaCraft...');
        
        // Inicializar componentes do motor
        this.renderer = new Renderer();
        this.physics = new Physics();
        this.input = new Input();
        this.audio = new Audio();
        
        // Inicializar componentes do jogo
        this.player = new Player();
        this.inventory = new Inventory();
        this.ui = new UI(this.inventory);
        
        // Inicializar geração de mundo
        this.world = new WorldGenerator();
        
        // Configurar eventos
        this.setupEvents();
        
        console.log('NovaCraft inicializado com sucesso!');
    }
    
    setupEvents() {
        // Configurar eventos de entrada
        this.input.setupEvents(this.player, this.world);
        
        // Configurar eventos de interface
        this.ui.setupEvents();
        
        window.addEventListener('resize', () => {
            this.renderer.onWindowResize();
        });
    }
    
    update() {
        const deltaTime = this.clock.getDelta();
        
        // Atualizar física
        this.physics.update(deltaTime);
        
        // Atualizar jogador
        this.player.update(deltaTime, this.input, this.world);
        
        // Atualizar mundo (carregar/descarregar chunks)
        this.world.update(this.player.position);
    }
    
    render() {
        // Renderizar a cena
        this.renderer.render(this.world.scene, this.player.camera);
        
        // Atualizar UI
        this.ui.update();
    }
}
