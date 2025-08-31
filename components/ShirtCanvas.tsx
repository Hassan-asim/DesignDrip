import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { ShirtSelector } from './ShirtSelector';

// Fix for TypeScript error where react-three-fiber's intrinsic elements are not recognized.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: ThreeElements['ambientLight'];
    }
  }
}

interface ShirtCanvasProps {
  textureUrl: string | null;
}

export const ShirtCanvas: React.FC<ShirtCanvasProps> = ({ textureUrl }) => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
        className="w-full h-full transition-all ease-in-out"
      >
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        
        <Suspense fallback={null}>
          <ShirtSelector textureUrl={textureUrl} />
        </Suspense>

        <OrbitControls 
          enableZoom={true}
          minDistance={1.5}
          maxDistance={4}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
};