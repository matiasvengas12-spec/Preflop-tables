import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Hand, HandState, TagType } from './types';
import { HANDS_13x13, HANDS_FLAT, TOTAL_COMBOS, PRELOADED_RANGES } from './constants';
import { decodeRange, decodeRangeCollection } from './utils/range-codec';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HandGrid from './components/HandGrid';
import Footer from './components/Footer';
import ThumbnailGridView from './components/ThumbnailGridView';
import SaveRangeModal from './components/SaveRangeModal';
import ShareCollectionModal from './components/ShareCollectionModal';

type ViewMode = 'normal' | 'shared_collection';

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
  const [isThumbnailView, setIsThumbnailView] = useState(false);
  const [customRanges, setCustomRanges] = useState<Record<string, string[]>>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [sharedRanges, setSharedRanges] = useState<Record<string, string[]>>({});


  // Load custom ranges from localStorage on initial mount
  useEffect(() => {
    try {
      const savedRanges = localStorage.getItem('pokerCustomRanges');
      if (savedRanges) {
        setCustomRanges(JSON.parse(savedRanges));
      }
    } catch (error) {
      console.error("Failed to load custom ranges from localStorage", error);
    }
  }, []);
  
  // Load range from URL on initial mount
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash.substring(1); // Remove leading '#'
    const pathParts = path.split('/').filter(Boolean);
    let urlProcessed = false;

    const loadCollection = (collection: Record<string, string[]>) => {
        if (Object.keys(collection).length > 0) {
            setViewMode('shared_collection');
            setSharedRanges(collection);
            
            const firstRangeName = Object.keys(collection)[0];
            const firstRangeHands = collection[firstRangeName];
            
            const rangeHandSet = new Set(firstRangeHands);
            const newStates = initialHandStates();
            HANDS_FLAT.forEach(hand => {
                if(rangeHandSet.has(hand.id)) {
                    newStates[hand.id] = { isSelected: true, tag: 1 };
                }
            });
            setHandStates(newStates);
            setActiveRange(firstRangeName);
            setActiveTag(1);
            urlProcessed = true;
        }
    };
    
    // Priority 1: Newest format -> /app/c/slug#data
    if (pathParts[0] === 'app' && pathParts[1] === 'c' && pathParts.length === 3 && hash) {
        try {
            const decodedCollection = decodeRangeCollection(hash);
            loadCollection(decodedCollection);
        } catch (error) {
            console.error("Failed to decode collection from URL hash", error);
        }
    }

    // Priority 2: Old formats (path-based)
    if (!urlProcessed && pathParts[0] === 'app' && pathParts.length > 1) {
      try {
        let collectionData: string | undefined;

        if (pathParts[1] === 'c' && pathParts.length === 4) { // /app/c/slug/data
            collectionData = decodeURIComponent(pathParts[3]);
        } else if (pathParts[1] === 'collection' && pathParts.length === 3) { // /app/collection/data
            collectionData = decodeURIComponent(pathParts[2]);
        }

        if (collectionData) {
          const decodedCollection = decodeRangeCollection(collectionData);
          loadCollection(decodedCollection);
        } else if (pathParts.length === 3 && !['c', 'collection'].includes(pathParts[1])) {
          // It's a single range link
          const rangeName = decodeURIComponent(pathParts[1]);
          const encodedData = pathParts[2];
          const hands = decodeRange(encodedData);
          
          const rangeHandSet = new Set(hands);
          const newStates = initialHandStates();
          HANDS_FLAT.forEach(hand => {
              if(rangeHandSet.has(hand.id)) {
                  newStates[hand.id] = { isSelected: true, tag: 1 };
              }
          });
          setHandStates(newStates);
          setActiveRange(rangeName);
          setActiveTag(1);
          urlProcessed = true;
        }
      } catch (error) {
        console.error("Failed to decode range from URL path", error);
      }
    }
    
    if (urlProcessed) {
        // Clean the URL after processing
        window.history.replaceState({}, document.title, window.location.origin);
    }

  }, []);

  // Save custom ranges to localStorage whenever they change
  useEffect(() => {
    if (viewMode === 'normal') {
      try {
        localStorage.setItem('pokerCustomRanges', JSON.stringify(customRanges));
      } catch (error) {
        console.error("Failed to save custom ranges to localStorage", error);
      }
    }
  }, [customRanges, viewMode]);

  const displayedPreloadedRanges = useMemo(() => (viewMode === 'shared_collection' ? {} : PRELOADED_RANGES), [viewMode]);
  const displayedCustomRanges = useMemo(() => (viewMode === 'shared_collection' ? sharedRanges : customRanges), [viewMode, sharedRanges, customRanges]);

  const allRanges = useMemo(() => ({ ...displayedPreloadedRanges, ...displayedCustomRanges }), [displayedPreloadedRanges, displayedCustomRanges]);

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
    const clearRangeName = viewMode === 'shared_collection' ? '' : 'Clear mode';
    setActiveRange(clearRangeName);
  }, [viewMode]);

  const handleRangeSelect = useCallback((rangeName: string) => {
    const rangeHands = allRanges[rangeName] || [];
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
    if (isThumbnailView) {
        setIsThumbnailView(false);
    }
  }, [isThumbnailView, allRanges]);

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

  const handleSaveRange = useCallback((name: string) => {
    const selectedHands = HANDS_FLAT.filter(hand => handStates[hand.id].isSelected).map(hand => hand.id);
    if(selectedHands.length === 0) {
        alert("No se puede guardar un rango vacío.");
        return;
    }
    setCustomRanges(prev => ({ ...prev, [name]: selectedHands }));
    setIsSaveModalOpen(false);
    setActiveRange(name);
     if (viewMode === 'shared_collection') {
        setViewMode('normal');
        setSharedRanges({});
    }
  }, [handStates, viewMode]);

  const handleDeleteRange = useCallback((name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el rango "${name}"?`)) {
      setCustomRanges(prev => {
        const newRanges = { ...prev };
        delete newRanges[name];
        return newRanges;
      });
      if(activeRange === name) {
        handleClear();
      }
    }
  }, [activeRange, handleClear]);

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
        preloadedRanges={displayedPreloadedRanges}
        customRanges={displayedCustomRanges}
        activeRange={activeRange}
        onRangeSelect={handleRangeSelect}
        isThumbnailView={isThumbnailView}
        onToggleView={() => setIsThumbnailView(prev => !prev)}
        onSaveRequest={() => setIsSaveModalOpen(true)}
        onShareCollectionRequest={() => setIsShareModalOpen(true)}
        onDelete={handleDeleteRange}
        viewMode={viewMode}
      />
      <main className="flex-1 flex flex-col min-w-0">
        {isThumbnailView ? (
          <ThumbnailGridView 
            ranges={allRanges}
            onRangeSelect={handleRangeSelect}
          />
        ) : (
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
        )}
      </main>
      <SaveRangeModal 
        isOpen={isSaveModalOpen}
        onSave={handleSaveRange}
        onClose={() => setIsSaveModalOpen(false)}
        existingNames={Object.keys(allRanges)}
      />
      <ShareCollectionModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        customRanges={customRanges}
      />
    </div>
  );
}

export default App;