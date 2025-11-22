"use client";

import React, { useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

interface StartMenuProps {
  onStart: (playerName: string, level: number) => void;
  onShowRanking: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onStart, onShowRanking }) => {
  const [playerName, setPlayerName] = useState('');
  const [level, setLevel] = useState(1);
  const [error, setError] = useState('');
  const [maxLevel] = useLocalStorage('maxNivelDesbloqueado', 1);

  const handleStart = () => {
    if (playerName.trim()) {
      setError('');
      onStart(playerName, level);
    } else {
      setError('Por favor, introduce un nombre para jugar.');
    }
  };

  const unlockedLevels = Array.from({ length: maxLevel }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Atrapa Frutas</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 block text-left mb-2">Nombre del jugador:</span>
            <input
              type="text"
              placeholder="Tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {error && <p className="text-red-500 text-sm text-left mt-1">{error}</p>}
          </label>
          <label className="block">
            <span className="text-gray-700 block text-left mb-2">Nivel:</span>
            <select
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {unlockedLevels.map(lvl => (
                <option key={lvl} value={lvl}>Nivel {lvl}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleStart}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-md hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Empezar
          </button>
          <button
            onClick={onShowRanking}
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            Rankings
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
