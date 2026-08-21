'use client';

import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';

type Stats = {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
};

type RecentOrder = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  email: string | null;
};

type TopProduct = {
  name: string;
  qty: number;
  revenue: number;
};

export function AdminDashboard({
  stats,
  recentOrders,
  topProducts,
}: {
  stats: Stats;
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}) {
  const statCards = [
    { label: 'Total Revenue', value: `$${(stats.revenue / 100).toFixed(2)}`, icon: DollarSign, accent: 'text-primary' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, accent: 'text-primary' },
    { label: 'Products', value: stats.products, icon: Package, accent: 'text-primary' },
    { label: 'Customers', value: stats.customers, icon: Users, accent: 'text-primary' },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Dashboard</h1>
      <p className="mt-2 text-sm font-light text-muted-foreground">Overview of your store performance.</p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-sm border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.accent}`} />
            </div>
            <p className="mt-3 text-2xl font-medium text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-sm border border-border bg-card p-6">
          <h2 className="font-display text-xl text-foreground">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-sm font-light text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs font-light text-muted-foreground">{order.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{order.status}</span>
                    <span className="text-sm font-medium text-foreground">${(order.total / 100).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="rounded-sm border border-border bg-card p-6">
          <h2 className="font-display text-xl text-foreground">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="mt-4 text-sm font-light text-muted-foreground">No sales data yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {topProducts.map((product, i) => (
                <div key={product.name} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs font-light text-muted-foreground">{product.qty} sold</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-foreground">${(product.revenue / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
