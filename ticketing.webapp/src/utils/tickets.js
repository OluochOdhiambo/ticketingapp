/** Dummy ticket catalogue used as a fallback for legacy mock screens. */
export const CURRENCY = 'AED';

const DEFAULT_PERKS = {
  gold: ['General admission', 'Standard seating', 'Event programme'],
  premium: ['Priority entry', 'Reserved seating', 'Welcome drink'],
  vip: ['Backstage access', 'Front-row seating', 'Lounge & catering'],
};

export const TICKETS = [
  {
    id: 'gold',
    name: 'Gold',
    price: 100,
    currency: CURRENCY,
    quota: 50,
    perks: DEFAULT_PERKS.gold,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 200,
    currency: CURRENCY,
    quota: 30,
    perks: DEFAULT_PERKS.premium,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 500,
    currency: CURRENCY,
    quota: 10,
    perks: DEFAULT_PERKS.vip,
  },
];

/** Resolve a ticket's display name from its id (OrderItemModel only carries ticketId). */
export const ticketName = (id) =>
  TICKETS.find((t) => t.id === id)?.name ?? id;
