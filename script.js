let juego = null;
let nombreJugador = '';
let nivelSeleccionado = Math.min(
    10,
    parseInt(localStorage.getItem('maxNivelDesbloqueado') || '1', 10)
);

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
    select.value = nivelSeleccionado;
}

function mostrarMenu(id) {
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('rankingMenu').classList.add('hidden');
    document.getElementById('endMenu').classList.add('hidden');

    if (id) {
        document.getElementById(id).classList.remove('hidden');
        if (window.soundManager) {
            window.soundManager.playMenu();
            if (id === 'startMenu') {
                window.soundManager.startMenuMusic();
            }
        }
        if (id === 'startMenu') {
            actualizarSelectorNiveles();
        }
    } else if (window.soundManager) {
        window.soundManager.stopMenuMusic();
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
            const siguiente = nivelSeleccionado + 1;
            localStorage.setItem('maxNivelDesbloqueado', siguiente);
            nivelSeleccionado = siguiente;
            actualizarSelectorNiveles();
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

    const startBtn = document.getElementById('startButton');
    const rankingBtn = document.getElementById('rankingButton');
    const backBtn = document.getElementById('backButton');
    const restartBtn = document.getElementById('restartButton');

    const hoverSound = () => {
        if (window.soundManager) {
            window.soundManager.playHover();
        }
    };

    [startBtn, rankingBtn, backBtn, restartBtn].forEach(btn => {
        if (btn) btn.addEventListener('mouseover', hoverSound);
    });

    startBtn.addEventListener('click', () => {
        nombreJugador = document.getElementById('playerName').value || 'Jugador';
        nivelSeleccionado = parseInt(select.value, 10);
        document.querySelector('.container').classList.remove('hidden');
        mostrarMenu();
        canvas.focus();
        juego = new JuegoAtrapaFrutas(nivelSeleccionado);
        juego.iniciar();
    });

    rankingBtn.addEventListener('click', () => {
        actualizarRankings();
        mostrarMenu('rankingMenu');
    });

    backBtn.addEventListener('click', () => {
        mostrarMenu('startMenu');
    });

    restartBtn.addEventListener('click', () => {
        mostrarMenu('startMenu');
        document.querySelector('.container').classList.add('hidden');
    });

    mostrarMenu('startMenu');
    document.querySelector('.container').classList.add('hidden');
});

// Expone la función para que Game.js pueda llamar cuando termine
window.mostrarFinJuego = mostrarFinJuego;
window.mostrarMenu = mostrarMenu;
