import React, { useState, useEffect, useMemo } from 'react';
import { encodeRangeCollection } from '../utils/range-codec';

interface ShareCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customRanges: Record<string, string[]>;
}

const ShareCollectionModal: React.FC<ShareCollectionModalProps> = ({ isOpen, onClose, customRanges }) => {
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSlug('');
      setCopied(false);
    }
  }, [isOpen]);

  const sanitizedSlug = useMemo(() => {
    return slug.trim().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
        .replace(/-+/g, '-'); // Replace multiple - with single -
  }, [slug]);

  const generatedUrl = useMemo(() => {
    if (!sanitizedSlug) return '';
    const encodedData = encodeRangeCollection(customRanges);
    if (!encodedData) return '';
    // Use hash for data to keep the main URL clean
    return `${window.location.origin}/app/c/${sanitizedSlug}#${encodedData}`;
  }, [sanitizedSlug, customRanges]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
        className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-2">Compartir Colección de Rangos</h2>
        <p className="text-sm text-gray-400 mb-6">Crea un enlace personalizado y fácil de recordar para compartir todos tus rangos guardados.</p>
        
        <div>
            <label htmlFor="slug-name" className="block text-sm font-medium text-gray-300 mb-2">
                Elige un nombre para tu enlace
            </label>
            <div className="flex items-center">
                <span className="text-gray-400 bg-gray-700 px-3 py-2 rounded-l-md border border-r-0 border-gray-600">
                    app.com/c/
                </span>
                <input
                    id="slug-name"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="rangos-de-pepito"
                    className="flex-grow px-3 py-2 bg-gray-900 border border-gray-600 rounded-r-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    autoFocus
                />
            </div>
        </div>

        {generatedUrl && (
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tu enlace para compartir:
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={generatedUrl}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300 text-sm truncate"
                    />
                    <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors w-28 ${
                            copied 
                            ? 'bg-emerald-600 text-white'
                            : 'bg-sky-600 text-white hover:bg-sky-500'
                        }`}
                    >
                        {copied ? '¡Copiado!' : 'Copiar'}
                    </button>
                </div>
            </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold hover:bg-gray-500 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCollectionModal;