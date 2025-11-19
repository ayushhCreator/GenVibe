import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Zap, History } from 'lucide-react';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage, GenerationState } from './types';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ImageViewer } from './components/ImageViewer';

// Placeholder image for empty state
const PLACEHOLDER_URL = "https://picsum.photos/450/800?grayscale&blur=2";

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [status, setStatus] = useState<GenerationState>({ loading: false, error: null });
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  // Handle image generation
  const handleGenerate = async (searchPrompt: string = prompt) => {
    if (!searchPrompt.trim()) return;
    
    // Dismiss keyboard on mobile
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }

    setStatus({ loading: true, error: null });
    try {
      const newImages = await generateWallpapers(searchPrompt, 4);
      setImages(prev => [...newImages, ...prev]); // Add new images to top
      setPrompt(''); // Clear input on success
    } catch (err: any) {
      setStatus({ loading: false, error: err.message || "Something went wrong" });
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const handleRemix = (previousPrompt: string) => {
    setPrompt(previousPrompt);
    // Optional: Scroll to top to show the input is ready
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent-600 rounded-lg shadow-[0_0_10px_rgba(192,38,211,0.4)]">
            <Zap size={20} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            VibeGen
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 px-3 py-1 bg-slate-900 rounded-full border border-white/5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Imagen 4.0
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 pt-6">
        
        {/* Intro / Empty State */}
        {images.length === 0 && !status.loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6 opacity-80">
            <div className="w-24 h-40 bg-slate-900 rounded-xl border border-slate-800 mb-6 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-brand-500/20 group-hover:opacity-100 transition-opacity"></div>
               <ImageIcon size={32} className="text-slate-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Create your aesthetic</h2>
            <p className="text-slate-400 max-w-xs">
              Describe a vibe like "retro sunset vaporwave" or "rainy cyberpunk city" to generate phone wallpapers.
            </p>
          </div>
        )}

        {/* Error Message */}
        {status.error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
            <div className="min-w-[4px] h-full bg-red-500 rounded-full"></div>
            {status.error}
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
           <div className="mb-6">
             <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
                <History size={14} />
                <span>Recent Vibes</span>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className="group relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-slate-900 ring-1 ring-white/10 transition-all hover:ring-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500"
                >
                  <img
                    src={`data:image/jpeg;base64,${img.base64}`}
                    alt={img.prompt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-xs text-white line-clamp-2 text-left font-medium">
                      {img.prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
           </div>
        )}
      </main>

      {/* Input Area (Sticky Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20">
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-accent-600 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
            <div className="relative flex gap-2 bg-slate-900 p-2 rounded-2xl ring-1 ring-white/10">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Describe your vibe (e.g. Neon Tokyo Rain)..."
                className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 px-3 py-2 text-base"
                disabled={status.loading}
              />
              <button
                onClick={() => handleGenerate()}
                disabled={!prompt.trim() || status.loading}
                className="bg-white text-black hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-2 font-semibold flex items-center gap-2 transition-colors"
              >
                {status.loading ? (
                  <span className="animate-spin block w-4 h-4 border-2 border-black/30 border-t-black rounded-full"></span>
                ) : (
                  <Sparkles size={18} className={prompt.trim() ? "text-accent-600" : "text-slate-400"} fill={prompt.trim() ? "currentColor" : "none"} />
                )}
                <span className="hidden sm:inline">Generate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <LoadingOverlay isVisible={status.loading} />
      <ImageViewer 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)}
        onRemix={handleRemix}
      />
    </div>
  );
}
