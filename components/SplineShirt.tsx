import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface SplineShirtProps {
  textureUrl: string | null;
}

export const SplineShirt: React.FC<SplineShirtProps> = ({ textureUrl }) => {
  const shirtRef = useRef<THREE.Group>(null!);
  const [splineModel, setSplineModel] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shirtMesh, setShirtMesh] = useState<THREE.Mesh | null>(null);
  
  // Load the texture from the URL provided by the AI
  const logoTexture = useTexture(textureUrl || '/default-logo.svg');
  logoTexture.anisotropy = 16;
  
  // Load the Spline model
  useEffect(() => {
    const loadSplineModel = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading Spline 3D shirt model from /scene.splinecode...');
        
        // Import the Spline runtime dynamically
        const { Application } = await import('@splinetool/runtime');
        
        // Create a new Spline application
        const app = new Application();
        
        // Load the scene from the local file
        await app.load('/scene.splinecode');
        
        // Get the scene and convert it to Three.js objects
        const scene = app.scene;
        if (scene) {
          console.log('✅ Spline 3D model loaded successfully:', scene);
          
          // Clone the scene to avoid conflicts
          const clonedScene = scene.clone();
          
          // Find the main shirt mesh in the Spline model
          const findShirtMesh = (object: THREE.Object3D): THREE.Mesh | null => {
            if (object instanceof THREE.Mesh && object.geometry) {
              // Check if this looks like a shirt mesh (has reasonable dimensions)
              const box = new THREE.Box3().setFromObject(object);
              const size = box.getSize(new THREE.Vector3());
              if (size.x > 0.5 && size.y > 0.5 && size.z > 0.1) {
                console.log('🎯 Found shirt mesh:', object.name, 'with size:', size);
                return object;
              }
            }
            
            // Recursively search children
            for (const child of object.children) {
              const found = findShirtMesh(child);
              if (found) return found;
            }
            
            return null;
          };
          
          const foundShirtMesh = findShirtMesh(clonedScene);
          if (foundShirtMesh) {
            setShirtMesh(foundShirtMesh);
            console.log('🎯 Shirt mesh found and set for texture mapping');
          } else {
            console.warn('⚠️ No suitable shirt mesh found in Spline model');
          }
          
          // Scale and position the model appropriately
          clonedScene.scale.set(1, 1, 1);
          clonedScene.position.set(0, 0, 0);
          
          setSplineModel(clonedScene);
        } else {
          console.warn('⚠️ No scene found in Spline model');
        }
      } catch (error) {
        console.error('❌ Failed to load Spline model:', error);
        // Fallback to a realistic T-shirt if Spline fails
        setSplineModel(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSplineModel();
  }, []);
  
  // Use a slight rotation animation
  useFrame((state, delta) => {
    if (shirtRef.current) {
      shirtRef.current.rotation.y += delta * 0.2;
    }
  });
  
  // If Spline model loaded successfully, render it with texture
  if (splineModel && !isLoading) {
    return (
      <group ref={shirtRef}>
        {/* Render the Spline 3D model */}
        <primitive 
          object={splineModel} 
          castShadow 
          receiveShadow
        />
        
        {/* Apply the AI-generated design as a texture on the shirt */}
        {textureUrl && shirtMesh && (
          <mesh 
            position={[0, 0, 0.05]} 
            rotation={[0, 0, 0]}
            scale={[0.8, 0.8, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={logoTexture} 
              transparent 
              alphaTest={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
        
        {/* Alternative: Apply texture directly to the shirt mesh if possible */}
        {textureUrl && shirtMesh && (
          <primitive 
            object={shirtMesh.clone()} 
            position={[0, 0, 0.02]}
            scale={[1.02, 1.02, 1.02]}
          >
            <meshStandardMaterial 
              map={logoTexture}
              transparent 
              alphaTest={0.1}
              side={THREE.DoubleSide}
              blending={THREE.MultiplyBlending}
            />
          </primitive>
        )}
      </group>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <group>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#4a5568" />
        </mesh>
        <mesh position={[0, 0, 0.5]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#38b2ac" />
        </mesh>
        {/* Loading indicator */}
        <mesh position={[0, 0, 0.7]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#38b2ac" />
        </mesh>
      </group>
    );
  }
  
  // Fallback: Professional, realistic T-shirt geometry
  return (
    <group ref={shirtRef}>
      {/* Main shirt body - realistic fabric simulation */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 2.0, 32, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.4}
          metalness={0.05}
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Shirt collar - more detailed */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.65, 0.75, 0.25, 32]} />
        <meshStandardMaterial 
          color="#f8f9fa" 
          roughness={0.3}
          metalness={0.02}
        />
      </mesh>
      
      {/* Collar fold detail */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.1, 32]} />
        <meshStandardMaterial 
          color="#e9ecef" 
          roughness={0.5}
          metalness={0.01}
        />
      </mesh>
      
      {/* Left sleeve - realistic with taper */}
      <mesh position={[-1.15, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.35, 1.4, 24, 4]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      
      {/* Left sleeve cuff */}
      <mesh position={[-1.15, -0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.15, 24]} />
        <meshStandardMaterial 
          color="#f1f3f4" 
          roughness={0.6}
          metalness={0.02}
        />
      </mesh>
      
      {/* Right sleeve - realistic with taper */}
      <mesh position={[1.15, 0.2, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.35, 1.4, 24, 4]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>
      
      {/* Right sleeve cuff */}
      <mesh position={[1.15, -0.5, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.15, 24]} />
        <meshStandardMaterial 
          color="#f1f3f4" 
          roughness={0.6}
          metalness={0.02}
        />
      </mesh>
      
      {/* Shirt hem/fold details - more realistic */}
      <mesh position={[0, -0.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.0, 0.15, 32]} />
        <meshStandardMaterial 
          color="#e9ecef" 
          roughness={0.6}
          metalness={0.02}
        />
      </mesh>
      
      {/* Additional hem fold for realism */}
      <mesh position={[0, -0.95, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.08, 32]} />
        <meshStandardMaterial 
          color="#dee2e6" 
          roughness={0.7}
          metalness={0.01}
        />
      </mesh>
      
      {/* Button row - multiple buttons */}
      <mesh position={[0, 0.1, 0.85]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshStandardMaterial 
          color="#6c757d" 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      <mesh position={[0, 0.3, 0.85]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshStandardMaterial 
          color="#6c757d" 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      <mesh position={[0, 0.5, 0.85]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
        <meshStandardMaterial 
          color="#6c757d" 
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
      
      {/* Button holes */}
      <mesh position={[0, 0.1, 0.88]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
      
      <mesh position={[0, 0.3, 0.88]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
      
      <mesh position={[0, 0.5, 0.88]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
        <meshStandardMaterial 
          color="#000000" 
          roughness={1.0}
          metalness={0.0}
        />
      </mesh>
      
      {/* Fabric texture simulation - subtle bumps */}
      <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
        <cylinderGeometry args={[0.86, 0.96, 2.02, 32, 8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          roughness={0.8}
          metalness={0.0}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Logo/Design on the front - properly positioned and sized */}
      {textureUrl && (
        <mesh position={[0, 0, 0.88]} castShadow receiveShadow>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent 
            alphaTest={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Additional lighting for better 3D effect */}
      <mesh position={[0, 0, -0.88]} castShadow receiveShadow>
        <planeGeometry args={[0.9, 0.9]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.15}
        />
      </mesh>
      
      {/* Side seams for realism */}
      <mesh position={[-0.85, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
        <meshStandardMaterial 
          color="#dee2e6" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
      
      <mesh position={[0.85, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
        <meshStandardMaterial 
          color="#dee2e6" 
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
};
