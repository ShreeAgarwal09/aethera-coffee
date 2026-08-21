import { supabase } from '@/lib/supabase/server';
import { AdminCoupons } from '@/components/admin/coupons';

export const revalidate = 0;

export default async function AdminCouponsPage() {
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
  return <AdminCoupons coupons={coupons ?? []} />;
}
