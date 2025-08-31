import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { config } from '../config';

// Initialize Groq for text generation
const groq = new ChatGroq({
  apiKey: config.GROQ_API_KEY,
  model: "llama-3-8b-8192",
});

// Working AI image generation APIs for 3D textures
const API_ENDPOINTS = [
  {
    name: 'Hugging Face',
    url: 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
    headers: { 'Authorization': `Bearer ${config.HUGGINGFACE_API_KEY}` }
  },
  {
    name: 'Stability AI',
    url: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    headers: { 'Authorization': `Bearer ${config.STABILITY_API_KEY || 'demo'}` }
  }
];

export const generateDesignDescription = async (prompt: string): Promise<string> => {
  try {
    const template = `You are a creative fashion designer and copywriter. 
    Create a compelling, detailed description of a T-shirt design based on this prompt: "{prompt}"
    
    The description should be:
    - 2-3 sentences long
    - Creative and engaging
    - Include style, mood, and design elements
    - Suitable for marketing and social media
    - Written in a trendy, fashion-forward tone
    
    Focus on the visual appeal and story behind the design.`;

    const chain = PromptTemplate.fromTemplate(template)
      .pipe(groq)
      .pipe(new StringOutputParser());

    const result = await chain.invoke({ prompt });
    return result;
  } catch (error) {
    console.error('Error generating description with Groq:', error);
    // Fallback description
    return `A unique T-shirt design featuring ${prompt.toLowerCase()}. This creative piece combines modern aesthetics with personal expression, perfect for making a statement.`;
  }
};

