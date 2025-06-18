/**
 * INTEGRANTE 3: DETECTAR COLISIONES Y SUMAR PUNTOS O RESTAR VIDAS
 * Clase responsable de detectar colisiones y manejar puntuación/vidas
 */
class DetectorColisiones {
    constructor() {
        this.puntos = 0;
        this.vidas = 5; // VIDAS_INICIALES
        this.ultimoPuntoGanado = 0;
        this.mensajePunto = "";
        this.tiempoMensaje = 0;
    }

    verificarColisiones(cesta, controladorFrutas) {
        const frutasAEliminar = [];
        const rectCesta = cesta.obtenerRectangulo();
        
        controladorFrutas.obtenerFrutas().forEach((fruta, i) => {
            const rectFruta = fruta.obtenerRectangulo();
            
            // Verificar colisión con la cesta
            if (this.colisionan(rectCesta, rectFruta)) {
                const puntosGanados = fruta.obtenerPuntos();
                this.puntos += puntosGanados;
                this.ultimoPuntoGanado = puntosGanados;
                this.mensajePunto = `+${puntosGanados} (${fruta.obtenerNombre()})`;
                this.tiempoMensaje = Date.now();
                frutasAEliminar.push(i);
            }
            // Verificar si la fruta tocó el suelo
            else if (fruta.estaEnSuelo()) {
                this.vidas -= 1;
                frutasAEliminar.push(i);
            }
        });
        
        // Eliminar frutas (en orden inverso para no afectar índices)
        frutasAEliminar.reverse().forEach(i => {
            controladorFrutas.eliminarFruta(i);
        });
    }

    colisionan(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    verificarCondicionesJuego() {
        if (this.puntos >= 200) { // PUNTOS_OBJETIVO
            return "victoria";
        } else if (this.vidas <= 0) {
            return "derrota";
        }
        return "jugando";
    }

    obtenerPuntos() {
        return this.puntos;
    }

    obtenerVidas() {
        return this.vidas;
    }

    reiniciar() {
        this.puntos = 0;
        this.vidas = 5; // VIDAS_INICIALES
        this.ultimoPuntoGanado = 0;
        this.mensajePunto = "";
        this.tiempoMensaje = 0;
    }

    obtenerMensajePunto() {
        const tiempoActual = Date.now();
        if (tiempoActual - this.tiempoMensaje < 1000) { // Mostrar por 1 segundo
            return this.mensajePunto;
        }
        return "";
    }
}