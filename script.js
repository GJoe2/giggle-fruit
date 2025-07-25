let juego = null;
let nombreJugador = '';

function mostrarMenu(id) {
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('rankingMenu').classList.add('hidden');
    document.getElementById('endMenu').classList.add('hidden');

    if (id) {
        document.getElementById(id).classList.remove('hidden');
    }
}

function actualizarRankings() {
    const lista = document.getElementById('rankingList');
    lista.innerHTML = '';
    const rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    rankings.sort((a, b) => b.puntos - a.puntos);
    rankings.slice(0, 5).forEach((r, i) => {
        const li = document.createElement('li');
        li.textContent = `${i + 1}. ${r.nombre} - ${r.puntos}`;
        lista.appendChild(li);
    });
}

function mostrarFinJuego(estado, puntos) {
    const mensaje = document.getElementById('endMessage');
    if (estado === 'victoria') {
        mensaje.textContent = `\u00a1Victoria! Puntos: ${puntos}`;
    } else {
        mensaje.textContent = `Game Over - Puntos: ${puntos}`;
    }

    const rankings = JSON.parse(localStorage.getItem('rankings') || '[]');
    rankings.push({ nombre: nombreJugador || 'Jugador', puntos });
    localStorage.setItem('rankings', JSON.stringify(rankings));
    mostrarMenu('endMenu');
}

// Inicializar la página cuando esté cargada
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.tabIndex = 1000;
    canvas.addEventListener('click', () => canvas.focus());

    document.getElementById('startButton').addEventListener('click', () => {
        nombreJugador = document.getElementById('playerName').value || 'Jugador';
        document.querySelector('.container').classList.remove('hidden');
        mostrarMenu();
        canvas.focus();
        juego = new JuegoAtrapaFrutas();
        juego.iniciar();
    });

    document.getElementById('rankingButton').addEventListener('click', () => {
        actualizarRankings();
        mostrarMenu('rankingMenu');
    });

    document.getElementById('backButton').addEventListener('click', () => {
        mostrarMenu('startMenu');
    });

    document.getElementById('restartButton').addEventListener('click', () => {
        mostrarMenu('startMenu');
        document.querySelector('.container').classList.add('hidden');
    });

    mostrarMenu('startMenu');
    document.querySelector('.container').classList.add('hidden');
});

// Expone la función para que Game.js pueda llamar cuando termine
window.mostrarFinJuego = mostrarFinJuego;
window.mostrarMenu = mostrarMenu;
