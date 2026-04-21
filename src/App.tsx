import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import ProductCatalog from './components/ProductCatalog'
import BlogSection from './components/BlogSection'
import NewsletterSection from './components/NewsletterSection'
import ConceptsShowcase from './components/ConceptsShowcase'
import CartSidebar from './components/CartSidebar'

export default function App() {
  return (
    // @CONCEPT: Full Concurrent Rendering root tree.
    // Every section below participates in React 19 concurrent scheduling.
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ConceptsShowcase />
        <ProductCatalog />
        <BlogSection />
        <NewsletterSection />
      </main>
      <CartSidebar />
    </>
  )
}
