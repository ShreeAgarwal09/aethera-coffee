'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { Order } from '@/lib/types';

export function AdminOrders({ orders }: { orders: Order[] }) {
  const [items, setItems] = useState(orders);
  const [expanded, setExpanded] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const statuses = ['pending', 'confirmed', 'roasting', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 className="font-display text-4xl text-foreground">Orders</h1>
      <p className="mt-2 text-sm font-light text-muted-foreground">{items.length} orders</p>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-sm border border-border bg-card p-12 text-center">
            <p className="text-sm font-light text-muted-foreground">No orders yet.</p>
          </div>
        ) : (
          items.map((order) => (
            <div key={order.id} className="rounded-sm border border-border bg-card">
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="flex w-full items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">#{order.id.slice(0, 8)}</span>
                  <span className="text-xs font-light text-muted-foreground">{order.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="rounded-sm border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="text-sm font-medium text-foreground">${(order.total / 100).toFixed(2)}</span>
                  {expanded === order.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>
              {expanded === order.id && (
                <div className="border-t border-border p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Shipping</p>
                      <p className="mt-1 text-foreground">{order.shipping_name}</p>
                      <p className="text-xs font-light text-muted-foreground">{order.shipping_address}</p>
                      <p className="text-xs font-light text-muted-foreground">{order.shipping_city}, {order.shipping_postal_code}</p>
                      <p className="text-xs font-light text-muted-foreground">{order.shipping_country}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Details</p>
                      <p className="mt-1 text-xs font-light text-muted-foreground">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-xs font-light text-muted-foreground">Payment: {order.payment_status}</p>
                      {order.coupon_code && <p className="text-xs font-light text-muted-foreground">Coupon: {order.coupon_code}</p>}
                      {order.discount > 0 && <p className="text-xs font-light text-primary">Discount: -${(order.discount / 100).toFixed(2)}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
