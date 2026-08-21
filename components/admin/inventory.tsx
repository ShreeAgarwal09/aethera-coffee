'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

type InventoryProduct = {
  id: string;
  name: string;
  slug: string;
  stock: number;
  price: number;
};

export function AdminInventory({ products }: { products: InventoryProduct[] }) {
  const [items, setItems] = useState(products);
  const [editing, setEditing] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState(0);

  const updateStock = async (id: string) => {
    await supabase.from('products').update({ stock: stockValue }).eq('id', id);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, stock: stockValue } : p)));
    setEditing(null);
  };

  const lowStock = items.filter((p) => p.stock < 20);
  const outOfStock = items.filter((p) => p.stock === 0);

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Inventory</h1>
      <p className="mt-2 text-sm font-light text-muted-foreground">{items.length} products tracked</p>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {outOfStock.length > 0 && (
            <div className="rounded-sm border border-destructive/30 bg-destructive/5 p-4">
              <p className="text-sm font-medium text-destructive">{outOfStock.length} out of stock</p>
              <p className="mt-1 text-xs font-light text-muted-foreground">{outOfStock.map((p) => p.name).join(', ')}</p>
            </div>
          )}
          {lowStock.length > 0 && lowStock.length !== outOfStock.length && (
            <div className="rounded-sm border border-primary/30 bg-primary/10 p-4">
              <p className="text-sm font-medium text-primary">{lowStock.length} low stock</p>
              <p className="mt-1 text-xs font-light text-muted-foreground">Products with less than 20 units remaining.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-sm text-foreground">{p.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">${(p.price / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {editing === p.id ? (
                    <input type="number" value={stockValue} onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                      className="w-20 rounded-sm border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary" />
                  ) : (
                    p.stock
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                    p.stock === 0 ? 'bg-destructive/10 text-destructive' : p.stock < 20 ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {p.stock === 0 ? 'Out' : p.stock < 20 ? 'Low' : 'In Stock'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {editing === p.id ? (
                    <button onClick={() => updateStock(p.id)} className="text-xs font-medium text-primary hover:underline">Save</button>
                  ) : (
                    <button onClick={() => { setEditing(p.id); setStockValue(p.stock); }} className="text-xs font-light text-muted-foreground hover:text-primary">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
