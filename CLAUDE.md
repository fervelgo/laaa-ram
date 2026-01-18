# laaa-ram 3D Collection

## Stack
- Next.js 14+ (App Router, Server Components)
- React Three Fiber + Drei
- Supabase (Postgres, Auth, Storage)
- Vercel deployment
- Google Analytics 4

## File Structure
/app
  /page.tsx                    # Grid view (server component)
  /objeto/[slug]/page.tsx      # Detail view with 3D viewer
  /admin/...                   # Protected admin routes
/components
  /grid/                       # ObjectGrid, ObjectCard, FilterBar
  /viewer/                     # ObjectViewer, ViewerControls
  /detail/                     # ObjectMetadata, ImageGallery
  /admin/                      # ObjectForm, FileUploader
/lib
  /supabase/                   # Client, server, types

## Conventions
- TypeScript strict mode
- Server Components by default, 'use client' only when needed
- Tailwind CSS for styling
- Spanish UI text, English code/comments

## Common Commands
- `npm run dev` - Start development
- `npm run build` - Production build
- `npx supabase db push` - Push migrations

## Performance Targets
- Grid LCP < 2s
- 3D viewer interactive < 4s
- Preview model < 2MB, Full model < 20MB
- 60fps on mid-tier mobile devices
