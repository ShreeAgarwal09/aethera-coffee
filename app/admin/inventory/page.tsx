import { supabase } from '@/lib/supabase/server';
import { AdminInventory } from '@/components/admin/inventory';

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, stock, price')
    .order('name');

  return <AdminInventory products={products ?? []} />;
}
