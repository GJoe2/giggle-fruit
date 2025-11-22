"use client";

import React from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';

// Tipo para una entrada del ranking
interface RankingEntry {
  name: string;
  score: number;
}

interface RankingMenuProps {
  onBack: () => void;
}

const RankingMenu: React.FC<RankingMenuProps> = ({ onBack }) => {
  const [rankings] = useLocalStorage<RankingEntry[]>('rankings', []);

  // Ordenar rankings y tomar los 5 mejores
  const sortedRankings = [...rankings]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Rankings</h2>

        {sortedRankings.length > 0 ? (
          <ol className="space-y-3 text-left">
            {sortedRankings.map((entry, index) => (
              <li
                key={index}
                className={`p-3 rounded-md flex justify-between items-center ${index === 0 ? 'bg-yellow-200' : 'bg-gray-100'}`}
              >
                <span className="font-bold text-lg text-gray-700">{index + 1}. {entry.name}</span>
                <span className="font-semibold text-blue-600">{entry.score} pts</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 my-8">Aún no hay puntuaciones. ¡Juega una partida!</p>
        )}

        <button
          onClick={onBack}
          className="mt-8 w-full bg-gray-500 text-white font-bold py-3 rounded-md hover:bg-gray-600 transition-transform transform hover:scale-105"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default RankingMenu;
