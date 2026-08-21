'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Product, Category } from '@/lib/types';

type ProductWithCategory = Product & { category: { name: string } | null };

export function AdminProducts({
  products,
  categories,
}: {
  products: ProductWithCategory[];
  categories: Category[];
}) {
  const [items, setItems] = useState(products);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm(p);
    setShowForm(true);
  };

  const startNew = () => {
    setEditing(null);
    setForm({ price: 0, stock: 0, featured: false, weight: '250g' });
    setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const slug = form.slug ?? (form.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const payload = { ...form, slug, price: Math.round((form.price ?? 0) * 100) };

    if (editing) {
      const { data } = await supabase.from('products').update(payload).eq('id', editing.id).select('*').maybeSingle<Product>();
      if (data) setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...data, category: p.category } : p)));
    } else {
      const { data } = await supabase.from('products').insert(payload).select('*').maybeSingle<Product>();
      if (data) {
        const cat = categories.find((c) => c.id === data.category_id);
        setItems((prev) => [{ ...data, category: cat ? { name: cat.name } : null }, ...prev]);
      }
    }
    setSaving(false);
    setShowForm(false);
    setForm({});
    setEditing(null);
  };

  const remove = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-foreground">Products</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">{items.length} products</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-foreground">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <input type="text" placeholder="Name" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="col-span-2 rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <textarea placeholder="Description" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="col-span-2 rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" rows={3} />
              <input type="number" placeholder="Price (USD)" value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <input type="number" placeholder="Stock" value={form.stock ?? 0} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <select value={form.category_id ?? ''} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="text" placeholder="Origin" value={form.origin ?? ''} onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <input type="text" placeholder="Roast Level" value={form.roast_level ?? ''} onChange={(e) => setForm({ ...form, roast_level: e.target.value })}
                className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <input type="text" placeholder="Weight" value={form.weight ?? '250g'} onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className="rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <input type="text" placeholder="Tasting Notes" value={form.tasting_notes ?? ''} onChange={(e) => setForm({ ...form, tasting_notes: e.target.value })}
                className="col-span-2 rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <input type="text" placeholder="Image URL" value={form.image_url ?? ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="col-span-2 rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <label className="col-span-2 flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
                Featured product
              </label>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
                {saving ? 'Saving...' : <><Check className="h-4 w-4" /> Save</>}
              </button>
              <button onClick={() => setShowForm(false)} className="rounded-sm border border-border px-6 py-2.5 text-sm font-light text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.category?.name ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-foreground">${(p.price / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-foreground">{p.stock}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => startEdit(p)} className="text-muted-foreground hover:text-primary"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
