// ─── Cart Store — Zustand Fine-Grained Reactivity ────────────────────────────
//
// @CONCEPT: Reactive Primitives / Fine-Grained Reactivity (Signals/Atoms)
// Zustand is the 2026 standard for "atoms" in React apps.
// The key idea: components subscribe to the EXACT slice of state they need.
// When only `items` changes, only components that read `items` re-render.
// Components that only read `totalPrice` won't re-render when the open/close
// state of the sidebar changes — this is "fine-grained reactivity."
//
// Compare to old Context API: any change to the context object triggers
// ALL consumers. Zustand avoids that with selector-based subscriptions.

import { create } from 'zustand'
import type { Bike, CartItem } from '../types'

interface CartStore {
  // ── State ──────────────────────────────────────────────────────────────────
  items: CartItem[]
  isOpen: boolean

  // @CONCEPT: useOptimistic integration point
  // This flag mirrors the "pending" concept from useOptimistic — when an item
  // is being added (imagine a Server Action confirming inventory), the UI
  // shows it immediately while this flag indicates server confirmation is pending.
  pendingItemId: string | null

  // ── Actions ────────────────────────────────────────────────────────────────
  addItem: (bike: Bike) => void
  removeItem: (bikeId: string) => void
  updateQuantity: (bikeId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setPendingItem: (id: string | null) => void

  // ── Derived/Computed ───────────────────────────────────────────────────────
  // @CONCEPT: Fine-grained reactivity — computed selectors
  // Consumers use: const total = useCartStore(state => state.totalPrice())
  // This function re-runs only when `items` changes, not when `isOpen` changes.
  totalPrice: () => number
  totalItems: () => number
}

// @CONCEPT: Zustand `create` — the core atom factory.
// The store is created ONCE and shared via the module singleton pattern.
// React 19 concurrent features (Transitions, Suspense) work naturally with
// Zustand because it uses external subscription rather than React state,
// making it immune to tearing in concurrent renders.
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  pendingItemId: null,

  // add or increment existing item
  addItem: (bike: Bike) => {
    // @CONCEPT: Zustand immer-style updater — atomically updates only items
    // Only components subscribed to `items` selector will re-render.
    set(state => {
      const existing = state.items.find(i => i.bike.id === bike.id)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.bike.id === bike.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        }
      }
      return { items: [...state.items, { bike, quantity: 1 }] }
    })
  },

  removeItem: (bikeId: string) =>
    set(state => ({ items: state.items.filter(i => i.bike.id !== bikeId) })),

  updateQuantity: (bikeId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(bikeId)
      return
    }
    set(state => ({
      items: state.items.map(i =>
        i.bike.id === bikeId ? { ...i, quantity } : i,
      ),
    }))
  },

  clearCart: () => set({ items: [] }),

  // Only `isOpen` changes — components subscribed to `items` do NOT re-render.
  // This is fine-grained reactivity in action.
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

  setPendingItem: (id: string | null) => set({ pendingItemId: id }),

  // Derived selectors — computed from state without storing redundant data
  totalPrice: () => get().items.reduce((sum, i) => sum + i.bike.price * i.quantity, 0),
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))
