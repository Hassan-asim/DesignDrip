import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface GLBShirtProps {
  textureUrl: string | null;
}

export const GLBShirt: React.FC<GLBShirtProps> = ({ textureUrl }) => {
  const shirtRef = useRef<THREE.Group>(null!);
  const [modelInfo, setModelInfo] = useState<{
    nodes: any;
    materials: any;
    animations: any;
  } | null>(null);
  
  // Load the GLB model
  const gltf = useGLTF('/t_shirt_site.glb');
  
  useEffect(() => {
    if (gltf) {
      setModelInfo(gltf);
      console.log('GLB Model loaded:', gltf);
      console.log('Nodes:', Object.keys(gltf.nodes));
      console.log('Materials:', Object.keys(gltf.materials));
    }
  }, [gltf]);
  
  // Load the texture from the URL provided by the AI
  const logoTexture = useTexture(textureUrl || '/default-logo.svg');
  logoTexture.anisotropy = 16;
  
  // Use a slight rotation animation
  useFrame((state, delta) => {
    if (shirtRef.current) {
      shirtRef.current.rotation.y += delta * 0.2;
    }
  });
  
  // Find the main shirt mesh in the GLB model
  const findShirtMesh = () => {
    if (!modelInfo?.nodes) return null;
    
    const { nodes } = modelInfo;
    
    // Common names for shirt meshes in GLB files
    const possibleNames = [
      'T_Shirt', 't_shirt', 'shirt', 'Shirt', 'TShirt', 'tshirt',
      'Body', 'body', 'Mesh', 'mesh', 'Object', 'object', 't_shirt_site'
    ];
    
    for (const name of possibleNames) {
      if (nodes[name] && nodes[name].geometry) {
        console.log('Found shirt mesh:', name);
        return { mesh: nodes[name], name };
      }
    }
    
    // If no specific name found, return the first mesh with geometry
    const meshKeys = Object.keys(nodes).filter(key => 
      nodes[key] && nodes[key].geometry
    );
    
    if (meshKeys.length > 0) {
      console.log('Using first available mesh:', meshKeys[0]);
      return { mesh: nodes[meshKeys[0]], name: meshKeys[0] };
    }
    
    return null;
  };
  
  const shirtData = findShirtMesh();
  
  if (!shirtData) {
    console.warn('Could not find shirt mesh in GLB model');
    return (
      <group>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
        {/* Error indicator - no text element */}
        <mesh position={[0, 0, 1]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    );
  }
  
  const { mesh: shirtMesh, name: meshName } = shirtData;
  
  return (
    <group ref={shirtRef}>
      {/* Render the GLB model with original materials */}
      <primitive 
        object={shirtMesh} 
        castShadow 
        receiveShadow
      />
      
      {/* Add the AI-generated design as a decal on the shirt */}
      {textureUrl && (
        <mesh 
          position={[0, 0, 0.02]} 
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial 
            map={logoTexture} 
            transparent 
            alphaTest={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <group position={[0, 1.5, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshBasicMaterial color="yellow" />
          </mesh>
          {/* Debug indicator - no text element */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color="white" />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Preload the GLB model
useGLTF.preload('/t_shirt_site.glb');
