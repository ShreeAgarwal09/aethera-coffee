import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { CollectionsClient } from '@/components/site/collections-client';
import { supabase } from '@/lib/supabase/server';
import type { Category, Product } from '@/lib/types';

export const revalidate = 3600;

export default async function CollectionsPage() {
  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').order('name').returns<Category[]>(),
    supabase.from('products').select('*').order('created_at', { ascending: false }).returns<Product[]>(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <CollectionsClient categories={categories ?? []} products={products ?? []} />
      </main>
      <Footer />
    </>
  );
}
