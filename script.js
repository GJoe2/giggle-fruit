let juego = null;
let nombreJugador = '';
let nivelSeleccionado = 1;

function actualizarSelectorNiveles() {
    const select = document.getElementById('levelSelect');
    if (!select) return;
    select.innerHTML = '';
    const maxNivel = parseInt(localStorage.getItem('maxNivelDesbloqueado') || '1', 10);
    for (let i = 1; i <= maxNivel; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Nivel ${i}`;
        select.appendChild(option);
    }
}

function mostrarMenu(id) {
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('rankingMenu').classList.add('hidden');
    document.getElementById('endMenu').classList.add('hidden');

    if (id) {
        document.getElementById(id).classList.remove('hidden');
        if (id === 'startMenu') {
            actualizarSelectorNiveles();
        }
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
        const maxNivel = parseInt(localStorage.getItem('maxNivelDesbloqueado') || '1', 10);
        if (nivelSeleccionado >= maxNivel && maxNivel < 10) {
            localStorage.setItem('maxNivelDesbloqueado', nivelSeleccionado + 1);
        }
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

    const select = document.getElementById('levelSelect');
    actualizarSelectorNiveles();

    document.getElementById('startButton').addEventListener('click', () => {
        nombreJugador = document.getElementById('playerName').value || 'Jugador';
        nivelSeleccionado = parseInt(select.value, 10);
        document.querySelector('.container').classList.remove('hidden');
        mostrarMenu();
        canvas.focus();
        juego = new JuegoAtrapaFrutas(nivelSeleccionado);
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
