# Spline 3D Integration Guide for DesignDrip

## Overview

This guide explains how to integrate Spline 3D models into your DesignDrip project for better 3D T-shirt visualization.

## What is Spline?

Spline is a powerful 3D design tool that allows you to create interactive 3D models without coding. It's perfect for creating realistic T-shirt models with proper lighting, materials, and animations.

## Setup Steps

### 1. Create a Spline Account

- Go to [spline.design](https://spline.design)
- Sign up for a free account
- Create a new project

### 2. Design Your 3D T-Shirt

- Use Spline's 3D tools to create a realistic T-shirt model
- Add proper lighting and materials
- Make sure the model has a material that can accept texture updates
- Export as a Spline scene

### 3. Get Your Scene URL

- In Spline, click "Export" → "Web"
- Copy the generated URL (e.g., `https://prod.spline.design/your-scene/scene.splinecode`)

### 4. Update the Component

Replace the placeholder URL in `components/SplineShirt.tsx`:

```tsx
<Spline
  scene="YOUR_ACTUAL_SPLINE_SCENE_URL_HERE"
  onLoad={onLoad}
  className="w-full h-full"
/>
```

### 5. Handle Texture Updates

To make the Spline model accept AI-generated textures:

1. In Spline, create a material that can be updated
2. Name it something like "shirt_texture" or "design_material"
3. In the component, update the material when texture changes:

```tsx
useEffect(() => {
  if (splineRef.current && textureUrl) {
    // Update the Spline material with the new texture
    const material = splineRef.current.findObjectByName("shirt_texture");
    if (material) {
      material.material.map = logoTexture;
      material.material.needsUpdate = true;
    }
  }
}, [textureUrl]);
```

## Alternative: Use Advanced Three.js Model

If you prefer to stick with Three.js, the project includes `AdvancedShirt.tsx` which provides:

- Better geometry than the basic model
- Proper lighting and shadows
- Texture mapping support
- Smooth animations

## Current Status

- ✅ Spline package installed
- ✅ Spline component created
- ✅ Advanced Three.js component available
- ⏳ Spline scene URL needs to be configured
- ⏳ Texture update logic needs to be implemented

## Next Steps

1. Create your Spline 3D T-shirt model
2. Update the scene URL in `SplineShirt.tsx`
3. Test texture updates
4. Customize lighting and materials as needed

## Troubleshooting

- **Spline not loading**: Check your scene URL and internet connection
- **Textures not updating**: Ensure your Spline material is named correctly
- **Performance issues**: Optimize your Spline model (reduce polygon count, simplify materials)
- **Mobile issues**: Test on different devices and adjust model complexity

## Resources

- [Spline Documentation](https://docs.spline.design/)
- [Spline Examples](https://spline.design/examples)
- [React Spline Package](https://www.npmjs.com/package/@splinetool/react-spline)
