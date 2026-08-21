import { supabase } from '@/lib/supabase/server';
import { AdminOrders } from '@/components/admin/orders';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminOrders orders={orders ?? []} />;
}
