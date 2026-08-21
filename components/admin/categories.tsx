'use client';

import { useState } from 'react';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';

export function AdminCategories({ categories }: { categories: Category[] }) {
  const [items, setItems] = useState(categories);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Category>>({});
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const slug = (form.name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { data } = await supabase.from('categories').insert({ name: form.name, slug, description: form.description }).select('*').maybeSingle<Category>();
    if (data) setItems((prev) => [...prev, data]);
    setSaving(false);
    setShowForm(false);
    setForm({});
  };

  const remove = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-foreground">Categories</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">{items.length} categories</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div className="w-full max-w-md rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-foreground">New Category</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 space-y-4">
              <input type="text" placeholder="Category Name" value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <textarea placeholder="Description" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" rows={3} />
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
                {saving ? 'Saving...' : <><Check className="h-4 w-4" /> Save</>}
              </button>
              <button onClick={() => setShowForm(false)} className="rounded-sm border border-border px-6 py-2.5 text-sm font-light text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((cat) => (
          <div key={cat.id} className="rounded-sm border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-lg text-foreground">{cat.name}</h3>
                <p className="mt-1 text-xs font-light text-muted-foreground">{cat.description}</p>
              </div>
              <button onClick={() => remove(cat.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
