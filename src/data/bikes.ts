// @CONCEPT: React Server Components (RSC) — Data Layer
// In a real Next.js / React Server Component setup this file would live on
// the SERVER only. It would query a database (Prisma, Drizzle, raw SQL) and
// return plain serialisable objects. No useEffect, no fetch() from the client.
// Here we simulate that server-side data with static arrays.

import type { Bike } from '../types'

// Simulates the data that a Server Component would fetch from a DB / CMS.
// The key RSC insight: this data NEVER ships to the client bundle.
export const bikes: Bike[] = [
  {
    id: 'b001',
    name: 'Aero SL 9.9',
    brand: 'Canyon',
    category: 'road',
    price: 4299,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 312,
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
    badge: 'Sale',
    specs: {
      frame: 'Carbon T1000',
      groupset: 'Shimano Dura-Ace Di2',
      weight: '6.8 kg',
      wheelSize: '700c',
    },
    inStock: true,
    description: 'Wind-tunnel engineered aero road machine for the serious racer.',
  },
  {
    id: 'b002',
    name: 'Neuron CF 8',
    brand: 'Canyon',
    category: 'mountain',
    price: 2899,
    rating: 4.8,
    reviewCount: 198,
    imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600&q=80',
    badge: 'Staff Pick',
    specs: {
      frame: 'Carbon CF',
      groupset: 'SRAM GX Eagle',
      weight: '13.2 kg',
      wheelSize: '29"',
    },
    inStock: true,
    description: 'All-mountain trail crusher built for technical descents and epic climbs.',
  },
  {
    id: 'b003',
    name: 'Grail CF SLX 8',
    brand: 'Canyon',
    category: 'gravel',
    price: 3499,
    rating: 4.9,
    reviewCount: 275,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    badge: 'Best Seller',
    specs: {
      frame: 'Carbon SLX',
      groupset: 'SRAM Force AXS',
      weight: '8.2 kg',
      wheelSize: '700c/650b',
    },
    inStock: true,
    description: 'Dual-drop bar gravel bike that thrives from cobblestones to fire roads.',
  },
  {
    id: 'b004',
    name: 'Precede:ON 7',
    brand: 'Canyon',
    category: 'electric',
    price: 3999,
    rating: 4.7,
    reviewCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80',
    badge: 'New',
    specs: {
      frame: 'Aluminium 6061',
      groupset: 'Shimano Deore 11s',
      weight: '22.5 kg',
      wheelSize: '27.5"',
    },
    inStock: true,
    description: 'Integrated mid-drive e-MTB with 625 Wh battery for unlimited adventures.',
  },
  {
    id: 'b005',
    name: 'Inflite CF SLX 9',
    brand: 'Canyon',
    category: 'road',
    price: 5299,
    rating: 5.0,
    reviewCount: 44,
    imageUrl: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=600&q=80',
    badge: 'New',
    specs: {
      frame: 'Carbon SLX',
      groupset: 'Shimano Dura-Ace Di2',
      weight: '7.9 kg',
      wheelSize: '700c',
    },
    inStock: false,
    description: 'Elite cyclocross racer engineered for mud, obstacles and podiums.',
  },
  {
    id: 'b006',
    name: 'Commuter 7',
    brand: 'Trek',
    category: 'urban',
    price: 899,
    originalPrice: 1099,
    rating: 4.6,
    reviewCount: 521,
    imageUrl: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?w=600&q=80',
    badge: 'Sale',
    specs: {
      frame: 'Aluminium Alpha',
      groupset: 'Shimano Claris 8s',
      weight: '11.5 kg',
      wheelSize: '700c',
    },
    inStock: true,
    description: 'Smart urban commuter with integrated lighting and rack-ready design.',
  },
]

// @CONCEPT: RSC — this function would be async in a real Server Component,
// awaiting a database query. The component that calls it stays server-only
// and never adds to the client JS bundle.
export function getBikesByCategory(category: string | null): Bike[] {
  if (!category || category === 'all') return bikes
  return bikes.filter(b => b.category === category)
}

export function searchBikes(query: string): Bike[] {
  const q = query.toLowerCase()
  return bikes.filter(
    b =>
      b.name.toLowerCase().includes(q) ||
      b.brand.toLowerCase().includes(q) ||
      b.category.includes(q),
  )
}
