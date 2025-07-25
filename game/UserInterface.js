/**
 * INTEGRANTE 4: CREAR LA INTERFAZ
 * Clase responsable de mostrar la interfaz de usuario
 */
class InterfazUsuario {
    constructor() {
        // No necesitamos inicializar fuentes en Canvas, se configuran al dibujar
    }

    dibujarHUD(ctx, detectorColisiones) {
        // Configurar fuente
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        
        // Puntos
        ctx.fillText(`Puntos: ${detectorColisiones.obtenerPuntos()}`, 10, 35);
        
        // Vidas
        ctx.fillText(`Vidas: ${detectorColisiones.obtenerVidas()}`, 10, 65);
        
        // Objetivo
        ctx.font = '18px Arial';
        ctx.fillText('Objetivo: 200 puntos', 10, 90);
        
        // Mensaje de puntos ganados
        const mensaje = detectorColisiones.obtenerMensajePunto();
        if (mensaje) {
            ctx.fillStyle = 'rgb(0, 150, 0)';
            ctx.font = '24px Arial';
            ctx.fillText(mensaje, 800 / 2 - 100, 120); // ANCHO_PANTALLA
        }
    }

    dibujarTablaValores(ctx) {
        const xInicio = 800 - 180; // ANCHO_PANTALLA
        const yInicio = 20;
        
        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';
        ctx.fillText('Valores de Frutas:', xInicio, yInicio);
        
        let yOffset = yInicio + 25;
        Object.entries(TIPOS_FRUTAS).forEach(([tipo, info]) => {
            // Dibujar círculo de color
            ctx.fillStyle = info.color;
            ctx.beginPath();
            ctx.arc(xInicio + 10, yOffset, 8, 0, 2 * Math.PI);
            ctx.fill();
            
            // Borde del círculo
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Dibujar texto
            ctx.fillStyle = 'black';
            ctx.font = '14px Arial';
            const texto = info.bomba ? `${info.nombre}: -1 vida` : `${info.nombre}: ${info.puntos} pts`;
            ctx.fillText(texto, xInicio + 25, yOffset + 5);
            yOffset += 18;
        });
    }

    dibujarControles(ctx) {
        const controles = [
            'Controles:',
            '← → o A D: Mover cesta',
            'ESC: Salir del juego'
        ];
        
        ctx.fillStyle = 'black';
        ctx.font = '18px Arial';
        let yOffset = 600 - 60; // ALTO_PANTALLA
        
        controles.forEach(control => {
            ctx.fillText(control, 10, yOffset);
            yOffset += 20;
        });
    }

    dibujarPantallaFinal(ctx, estado, puntos) {
        // Crear overlay semi-transparente
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 800, 600); // ANCHO_PANTALLA, ALTO_PANTALLA
        
        const centerX = 800 / 2; // ANCHO_PANTALLA
        const centerY = 600 / 2; // ALTO_PANTALLA
        
        // Texto principal
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        
        if (estado === 'victoria') {
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillText('¡VICTORIA!', centerX, centerY - 50);
            
            ctx.fillStyle = 'white';
            ctx.font = '28px Arial';
            ctx.fillText(`¡Conseguiste ${puntos} puntos!`, centerX, centerY);
        } else {
            ctx.fillStyle = 'rgb(255, 0, 0)';
            ctx.fillText('GAME OVER', centerX, centerY - 50);
            
            ctx.fillStyle = 'white';
            ctx.font = '28px Arial';
            ctx.fillText(`Puntos finales: ${puntos}`, centerX, centerY);
        }
        
        // Texto de reinicio
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText('Presiona R para jugar de nuevo o ESC para salir', centerX, centerY + 50);
        
        // Resetear alineación de texto
        ctx.textAlign = 'left';
    }
}