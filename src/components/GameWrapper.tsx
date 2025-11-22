"use client";

import { useEffect } from 'react';

const GameWrapper = () => {
  useEffect(() => {
    // Lista de scripts a cargar en orden
    const scripts = [
      '/game/BasketMovement.js',
      '/game/FruitGenerator.js',
      '/game/CollisionDetector.js',
      '/game/UserInterface.js',
      '/game/SoundManager.js',
      '/game/Game.js'
    ];

    // Cargar scripts en secuencia
    const loadScript = (index: number) => {
      if (index >= scripts.length) {
        return;
      }
      const script = document.createElement('script');
      script.src = scripts[index];
      script.onload = () => loadScript(index + 1);
      document.body.appendChild(script);
    };

    loadScript(0);

    // Limpieza al desmontar el componente
    return () => {
      scripts.forEach(src => {
        const scriptElement = document.querySelector(`script[src="${src}"]`);
        if (scriptElement) {
          document.body.removeChild(scriptElement);
        }
      });
    };
  }, []);

  return (
    <div className="flex justify-center my-8">
      <canvas
        id="gameCanvas"
        width="800"
        height="600"
        className="rounded-lg shadow-xl border-4 border-gray-700"
      ></canvas>
    </div>
  );
};

export default GameWrapper;
