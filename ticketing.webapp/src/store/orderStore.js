import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SEED_ORDERS } from '../utils/orders';

/**
 * In-memory order "database" standing in for the ASP.NET gRPC OrderService.
 * Seeded with dummy orders and persisted so created orders survive a reload
 * and show up in the paginated Orders list / Order detail pages.
 */
export const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      updateOrder: (id, patch) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)),
        })),

      getOrder: (id) => get().orders.find((o) => o.id === id) ?? null,
    }),
    { name: 'ticket-orders' }
  )
);
