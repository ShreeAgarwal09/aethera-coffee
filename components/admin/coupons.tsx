'use client';

import { useState } from 'react';
import { Plus, X, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Coupon } from '@/lib/types';

export function AdminCoupons({ coupons }: { coupons: Coupon[] }) {
  const [items, setItems] = useState(coupons);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Coupon>>({ discount_type: 'percentage', active: true, min_order: 0 });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      code: (form.code ?? '').toUpperCase(),
      description: form.description,
      discount_type: form.discount_type,
      discount_value: form.discount_type === 'percentage' ? form.discount_value : Math.round((form.discount_value ?? 0) * 100),
      min_order: Math.round((form.min_order ?? 0) * 100),
      active: form.active ?? true,
    };
    const { data } = await supabase.from('coupons').insert(payload).select('*').maybeSingle<Coupon>();
    if (data) setItems((prev) => [data, ...prev]);
    setSaving(false);
    setShowForm(false);
    setForm({ discount_type: 'percentage', active: true, min_order: 0 });
  };

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('coupons').update({ active }).eq('id', id);
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, active } : c)));
  };

  const remove = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-foreground">Coupons</h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">{items.length} coupons</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div className="w-full max-w-md rounded-sm border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-foreground">New Coupon</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-6 space-y-4">
              <input type="text" placeholder="Code (e.g. SUMMER20)" value={form.code ?? ''} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <input type="text" placeholder="Description" value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed' })}
                className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <input type="number" placeholder={form.discount_type === 'percentage' ? 'Discount % (e.g. 10)' : 'Discount $ (e.g. 5.00)'} value={form.discount_value ?? ''} onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) })}
                className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
              <input type="number" placeholder="Min order $ (e.g. 50)" value={form.min_order ?? 0} onChange={(e) => setForm({ ...form, min_order: parseFloat(e.target.value) })}
                className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" />
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
        {items.map((c) => (
          <div key={c.id} className="rounded-sm border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-xl text-foreground">{c.code}</h3>
                <p className="mt-1 text-xs font-light text-muted-foreground">{c.description}</p>
                <p className="mt-2 text-sm font-medium text-primary">
                  {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `$${(c.discount_value / 100).toFixed(2)} off`}
                </p>
                <p className="mt-1 text-xs font-light text-muted-foreground">
                  Used {c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''} times
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => toggleActive(c.id, !c.active)}
                  className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                    c.active ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {c.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
