import React from 'react';
import type { Hand, HandState } from '../types';
import { TAG_COLORS } from '../constants';

interface HandCellProps {
  hand: Hand;
  state: HandState;
  onClick: (handId: string) => void;
}

const baseColors: Record<Hand['type'], string> = {
  pair: 'bg-blue-900',
  suited: 'bg-yellow-900',
  offsuit: 'bg-red-900',
};

const selectedColors: Record<Hand['type'], string> = {
  pair: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]',
  suited: 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)]',
  offsuit: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]',
};

const HandCell: React.FC<HandCellProps> = ({ hand, state, onClick }) => {
  const { isSelected, tag } = state;

  const bgColor = isSelected ? selectedColors[hand.type] : baseColors[hand.type];
  const tagColor = tag !== 0 ? TAG_COLORS[tag] : '';

  return (
    <div
      onClick={() => onClick(hand.id)}
      className={`relative aspect-square flex items-center justify-center rounded-md cursor-pointer select-none
                  transition-all duration-200 ease-in-out text-white font-mono font-bold
                  text-xs sm:text-sm md:text-base
                  hover:scale-105 hover:z-10
                  ${bgColor}`}
    >
      <span>{hand.display}</span>
      {tag !== 0 && (
        <div
          className={`absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-gray-900 ${tagColor}`}
        ></div>
      )}
    </div>
  );
};

// Memoize to prevent re-renders of all cells on single cell click
export default React.memo(HandCell);
