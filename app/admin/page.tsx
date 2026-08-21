import { supabase } from '@/lib/supabase/server';
import { AdminDashboard } from '@/components/admin/dashboard';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { data: recentOrders },
    { data: topProducts },
    { data: revenueData },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('id, total, status, created_at, email').order('created_at', { ascending: false }).limit(10),
    supabase.from('order_items').select('product_name, quantity, price').limit(50),
    supabase.from('orders').select('total, created_at'),
  ]);

  // Calculate total revenue
  const totalRevenue = (revenueData ?? []).reduce((sum, o) => sum + (o.total ?? 0), 0);

  // Aggregate top products
  const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
  (topProducts ?? []).forEach((item) => {
    const existing = productMap.get(item.product_name) ?? { name: item.product_name, qty: 0, revenue: 0 };
    existing.qty += item.quantity;
    existing.revenue += item.price * item.quantity;
    productMap.set(item.product_name, existing);
  });
  const topProductsAgg = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <AdminDashboard
      stats={{
        products: productCount ?? 0,
        orders: orderCount ?? 0,
        customers: customerCount ?? 0,
        revenue: totalRevenue,
      }}
      recentOrders={recentOrders ?? []}
      topProducts={topProductsAgg}
    />
  );
}
