import { supabase } from '@/lib/supabase/server';
import { AdminProducts } from '@/components/admin/products';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return <AdminProducts products={products ?? []} categories={categories ?? []} />;
}
