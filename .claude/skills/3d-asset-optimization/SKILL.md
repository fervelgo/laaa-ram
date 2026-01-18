---
name: 3d-asset-optimization
description: High-fidelity 3D asset optimization for web delivery. Use when working with GLB/GLTF files, Draco compression, level-of-detail, progressive model loading, or optimizing file sizes for cultural heritage scans. Triggers on GLB, GLTF, Draco, mesh optimization, 3D compression, photogrammetry.
---

# 3D Asset Optimization for Web

## Target Specifications

| Asset Type | Target Size | Use Case |
|------------|-------------|----------|
| Preview Model | < 2MB | Initial load, immediate interaction |
| Full Model | < 20MB | High-fidelity viewing after preview |
| Thumbnail | < 50KB | Grid display |

## Draco Compression

### Using gltf-pipeline CLI
```bash
# Install
npm install -g gltf-pipeline

# Compress with Draco
gltf-pipeline -i input.glb -o output.glb --draco.compressionLevel 7

# Create preview (aggressive compression)
gltf-pipeline -i input.glb -o preview.glb \
  --draco.compressionLevel 10 \
  --draco.quantizePositionBits 14 \
  --draco.quantizeNormalBits 10 \
  --draco.quantizeTexcoordBits 12
```

### Compression Settings Explained
| Setting | Range | Lower = | Higher = |
|---------|-------|---------|----------|
| compressionLevel | 0-10 | Faster encode | Smaller file |
| quantizePositionBits | 8-16 | Smaller, less precise | Larger, more precise |
| quantizeNormalBits | 8-16 | Smaller, lighting artifacts | Better normals |
| quantizeTexcoordBits | 8-16 | Smaller, UV artifacts | Better textures |

### Recommended Settings
```bash
# Preview model (< 2MB target)
--draco.compressionLevel 10
--draco.quantizePositionBits 12
--draco.quantizeNormalBits 8
--draco.quantizeTexcoordBits 10

# Full model (< 20MB target, preserve quality)
--draco.compressionLevel 7
--draco.quantizePositionBits 16
--draco.quantizeNormalBits 12
--draco.quantizeTexcoordBits 14
```

## Blender Export Settings

### For High-Fidelity Cultural Artifacts
```
Export Format: GLB
[x] Apply Modifiers
[x] Include: Mesh data only (no animations, armatures)
[ ] Limit to Selected Objects

Mesh:
  [x] Apply Modifiers
  [ ] UVs (if no textures)
  [x] Normals
  [ ] Tangents (unless normal maps)
  [x] Vertex Colors (if baked)

Compression:
  [x] Draco mesh compression
  Compression level: 6
  Position Quantization: 14
  Normal: 10
  Tex Coord: 12
```

### Creating Preview Version in Blender
1. Duplicate high-poly mesh
2. Apply Decimate modifier:
   - Ratio: 0.1-0.2 (reduce to 10-20% of faces)
   - Planar angle: 5 deg (preserve flat surfaces)
3. Bake textures to lower resolution if needed
4. Export with aggressive Draco settings

## Mesh Simplification Tools

### Using meshoptimizer (CLI)
```bash
# Simplify mesh to target face count
gltfpack -i input.glb -o output.glb -si 0.5  # 50% simplification

# Aggressive for preview
gltfpack -i input.glb -o preview.glb -si 0.1 -tc  # 10% + texture compression
```

### Simplification Pipeline
```
Source Scan (100MB+)
    | Blender cleanup
Clean Mesh (50MB)
    | Decimate 50%
Full Quality (20MB)
    | Decimate 90%
Preview (2MB)
```

## Texture Optimization

### For Photogrammetry Scans
```bash
# Convert to WebP (significant size reduction)
cwebp -q 85 texture.jpg -o texture.webp

# Resize for web (max 2K for most uses)
convert texture.jpg -resize 2048x2048 texture_2k.jpg

# For preview: 512px textures
convert texture.jpg -resize 512x512 texture_512.jpg
```

### Texture Atlas
Combine multiple textures into single atlas to reduce draw calls:
```
artifact_diffuse.webp  (2048x2048)
artifact_normal.webp   (1024x1024) - optional for cultural artifacts
```

## File Structure Convention
```
/public/models/
  /preview/
    vasija-maya.glb      # < 2MB, Draco compressed
  /full/
    vasija-maya.glb      # < 20MB, balanced quality

/public/thumbnails/
    vasija-maya.webp     # 400x400, < 50KB
```

## Validation Checklist

Before uploading:
- [ ] Preview model under 2MB
- [ ] Full model under 20MB
- [ ] Both models load in R3F without errors
- [ ] Visual quality acceptable at intended zoom levels
- [ ] Thumbnail is square WebP < 50KB
- [ ] No console errors about missing textures

## Common Issues

| Problem | Solution |
|---------|----------|
| Model too large after compression | Reduce polygon count before Draco |
| Visual artifacts on preview | Increase quantization bits |
| Textures not loading | Ensure paths are relative in GLB |
| Long load times | Check if textures are embedded, compress separately |
| Model appears dark | Check if normals are exported, add Environment |
