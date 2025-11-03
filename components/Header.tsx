import React from 'react';
import type { TagType } from '../types';
import { TAG_COLORS } from '../constants';

interface HeaderProps {
  activeTag: TagType;
  onTagSelect: (tag: TagType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTag, onTagSelect }) => {
  const tags: TagType[] = [0, 1, 2, 3, 4, 5];

  return (
    <header className="mb-4 flex items-center justify-center flex-wrap gap-2">
      {tags.map((tag) => {
        const isActive = activeTag === tag;
        let bgColor = 'bg-gray-600 hover:bg-gray-500';
        if (tag !== 0) {
            bgColor = `${TAG_COLORS[tag as Exclude<TagType, 0>]} opacity-60 hover:opacity-100`;
        }
        if (isActive) {
            if (tag === 0) {
                bgColor = 'bg-sky-500';
            } else {
                bgColor = `${TAG_COLORS[tag as Exclude<TagType, 0>]} opacity-100`;
            }
        }

        return (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-400 ${
              isActive ? 'ring-2 ring-white' : ''
            } ${bgColor}`}
          >
            {tag === 0 ? 'No weight' : tag}
          </button>
        );
      })}
    </header>
  );
};

export default Header;
