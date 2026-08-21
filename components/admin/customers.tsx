'use client';

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

type OrderRef = {
  user_id: string;
  total: number;
};

export function AdminCustomers({
  profiles,
  orders,
}: {
  profiles: Profile[];
  orders: OrderRef[];
}) {
  const orderMap = new Map<string, { count: number; total: number }>();
  orders.forEach((o) => {
    const existing = orderMap.get(o.user_id) ?? { count: 0, total: 0 };
    existing.count += 1;
    existing.total += o.total;
    orderMap.set(o.user_id, existing);
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Customers</h1>
      <p className="mt-2 text-sm font-light text-muted-foreground">{profiles.length} customers</p>

      <div className="mt-8 overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Joined</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Orders</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Spent</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => {
              const stats = orderMap.get(p.id);
              return (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm text-foreground">{p.full_name ?? 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{p.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{stats?.count ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-foreground">${((stats?.total ?? 0) / 100).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
