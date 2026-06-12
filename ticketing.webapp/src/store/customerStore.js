import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCustomerStore = create(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
      clearCustomer: () => set({ customer: null }),
    }),
    { name: 'selected-customer' }
  )
);
