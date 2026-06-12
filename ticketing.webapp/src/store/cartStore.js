import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      currentOrderId: null,
      currentOrder: null,
      lastOrder: null,

      addItem: (ticket, orderId = null) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === ticket.id);
          const currentOrderId = state.currentOrderId ?? orderId;

          if (existing) {
            return {
              currentOrderId,
              items: state.items.map((item) =>
                item.id === ticket.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            currentOrderId,
            items: [
              ...state.items,
              {
                id: ticket.id,
                name: ticket.name,
                price: ticket.price,
                currency: ticket.currency,
                quantity: 1,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((item) => item.id !== id);
          return {
            items,
            currentOrderId: items.length === 0 ? null : state.currentOrderId,
            currentOrder: items.length === 0 ? null : state.currentOrder,
          };
        }),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decrement: (id) =>
        set((state) => {
          const items = state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0);

          return {
            items,
            currentOrderId: items.length === 0 ? null : state.currentOrderId,
            currentOrder: items.length === 0 ? null : state.currentOrder,
          };
        }),

      setCurrentOrderId: (orderId) => set({ currentOrderId: orderId }),

      setCurrentOrder: (order) =>
        set({
          currentOrder: order,
          currentOrderId: order?.id ?? null,
        }),

      clearCart: () => set({ items: [], currentOrderId: null, currentOrder: null }),

      setLastOrder: (order) => set({ lastOrder: order }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalCost: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'ticket-cart',
      partialize: (state) => ({
        items: state.items,
        currentOrderId: state.currentOrderId,
        currentOrder: state.currentOrder,
        lastOrder: state.lastOrder,
      }),
    }
  )
);
