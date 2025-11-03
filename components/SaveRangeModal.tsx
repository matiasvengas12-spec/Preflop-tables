import React, { useState, useEffect } from 'react';

interface SaveRangeModalProps {
  isOpen: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
  existingNames: string[];
}

const SaveRangeModal: React.FC<SaveRangeModalProps> = ({ isOpen, onSave, onClose, existingNames }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);
  
  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('El nombre no puede estar vacío.');
      return;
    }
    if (existingNames.includes(trimmedName)) {
      setError('Ya existe un rango con este nombre.');
      return;
    }
    onSave(trimmedName);
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-4">Guardar Rango</h2>
        <p className="text-sm text-gray-400 mb-4">Introduce un nombre para tu rango actual. Este nombre debe ser único.</p>
        <div>
            <label htmlFor="range-name" className="sr-only">Nombre del rango</label>
            <input
                id="range-name"
                type="text"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    if(error) setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="Ej: Mi Rango de 3-Bet"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-semibold hover:bg-sky-500 transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveRangeModal;