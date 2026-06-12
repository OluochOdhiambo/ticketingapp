export const customerName = (id) => {
  const c = CUSTOMERS.find((x) => x.id === id);
  return c ? `${c.firstname} ${c.lastname}` : id;
};

export const CUSTOMERS = [
    { id: '3CD9FC3B-6FAB-41BD-AD3C-08DEC7C308E8', code: 'CUST001', firstname: 'John', lastname: 'Doe', email: 'john.doe@email.com', phoneNumber: '+254500000001' },
    { id: '88258A8D-C649-4E25-AD3D-08DEC7C308E8', code: 'CUST002', firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@email.com', phoneNumber: '+254500000002' },
    { id: '29082AA1-34AB-45A6-AD3E-08DEC7C308E8', code: 'CUST003', firstname: 'Michael', lastname: 'Johnson', email: 'michael.johnson@email.com', phoneNumber: '+254500000003' },
];
