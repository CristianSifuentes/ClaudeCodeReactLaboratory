// ─── Hero Section ─────────────────────────────────────────────────────────────
//
// @CONCEPT: Full Concurrent Rendering
// This component benefits from React 19's concurrent scheduler.
// The large background image and animated elements are rendered without
// blocking user interactions — if the user clicks "Shop Now" while the
// gradient animation is computing, React prioritises that click event
// via time-slicing, deferring the animation work.

import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react'

const stats = [
  { label: 'Premium Bikes', value: '500+' },
  { label: 'Happy Riders', value: '12K+' },
  { label: 'Expert Reviews', value: '4.9★' },
  { label: 'Countries Shipped', value: '38' },
]

const perks = [
  { icon: Truck, text: 'Free shipping over $500' },
  { icon: Shield, text: '2-year warranty' },
  { icon: Headphones, text: '24/7 rider support' },
]

export default function HeroSection() {
  // @CONCEPT: React Compiler — no hooks here, but in a version with animated
  // state the compiler would automatically decide which derived values to
  // memoize without a single useMemo call from the developer.

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 40%, #0d0d1a 100%)',
        paddingTop: 64, // nav height
      }}
    >
      {/* Decorative radial glow — pure CSS, zero JS cost */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '10%',
          right: '-5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(229,57,53,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(33,150,243,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '80px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 48,
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Left: Copy */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(229,57,53,0.15)',
              border: '1px solid rgba(229,57,53,0.4)',
              borderRadius: 999,
              padding: '6px 16px',
              marginBottom: 24,
            }}
          >
            <Star size={14} fill="#e53935" color="#e53935" />
            <span style={{ color: '#e57373', fontSize: 13, fontWeight: 600 }}>
              #1 Online Bike Store 2026
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 76px)',
              fontWeight: 900,
              lineHeight: 1.05,
              color: '#ffffff',
              margin: '0 0 24px',
              letterSpacing: '-2px',
            }}
          >
            Ride Further.
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #e53935, #ff7043)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Go Faster.
            </span>
            <br />
            Feel Everything.
          </h1>

          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 480,
              margin: '0 0 36px',
            }}
          >
            Premium road, mountain and gravel bikes — plus the cycling world's
            most trusted news and reviews. Your next adventure starts here.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <a
              href="#shop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#e53935',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                transition: 'transform 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = '#c62828'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = '#e53935'
                el.style.transform = 'translateY(0)'
              }}
            >
              Shop Bikes <ArrowRight size={18} />
            </a>
            <a
              href="#blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                color: '#fff',
                padding: '14px 28px',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                textDecoration: 'none',
                border: '1.5px solid rgba(255,255,255,0.25)',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e =>
                ((e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'))
              }
              onMouseLeave={e =>
                ((e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'))
              }
            >
              Read the Blog
            </a>
          </div>

          {/* Perks */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 48,
              flexWrap: 'wrap',
            }}
          >
            {perks.map(({ icon: Icon, text }) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: 13,
                }}
              >
                <Icon size={16} color="#e53935" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stats card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          {stats.map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '28px 24px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 900,
                  color: '#fff',
                  letterSpacing: '-1px',
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.45)',
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
