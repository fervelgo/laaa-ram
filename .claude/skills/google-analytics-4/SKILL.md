---
name: google-analytics-4
description: Google Analytics 4 integration for Next.js applications. Use when setting up analytics, implementing event tracking, configuring GA4 with App Router, or tracking user interactions. Triggers on analytics, GA4, gtag, event tracking, pageviews.
---

# Google Analytics 4 for Next.js

## Setup with App Router

### 1. Create Analytics Component
```typescript
// components/Analytics.tsx
'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function AnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && GA_MEASUREMENT_ID) {
      window.gtag?.('config', GA_MEASUREMENT_ID, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams}` : ''),
      })
    }
  }, [pathname, searchParams])

  return null
}

export function Analytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsInner />
      </Suspense>
    </>
  )
}
```

### 2. Add to Root Layout
```typescript
// app/layout.tsx
import { Analytics } from '@/components/Analytics'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 3. Environment Variable
```bash
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Event Tracking

### Create Type-Safe Event Helper
```typescript
// lib/analytics.ts
type EventParams = Record<string, string | number | boolean>

export function trackEvent(
  eventName: string,
  params?: EventParams
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// Type declarations
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event',
      targetId: string,
      params?: Record<string, unknown>
    ) => void
  }
}
```

### Events for 3D Collection

```typescript
// Track object views
trackEvent('view_item', {
  item_id: object.slug,
  item_name: object.title,
  item_category: object.cultura,
})

// Track 3D interactions
trackEvent('3d_interaction', {
  action: 'rotate' | 'zoom' | 'pan' | 'reset',
  object_id: object.slug,
})

// Track model loading
trackEvent('model_loaded', {
  model_type: 'preview' | 'full',
  object_id: object.slug,
  load_time_ms: loadTime,
})

// Track filter usage
trackEvent('filter_applied', {
  filter_type: 'cultura' | 'origen' | 'periodo' | 'material',
  filter_value: selectedValue,
})

// Track gallery interactions
trackEvent('gallery_view', {
  object_id: object.slug,
  image_index: imageIndex,
})
```

### Implementation in Viewer
```typescript
// components/viewer/ObjectViewer.tsx
'use client'

import { trackEvent } from '@/lib/analytics'
import { useEffect, useRef } from 'react'

export function ObjectViewer({ object }) {
  const hasTrackedView = useRef(false)
  const loadStartTime = useRef(Date.now())

  useEffect(() => {
    if (!hasTrackedView.current) {
      trackEvent('view_item', {
        item_id: object.slug,
        item_name: object.title,
      })
      hasTrackedView.current = true
    }
  }, [object])

  const onModelLoaded = (modelType: 'preview' | 'full') => {
    trackEvent('model_loaded', {
      model_type: modelType,
      object_id: object.slug,
      load_time_ms: Date.now() - loadStartTime.current,
    })
  }

  return (...)
}
```

## Recommended Events

| Event Name | When | Parameters |
|------------|------|------------|
| `view_item` | Object detail page load | item_id, item_name, item_category |
| `view_item_list` | Grid page load | item_list_name, items[] |
| `filter_applied` | Filter selection | filter_type, filter_value |
| `3d_interaction` | User manipulates model | action, object_id, duration |
| `model_loaded` | 3D model finishes loading | model_type, load_time_ms |
| `gallery_view` | Image lightbox opened | object_id, image_index |
| `search` | If search implemented | search_term |

## Debug Mode
```typescript
// Enable debug mode in development
gtag('config', GA_MEASUREMENT_ID, {
  debug_mode: process.env.NODE_ENV === 'development',
})
```

View events in GA4: Admin -> Debug View
