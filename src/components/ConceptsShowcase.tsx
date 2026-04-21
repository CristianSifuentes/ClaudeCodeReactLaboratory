const concepts = [
  {
    title: 'React Compiler (Forget)',
    detail:
      'Automatic memoization removes most manual useMemo/useCallback boilerplate in component trees.',
  },
  {
    title: 'Server Components + Actions',
    detail:
      'Server-first data flow with direct mutations from forms keeps the client bundle lean.',
  },
  {
    title: 'Transitions + Suspense',
    detail:
      'Mark expensive updates non-urgent and coordinate async rendering with a single declarative boundary.',
  },
  {
    title: 'Fine-Grained Reactivity',
    detail:
      'Zustand selectors subscribe to the minimal state slice to avoid global rerender cascades.',
  },
]

export default function ConceptsShowcase() {
  return (
    <section style={{ background: '#090909', padding: '70px 0 30px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{ color: '#fff', margin: '0 0 20px', fontSize: 'clamp(26px,3.2vw,42px)' }}>
          React 2026 Concepts Used in This Landing Page
        </h2>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginBottom: 24 }}>
          {concepts.map(concept => (
            <article
              key={concept.title}
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 14,
                padding: 16,
              }}
            >
              <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: 16 }}>{concept.title}</h3>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', lineHeight: 1.55, fontSize: 13 }}>
                {concept.detail}
              </p>
            </article>
          ))}
        </div>

        {/* @CONCEPT: Direct Web Components Support
            React 19 can render custom elements naturally. */}
        <cycling-news-ticker
          headlines='["UCI Announces New Mixed Gravel Format","Spring Classics Tech: 7 Aero Trends","How to Pace Long Climbs With Power Zones"]'
        ></cycling-news-ticker>
      </div>
    </section>
  )
}
