import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <p className="text-white font-medium">Generating Design...</p>
      </div>
    </div>
  );
};
