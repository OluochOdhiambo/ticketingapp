import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import TicketsPage from './pages/TicketsPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import CustomersPage from './pages/CustomersPage';
import SelectCustomerPage from './pages/SelectCustomerPage';
import { useCustomerStore } from './store/customerStore';

// Gate the whole flow behind picking a customer first.
function RequireCustomer() {
  const customer = useCustomerStore((s) => s.customer);
  if (!customer) return <Navigate to="/select-customer" replace />;
  return <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="select-customer" element={<SelectCustomerPage />} />
        <Route element={<RequireCustomer />}>
          <Route index element={<TicketsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="success" element={<SuccessPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
