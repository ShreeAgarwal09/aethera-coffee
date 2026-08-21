import { supabase } from '@/lib/supabase/server';
import { AdminCustomers } from '@/components/admin/customers';

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, phone, created_at')
    .order('created_at', { ascending: false });

  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total');

  return <AdminCustomers profiles={profiles ?? []} orders={orders ?? []} />;
}
