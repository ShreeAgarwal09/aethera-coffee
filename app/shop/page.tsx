import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { ShopClient } from '@/components/site/shop-client';
import { supabase } from '@/lib/supabase/server';
import type { Product, Category } from '@/lib/types';

export const revalidate = 3600;

export default async function ShopPage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: false }).returns<Product[]>(),
    supabase.from('categories').select('*').order('name', { ascending: true }).returns<Category[]>(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <ShopClient products={products ?? []} categories={categories ?? []} />
      </main>
      <Footer />
    </>
  );
}
