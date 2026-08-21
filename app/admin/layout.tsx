import Link from 'next/link';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/admin/login');

  const isAdmin = session.user.app_metadata?.role === 'admin';
  if (!isAdmin) redirect('/');

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="fixed left-0 top-0 z-30 h-screen w-60 border-r border-border bg-card p-4">
          <Link href="/admin" className="block">
            <span className="font-display text-2xl text-foreground">Aethera</span>
            <span className="ml-1 text-primary text-xs font-medium tracking-widest">® Admin</span>
          </Link>
          <nav className="mt-8 space-y-1">
            {[
              { label: 'Dashboard', href: '/admin' },
              { label: 'Products', href: '/admin/products' },
              { label: 'Categories', href: '/admin/categories' },
              { label: 'Orders', href: '/admin/orders' },
              { label: 'Customers', href: '/admin/customers' },
              { label: 'Inventory', href: '/admin/inventory' },
              { label: 'Coupons', href: '/admin/coupons' },
              { label: 'Back to Store', href: '/' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-sm px-4 py-2.5 text-sm font-light text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="ml-60 flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
