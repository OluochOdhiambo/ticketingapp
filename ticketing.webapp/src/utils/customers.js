/**
 * Dummy customers — mirrors CustomerService / CustomerModel in customer.proto.
 * CustomerModel: { id, code, firstname, lastname, email, phoneNumber }
 */
/** Resolve a customer's full name from their id (OrderModel only carries customerId). */
export const customerName = (id) => {
  const c = CUSTOMERS.find((x) => x.id === id);
  return c ? `${c.firstname} ${c.lastname}` : id;
};

export const CUSTOMERS = [
  { id: 'c-001', code: 'CUST-1001', firstname: 'Amira', lastname: 'Hassan', email: 'amira.hassan@example.com', phoneNumber: '+971 50 123 4567' },
  { id: 'c-002', code: 'CUST-1002', firstname: 'Omar', lastname: 'Khalid', email: 'omar.khalid@example.com', phoneNumber: '+971 50 234 5678' },
  { id: 'c-003', code: 'CUST-1003', firstname: 'Layla', lastname: 'Ahmed', email: 'layla.ahmed@example.com', phoneNumber: '+971 50 345 6789' },
  { id: 'c-004', code: 'CUST-1004', firstname: 'Yusuf', lastname: 'Rahman', email: 'yusuf.rahman@example.com', phoneNumber: '+971 50 456 7890' },
  { id: 'c-005', code: 'CUST-1005', firstname: 'Fatima', lastname: 'Saleh', email: 'fatima.saleh@example.com', phoneNumber: '+971 50 567 8901' },
  { id: 'c-006', code: 'CUST-1006', firstname: 'Khalid', lastname: 'Nasser', email: 'khalid.nasser@example.com', phoneNumber: '+971 50 678 9012' },
  { id: 'c-007', code: 'CUST-1007', firstname: 'Noor', lastname: 'Ibrahim', email: 'noor.ibrahim@example.com', phoneNumber: '+971 50 789 0123' },
  { id: 'c-008', code: 'CUST-1008', firstname: 'Tariq', lastname: 'Mansour', email: 'tariq.mansour@example.com', phoneNumber: '+971 50 890 1234' },
  { id: 'c-009', code: 'CUST-1009', firstname: 'Salma', lastname: 'Aziz', email: 'salma.aziz@example.com', phoneNumber: '+971 50 901 2345' },
  { id: 'c-010', code: 'CUST-1010', firstname: 'Hamza', lastname: 'Farouk', email: 'hamza.farouk@example.com', phoneNumber: '+971 50 012 3456' },
  { id: 'c-011', code: 'CUST-1011', firstname: 'Mariam', lastname: 'Said', email: 'mariam.said@example.com', phoneNumber: '+971 52 111 2222' },
  { id: 'c-012', code: 'CUST-1012', firstname: 'Bilal', lastname: 'Hadid', email: 'bilal.hadid@example.com', phoneNumber: '+971 52 222 3333' },
  { id: 'c-013', code: 'CUST-1013', firstname: 'Zaina', lastname: 'Othman', email: 'zaina.othman@example.com', phoneNumber: '+971 52 333 4444' },
  { id: 'c-014', code: 'CUST-1014', firstname: 'Adam', lastname: 'Sultan', email: 'adam.sultan@example.com', phoneNumber: '+971 52 444 5555' },
];
