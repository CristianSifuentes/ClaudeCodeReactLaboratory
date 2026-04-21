// ─── Cart Sidebar ─────────────────────────────────────────────────────────────
//
// @CONCEPT: Fine-Grained Reactivity (Zustand)
// This sidebar subscribes to ONLY the slices of store state it needs:
// - items, isOpen, totalPrice, totalItems, removeItem, updateQuantity, clearCart
// Components that only read `isOpen` will NOT re-render when `items` change.
//
// @CONCEPT: useOptimistic
// When the user clicks "Remove" on a cart item, we optimistically remove it
// from the UI immediately. If a server action rejected the removal, React
// would revert to the real state automatically.

import { useOptimistic, useTransition } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import type { CartItem } from '../types'

export default function CartSidebar() {
  // @CONCEPT: Fine-grained Zustand selectors — each selector subscribes
  // independently. Changing `isOpen` won't re-render anything reading `items`.
  const items = useCartStore(state => state.items)
  const isOpen = useCartStore(state => state.isOpen)
  const totalPrice = useCartStore(state => state.totalPrice())
  const removeItem = useCartStore(state => state.removeItem)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const clearCart = useCartStore(state => state.clearCart)
  const toggleCart = useCartStore(state => state.toggleCart)

  // @CONCEPT: useTransition — non-urgent updates
  // Removing items from cart or updating quantities are non-urgent operations.
  // Wrapping them in a transition keeps the sidebar animation smooth.
  const [isPending, startTransition] = useTransition()

  // @CONCEPT: useOptimistic for cart item removal
  // optimisticItems reflects the DESIRED state immediately.
  // If removeItem (or a real Server Action) fails, React reverts automatically.
  const [optimisticItems, removeOptimistic] = useOptimistic<CartItem[], string>(
    items,
    // Reducer: given current items and the bike ID to remove,
    // return the new optimistic items array.
    (currentItems, bikeIdToRemove) =>
      currentItems.filter(i => i.bike.id !== bikeIdToRemove),
  )

  function handleRemove(bikeId: string) {
    // @CONCEPT: useOptimistic — update the displayed list immediately
    removeOptimistic(bikeId)
    // @CONCEPT: useTransition — commit the real removal in the background
    startTransition(() => {
      removeItem(bikeId)
    })
  }

  function handleQuantity(bikeId: string, quantity: number) {
    startTransition(() => {
      updateQuantity(bikeId, quantity)
    })
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={toggleCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          maxWidth: '100vw',
          background: '#111',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          // @CONCEPT: Concurrent Rendering — during pending transitions
          // the sidebar dims to signal background work.
          opacity: isPending ? 0.8 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} color="#e53935" />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
              Your Cart
            </span>
            <span
              style={{
                background: '#e53935',
                color: '#fff',
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {items.length}
            </span>
          </div>
          <button
            onClick={toggleCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
              padding: 8,
              display: 'flex',
            }}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {/* @CONCEPT: useOptimistic — we render `optimisticItems` instead of
              `items`. The removed item disappears INSTANTLY from the UI even
              before the Zustand store has processed the update. */}
          {optimisticItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              <ShoppingBag size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
              <p style={{ fontSize: 16, margin: 0 }}>Your cart is empty</p>
              <button
                onClick={toggleCart}
                style={{
                  marginTop: 16,
                  background: 'none',
                  border: 'none',
                  color: '#e53935',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {optimisticItems.map(({ bike, quantity }) => (
                <li
                  key={bike.id}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={bike.imageUrl}
                    alt={bike.name}
                    style={{
                      width: 72,
                      height: 72,
                      objectFit: 'cover',
                      borderRadius: 8,
                      flexShrink: 0,
                    }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 14,
                        margin: '0 0 4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {bike.brand} {bike.name}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 12px' }}>
                      ${bike.price.toLocaleString()} each
                    </p>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => handleQuantity(bike.id, quantity - 1)}
                        style={qtyBtnStyle}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ color: '#fff', fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity(bike.id, quantity + 1)}
                        style={qtyBtnStyle}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>

                      <button
                        onClick={() => handleRemove(bike.id)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(255,100,100,0.6)',
                          padding: 4,
                          display: 'flex',
                        }}
                        aria-label={`Remove ${bike.name} from cart`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div
                    style={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 15,
                      flexShrink: 0,
                      alignSelf: 'center',
                    }}
                  >
                    ${(bike.price * quantity).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {optimisticItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Subtotal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                color: 'rgba(255,255,255,0.5)',
                fontSize: 14,
              }}
            >
              <span>Subtotal</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 20,
                color: '#fff',
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              <span>Total</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>

            {/* Checkout CTA */}
            <button
              style={{
                width: '100%',
                background: '#e53935',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 0',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 12,
              }}
            >
              Checkout <ArrowRight size={18} />
            </button>

            <button
              onClick={() => { clearCart(); toggleCart() }}
              style={{
                width: '100%',
                background: 'none',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '10px 0',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Clear cart
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

const qtyBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  background: 'rgba(255,255,255,0.07)',
  border: 'none',
  cursor: 'pointer',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
