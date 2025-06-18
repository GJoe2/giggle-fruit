// Inicializar el juego cuando la página esté cargada
document.addEventListener('DOMContentLoaded', () => {
    const juego = new JuegoAtrapaFrutas();
    juego.iniciar();
});

// Asegurar que el canvas mantenga el foco para los eventos de teclado
document.getElementById('gameCanvas').addEventListener('click', () => {
    document.getElementById('gameCanvas').focus();
});

// Permitir que el canvas reciba eventos de teclado
document.getElementById('gameCanvas').tabIndex = 1000;