import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface SimpleShirtProps {
  textureUrl: string | null;
}

export const SimpleShirt: React.FC<SimpleShirtProps> = ({ textureUrl }) => {
  const shirtRef = useRef<THREE.Mesh>(null!);
  
  // Load the texture from the URL provided by the AI
  const logoTexture = useTexture(textureUrl || '/default-logo.svg');
  logoTexture.anisotropy = 16;
  
  // Use a slight rotation animation
  useFrame((state, delta) => {
    if (shirtRef.current) {
        shirtRef.current.rotation.y += delta * 0.1;
    }
  });

  // Create a simple T-shirt shape using basic geometry
  const shirtGeometry = new THREE.BoxGeometry(1, 1.2, 0.1);
  const shirtMaterial = new THREE.MeshLambertMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.9
  });
  
  return (
    <group>
      {/* Main shirt body */}
      <mesh
        ref={shirtRef}
        castShadow
        receiveShadow
        geometry={shirtGeometry}
        material={shirtMaterial}
      />
      
      {/* Sleeves */}
      <mesh
        position={[-0.6, 0.2, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>
      
      <mesh
        position={[0.6, 0.2, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>
      
      {/* Logo/Design on the front */}
      {textureUrl && (
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial map={logoTexture} transparent />
        </mesh>
      )}
    </group>
  );
};
