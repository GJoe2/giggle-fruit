"use client";

import React, { useState, useEffect, useCallback } from 'react';
import GameWrapper from '@/components/GameWrapper';
import StartMenu from '@/components/StartMenu';
import RankingMenu from '@/components/RankingMenu';
import EndMenu from '@/components/EndMenu';
import useLocalStorage from '@/hooks/useLocalStorage';

// --- Tipos Mejorados ---

// Interfaz para la instancia del juego
interface GameInstance {
  iniciar: () => void;
}

// Interfaz para el constructor del juego
interface GameConstructor {
  new (level: number): GameInstance;
}

// Declarar el constructor en el ámbito global
declare const JuegoAtrapaFrutas: GameConstructor;

// Extender la interfaz global de Window para incluir gameAPI
interface GameAPI {
  endGame: (status: 'victoria' | 'derrota', score: number) => void;
}

declare global {
  interface Window {
    gameAPI: GameAPI;
  }
}

type GameState = 'start' | 'playing' | 'ranking' | 'end';

interface RankingEntry {
  name: string;
  score: number;
}

const MAX_LEVEL_CAP = 10;

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [endMessage, setEndMessage] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);

  // Las variables _rankings y _maxLevel se gestionan a través del hook,
  // pero no se leen directamente en este componente. Se prefijan con _ para
  // indicar que su declaración es necesaria para la persistencia.
  const [, setRankings] = useLocalStorage<RankingEntry[]>('rankings', []);
  const [, setMaxLevel] = useLocalStorage('maxNivelDesbloqueado', 1);

  const handleGameEnd = useCallback((message: string, score: number, status: 'victoria' | 'derrota') => {
    setEndMessage(message);
    setGameState('end');

    // Guardar la nueva puntuación
    const newRanking: RankingEntry = { name: playerName || 'Jugador', score };
    setRankings(prevRankings => [...prevRankings, newRanking]);

    // Lógica para desbloquear el siguiente nivel
    if (status === 'victoria') {
      setMaxLevel(prevMaxLevel => {
        if (currentLevel === prevMaxLevel && prevMaxLevel < MAX_LEVEL_CAP) {
          console.log(`¡Nivel ${prevMaxLevel + 1} desbloqueado!`);
          return prevMaxLevel + 1;
        }
        return prevMaxLevel;
      });
    }
  }, [playerName, currentLevel, setRankings, setMaxLevel]);

  // Efecto para exponer la API de React al juego
  useEffect(() => {
    window.gameAPI = {
      endGame: (status, score) => {
        const message = status === 'victoria'
          ? `¡Victoria! Puntos: ${score}`
          : `Game Over - Puntos: ${score}`;
        handleGameEnd(message, score, status);
      }
    };
  }, [handleGameEnd]);

  const handleStartGame = (name: string, level: number) => {
    setPlayerName(name);
    setCurrentLevel(level);
    setGameState('playing');
    setTimeout(() => {
      try {
        const game = new JuegoAtrapaFrutas(level);
        game.iniciar();
      } catch (error) {
        console.error("Error al iniciar el juego:", error);
        alert("No se pudo cargar el juego. Inténtalo de nuevo.");
        setGameState('start');
      }
    }, 100);
  };

  const handleShowRanking = () => {
    setGameState('ranking');
  };

  const handleBackToMenu = () => {
    setGameState('start');
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-200 min-h-screen">
      <main className="container mx-auto p-4 font-sans relative">

        {gameState === 'start' && (
          <StartMenu onStart={handleStartGame} onShowRanking={handleShowRanking} />
        )}

        {gameState === 'ranking' && (
          <RankingMenu onBack={handleBackToMenu} />
        )}

        {gameState === 'end' && (
          <EndMenu message={endMessage} onRestart={handleBackToMenu} />
        )}

        <div className={`transition-filter duration-500 ${gameState !== 'playing' ? 'blur-sm pointer-events-none' : ''}`}>
          <h1 className="text-center text-4xl sm:text-5xl font-bold my-8 text-gray-800">
            🍎 Atrapa Frutas - Edición Premium 🍎
          </h1>

          <GameWrapper />

          <div className="instructions mt-8 max-w-2xl mx-auto p-6 bg-white bg-opacity-80 rounded-lg shadow-md text-center space-y-2">
            <p><strong>🎯 Objetivo:</strong> Conseguir 200 puntos atrapando frutas</p>
            <p><strong>🎮 Controles:</strong> ← → o A D para mover la cesta | R para reiniciar | ESC para salir</p>
            <p><strong>💡 Tip:</strong> ¡Las frutas doradas son las más valiosas pero también las más raras!</p>
            <p><strong>⚠️ Cuidado:</strong> ¡Evita las bombas negras o perderás una vida!</p>
          </div>
        </div>

      </main>
    </div>
  );
}
