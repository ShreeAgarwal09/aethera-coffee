'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User, Package, MapPin, Heart, Clock, Settings, LogOut, Plus, Trash2,
  Check, Edit2, Eye, ShoppingBag, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { supabase } from '@/lib/supabase/client';
import type { Order, OrderItem, Address, Product } from '@/lib/types';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { getProductImage } from '@/lib/images';

type Tab = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'recent' | 'settings';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const { items: wishlistItems, remove: removeFromWishlist, moveToCart } = useWishlist();
  const { recentIds, clearRecent } = useRecentlyViewed();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState({ full_name: '', phone: '' });
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrForm, setAddrForm] = useState<Partial<Address>>({});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) { setFetching(false); return; }

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle<{ full_name: string; phone: string }>();
    if (profileData) setProfile(profileData);

    const { data: orderRows } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .returns<Order[]>();

    if (orderRows && orderRows.length > 0) {
      const ordersWithItems = await Promise.all(
        orderRows.map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id)
            .returns<OrderItem[]>();
          return { ...order, items: items ?? [] };
        })
      );
      setOrders(ordersWithItems);
    }

    const { data: addrData } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .returns<Address[]>();
    setAddresses(addrData ?? []);

    // Fetch recently viewed products
    if (recentIds.length > 0) {
      const { data: recentData } = await supabase
        .from('products')
        .select('*')
        .in('id', recentIds)
        .returns<Product[]>();
      // Sort by recentIds order
      const sorted = (recentData ?? []).sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));
      setRecentProducts(sorted);
    }

    setFetching(false);
  }, [user, recentIds]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from('profiles').upsert({ id: user?.id, ...profile });
    setSaving(false);
    setEditingProfile(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const saveAddress = async () => {
    if (!user || !addrForm.full_name || !addrForm.address_line1 || !addrForm.city || !addrForm.postal_code) return;
    setSaving(true);
    const { data } = await supabase
      .from('addresses')
      .insert({ user_id: user.id, ...addrForm })
      .select('*')
      .maybeSingle<Address>();
    if (data) setAddresses((prev) => [data, ...prev]);
    setSaving(false);
    setShowAddrForm(false);
    setAddrForm({});
  };

  const deleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) return;
    // Unset all defaults, then set the chosen one
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
    await supabase.from('addresses').update({ is_default: true }).eq('id', id);
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
  };

  if (loading || fetching) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm font-light text-muted-foreground">Loading...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-24">
          <User className="h-12 w-12 text-muted-foreground" />
          <h1 className="mt-6 font-display text-4xl text-foreground md:text-5xl">Sign in to continue</h1>
          <Link href="/signin?redirect=/account" className="mt-6 rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
            Sign In
          </Link>
        </div>
      </>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'recent', label: 'Recently Viewed', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 pt-24 lg:px-10">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.35em] text-primary">Account</span>
            <h1 className="mt-3 font-display text-[clamp(2rem,4vw,4rem)] leading-tight text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm font-light text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm font-light text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/30"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="flex gap-2 overflow-x-auto lg:flex-col">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-sm px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile tab */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-sm border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-foreground">Profile</h2>
                  {!editingProfile ? (
                    <button onClick={() => setEditingProfile(true)} className="flex items-center gap-2 text-xs font-light text-muted-foreground hover:text-primary">
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                  ) : (
                    <button onClick={saveProfile} disabled={saving} className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50">
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                  )}
                </div>

                {savedMsg && <p className="mt-3 text-sm text-primary">Profile updated successfully.</p>}

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                    {editingProfile ? (
                      <input type="text" value={profile.full_name ?? ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                    ) : (
                      <p className="mt-2 text-sm text-foreground">{profile.full_name || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                    <p className="mt-2 text-sm text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Phone</label>
                    {editingProfile ? (
                      <input type="text" value={profile.phone ?? ''} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="mt-2 w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                    ) : (
                      <p className="mt-2 text-sm text-foreground">{profile.phone || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders tab */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display text-2xl text-foreground">Order History</h2>
                {orders.length === 0 ? (
                  <div className="mt-6 rounded-sm border border-border bg-card p-12 text-center">
                    <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-sm font-light text-muted-foreground">You haven&apos;t placed any orders yet.</p>
                    <Link href="/shop" className="mt-4 inline-block rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="rounded-sm border border-border bg-card p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                          <div>
                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Order #{order.id.slice(0, 8)}</span>
                            <p className="mt-1 text-xs font-light text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="rounded-full border border-border px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{order.status}</span>
                            <span className="text-lg font-medium text-foreground">${(order.total / 100).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="font-light text-foreground">{item.quantity}× {item.product_name}</span>
                              <span className="font-light text-muted-foreground">${((item.price * item.quantity) / 100).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Addresses tab */}
            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-foreground">Saved Addresses</h2>
                  <button onClick={() => setShowAddrForm(!showAddrForm)} className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                {showAddrForm && (
                  <div className="mt-6 rounded-sm border border-border bg-card p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" value={addrForm.full_name ?? ''} onChange={(e) => setAddrForm({ ...addrForm, full_name: e.target.value })}
                        className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                      <input type="text" placeholder="Phone" value={addrForm.phone ?? ''} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                        className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                      <input type="text" placeholder="Address Line 1" value={addrForm.address_line1 ?? ''} onChange={(e) => setAddrForm({ ...addrForm, address_line1: e.target.value })}
                        className="col-span-2 rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                      <input type="text" placeholder="City" value={addrForm.city ?? ''} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                        className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                      <input type="text" placeholder="Postal Code" value={addrForm.postal_code ?? ''} onChange={(e) => setAddrForm({ ...addrForm, postal_code: e.target.value })}
                        className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                      <input type="text" placeholder="Country" value={addrForm.country ?? 'United States'} onChange={(e) => setAddrForm({ ...addrForm, country: e.target.value })}
                        className="col-span-2 rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={saveAddress} disabled={saving} className="rounded-sm bg-primary px-6 py-2.5 text-xs font-medium text-primary-foreground disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Address'}
                      </button>
                      <button onClick={() => { setShowAddrForm(false); setAddrForm({}); }} className="rounded-sm border border-border px-6 py-2.5 text-xs font-light text-muted-foreground hover:text-foreground">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="mt-6 rounded-sm border border-border bg-card p-12 text-center">
                    <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-sm font-light text-muted-foreground">No saved addresses yet.</p>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="rounded-sm border border-border bg-card p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">{addr.full_name}</p>
                            <p className="mt-1 text-xs font-light text-muted-foreground">{addr.address_line1}</p>
                            <p className="text-xs font-light text-muted-foreground">{addr.city}, {addr.postal_code}</p>
                            <p className="text-xs font-light text-muted-foreground">{addr.country}</p>
                            {addr.phone && <p className="mt-1 text-xs font-light text-muted-foreground">{addr.phone}</p>}
                          </div>
                          <button onClick={() => deleteAddress(addr.id)} className="text-muted-foreground transition-colors hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          {addr.is_default ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-primary"><Check className="h-3 w-3" /> Default</span>
                          ) : (
                            <button onClick={() => setDefaultAddress(addr.id)} className="text-xs font-light text-muted-foreground hover:text-primary">
                              Set as default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Wishlist tab */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display text-2xl text-foreground">Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="mt-6 rounded-sm border border-border bg-card p-12 text-center">
                    <Heart className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-sm font-light text-muted-foreground">Your wishlist is empty.</p>
                    <Link href="/shop" className="mt-4 inline-block rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Discover Coffees</Link>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="rounded-sm border border-border bg-card p-4">
                        <Link href={`/shop/${item.product.slug}`} className="block">
                          <div className="relative aspect-square overflow-hidden rounded-sm bg-background">
                            {item.product.image_url && (
                              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${item.product.image_url}')` }} />
                            )}
                          </div>
                          <h3 className="mt-3 font-display text-lg text-foreground">{item.product.name}</h3>
                          <p className="text-sm font-medium text-foreground">${(item.product.price / 100).toFixed(2)}</p>
                        </Link>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => moveToCart(item.product_id)} className="flex flex-1 items-center justify-center gap-1 rounded-sm bg-primary py-2 text-xs font-medium text-primary-foreground">
                            <ShoppingBag className="h-3 w-3" /> To Cart
                          </button>
                          <button onClick={() => removeFromWishlist(item.product_id)} className="rounded-sm border border-border px-3 text-muted-foreground hover:text-destructive hover:border-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Recently viewed tab */}
            {activeTab === 'recent' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl text-foreground">Recently Viewed</h2>
                  {recentProducts.length > 0 && (
                    <button onClick={clearRecent} className="text-xs font-light text-muted-foreground hover:text-destructive">Clear</button>
                  )}
                </div>
                {recentProducts.length === 0 ? (
                  <div className="mt-6 rounded-sm border border-border bg-card p-12 text-center">
                    <Eye className="mx-auto h-10 w-10 text-muted-foreground" />
                    <p className="mt-4 text-sm font-light text-muted-foreground">No recently viewed products.</p>
                    <Link href="/shop" className="mt-4 inline-block rounded-sm bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Browse Coffees</Link>
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {recentProducts.map((p) => (
                      <Link key={p.id} href={`/shop/${p.slug}`} className="group block">
                        <div className="relative aspect-square overflow-hidden rounded-sm bg-card">
                          {p.image_url && (
                            <img
                              src={getProductImage(p.slug, p.image_url)}
                              alt={p.name}
                              className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                              onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                            />
                          )}
                        </div>
                        <h3 className="mt-2 font-display text-sm text-foreground">{p.name}</h3>
                        <p className="text-xs font-medium text-foreground">${(p.price / 100).toFixed(2)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings tab */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h2 className="font-display text-2xl text-foreground">Account Settings</h2>

                <div className="rounded-sm border border-border bg-card p-6">
                  <h3 className="text-sm font-medium text-foreground">Email Notifications</h3>
                  <p className="mt-1 text-xs font-light text-muted-foreground">Manage your email preferences.</p>
                  <div className="mt-4 space-y-3">
                    {['Order updates', 'New product releases', 'Reserve early access', 'Newsletter'].map((label) => (
                      <label key={label} className="flex items-center justify-between">
                        <span className="text-sm font-light text-foreground">{label}</span>
                        <input type="checkbox" defaultChecked className="accent-primary" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-sm border border-border bg-card p-6">
                  <h3 className="text-sm font-medium text-foreground">Security</h3>
                  <p className="mt-1 text-xs font-light text-muted-foreground">Manage your password and security settings.</p>
                  <button
                    onClick={() => router.push('/signin?reset=true')}
                    className="mt-4 rounded-sm border border-border px-4 py-2 text-xs font-light text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    Reset Password
                  </button>
                </div>

                <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-6">
                  <h3 className="text-sm font-medium text-destructive">Danger Zone</h3>
                  <p className="mt-1 text-xs font-light text-muted-foreground">Sign out of your account on this device.</p>
                  <button onClick={signOut} className="mt-4 flex items-center gap-2 rounded-sm border border-destructive/30 px-4 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10">
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
