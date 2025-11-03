import React from 'react';
import type { Hand, HandState } from '../types';
import HandCell from './HandCell';

interface HandGridProps {
  hands: Hand[][];
  handStates: Record<string, HandState>;
  onCellClick: (handId: string) => void;
}

const HandGrid: React.FC<HandGridProps> = ({ hands, handStates, onCellClick }) => {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div 
        className="grid gap-1.5"
        style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
      >
        {hands.flat().map((hand) => (
          <HandCell
            key={hand.id}
            hand={hand}
            state={handStates[hand.id]}
            onClick={onCellClick}
          />
        ))}
      </div>
    </div>
  );
};

export default HandGrid;
