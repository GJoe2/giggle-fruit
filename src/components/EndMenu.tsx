"use client";

import React from 'react';

interface EndMenuProps {
  message: string;
  onRestart: () => void;
}

const EndMenu: React.FC<EndMenuProps> = ({ message, onRestart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">{message}</h2>
        <button
          onClick={onRestart}
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default EndMenu;
