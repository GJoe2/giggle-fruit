/**
 * INTEGRANTE 2: PROGRAMAR LA CAÍDA DE LAS FRUTAS
 * Clases responsables de generar y mover las frutas
 */

// Sistema de frutas por valor (menor a mayor contraste/valor)
const TIPOS_FRUTAS = {
    'gris':   { color: 'rgb(128, 128, 128)', puntos: 5,  nombre: 'Gris',   emoji: '🍎' },
    'verde':  { color: 'rgb(34, 139, 34)',   puntos: 10, nombre: 'Verde',  emoji: '🍏' },
    'azul':   { color: 'rgb(30, 144, 255)',  puntos: 15, nombre: 'Azul',   emoji: '🫐' },
    'rojo':   { color: 'rgb(220, 20, 60)',   puntos: 20, nombre: 'Rojo',   emoji: '🍒' },
    'naranja':{ color: 'rgb(255, 140, 0)',   puntos: 25, nombre: 'Naranja',emoji: '🍊' },
    'oro':    { color: 'rgb(255, 215, 0)',   puntos: 30, nombre: 'Oro',    emoji: '🍍' },
    'bomba':  { color: 'rgb(0, 0, 0)',       puntos: 0,  nombre: 'Bomba',  emoji: '💣', bomba: true }
};

class GeneradorFrutas {
    constructor() {
        this.radio = 15;
        this.tipo = this.seleccionarTipoAleatorio();
        this.x = Math.random() * (800 - this.radio * 2) + this.radio; // ANCHO_PANTALLA
        this.y = -this.radio;
        this.velocidad = Math.floor(Math.random() * (6 - 2 + 1)) + 2; // VELOCIDAD_FRUTA_MIN a MAX
    }

    seleccionarTipoAleatorio() {
        const tipos = Object.keys(TIPOS_FRUTAS);
        return tipos[Math.floor(Math.random() * tipos.length)];
    }

    mover() {
        this.y += this.velocidad;
    }

    dibujar(ctx) {
        const emoji = TIPOS_FRUTAS[this.tipo].emoji;

        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, this.x, this.y);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }

    estaEnSuelo() {
        return this.y > 600; // ALTO_PANTALLA
    }

    obtenerRectangulo() {
        return {
            x: this.x - this.radio,
            y: this.y - this.radio,
            width: this.radio * 2,
            height: this.radio * 2
        };
    }

    obtenerPuntos() {
        return TIPOS_FRUTAS[this.tipo].puntos;
    }

    obtenerNombre() {
        return TIPOS_FRUTAS[this.tipo].nombre;
    }
}

class ControladorFrutas {
    constructor() {
        this.frutas = [];
        this.tiempoUltimaFruta = 0;
        this.intervaloFruta = 1500; // milisegundos
        this.nivel = 1;
        this.probabilidades = {
            'gris': 28,    // 28% probabilidad
            'verde': 23,   // 23% probabilidad
            'azul': 18,    // 18% probabilidad
            'rojo': 14,    // 14% probabilidad
            'naranja': 8,  // 8% probabilidad
            'oro': 2,      // 2% probabilidad (más rara)
            'bomba': 7     // 7% probabilidad
        };
    }

    generarFruta() {
        const tiempoActual = Date.now();
        if (tiempoActual - this.tiempoUltimaFruta > this.intervaloFruta) {
            // Seleccionar tipo de fruta basado en probabilidades
            const rand = Math.floor(Math.random() * 100) + 1;
            let acumulado = 0;
            let tipoSeleccionado = 'gris';
            
            for (const [tipo, prob] of Object.entries(this.probabilidades)) {
                acumulado += prob;
                if (rand <= acumulado) {
                    tipoSeleccionado = tipo;
                    break;
                }
            }
            
            const nuevaFruta = new GeneradorFrutas();
            nuevaFruta.tipo = tipoSeleccionado;
            this.frutas.push(nuevaFruta);
            this.tiempoUltimaFruta = tiempoActual;
        }
    }

    ajustarDificultadPorNivel(nivel) {
        this.nivel = nivel;
        this.intervaloFruta = Math.max(600, 1500 - (nivel - 1) * 100);
    }

    actualizarFrutas() {
        this.frutas.forEach(fruta => fruta.mover());
    }

    obtenerFrutas() {
        return this.frutas;
    }

    eliminarFruta(indice) {
        if (indice >= 0 && indice < this.frutas.length) {
            this.frutas.splice(indice, 1);
        }
    }

    dibujarTodas(ctx) {
        this.frutas.forEach(fruta => fruta.dibujar(ctx));
    }
}