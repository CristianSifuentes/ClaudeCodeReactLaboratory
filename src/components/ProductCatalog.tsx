// ─── Product Catalog ──────────────────────────────────────────────────────────
//
// @CONCEPT: Transitions API (useTransition) — Core 2026 Pattern
// useTransition is the PRIMARY tool for keeping the UI responsive during
// heavy state updates. Here we use it for:
//   1. Category filter changes (re-rendering 6+ heavy cards)
//   2. Search input (filtering products while user types)
//
// Without useTransition: every keystroke triggers a full re-render of all
// BikeCard components, potentially dropping frames.
//
// With useTransition: React marks the filter/search state update as
// "non-urgent." User interactions (typing, clicking) are always processed
// first. The catalog update happens in the background during idle time.
//
// @CONCEPT: useOptimistic
// When a user clicks "Add to Cart", we immediately show a "Adding…" state
// on the card via useOptimistic — the UI feels instant even if a server
// confirmation would take 500ms in a real app.
//
// @CONCEPT: React Server Components (simulated)
// In a real RSC setup, this component would be a Client Component (marked
// "use client") receiving pre-filtered data from a Server Component parent.
// The filtering logic in getBikesByCategory / searchBikes would run server-side.

import {
  useState,
  useTransition,    // @CONCEPT: Transitions API
  useOptimistic,    // @CONCEPT: useOptimistic — React 19
  Suspense,         // @CONCEPT: Suspense as coordination layer
  lazy,
} from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'
import { bikes, getBikesByCategory, searchBikes } from '../data/bikes'
import { useCartStore } from '../store/cartStore'
import type { Bike } from '../types'

// @CONCEPT: Suspense + lazy — Code Splitting
// BikeCard is lazily loaded: it's only downloaded when the catalog section
// enters the viewport for the first time. React Suspense shows the fallback
// skeleton while the chunk is being fetched.
const BikeCard = lazy(() => import('./BikeCard'))

const CATEGORIES = [
  { value: 'all', label: 'All Bikes' },
  { value: 'road', label: 'Road' },
  { value: 'mountain', label: 'Mountain' },
  { value: 'gravel', label: 'Gravel' },
  { value: 'urban', label: 'Urban' },
  { value: 'electric', label: 'Electric' },
]

// Skeleton shown by Suspense while BikeCard chunk loads
function CardSkeleton() {
  return (
    <div
      style={{
        background: '#111',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        overflow: 'hidden',
        aspectRatio: '3/4',
      }}
    >
      {/* Shimmer effect — pure CSS animation */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }}
      />
    </div>
  )
}

