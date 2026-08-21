import { supabase } from '@/lib/supabase/server';
import { AdminCategories } from '@/components/admin/categories';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const { data: categories } = await supabase.from('categories').select('*').order('name');
  return <AdminCategories categories={categories ?? []} />;
}
