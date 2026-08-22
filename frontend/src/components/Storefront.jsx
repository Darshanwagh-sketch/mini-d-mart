import React from 'react';
import ProductCard from './ProductCard';
import { Sparkles, ShoppingBag, Truck, ShieldCheck, ArrowRight, Search, X, Filter } from 'lucide-react';

export default function Storefront({ 
  products, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery,
  setSearchQuery,
  onAddToCart, 
  onQuickView 
}) {
  const isSearching = searchQuery && searchQuery.trim() !== '';

  // Fail-safe client-side category filtering
  const categoryFilteredProducts = selectedCategory !== null
    ? products.filter(p => p.category?.id === Number(selectedCategory))
    : products;

  return (
    <div>
      {/* Hero Banner (Shown when not searching & browsing all) */}
      {!isSearching && selectedCategory === null && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)', 
          border: '1px solid var(--border-glass)', 
          borderRadius: 'var(--radius-lg)', 
          padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)', 
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: 640 }}>
            <span className="brand-badge" style={{ background: 'var(--primary)', marginBottom: 12, display: 'inline-block' }}>
              <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} /> Superfast 30-Min Delivery & Store Pickup
            </span>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 12 }}>
              Fresh Groceries & Everyday Essentials Delivered Fast.
            </h1>
            <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'var(--text-muted)', marginBottom: 20 }}>
              Shop top quality fresh produce, dairy, bakery, snacks and household care at lowest D-Mart wholesale prices.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600 }}>
                <Truck size={16} style={{ color: 'var(--primary)' }} /> Express Home Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600 }}>
                <ShoppingBag size={16} style={{ color: 'var(--secondary)' }} /> Scheduled Store Pickup
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 600 }}>
                <ShieldCheck size={16} style={{ color: 'var(--accent-gold)' }} /> 100% Quality Guaranteed
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Filter Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8, 
        overflowX: 'auto', 
        paddingBottom: 8, 
        marginBottom: 24,
        WebkitOverflowScrolling: 'touch'
      }}>
        <button 
          className={`btn ${selectedCategory === null ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedCategory(null)}
          style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: '0.82rem', padding: '7px 16px' }}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button 
            key={cat.id}
            className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: '0.82rem', padding: '7px 16px' }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* SEARCH RESULTS VIEW */}
      {isSearching ? (
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--border-glass)', paddingBottom: 12 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Search size={20} style={{ color: 'var(--primary)' }} />
              Search Results for "{searchQuery}" ({products.length} {products.length === 1 ? 'item' : 'items'})
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setSearchQuery('')}>
              <X size={14} /> Clear Search
            </button>
          </div>

          {products.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '50px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <Search size={40} style={{ color: 'var(--text-dim)', marginBottom: 12 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>No groceries found for "{searchQuery}"</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>Try searching for "milk", "mango", "rice", "tea", "coffee", or "butter".</p>
              <button className="btn btn-primary btn-sm" onClick={() => setSearchQuery('')}>
                Clear Search & Show All Products
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onQuickView={onQuickView} 
                />
              ))}
            </div>
          )}
        </div>
      ) : selectedCategory !== null ? (
        /* SINGLE SELECTED CATEGORY VIEW (Exclusively shows items of this category) */
        <div style={{ marginBottom: 30 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--border-glass)', paddingBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 4, height: 24, background: 'var(--primary)', borderRadius: 2, display: 'inline-block' }}></span>
                {categories.find(c => c.id === selectedCategory)?.name}
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>({categoryFilteredProducts.length} items)</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, marginLeft: 14 }}>
                {categories.find(c => c.id === selectedCategory)?.description}
              </p>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCategory(null)}>
              <X size={14} /> Show All Categories
            </button>
          </div>

          {categoryFilteredProducts.length === 0 ? (
            <div style={{ background: 'var(--bg-card)', padding: '50px 20px', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
              <Filter size={40} style={{ color: 'var(--text-dim)', marginBottom: 12 }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 6 }}>No items in this category currently.</p>
              <button className="btn btn-primary btn-sm" onClick={() => setSelectedCategory(null)}>
                View All Categories
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {categoryFilteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={onAddToCart} 
                  onQuickView={onQuickView} 
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Grouped Section-By-Section View when All Categories is active */
        categories.map((cat) => {
          const catProducts = products.filter(p => p.category?.id === cat.id);
          if (catProducts.length === 0) return null;

          return (
            <section key={cat.id} style={{ marginBottom: 40 }}>
              <div style={{ 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center', 
                marginBottom: 16, 
                borderBottom: '1px solid var(--border-glass)', 
                paddingBottom: 10,
                flexWrap: 'wrap',
                gap: 8
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 4, height: 22, background: 'var(--primary)', borderRadius: 2, display: 'inline-block' }}></span>
                    {cat.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 14 }}>
                    {cat.description}
                  </span>
                </div>

                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{ fontSize: '0.78rem' }}
                >
                  View Only {cat.name} ({catProducts.length}) <ArrowRight size={14} />
                </button>
              </div>

              <div className="product-grid">
                {catProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={onAddToCart} 
                    onQuickView={onQuickView} 
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
