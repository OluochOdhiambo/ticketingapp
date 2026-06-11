import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * The customer currently acting on the site. Selecting a customer is the first
 * step of the flow — orders are created on their behalf. Persisted so the
 * choice survives a reload.
 */
export const useCustomerStore = create(
  persist(
    (set) => ({
      customer: null, // selected CustomerModel
      setCustomer: (customer) => set({ customer }),
      clearCustomer: () => set({ customer: null }),
    }),
    { name: 'selected-customer' }
  )
);
