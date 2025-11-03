import React, { useState, useMemo, useCallback } from 'react';
import type { Hand, HandState, TagType } from './types';
import { HANDS_13x13, HANDS_FLAT, TOTAL_COMBOS, PRELOADED_RANGES } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HandGrid from './components/HandGrid';
import Footer from './components/Footer';

const initialHandStates = (): Record<string, HandState> => {
  const states: Record<string, HandState> = {};
  HANDS_FLAT.forEach(hand => {
    states[hand.id] = { isSelected: false, tag: 0 };
  });
  return states;
};

function App() {
  const [handStates, setHandStates] = useState<Record<string, HandState>>(initialHandStates);
  const [activeTag, setActiveTag] = useState<TagType>(0);
  const [activeRange, setActiveRange] = useState<string>('Clear mode');

  const handleCellClick = useCallback((handId: string) => {
    setHandStates(prevStates => {
      const currentHand = prevStates[handId];
      const isCurrentlySelected = currentHand.isSelected;
      const newStates = { ...prevStates };

      newStates[handId] = {
        isSelected: !isCurrentlySelected,
        tag: !isCurrentlySelected ? activeTag : 0,
      };
      
      return newStates;
    });
    setActiveRange(''); // Deselect pre-loaded range on manual edit
  }, [activeTag]);

  const handleClear = useCallback(() => {
    setHandStates(initialHandStates());
    setActiveTag(0);
    setActiveRange('Clear mode');
  }, []);

  const handleRangeSelect = useCallback((rangeName: string) => {
    const rangeHands = PRELOADED_RANGES[rangeName] || [];
    const rangeHandSet = new Set(rangeHands);
    const newStates: Record<string, HandState> = {};
    HANDS_FLAT.forEach(hand => {
      const isSelected = rangeHandSet.has(hand.id);
      newStates[hand.id] = {
        isSelected: isSelected,
        tag: isSelected ? 1 : 0, // Default tag 1 for pre-loaded ranges
      };
    });
    setHandStates(newStates);
    setActiveRange(rangeName);
    setActiveTag(1); // Set active tag to 1 for consistency
  }, []);

  const handleQuickSelect = useCallback((filterFn: (hand: Hand) => boolean) => {
    const newStates: Record<string, HandState> = { ...handStates };
    HANDS_FLAT.forEach(hand => {
        if (filterFn(hand)) {
            newStates[hand.id] = {
                isSelected: true,
                tag: activeTag === 0 ? 1 : activeTag, // Default to tag 1 if no tag selected
            };
        }
    });
    setHandStates(newStates);
    setActiveRange('');
  }, [handStates, activeTag]);

  // FIX: Refactored stats calculation to fix typing issue and improve performance.
  const stats = useMemo(() => {
    const selectedCombos = HANDS_FLAT.reduce((sum, hand) => {
      if (handStates[hand.id].isSelected) {
        return sum + hand.combos;
      }
      return sum;
    }, 0);
    const percentage = (selectedCombos / TOTAL_COMBOS) * 100;
    return { selectedCombos, percentage };
  }, [handStates]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 font-sans p-2 sm:p-4">
      <Sidebar 
        ranges={PRELOADED_RANGES} 
        activeRange={activeRange}
        onRangeSelect={handleRangeSelect} 
      />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
            <Header activeTag={activeTag} onTagSelect={setActiveTag} />
            <HandGrid 
                hands={HANDS_13x13}
                handStates={handStates}
                onCellClick={handleCellClick}
            />
            <Footer 
                comboCount={stats.selectedCombos}
                percentage={stats.percentage}
                onQuickSelect={handleQuickSelect}
                onClear={handleClear}
            />
        </div>
      </main>
    </div>
  );
}

export default App;
