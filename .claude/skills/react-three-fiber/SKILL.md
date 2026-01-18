---
name: react-three-fiber
description: React Three Fiber and Drei patterns for 3D web applications. Use when implementing 3D viewers, loading GLB/GLTF models, configuring orbit controls, handling WebGL, or optimizing 3D performance. Triggers on R3F, Three.js, Canvas, useFrame, useLoader, OrbitControls, GLTFLoader.
allowed-tools: Read, Grep, Glob, Edit, Write
---

# React Three Fiber Development

## Core Patterns

### Basic Canvas Setup
```tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useProgress, Html } from '@react-three/drei'
import { Suspense } from 'react'

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress.toFixed(0)}% loaded</Html>
}

export function ObjectViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]} // Limit pixel ratio for performance
    >
      <Suspense fallback={<Loader />}>
        <Model url={modelUrl} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}
```

### Loading GLB Models
```tsx
import { useGLTF } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

// Preload for faster loading
useGLTF.preload('/models/preview/object.glb')
```

### Progressive Loading (Preview -> Full)
```tsx
import { useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

function ProgressiveModel({ previewUrl, fullUrl }: Props) {
  const [useFullModel, setUseFullModel] = useState(false)
  const preview = useGLTF(previewUrl)

  useEffect(() => {
    // Preload full model in background
    useGLTF.preload(fullUrl)
    const timer = setTimeout(() => setUseFullModel(true), 100)
    return () => clearTimeout(timer)
  }, [fullUrl])

  const full = useGLTF(fullUrl, true) // true = don't block

  return <primitive object={useFullModel && full.scene ? full.scene : preview.scene} />
}
```

### Mobile Touch Controls
```tsx
<OrbitControls
  touches={{
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  }}
  enableDamping={true}
  dampingFactor={0.05}
/>
```

### Auto-Rotate Toggle
```tsx
function Controls({ autoRotate }: { autoRotate: boolean }) {
  const controlsRef = useRef<OrbitControlsImpl>(null)

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={autoRotate}
      autoRotateSpeed={2}
    />
  )
}
```

### Reset Camera Position
```tsx
import { useThree } from '@react-three/fiber'

function ResetButton() {
  const { camera } = useThree()
  const defaultPosition = new Vector3(0, 0, 5)

  const reset = () => {
    camera.position.copy(defaultPosition)
    camera.lookAt(0, 0, 0)
  }

  return <button onClick={reset}>Reset View</button>
}
```

## Performance Optimization

### Frame Rate Management
```tsx
import { useFrame } from '@react-three/fiber'

function Model() {
  const ref = useRef<THREE.Mesh>(null)

  // Only update when needed
  useFrame((state, delta) => {
    if (ref.current && autoRotate) {
      ref.current.rotation.y += delta * 0.5
    }
  })

  return <mesh ref={ref}>...</mesh>
}
```

### Dispose Resources
```tsx
useEffect(() => {
  return () => {
    // Clean up on unmount
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        if (child.material instanceof THREE.Material) {
          child.material.dispose()
        }
      }
    })
  }
}, [scene])
```

### WebGL Fallback
```tsx
function Viewer({ modelUrl, fallbackImage }: Props) {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2')
      setWebglSupported(!!gl)
    } catch {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) {
    return (
      <div>
        <img src={fallbackImage} alt="3D view unavailable" />
        <p>WebGL is not supported in your browser</p>
      </div>
    )
  }

  return <Canvas>...</Canvas>
}
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Model too dark | Add `<Environment preset="studio" />` |
| Controls not working | Ensure Canvas has size (height/width) |
| Model not centered | Use `<Center>` from Drei |
| Poor mobile performance | Reduce `dpr`, use simpler models |
| Memory leaks | Dispose geometries and materials on unmount |
