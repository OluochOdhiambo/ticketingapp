export const customerName = (id) => {
  const c = CUSTOMERS.find((x) => x.id === id);
  return c ? `${c.firstname} ${c.lastname}` : id;
};

export const CUSTOMERS = [
  { id: 'c-001', code: 'CUST-1001', firstname: 'Amira', lastname: 'Hassan', email: 'amira.hassan@example.com', phoneNumber: '+971 50 123 4567' },
  { id: 'c-002', code: 'CUST-1002', firstname: 'Omar', lastname: 'Khalid', email: 'omar.khalid@example.com', phoneNumber: '+971 50 234 5678' },
  { id: 'c-003', code: 'CUST-1003', firstname: 'Layla', lastname: 'Ahmed', email: 'layla.ahmed@example.com', phoneNumber: '+971 50 345 6789' },
];
