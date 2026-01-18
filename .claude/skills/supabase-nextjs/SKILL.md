---
name: supabase-nextjs
description: Supabase integration patterns for Next.js App Router. Use when implementing authentication, database queries, file storage, Row Level Security policies, or Supabase client setup. Triggers on Supabase, createClient, RLS, auth, storage bucket.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Supabase + Next.js Integration

## Client Setup

### Server Client (for Server Components, Route Handlers)
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component
          }
        },
      },
    }
  )
}
```

### Browser Client (for Client Components)
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Database Queries

### Fetching All Objects (Server Component)
```typescript
// app/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function GridPage() {
  const supabase = await createClient()

  const { data: objects, error } = await supabase
    .from('objects')
    .select(`
      id,
      slug,
      piece_number,
      title,
      thumbnail_url,
      cultura,
      origen,
      periodo,
      material
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return <ObjectGrid objects={objects} />
}
```

### Fetching Single Object with Images
```typescript
// app/objeto/[slug]/page.tsx
export default async function ObjectPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: object } = await supabase
    .from('objects')
    .select(`
      *,
      object_images (
        id,
        image_url,
        display_order
      )
    `)
    .eq('slug', params.slug)
    .single()

  return <ObjectDetail object={object} />
}
```

### Filter Queries
```typescript
// Build dynamic query based on filters
let query = supabase.from('objects').select('*')

if (cultura) query = query.eq('cultura', cultura)
if (origen) query = query.eq('origen', origen)
if (periodo) query = query.eq('periodo', periodo)
if (material) query = query.eq('material', material)

const { data } = await query
```

## Authentication

### Middleware for Protected Routes
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

### Login Form
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = '/admin'
    }
  }

  return <form onSubmit={handleLogin}>...</form>
}
```

## File Storage

### Upload Files
```typescript
async function uploadFile(file: File, bucket: string, path: string) {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return publicUrl
}
```

### Storage Buckets for This Project
```
public/
  thumbnails/{slug}.webp
  models/preview/{slug}.glb
  models/full/{slug}.glb
  gallery/{slug}/01.webp
```

## Row Level Security

### Objects Table Policies
```sql
-- Anyone can read
CREATE POLICY "Public read access"
ON objects FOR SELECT
TO public
USING (true);

-- Only authenticated admins can modify
CREATE POLICY "Admin insert"
ON objects FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin update"
ON objects FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin delete"
ON objects FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

## Type Generation
```bash
# Generate TypeScript types from schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
```
