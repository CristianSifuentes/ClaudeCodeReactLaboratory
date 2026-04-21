import { Suspense } from 'react'
import { Clock3, ArrowUpRight } from 'lucide-react'
import { getFeaturedPosts, getLatestPosts } from '../data/blogs'

function BlogSkeleton() {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        minHeight: 280,
      }}
    />
  )
}

function BlogGrid() {
  // @CONCEPT: React Server Components (simulated)
  // In a true RSC architecture this read would run on the server only.
  // Here we keep the same mental model by consuming a server-style data module.
  const featured = getFeaturedPosts()
  const latest = getLatestPosts(4)

  const allPosts = [...featured, ...latest].slice(0, 6)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}
    >
      {allPosts.map(post => (
        <article
          key={post.id}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
            style={{ width: '100%', height: 180, objectFit: 'cover' }}
          />

          <div style={{ padding: 18 }}>
            <p style={{ color: '#e57373', margin: '0 0 8px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
              {post.category}
            </p>
            <h3 style={{ color: '#fff', margin: '0 0 10px', lineHeight: 1.3, fontSize: 19 }}>
              {post.title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 14px', fontSize: 14, lineHeight: 1.6 }}>
              {post.excerpt}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                <Clock3 size={13} /> {post.readTime} min
              </div>
              <a href="#" style={{ color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Read <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function BlogSection() {
  return (
    <section id="blog" style={{ background: '#0a0a0a', padding: '20px 0 90px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(30px,4vw,48px)', margin: '0 0 8px', fontWeight: 900 }}>
          Cycling World News
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', margin: '0 0 28px', maxWidth: 640 }}>
          Race insights, gear analysis and coaching science. Built with a server-first mindset for fast first paint.
        </p>

        {/* @CONCEPT: Suspense for data coordination.
            We keep a unified fallback while async boundaries resolve. */}
        <Suspense
          fallback={
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <BlogSkeleton key={i} />
              ))}
            </div>
          }
        >
          <BlogGrid />
        </Suspense>
      </div>
    </section>
  )
}
