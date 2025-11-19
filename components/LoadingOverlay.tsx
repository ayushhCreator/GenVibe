import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-accent-500 border-solid rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-t-4 border-brand-400 border-solid rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <h2 className="mt-8 text-xl font-medium text-white animate-pulse">Dreaming up your vibe...</h2>
      <p className="mt-2 text-sm text-slate-400">Generating 4 variations</p>
    </div>
  );
};