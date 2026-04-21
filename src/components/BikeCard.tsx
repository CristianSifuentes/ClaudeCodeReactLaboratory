// ─── Bike Card Component ──────────────────────────────────────────────────────
//
// @CONCEPT: React Compiler — Automatic Memoization
// Without React Compiler, you would need:
//   const BikeCard = memo(({ bike, onAddToCart }) => { ... })
//   and wrap `onAddToCart` with useCallback at the call site.
//
// With React Compiler enabled (babel-plugin-react-compiler in vite.config),
// the compiler analyses this component at BUILD TIME and automatically
// determines that it only needs to re-render when `bike` or `onAddToCart`
// props change. The `memo()` wrapper becomes unnecessary boilerplate.

import { useState } from 'react'
import { ShoppingCart, Star, Zap } from 'lucide-react'
import type { Bike } from '../types'

interface BikeCardProps {
  bike: Bike
  onAddToCart: (bike: Bike) => void   // stable ref provided by parent via useTransition
  isPending?: boolean                  // signals an optimistic update is in-flight
}

const categoryColors: Record<string, string> = {
  road: '#2196f3',
  mountain: '#4caf50',
  gravel: '#ff9800',
  urban: '#9c27b0',
  electric: '#00bcd4',
}

const badgeColors: Record<string, string> = {
  New: '#2196f3',
  Sale: '#e53935',
  'Staff Pick': '#ff9800',
  'Best Seller': '#4caf50',
}

export default function BikeCard({ bike, onAddToCart, isPending }: BikeCardProps) {
  // Local hover state — the compiler decides this is component-local and
  // does not need to be lifted or memoized.
  const [hovered, setHovered] = useState(false)

  const discount = bike.originalPrice
    ? Math.round(((bike.originalPrice - bike.price) / bike.originalPrice) * 100)
    : null

  return (
    <article
      style={{
        background: '#111',
        border: `1px solid ${hovered ? 'rgba(229,57,53,0.4)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.4)' : 'none',
        // @CONCEPT: useOptimistic — when isPending is true (optimistic add),
        // we dim the card slightly to communicate the pending state to the user.
        opacity: isPending ? 0.7 : 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={bike.imageUrl}
          alt={bike.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.4s',
          }}
        />
        {/* Badge */}
        {bike.badge && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: badgeColors[bike.badge] ?? '#555',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 999,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {bike.badge}
          </span>
        )}
        {/* Out of stock overlay */}
        {!bike.inStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Out of Stock
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 0', flex: 1 }}>
        {/* Category pill */}
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: categoryColors[bike.category],
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {bike.category}
        </span>

        <h3
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 700,
            margin: '6px 0 4px',
          }}
        >
          {bike.brand} {bike.name}
        </h3>

        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            lineHeight: 1.5,
            margin: '0 0 12px',
          }}
        >
          {bike.description}
        </p>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Star size={13} fill="#ffc107" color="#ffc107" />
          <span style={{ color: '#ffc107', fontSize: 13, fontWeight: 700 }}>
            {bike.rating}
          </span>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
            ({bike.reviewCount})
          </span>
        </div>

        {/* Specs mini table */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px 12px',
            marginBottom: 16,
          }}
        >
          {Object.entries(bike.specs).map(([key, value]) => (
            <div key={key}>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          marginTop: 'auto',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>
              ${bike.price.toLocaleString()}
            </span>
            {bike.originalPrice && (
              <span
                style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: 14,
                  textDecoration: 'line-through',
                }}
              >
                ${bike.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {discount && (
            <span style={{ color: '#e57373', fontSize: 12, fontWeight: 600 }}>
              Save {discount}%
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          disabled={!bike.inStock || isPending}
          onClick={() => onAddToCart(bike)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: bike.inStock ? '#e53935' : 'rgba(255,255,255,0.06)',
            color: bike.inStock ? '#fff' : 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontWeight: 700,
            fontSize: 14,
            cursor: bike.inStock ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => {
            if (bike.inStock) (e.currentTarget.style.background = '#c62828')
          }}
          onMouseLeave={e => {
            if (bike.inStock) (e.currentTarget.style.background = '#e53935')
          }}
          aria-label={`Add ${bike.name} to cart`}
        >
          {/* @CONCEPT: useOptimistic — the Zap icon appears when isPending
              indicating an optimistic add is being confirmed server-side. */}
          {isPending ? <Zap size={16} /> : <ShoppingCart size={16} />}
          {isPending ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}
