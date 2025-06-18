/**
 * INTEGRANTE 2: PROGRAMAR LA CAÍDA DE LAS FRUTAS
 * Clases responsables de generar y mover las frutas
 */

// Sistema de frutas por valor (menor a mayor contraste/valor)
const TIPOS_FRUTAS = {
    'gris': { color: 'rgb(128, 128, 128)', puntos: 5, nombre: 'Gris' },
    'verde': { color: 'rgb(34, 139, 34)', puntos: 10, nombre: 'Verde' },
    'azul': { color: 'rgb(30, 144, 255)', puntos: 15, nombre: 'Azul' },
    'rojo': { color: 'rgb(220, 20, 60)', puntos: 20, nombre: 'Rojo' },
    'naranja': { color: 'rgb(255, 140, 0)', puntos: 25, nombre: 'Naranja' },
    'oro': { color: 'rgb(255, 215, 0)', puntos: 30, nombre: 'Oro' }
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
        const color = TIPOS_FRUTAS[this.tipo].color;
        
        // Dibujar círculo de la fruta
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, 2 * Math.PI);
        ctx.fill();
        
        // Borde negro
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Efecto especial para frutas de oro
        if (this.tipo === 'oro') {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.x - 5, this.y - 5, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
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
        this.probabilidades = {
            'gris': 30,    // 30% probabilidad
            'verde': 25,   // 25% probabilidad
            'azul': 20,    // 20% probabilidad
            'rojo': 15,    // 15% probabilidad
            'naranja': 8,  // 8% probabilidad
            'oro': 2       // 2% probabilidad (más rara)
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
            
            // Aumentar dificultad gradualmente
            if (this.intervaloFruta > 800) {
                this.intervaloFruta -= 3;
            }
        }
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