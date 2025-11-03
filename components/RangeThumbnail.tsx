import React, { useMemo } from 'react';
import { HANDS_13x13 } from '../constants';

interface RangeThumbnailProps {
    rangeName: string;
    rangeHands: string[];
    onClick: (rangeName: string) => void;
}

const handTypeColors = {
  pair: 'bg-blue-500',
  suited: 'bg-yellow-500',
  offsuit: 'bg-red-500',
};

const defaultColor = 'bg-gray-700/50';

const RangeThumbnail: React.FC<RangeThumbnailProps> = ({ rangeName, rangeHands, onClick }) => {
    const rangeHandSet = useMemo(() => new Set(rangeHands), [rangeHands]);

    return (
        <div 
            onClick={() => onClick(rangeName)}
            className="bg-gray-900/50 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700/80 hover:scale-105"
        >
            <h3 className="text-lg font-bold text-white text-center mb-3 truncate">{rangeName}</h3>
            <div 
                className="grid gap-[2px] aspect-square"
                style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}
                aria-label={`Miniatura del rango ${rangeName}`}
            >
                {HANDS_13x13.flat().map((hand) => {
                    const isSelected = rangeHandSet.has(hand.id);
                    const color = isSelected ? handTypeColors[hand.type] : defaultColor;
                    return (
                       <div key={hand.id} className={`w-full aspect-square ${color} rounded-sm flex items-center justify-center overflow-hidden`}>
                            <span 
                                className="text-white font-mono font-bold text-center" 
                                style={{ fontSize: 'clamp(5px, 1.2vw, 9px)', lineHeight: 1 }}
                            >
                                {hand.display}
                            </span>
                       </div> 
                    )
                })}
            </div>
        </div>
    );
};

export default React.memo(RangeThumbnail);