// ─── Domain Types ────────────────────────────────────────────────────────────
// These types are shared across Server Components, Client Components and
// Server Actions — a key requirement of the RSC architecture where the same
// data shape must cross the server/client boundary via serialisation.

export interface Bike {
  id: string
  name: string
  brand: string
  category: 'road' | 'mountain' | 'gravel' | 'urban' | 'electric'
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  badge?: 'New' | 'Sale' | 'Staff Pick' | 'Best Seller'
  specs: {
    frame: string
    groupset: string
    weight: string
    wheelSize: string
  }
  inStock: boolean
  description: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: 'race' | 'gear' | 'training' | 'travel' | 'tech'
  author: string
  readTime: number            // minutes
  publishedAt: string         // ISO date string — serializable across RSC boundary
  imageUrl: string
  featured: boolean
}

export interface CartItem {
  bike: Bike
  quantity: number
}

// @CONCEPT: Server Action input/output types
// Server Actions must receive and return serializable values only.
// No class instances, no functions — plain objects / primitives.
export interface NewsletterFormState {
  status: 'idle' | 'success' | 'error'
  message: string
}

export interface CartState {
  items: CartItem[]
  // @CONCEPT: useOptimistic — optimistic updates need a "pending" flag
  // so the UI can show tentative changes before the server confirms them.
  isPending: boolean
}