export const generateTShirtImage = async (prompt: string): Promise<string> => {
  console.log('🚀 Starting 3D texture generation for:', prompt);
  
  // Try each API endpoint until one works
  for (const api of API_ENDPOINTS) {
    try {
      console.log(`🔄 Trying ${api.name} API for 3D texture...`);
      
      let requestBody;
      let response;
      
      if (api.name === 'Hugging Face') {
        requestBody = {
          inputs: `${prompt}, t-shirt design texture, seamless pattern, high quality, detailed, artistic, front view, fabric texture, wearable design, no background, clean edges`,
          parameters: {
            num_inference_steps: 25,
            guidance_scale: 8.0,
            width: 512,
            height: 512
          }
        };
        
        response = await fetch(api.url, {
          method: 'POST',
          headers: { ...api.headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        
      } else if (api.name === 'Stability AI') {
        requestBody = {
          text_prompts: [
            {
              text: `${prompt}, t-shirt design texture, seamless pattern, high quality, detailed, artistic, front view, fabric texture, wearable design, no background, clean edges`,
              weight: 1
            }
          ],
          cfg_scale: 8,
          height: 512,
          width: 512,
          samples: 1,
          steps: 35,
        };
        
        response = await fetch(api.url, {
          method: 'POST',
          headers: { ...api.headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
      }
      
      if (response && response.ok) {
        if (api.name === 'Hugging Face') {
          const imageBlob = await response.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          console.log(`✅ Successfully generated 3D texture with ${api.name}`);
          return imageUrl;
        } else if (api.name === 'Stability AI') {
          const data = await response.json();
          if (data.artifacts && data.artifacts[0]) {
            const imageData = data.artifacts[0].base64;
            const imageUrl = `data:image/png;base64,${imageData}`;
            console.log(`✅ Successfully generated 3D texture with ${api.name}`);
            return imageUrl;
          }
        }
      } else {
        console.warn(`❌ ${api.name} API failed with status:`, response?.status);
      }
      
    } catch (error) {
      console.warn(`❌ ${api.name} API error:`, error);
      continue; // Try next API
    }
  }
  
  // If all APIs fail, create a sophisticated 3D-ready texture design
  console.log('🎨 All APIs failed, creating advanced 3D texture design');
  return createAdvanced3DTexture(prompt);
};

// Create a sophisticated, 3D-ready texture design that works well on T-shirt models
const createAdvanced3DTexture = (prompt: string): string => {
  const designStyles = [
    {
      name: 'geometric',
      elements: [
        `<path d="M 50 50 L 150 100 L 250 50 L 350 100 L 350 350 L 50 350 Z" fill="${getRandomColor()}" opacity="0.9"/>`,
        `<circle cx="100" cy="200" r="50" fill="${getRandomColor()}" opacity="0.8"/>`,
        `<rect x="200" y="150" width="100" height="100" fill="${getRandomColor()}" opacity="0.7"/>`,
        `<polygon points="300,100 350,150 300,200 250,150" fill="${getRandomColor()}" opacity="0.6"/>`
      ]
    },
    {
      name: 'abstract',
      elements: [
        `<path d="M 40 100 Q 120 60 200 100 T 360 100 Q 280 140 200 100 T 40 100" fill="${getRandomColor()}" opacity="0.9"/>`,
        `<circle cx="120" cy="250" r="45" fill="${getRandomColor()}" opacity="0.8"/>`,
        `<path d="M 240 180 Q 280 160 320 180 T 400 220 Q 360 240 320 220 T 240 180" fill="${getRandomColor()}" opacity="0.7"/>`,
        `<ellipse cx="80" cy="300" rx="60" ry="30" fill="${getRandomColor()}" opacity="0.6"/>`
      ]
    },
    {
      name: 'minimalist',
      elements: [
        `<line x1="50" y1="150" x2="450" y2="150" stroke="${getRandomColor()}" stroke-width="10" opacity="0.9"/>`,
        `<circle cx="250" cy="250" r="80" fill="none" stroke="${getRandomColor()}" stroke-width="8" opacity="0.8"/>`,
        `<rect x="150" y="150" width="200" height="200" fill="none" stroke="${getRandomColor()}" stroke-width="6" opacity="0.7"/>`,
        `<path d="M 100 300 L 200 250 L 300 300 L 400 250" stroke="${getRandomColor()}" stroke-width="5" fill="none" opacity="0.6"/>`
      ]
    },
    {
      name: 'organic',
      elements: [
        `<path d="M 100 100 C 150 80 200 120 250 100 S 350 80 400 100 L 400 300 C 350 320 300 280 250 300 S 150 320 100 300 Z" fill="${getRandomColor()}" opacity="0.8"/>`,
        `<circle cx="150" cy="200" r="40" fill="${getRandomColor()}" opacity="0.7"/>`,
        `<path d="M 250 180 Q 300 160 350 180 T 450 200 Q 400 220 350 200 T 250 180" fill="${getRandomColor()}" opacity="0.6"/>`,
        `<ellipse cx="300" cy="280" rx="50" ry="25" fill="${getRandomColor()}" opacity="0.5"/>`
      ]
    }
  ];
  
  const selectedStyle = designStyles[Math.floor(Math.random() * designStyles.length)];
  const bgColor = getRandomColor();
  const accentColor = getRandomColor();
  const highlightColor = getRandomColor();
  
  const svgContent = `
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.95" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.85" />
        </linearGradient>
        <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.98" />
          <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.05" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.2"/>
        </filter>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <pattern id="texturePattern" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          <circle cx="32" cy="32" r="2" fill="${highlightColor}" opacity="0.3"/>
          <circle cx="16" cy="16" r="1" fill="${highlightColor}" opacity="0.2"/>
          <circle cx="48" cy="48" r="1.5" fill="${highlightColor}" opacity="0.25"/>
        </pattern>
      </defs>
      
      <!-- Background with gradient and texture pattern -->
      <rect width="512" height="512" fill="url(#bgGrad)"/>
      <rect width="512" height="512" fill="url(#texturePattern)"/>
      
      <!-- Central design area with subtle shadow -->
      <circle cx="256" cy="256" r="220" fill="url(#centerGrad)" filter="url(#shadow)"/>
      
      <!-- Style-specific design elements with glow effect -->
      <g filter="url(#glow)">
        ${selectedStyle.elements.join('\n        ')}
      </g>
      
      <!-- Main text/design element with better positioning for 3D -->
      <text x="256" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#2d3748" filter="url(#shadow)">
        ${prompt.substring(0, 40)}${prompt.length > 40 ? '...' : ''}
      </text>
      
      <!-- Design label -->
      <text x="256" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#718096" opacity="0.8">
        3D T-Shirt Texture
      </text>
      
      <!-- Corner decorative elements for better 3D wrapping -->
      <g opacity="0.7">
        <circle cx="60" cy="60" r="25" fill="${accentColor}"/>
        <circle cx="452" cy="60" r="20" fill="${bgColor}"/>
        <circle cx="60" cy="452" r="30" fill="${accentColor}"/>
        <circle cx="452" cy="452" r="22" fill="${bgColor}"/>
      </g>
      
      <!-- Subtle border for better texture definition -->
      <rect x="20" y="20" width="472" height="472" fill="none" stroke="${highlightColor}" stroke-width="2" opacity="0.3" rx="10"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
};

// Helper function to get random colors optimized for 3D textures
const getRandomColor = (): string => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', 
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd',
    '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9', '#f8c471', '#82e0aa',
    '#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#1abc9c', '#f1c40f'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};


