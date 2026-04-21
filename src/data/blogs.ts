// @CONCEPT: React Server Components — Blog Data Layer
// This module represents data fetched on the SERVER.
// A real implementation would be: const posts = await db.post.findMany()
// Because it runs server-side, it adds ZERO bytes to the client bundle.

import type { BlogPost } from '../types'

export const blogPosts: BlogPost[] = [
  {
    id: 'p001',
    slug: 'pogacar-tour-2026-preview',
    title: "Pogačar's 2026 Tour Strategy: Can Anyone Stop Him?",
    excerpt:
      'After back-to-back Grand Tour victories, all eyes are on the Slovenian phenomenon and whether the peloton has finally found an answer.',
    category: 'race',
    author: 'Marco Rossi',
    readTime: 6,
    publishedAt: '2026-04-18',
    imageUrl: 'https://images.unsplash.com/photo-1533561052604-c3beb6d55b8d?w=600&q=80',
    featured: true,
  },
  {
    id: 'p002',
    slug: 'gravel-world-tech-review',
    title: 'Gravel World Champs: The Tech That Won',
    excerpt:
      'We tear down the winning bikes from Veneto to understand what marginal gains really look like at the highest gravel level.',
    category: 'gear',
    author: 'Sarah Chen',
    readTime: 8,
    publishedAt: '2026-04-15',
    imageUrl: 'https://images.unsplash.com/photo-1544191696-102dbeb9af7e?w=600&q=80',
    featured: true,
  },
  {
    id: 'p003',
    slug: 'lactate-threshold-training-2026',
    title: 'Zone 2 Is Dead: The New Science of Threshold Training',
    excerpt:
      'Cutting-edge sports science is reshaping how elite riders structure their training. Here is what the data actually says.',
    category: 'training',
    author: 'Dr. Lena Müller',
    readTime: 10,
    publishedAt: '2026-04-12',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    featured: false,
  },
  {
    id: 'p004',
    slug: 'cycling-dolomites-guide',
    title: 'Riding the Dolomites: A Complete 2026 Guide',
    excerpt:
      'Seven passes, three valleys, two weeks — our correspondent mapped every café stop on the most iconic cycling terrain on Earth.',
    category: 'travel',
    author: 'Elena Bianchi',
    readTime: 12,
    publishedAt: '2026-04-10',
    imageUrl: 'https://images.unsplash.com/photo-1558981852-426c349c2b58?w=600&q=80',
    featured: false,
  },
  {
    id: 'p005',
    slug: 'ai-cycling-coaching-2026',
    title: 'How AI Coaches Are Replacing Training Plans',
    excerpt:
      'From power meter data to sleep tracking, AI platforms are personalising training at a level human coaches struggle to match.',
    category: 'tech',
    author: 'James Park',
    readTime: 7,
    publishedAt: '2026-04-08',
    imageUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?w=600&q=80',
    featured: false,
  },
]

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter(p => p.featured)
}

export function getLatestPosts(limit = 3): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  ).slice(0, limit)
}
