import React from 'react';
import { X, Download, RefreshCcw } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageViewerProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onRemix: (prompt: string) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ image, onClose, onRemix }) => {
  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${image.base64}`;
    link.download = `vibegen-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-950/95 animate-in fade-in duration-200">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>
        <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Preview</span>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={`data:image/jpeg;base64,${image.base64}`}
          alt={image.prompt}
          className="max-h-full w-auto object-contain shadow-2xl rounded-sm"
        />
      </div>

      {/* Footer Actions */}
      <div className="p-6 pb-8 bg-slate-900/80 backdrop-blur-lg border-t border-white/5 flex flex-col gap-4">
        <p className="text-sm text-slate-300 line-clamp-2 font-light italic">
          "{image.prompt}"
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3.5 px-4 rounded-xl font-medium transition-all active:scale-95"
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={() => {
              onClose();
              onRemix(image.prompt);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-accent-600 hover:bg-accent-500 text-white py-3.5 px-4 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(192,38,211,0.3)] hover:shadow-[0_0_25px_rgba(192,38,211,0.5)] active:scale-95"
          >
            <RefreshCcw size={18} />
            Remix Vibe
          </button>
        </div>
      </div>
    </div>
  );
};