
import { GoogleGenAI } from '@google/genai';
import { config } from '../config';

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

export const generateTShirtImage = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `A modern, high-quality, centered graphic for a t-shirt design with a transparent background. The design should be bold and clear. Style hint: vector art, minimalist. The design is: ${prompt}`;
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    } else {
      throw new Error('Image generation failed, no images returned.');
    }
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    
    // Handle specific error cases
    if (error.message.includes('API key not valid')) {
      throw new Error('The provided API key is invalid. Please check your configuration.');
    }
    
    if (error.message.includes('billed users')) {
      throw new Error('Gemini Imagen API requires billing to be enabled. Please enable billing in your Google Cloud Console or use a different API key.');
    }
    
    // For now, return a placeholder image with the prompt text
    // In production, you might want to use a different image generation service
    console.warn('Falling back to placeholder image due to API error:', error.message);
    
    // Create a simple SVG placeholder with the prompt text
    const svgContent = `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#f8f9fa" stroke="#dee2e6" stroke-width="2"/>
        <text x="100" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6c757d">
          ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}
        </text>
        <text x="100" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#adb5bd">
          (API Error - Check Console)
        </text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  }
};
