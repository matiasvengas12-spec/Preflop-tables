import React from 'react';
import type { Hand } from '../types';
import { BROADWAY_RANKS } from '../constants';

interface FooterProps {
  comboCount: number;
  percentage: number;
  onQuickSelect: (filterFn: (hand: Hand) => boolean) => void;
  onClear: () => void;
}

const QuickSelectButton: React.FC<{onClick: () => void; children: React.ReactNode}> = ({ onClick, children }) => (
    <button onClick={onClick} className="px-3 py-1.5 bg-gray-700 text-gray-200 rounded-md text-sm font-semibold hover:bg-sky-600 transition-colors duration-200">
        {children}
    </button>
);


const Footer: React.FC<FooterProps> = ({ comboCount, percentage, onQuickSelect, onClear }) => {

  const handleBroadway = () => {
    onQuickSelect(h => {
        const r1 = h.id.charAt(0);
        const r2 = h.id.charAt(1);
        return BROADWAY_RANKS.includes(r1) && BROADWAY_RANKS.includes(r2);
    })
  }

  return (
    <footer className="mt-4 pt-4 border-t border-gray-700">
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm font-semibold mb-1 text-gray-300">
          <span>{comboCount} combos en el rango</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 to-indigo-500 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <QuickSelectButton onClick={() => onQuickSelect(() => true)}>Todos</QuickSelectButton>
        <QuickSelectButton onClick={() => onQuickSelect(h => h.type === 'pair')}>Pares</QuickSelectButton>
        <QuickSelectButton onClick={handleBroadway}>Broadway</QuickSelectButton>
        <QuickSelectButton onClick={() => onQuickSelect(h => h.type === 'suited')}>Suited</QuickSelectButton>
        <button onClick={onClear} className="px-3 py-1.5 bg-red-700 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition-colors duration-200">
            Limpiar
        </button>
      </div>
    </footer>
  );
};

export default Footer;
