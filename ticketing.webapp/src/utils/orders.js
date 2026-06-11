/**
 * Dummy order seed data — mirrors OrderService / OrderModel in order.proto.
 *
 * OrderModel:     { id, customerId, items: OrderItemModel[], totalPrice, status }
 * OrderItemModel: { id, orderId, ticketId, orderedQuantity, currencyCode, unitPrice, lineTotal }
 *
 * Statuses used across the app: 'Pending' | 'Paid' | 'Cancelled'.
 */
import { CURRENCY, TICKETS } from './tickets';

const priceOf = (ticketId) => TICKETS.find((t) => t.id === ticketId)?.price ?? 0;

// Build a fully-shaped OrderModel from a compact spec.
export function makeOrder({ id, customerId, status, lines }) {
  const items = lines.map((line, index) => {
    const unitPrice = priceOf(line.ticketId);
    return {
      id: `${id}-L${index + 1}`,
      orderId: id,
      ticketId: line.ticketId,
      orderedQuantity: line.orderedQuantity,
      currencyCode: CURRENCY,
      unitPrice,
      lineTotal: unitPrice * line.orderedQuantity,
    };
  });
  const totalPrice = items.reduce((sum, i) => sum + i.lineTotal, 0);
  return { id, customerId, items, totalPrice, status };
}

export const SEED_ORDERS = [
  makeOrder({
    id: 'ord-1001',
    customerId: 'c-001',
    status: 'Paid',
    lines: [
      { ticketId: 'vip', orderedQuantity: 1 },
      { ticketId: 'premium', orderedQuantity: 2 },
    ],
  }),
  makeOrder({
    id: 'ord-1002',
    customerId: 'c-003',
    status: 'Paid',
    lines: [{ ticketId: 'gold', orderedQuantity: 4 }],
  }),
  makeOrder({
    id: 'ord-1003',
    customerId: 'c-005',
    status: 'Pending',
    lines: [{ ticketId: 'premium', orderedQuantity: 1 }],
  }),
  makeOrder({
    id: 'ord-1004',
    customerId: 'c-002',
    status: 'Cancelled',
    lines: [{ ticketId: 'vip', orderedQuantity: 2 }],
  }),
  makeOrder({
    id: 'ord-1005',
    customerId: 'c-007',
    status: 'Paid',
    lines: [
      { ticketId: 'gold', orderedQuantity: 2 },
      { ticketId: 'vip', orderedQuantity: 1 },
    ],
  }),
  makeOrder({
    id: 'ord-1006',
    customerId: 'c-009',
    status: 'Pending',
    lines: [{ ticketId: 'gold', orderedQuantity: 3 }],
  }),
  makeOrder({
    id: 'ord-1007',
    customerId: 'c-010',
    status: 'Paid',
    lines: [{ ticketId: 'premium', orderedQuantity: 5 }],
  }),
];
