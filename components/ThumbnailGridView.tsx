import React from 'react';
import RangeThumbnail from './RangeThumbnail';

interface ThumbnailGridViewProps {
    ranges: Record<string, string[]>;
    onRangeSelect: (rangeName: string) => void;
}

const ThumbnailGridView: React.FC<ThumbnailGridViewProps> = ({ ranges, onRangeSelect }) => {
    // Filtrar rangos vacíos o que son solo placeholders
    // FIX: Explicitly type the destructured array from Object.entries to resolve 'unknown' type inference on `hands`.
    const visibleRanges = Object.entries(ranges).filter(([name, hands]: [string, string[]]) => hands.length > 0 && name !== 'Store range ...');

    return (
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-sky-400 text-center">Vista General de Rangos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {visibleRanges.map(([rangeName, rangeHands]) => (
                    <RangeThumbnail 
                        key={rangeName}
                        rangeName={rangeName}
                        rangeHands={rangeHands}
                        onClick={onRangeSelect}
                    />
                 ))}
            </div>
        </div>
    );
};

export default ThumbnailGridView;