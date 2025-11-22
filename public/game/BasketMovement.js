/**
 * INTEGRANTE 1: PROGRAMAR EL MOVIMIENTO DE LA CESTA
 * Clase responsable del movimiento y control de la cesta
 */
window.MovimientoCesta = class MovimientoCesta {
    constructor() {
        this.ancho = 80;
        this.alto = 20;
        this.x = 800 / 2 - this.ancho / 2; // ANCHO_PANTALLA
        this.y = 600 - 50; // ALTO_PANTALLA
        this.velocidad = 8; // VELOCIDAD_CESTA
        this.color = 'rgb(34, 139, 34)'; // Verde
    }

    moverIzquierda() {
        if (this.x > 0) {
            this.x -= this.velocidad;
        }
    }

    moverDerecha() {
        if (this.x < 800 - this.ancho) { // ANCHO_PANTALLA
            this.x += this.velocidad;
        }
    }

    procesarControles(teclas) {
        if (teclas['ArrowLeft'] || teclas['KeyA']) {
            this.moverIzquierda();
        }
        if (teclas['ArrowRight'] || teclas['KeyD']) {
            this.moverDerecha();
        }
    }

    dibujar(ctx) {
        // Dibujar la cesta
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.ancho, this.alto);
        
        // Borde negro
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
    }

    obtenerRectangulo() {
        return {
            x: this.x,
            y: this.y,
            width: this.ancho,
            height: this.alto
        };
    }
};