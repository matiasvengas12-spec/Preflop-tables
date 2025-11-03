import React from 'react';

interface SidebarProps {
  ranges: Record<string, string[]>;
  activeRange: string;
  onRangeSelect: (rangeName: string) => void;
  isThumbnailView: boolean;
  onToggleView: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ ranges, activeRange, onRangeSelect, isThumbnailView, onToggleView }) => {
  return (
    <aside className="w-full md:w-56 lg:w-64 bg-gray-800 rounded-lg shadow-lg p-4 mb-4 md:mb-0 md:mr-4 flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-sky-400">Rangos Predefinidos</h2>
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
      <div className="space-y-2 overflow-y-auto max-h-96 md:max-h-full">
        {Object.keys(ranges).map((rangeName) => (
          <button
            key={rangeName}
            onClick={() => onRangeSelect(rangeName)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
              activeRange === rangeName
                ? 'bg-sky-600 text-white font-semibold'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {rangeName}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;