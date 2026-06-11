import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart store (persisted to localStorage).
 *
 * items: [{ id, name, price, currency, quantity }]
 * lastOrder: the most recent successful checkout result (for the Success page).
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      lastOrder: null,

      // Add a ticket to the cart, or bump its quantity if already present.
      addItem: (ticket) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === ticket.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === ticket.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
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

      // Remove a ticket line entirely.
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      increment: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      // Decrement quantity; remove the line if it would drop to zero.
      decrement: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      setLastOrder: (order) => set({ lastOrder: order }),

      // Derived selectors.
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalCost: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'ticket-cart',
      // Only persist the cart contents, not the volatile selectors.
      partialize: (state) => ({ items: state.items, lastOrder: state.lastOrder }),
    }
  )
);
