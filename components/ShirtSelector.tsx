import React from 'react';
import { SplineShirt } from './SplineShirt';

interface ShirtSelectorProps {
  textureUrl: string | null;
}

export const ShirtSelector: React.FC<ShirtSelectorProps> = ({ textureUrl }) => {
  return <SplineShirt textureUrl={textureUrl} />;
};
