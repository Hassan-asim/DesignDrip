
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { ShirtCanvas } from './components/ShirtCanvas';
import { Loader } from './components/Loader';
import { DesignDescription } from './components/DesignDescription';
import { generateTShirtImage, generateDesignDescription } from './services/langchainService';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>('/default-logo.svg');
  const [designDescription, setDesignDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a design idea.');
      return;
    }
    setIsLoading(true);
    setIsGeneratingDescription(true);
    setError(null);
    setGeneratedImage(null);
    setDesignDescription('');

    try {
      // Generate both image and description in parallel
      const [imageDataUrl, description] = await Promise.all([
        generateTShirtImage(prompt),
        generateDesignDescription(prompt)
      ]);
      
      setGeneratedImage(imageDataUrl);
      setDesignDescription(description);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
      setIsGeneratingDescription(false);
    }
  }, [prompt]);

  return (
    <main className="transition-colors duration-500" style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-blue-200 to-indigo-300 dark:from-gray-900 dark:via-indigo-800 dark:to-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden" style={{minHeight: '100vh'}}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-[calc(100vh-80px)]" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', minHeight: 'calc(100vh - 80px)'}}>
          <div className="flex flex-col gap-8 h-full justify-center" style={{display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center'}}>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500" style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', background: 'linear-gradient(45deg, #667eea, #f093fb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'white'}}>Design Your Future Tee</h1>
              <p className="text-gray-600 dark:text-gray-400" style={{color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem'}}>Describe your vision. Let AI bring it to life on a virtual tee. What will you create today?</p>
            </div>
            <PromptForm 
              prompt={prompt} 
              setPrompt={setPrompt} 
              onSubmit={handleGenerateImage}
              isLoading={isLoading} 
            />
            {error && <p className="text-red-400 text-center font-semibold animate-pulse">{error}</p>}
          </div>

          <div className="relative w-full h-[50vh] lg:h-[80vh]" style={{position: 'relative', width: '100%', height: '60vh', minHeight: '400px'}}>
            {isLoading && <Loader />}
            <ShirtCanvas textureUrl={generatedImage} />
          </div>
          
          {/* Creative Description Section */}
          <div className="col-span-1 lg:col-span-2 mt-8 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <DesignDescription 
              description={designDescription}
              isLoading={isGeneratingDescription}
              prompt={prompt}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
