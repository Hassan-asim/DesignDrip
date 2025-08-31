
import React from 'react';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., a neon astronaut surfing on a slice of pizza"
        rows={3}
        className="w-full p-4 rounded-lg bg-white/5 dark:bg-black/20 text-gray-200 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                   border-2 border-transparent focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 
                   transition-all duration-300 outline-none resize-none shadow-lg"
        style={{width: '100%', padding: '1rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', outline: 'none', resize: 'none', fontSize: '1rem'}}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{background: 'linear-gradient(45deg, #667eea, #f093fb)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', fontSize: '1rem', cursor: 'pointer', opacity: isLoading ? 0.5 : 1}}
      >
        <span className="relative w-full px-5 py-3 transition-all ease-in duration-150 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
          {isLoading ? 'Creating Magic...' : 'Generate Design'}
        </span>
      </button>
    </form>
  );
};
