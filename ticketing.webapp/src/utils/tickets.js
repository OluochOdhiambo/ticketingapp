/** Dummy ticket catalogue (no database — static seed data). */
export const CURRENCY = 'AED';

/** Resolve a ticket's display name from its id (OrderItemModel only carries ticketId). */
export const ticketName = (id) => TICKETS.find((t) => t.id === id)?.name ?? id;

export const TICKETS = [
  {
    id: 'gold',
    name: 'Gold',
    price: 100,
    currency: CURRENCY,
    quota: 50,
    perks: ['General admission', 'Standard seating', 'Event programme'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 200,
    currency: CURRENCY,
    quota: 30,
    perks: ['Priority entry', 'Reserved seating', 'Welcome drink'],
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 500,
    currency: CURRENCY,
    quota: 10,
    perks: ['Backstage access', 'Front-row seating', 'Lounge & catering'],
  },
];
