import React from 'react';

interface DesignDescriptionProps {
  description: string;
  isLoading: boolean;
  prompt: string;
}

export const DesignDescription: React.FC<DesignDescriptionProps> = ({ 
  description, 
  isLoading, 
  prompt 
}) => {
  if (!prompt.trim()) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
          Enter a design idea above to see the creative description
        </div>
        <div className="text-gray-300 dark:text-gray-600 text-sm mt-2">
          Let AI describe your vision in creative detail
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8 px-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-sm mt-3">
          Crafting your design story...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-xl">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-purple-200 dark:text-purple-300 mb-2">
          ✨ Creative Description
        </h3>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
      </div>
      
      <div className="text-gray-200 dark:text-gray-100 text-center leading-relaxed">
        {description}
      </div>
      
      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <div className="text-xs text-purple-300/70 dark:text-purple-400/70 text-center">
          Generated with LangChain + Groq AI
        </div>
      </div>
    </div>
  );
};