export default function ProductCatalog() {
  // @CONCEPT: useTransition — the key hook for non-urgent state updates
  // `isPending` is true while React is processing the deferred re-render.
  // We use it to show a subtle loading indicator without blocking the UI.
  const [isPending, startTransition] = useTransition()

  // These state values are updated INSIDE startTransition so React treats
  // them as non-urgent and can interrupt the render if needed.
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Derive displayed bikes from current filters
  // In a real RSC app this would be a server fetch, not client filtering.
  const filteredBikes = searchQuery
    ? searchBikes(searchQuery)
    : getBikesByCategory(activeCategory)

  // @CONCEPT: Zustand fine-grained selector — only re-renders when addItem changes
  const addItem = useCartStore(state => state.addItem)
  const toggleCart = useCartStore(state => state.toggleCart)

  // @CONCEPT: useOptimistic — Optimistic UI Updates (React 19)
  // `optimisticPendingId` stores the ID of the bike being added RIGHT NOW.
  // `addOptimisticPending` updates it immediately without waiting for any
  // async operation to complete. The card shows "Adding…" instantly.
  // When the real addItem completes, React reconciles the optimistic state.
  const [optimisticPendingId, addOptimisticPending] = useOptimistic<string | null, string | null>(
    null,
    (_currentState, newPendingId) => newPendingId,
  )

  // @CONCEPT: useTransition + useOptimistic working together
  // 1. useOptimistic instantly shows "Adding…" on the clicked card
  // 2. useTransition wraps the actual cart state update so it doesn't
  //    block the optimistic UI from painting immediately
  function handleAddToCart(bike: Bike) {
    // Step 1: Immediately show optimistic "Adding…" state
    addOptimisticPending(bike.id)

    // Step 2: Wrap the real update in a transition so React can schedule it
    // without blocking user interactions.
    startTransition(async () => {
      // Simulate a server round-trip (inventory check, session sync, etc.)
      // In a real app: await checkInventoryServerAction(bike.id)
      await new Promise(r => setTimeout(r, 600))

      // Step 3: Commit the real state update
      addItem(bike)

      // Step 4: Clear the optimistic pending flag
      addOptimisticPending(null)

      // Step 5: Open cart to confirm the addition
      toggleCart()
    })
  }

  // @CONCEPT: useTransition for search — wraps heavy filtering in a transition
  function handleSearch(value: string) {
    startTransition(() => {
      setSearchQuery(value)
      setActiveCategory('all')
    })
  }

  // @CONCEPT: useTransition for category filter
  function handleCategory(category: string) {
    startTransition(() => {
      setActiveCategory(category)
      setSearchQuery('')
    })
  }

  return (
    <section id="shop" style={{ background: '#0a0a0a', padding: '80px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 900,
              color: '#fff',
              margin: '0 0 16px',
              letterSpacing: '-1.5px',
            }}
          >
            Our Bikes
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            Hand-picked performance machines for every rider and every road.
          </p>
        </div>

        {/* Search + Filter controls */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 40,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search input */}
          <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: 360 }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.35)',
              }}
            />
            <input
              type="search"
              placeholder="Search bikes…"
              value={searchQuery}
              // @CONCEPT: useTransition — onChange updates are wrapped in a
              // transition so typing never feels laggy, even on slow devices.
              onChange={e => handleSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '10px 14px 10px 40px',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Transition pending indicator */}
          {/* @CONCEPT: isPending from useTransition — shows a non-intrusive
              spinner while the catalog is being re-rendered in the background.
              Crucially, the search input itself remains interactive. */}
          {isPending && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
              <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Updating…
            </div>
          )}

          {/* Category filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginLeft: 'auto' }}>
            <Filter size={14} style={{ color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }} />
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategory(cat.value)}
                style={{
                  background:
                    activeCategory === cat.value
                      ? '#e53935'
                      : 'rgba(255,255,255,0.05)',
                  color:
                    activeCategory === cat.value
                      ? '#fff'
                      : 'rgba(255,255,255,0.55)',
                  border: 'none',
                  borderRadius: 999,
                  padding: '6px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 24 }}>
          {filteredBikes.length} bike{filteredBikes.length !== 1 ? 's' : ''} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        {/* Grid — wrapped in Suspense for lazy BikeCard */}
        {/* @CONCEPT: Suspense as coordination layer
            Suspense here coordinates two async sources:
            1. The lazy() import of BikeCard.tsx
            2. Any future async data inside BikeCard (e.g. real-time stock)
            The fallback renders for BOTH cases, giving a unified loading UI. */}
        <Suspense
          fallback={
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24,
              }}
            >
              {bikes.map(b => <CardSkeleton key={b.id} />)}
            </div>
          }
        >
          {filteredBikes.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24,
                // @CONCEPT: Concurrent Rendering visual cue — during a
                // transition React keeps the OLD content visible with reduced
                // opacity rather than showing a blank screen.
                opacity: isPending ? 0.6 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {filteredBikes.map(bike => (
                <BikeCard
                  key={bike.id}
                  bike={bike}
                  onAddToCart={handleAddToCart}
                  // @CONCEPT: useOptimistic — the card that was just clicked
                  // gets the "Adding…" treatment while the async op runs.
                  isPending={optimisticPendingId === bike.id}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 24px',
                color: 'rgba(255,255,255,0.35)',
              }}
            >
              <p style={{ fontSize: 18, marginBottom: 8 }}>No bikes match your search.</p>
              <button
                onClick={() => handleCategory('all')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#e53935',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </Suspense>
      </div>
    </section>
  )
}
