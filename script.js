// Inicializar el juego cuando la página esté cargada
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');

    // Permitir que el canvas reciba eventos de teclado
    canvas.tabIndex = 1000;
    // Dar foco inicial al canvas para que los controles funcionen enseguida
    canvas.focus();

    // Mantener el foco cuando se haga clic
    canvas.addEventListener('click', () => {
        canvas.focus();
    });

    const juego = new JuegoAtrapaFrutas();
    juego.iniciar();
});
