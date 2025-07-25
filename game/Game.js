/**
 * CLASE PRINCIPAL DEL JUEGO
 * Clase principal que coordina todos los componentes del juego
 */
class JuegoAtrapaFrutas {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.teclasPresionadas = {};
        
        // Inicializar componentes (roles de integrantes)
        this.cesta = new MovimientoCesta();  // Integrante 1
        this.controladorFrutas = new ControladorFrutas();  // Integrante 2
        this.detectorColisiones = new DetectorColisiones();  // Integrante 3
        this.interfaz = new InterfazUsuario();  // Integrante 4
        
        this.estado = "jugando";
        this.ultimoTiempo = 0;
        this.finalMostrado = false;
        
        this.configurarEventos();
    }

    configurarEventos() {
        // Eventos de teclado
        document.addEventListener('keydown', (e) => {
            this.teclasPresionadas[e.code] = true;
            
            if (e.code === 'KeyR' && this.estado !== 'jugando') {
                this.reiniciarJuego();
            } else if (e.code === 'Escape') {
                // En un entorno web, simplemente mostramos un mensaje
                alert('Gracias por jugar Atrapa Frutas!');
            }
        });

        document.addEventListener('keyup', (e) => {
            this.teclasPresionadas[e.code] = false;
        });

        // Prevenir scroll con teclas de flecha
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }

    reiniciarJuego() {
        this.cesta = new MovimientoCesta();
        this.controladorFrutas = new ControladorFrutas();
        this.detectorColisiones.reiniciar();
        this.estado = "jugando";
        this.finalMostrado = false;
        if (window.mostrarMenu) {
            window.mostrarMenu();
        }
    }

    actualizar() {
        if (this.estado === "jugando") {
            // Procesar controles (Integrante 1)
            this.cesta.procesarControles(this.teclasPresionadas);
            
            // Generar y actualizar frutas (Integrante 2)
            this.controladorFrutas.generarFruta();
            this.controladorFrutas.actualizarFrutas();
            
            // Detectar colisiones (Integrante 3)
            this.detectorColisiones.verificarColisiones(
                this.cesta, this.controladorFrutas);
            this.estado = this.detectorColisiones.verificarCondicionesJuego();
            if (this.estado !== "jugando" && !this.finalMostrado) {
                this.finalMostrado = true;
                if (window.mostrarFinJuego) {
                    window.mostrarFinJuego(this.estado,
                        this.detectorColisiones.obtenerPuntos());
                }
            }
        }
    }

    dibujar() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.estado === "jugando") {
            this.cesta.dibujar(this.ctx);
            this.controladorFrutas.dibujarTodas(this.ctx);
        }
        
        this.interfaz.dibujarHUD(this.ctx, this.detectorColisiones);
        this.interfaz.dibujarTablaValores(this.ctx);
        this.interfaz.dibujarControles(this.ctx);
        
        if (this.estado !== "jugando") {
            this.interfaz.dibujarPantallaFinal(
                this.ctx, this.estado, this.detectorColisiones.obtenerPuntos());
        }
    }

    bucleJuego(tiempoActual) {
        this.actualizar();
        this.dibujar();
        
        requestAnimationFrame((tiempo) => this.bucleJuego(tiempo));
    }

    iniciar() {
        this.finalMostrado = false;
        console.log("🍎 ¡Bienvenido a Atrapa Frutas - Edición Premium! 🍎");
        console.log("\n🎯 Sistema de Puntuación por Colores:");
        Object.entries(TIPOS_FRUTAS).forEach(([tipo, info]) => {
            console.log(`   ${info.nombre}: ${info.puntos} puntos`);
        });
        console.log("\n🏆 Objetivo: Conseguir 200 puntos");
        console.log("💖 Vidas: 5");
        console.log("\n🎮 Controles:");
        console.log("   ← → o A D: Mover cesta");
        console.log("   R: Reiniciar (en pantalla final)");
        console.log("   ESC: Salir");
        console.log("\n¡Las frutas doradas son las más valiosas pero también las más raras!");
        console.log("Iniciando juego...");
        
        requestAnimationFrame((tiempo) => this.bucleJuego(tiempo));
    }
}