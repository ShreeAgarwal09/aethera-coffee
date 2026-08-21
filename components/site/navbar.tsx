'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Heart, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'Our Story', href: '/story' },
  { label: 'Journal', href: '/journal' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/shop') return pathname === '/shop' || pathname.startsWith('/shop/');
    return pathname === href;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? 'glass py-3' : 'py-6 bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="text-foreground transition-opacity md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop nav left */}
          <div className="hidden items-center gap-10 md:flex">
            {navLinks.slice(0, 3).map((link) => (
              <NavLink key={link.href} link={link} isActive={isActive(link.href)} />
            ))}
          </div>

          {/* Logo */}
          <Link href="/" className="group absolute left-1/2 -translate-x-1/2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="font-display text-2xl tracking-tight text-foreground"
            >
              Aethera
            </motion.span>
            <span
              className="text-[10px] font-medium tracking-widest align-super"
              style={{ color: 'hsl(38 78% 52%)' }}
            >
              ®
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-5 md:gap-6">
            <div className="hidden items-center gap-10 md:flex">
              {navLinks.slice(3).map((link) => (
                <NavLink key={link.href} link={link} isActive={isActive(link.href)} />
              ))}
            </div>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link
              href="/wishlist"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href="/cart"
              className="relative text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
            </Link>
            <Link
              href={user ? '/account' : '/signin'}
              className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground lg:block"
            >
              {user ? 'Account' : 'Sign In'}
            </Link>
          </div>
        </nav>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mx-auto max-w-7xl px-6 pt-4 lg:px-10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) window.location.href = `/shop?q=${encodeURIComponent(searchQuery)}`;
                  }}
                >
                  <div className="relative">
                    <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search coffees, origins, tasting notes..."
                      className="w-full border-b border-border bg-transparent py-4 pl-8 text-lg font-light text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                    />
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-background md:hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-2xl text-foreground">Aethera®</span>
              <button onClick={() => setMobileOpen(false)} className="text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-2 px-6 pt-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className={`group flex items-center justify-between border-b border-border py-5 font-display text-5xl transition-colors ${
                      isActive(link.href) ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight
                      className={`h-6 w-6 transition-transform duration-300 group-hover:translate-x-2 ${
                        isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Secondary links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute bottom-10 left-6 right-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-6">
                <Link href={user ? '/account' : '/signin'} className="text-sm font-light text-muted-foreground">
                  {user ? 'My Account' : 'Sign In'}
                </Link>
                <Link href="/wishlist" className="text-sm font-light text-muted-foreground">Wishlist</Link>
                <Link href="/cart" className="text-sm font-light text-muted-foreground">Cart</Link>
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Est. 2019 — Altitude Sourced</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ link, isActive }: { link: { label: string; href: string }; isActive: boolean }) {
  return (
    <Link
      href={link.href}
      className={`group relative text-sm font-light tracking-wide transition-colors duration-300 ${
        isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {link.label}
      <motion.span
        className="absolute -bottom-1.5 left-0 h-px"
        style={{ backgroundColor: 'hsl(38 78% 52%)' }}
        initial={false}
        animate={{ width: isActive ? '100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <span
        className="absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{ backgroundColor: 'hsl(38 78% 52% / 0.5)', opacity: isActive ? 0 : 1 }}
      />
    </Link>
  );
}
