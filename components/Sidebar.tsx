import React, { useState } from 'react';
import { encodeRange } from '../utils/range-codec';

interface SidebarProps {
  preloadedRanges: Record<string, string[]>;
  customRanges: Record<string, string[]>;
  activeRange: string;
  onRangeSelect: (rangeName: string) => void;
  isThumbnailView: boolean;
  onToggleView: () => void;
  onSaveRequest: () => void;
  onShareCollectionRequest: () => void;
  onDelete: (rangeName: string) => void;
  viewMode: 'normal' | 'shared_collection';
}

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const RangeButton: React.FC<{
    rangeName: string,
    isActive: boolean,
    isCustom: boolean,
    hands: string[],
    onSelect: (name: string) => void,
    onDelete: (name: string) => void,
    viewMode: 'normal' | 'shared_collection';
}> = ({ rangeName, isActive, isCustom, hands, onSelect, onDelete, viewMode }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const selectedHands = new Set(hands);
        const encoded = encodeRange(selectedHands);
        const url = `${window.location.origin}/app/${encodeURIComponent(rangeName)}/${encoded}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(rangeName);
    }

    return (
        <div className={`flex items-center group rounded-md transition-colors duration-200 ${
              isActive
                ? 'bg-sky-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}>
            <button
                onClick={() => onSelect(rangeName)}
                className={`flex-grow text-left px-3 py-2 text-sm truncate ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`}
            >
                {rangeName}
            </button>
            {isCustom && viewMode === 'normal' && (
                <div className="flex items-center pr-2">
                    <button onClick={handleShare} className="p-1 text-gray-400 hover:text-white" title={copied ? "¡Copiado!" : "Compartir Rango"}>
                        {copied ? <span className="text-xs font-semibold">✓</span> : <ShareIcon />}
                    </button>
                    <button onClick={handleDelete} className="p-1 text-gray-400 hover:text-red-500" title="Eliminar Rango">
                        <TrashIcon />
                    </button>
                </div>
            )}
        </div>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ 
    preloadedRanges, 
    customRanges, 
    activeRange, 
    onRangeSelect, 
    isThumbnailView, 
    onToggleView, 
    onSaveRequest, 
    onShareCollectionRequest,
    onDelete, 
    viewMode 
}) => {
  
  const hasPreloadedRanges = Object.keys(preloadedRanges).length > 0;
  const hasCustomRanges = Object.keys(customRanges).length > 0;

  return (
    <aside className="w-full md:w-56 lg:w-64 bg-gray-800 rounded-lg shadow-lg p-4 mb-4 md:mb-0 md:mr-4 flex-shrink-0 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-sky-400">{viewMode === 'shared_collection' ? 'Colección' : 'Rangos'}</h2>
        <button 
          onClick={onToggleView}
          className="p-1.5 rounded-md text-white bg-gray-700 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
          aria-label={isThumbnailView ? "Mostrar Matriz" : "Mostrar Vista General"}
        >
          {isThumbnailView ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.27 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM11 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
            </svg>
          )}
        </button>
      </div>
       <button onClick={onSaveRequest} className="w-full text-center px-3 py-2 rounded-md text-sm transition-colors duration-200 bg-emerald-600 text-white font-semibold hover:bg-emerald-500 mb-4">
            Guardar Rango Actual
       </button>
      <div className="space-y-2 overflow-y-auto flex-grow">
        {hasPreloadedRanges && <h3 className="text-xs font-bold uppercase text-gray-400 px-1 pt-2">Predefinidos</h3>}
        {Object.entries(preloadedRanges).map(([rangeName, hands]) => (
          <RangeButton 
            key={`preloaded-${rangeName}`} 
            rangeName={rangeName}
            isActive={activeRange === rangeName}
            isCustom={false}
            hands={hands}
            onSelect={onRangeSelect}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        ))}

        {hasCustomRanges && (
            <div className="flex justify-between items-center pt-4">
                <h3 className="text-xs font-bold uppercase text-gray-400 px-1">{viewMode === 'shared_collection' ? 'Rangos Compartidos' : 'Mis Rangos'}</h3>
                {viewMode === 'normal' && (
                    <button onClick={onShareCollectionRequest} className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1" title="Compartir todos mis rangos">
                       <ShareIcon /> Compartir
                    </button>
                )}
            </div>
        )}
        {Object.entries(customRanges).map(([rangeName, hands]) => (
            <RangeButton 
                key={`custom-${rangeName}`}
                rangeName={rangeName}
                isActive={activeRange === rangeName}
                isCustom={true}
                hands={hands}
                onSelect={onRangeSelect}
                onDelete={onDelete}
                viewMode={viewMode}
            />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;