import React from 'react';

interface SidebarProps {
  ranges: Record<string, string[]>;
  activeRange: string;
  onRangeSelect: (rangeName: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ ranges, activeRange, onRangeSelect }) => {
  return (
    <aside className="w-full md:w-56 lg:w-64 bg-gray-800 rounded-lg shadow-lg p-4 mb-4 md:mb-0 md:mr-4 flex-shrink-0">
      <h2 className="text-xl font-bold mb-4 text-sky-400">Rangos Predefinidos</h2>
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
