// ─── Navigation Component ─────────────────────────────────────────────────────
//
// @CONCEPT: Fine-Grained Reactivity (Zustand selectors)
// This component subscribes to ONLY the cart item count from the store.
// When product descriptions or prices update, this component does NOT re-render
// because it doesn't subscribe to those slices of state.

import { ShoppingCart, Bike, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../store/cartStore'

const navLinks = [
  { label: 'Shop', href: '#shop' },
  { label: 'Blog', href: '#blog' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  // @CONCEPT: Fine-grained reactivity — selector subscribes to a SINGLE value.
  // Only re-renders when totalItems() output changes, not on every cart mutation.
  const totalItems = useCartStore(state => state.totalItems())

  // @CONCEPT: Fine-grained reactivity — separate selector for the action.
  // Selectors that return stable function references don't cause re-renders.
  const toggleCart = useCartStore(state => state.toggleCart)

  // @CONCEPT: React Compiler note — without the compiler, the inline arrow
  // function `state => state.toggleCart` creates a new reference each render.
  // With React Compiler enabled, this memoization is handled automatically
  // at build time, eliminating the need for useCallback here.
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10, 10, 10, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            color: '#fff',
          }}
        >
          <Bike size={28} color="#e53935" />
          <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.5px' }}>
            VELOCE
          </span>
        </a>

        {/* Desktop links */}
        <ul
          style={{
            display: 'flex',
            gap: 32,
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          className="desktop-nav"
        >
          {navLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: 15,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
                onMouseLeave={e =>
                  ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.75)')
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Cart button — triggers fine-grained re-render only on totalItems change */}
          <button
            onClick={toggleCart}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: '#fff',
              display: 'flex',
            }}
            aria-label={`Open cart, ${totalItems} items`}
          >
            <ShoppingCart size={22} />
            {/* Badge: only renders when there are items */}
            {totalItems > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: '#e53935',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: '#fff',
              display: 'none',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            background: 'rgba(10,10,10,0.98)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '16px 24px 24px',
          }}
        >
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: 16,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
