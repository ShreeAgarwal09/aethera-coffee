'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/site/product-card';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

export function ShopClient({
  products,
  categories,
  initialCategory = 'all',
  initialSearch = '',
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>('newest');
  const [roastFilter, setRoastFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Sync with URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const q = params.get('q');
      if (cat) setActiveCategory(cat);
      if (q) setSearch(q);
    }
  }, []);

  const roastLevels = useMemo(() => {
    const set = new Set(products.map((p) => p.roast_level).filter(Boolean) as string[]);
    return ['all', ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (activeCategory !== 'all') {
      result = result.filter((p) => {
        const cat = categories.find((c) => c.id === p.category_id);
        return cat?.slug === activeCategory;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.origin?.toLowerCase().includes(q) ||
          p.tasting_notes?.toLowerCase().includes(q)
      );
    }

    if (roastFilter !== 'all') {
      result = result.filter((p) => p.roast_level === roastFilter);
    }

    if (priceRange !== 'all') {
      result = result.filter((p) => {
        const price = p.price / 100;
        switch (priceRange) {
          case 'under-30': return price < 30;
          case '30-50': return price >= 30 && price <= 50;
          case 'over-50': return price > 50;
          default: return true;
        }
      });
    }

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [products, categories, activeCategory, search, roastFilter, priceRange, sort]);

  const clearFilters = () => {
    setActiveCategory('all');
    setSearch('');
    setRoastFilter('all');
    setPriceRange('all');
    setSort('newest');
  };

  const hasActiveFilters = activeCategory !== 'all' || search !== '' || roastFilter !== 'all' || priceRange !== 'all' || sort !== 'newest';

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">The Collection</span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-tight text-foreground">All Coffees</h1>
        <p className="mt-4 max-w-lg text-sm font-light text-muted-foreground text-pretty">
          Each coffee is roasted to order within 48 hours of dispatch. Explore by origin, blend, or our numbered Reserve series.
        </p>
      </motion.div>

      {/* Search bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, origin, or tasting notes..."
            className="w-full rounded-sm border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-2 rounded-sm border px-5 py-3 text-sm font-medium transition-all ${
            showFilters ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Category pills */}
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full border px-5 py-2 text-xs font-medium tracking-wide transition-all ${
            activeCategory === 'all'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`rounded-full border px-5 py-2 text-xs font-medium tracking-wide transition-all ${
              activeCategory === cat.slug
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 flex flex-wrap items-center gap-4 rounded-sm border border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Roast</span>
            <select value={roastFilter} onChange={(e) => setRoastFilter(e.target.value)}
              className="rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary">
              {roastLevels.map((r) => <option key={r} value={r}>{r === 'all' ? 'All Roasts' : r}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Price</span>
            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
              className="rounded-sm border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary">
              <option value="all">All Prices</option>
              <option value="under-30">Under $30</option>
              <option value="30-50">$30 - $50</option>
              <option value="over-50">Over $50</option>
            </select>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs font-light text-muted-foreground transition-colors hover:text-destructive">
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </motion.div>
      )}

      <p className="mb-6 text-xs font-light text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? 'coffee' : 'coffees'}
      </p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm font-light text-muted-foreground">No coffees match your filters. Try adjusting your search.</p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-4 rounded-sm border border-border px-4 py-2 text-xs font-light text-foreground transition-colors hover:border-primary hover:text-primary">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
