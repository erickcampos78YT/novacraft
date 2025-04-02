// Ponto de entrada do jogo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar o jogo quando o DOM estiver carregado
    const game = new Game();
    game.init();
    
    // Iniciar o loop do jogo
    function gameLoop() {
        game.update();
        game.render();
        requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
});
