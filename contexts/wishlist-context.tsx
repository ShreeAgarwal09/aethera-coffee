'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/auth-context';
import type { Product, Wishlist } from '@/lib/types';

type WishlistContextType = {
  items: Wishlist[];
  loading: boolean;
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
  remove: (productId: string) => Promise<void>;
  moveToCart: (productId: string) => Promise<{ error: string | null }>;
};

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  loading: true,
  toggle: async () => {},
  has: () => false,
  remove: async () => {},
  moveToCart: async () => ({ error: null }),
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('wishlists')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .returns<Wishlist[]>();
    setItems(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggle = useCallback(async (productId: string) => {
    if (!user) return;
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      await supabase.from('wishlists').delete().eq('id', existing.id);
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
    } else {
      const { data } = await supabase
        .from('wishlists')
        .insert({ product_id: productId })
        .select('*, product:products(*)')
        .maybeSingle<Wishlist>();
      if (data) setItems((prev) => [...prev, data]);
    }
  }, [user, items]);

  const has = useCallback(
    (productId: string) => items.some((i) => i.product_id === productId),
    [items]
  );

  const remove = useCallback(async (productId: string) => {
    if (!user) return;
    await supabase.from('wishlists').delete().eq('product_id', productId).eq('user_id', user.id);
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  }, [user]);

  const moveToCart = useCallback(async (productId: string) => {
    if (!user) return { error: 'Not signed in' };
    const { error } = await supabase
      .from('cart_items')
      .upsert({ product_id: productId, quantity: 1 }, { onConflict: 'user_id,product_id' });
    if (error) return { error: error.message };
    await remove(productId);
    return { error: null };
  }, [user, remove]);

  return (
    <WishlistContext.Provider value={{ items, loading, toggle, has, remove, moveToCart }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
