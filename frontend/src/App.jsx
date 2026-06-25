import React from 'react'
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

// Importing pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompanyList from './pages/CompanyList';
import CompanyForm from './pages/CompanyForm';
import LedgerList from './pages/LedgerList';
import LedgerForm from './pages/LedgerForm';
import ItemList from './pages/ItemList';
import ItemForm from './pages/ItemForm';
import PurchaseVoucherForm from './pages/PurchaseVoucherForm';
import SalesVoucherForm from './pages/SalesVoucherForm';
import VoucherSelection from './pages/VoucherSelection';
import Reports from './pages/Reports';
import PrintInvoice from './pages/PrintInvoice';

// Layout
import MainLayout from './components/layout/MainLayout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}


function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes (No Layout) */}
      <Route path="/companies" element={<ProtectedRoute><CompanyList /></ProtectedRoute>} />
      <Route path="/company/create" element={<ProtectedRoute><CompanyForm /></ProtectedRoute>} />
      <Route path="/company/edit/:id" element={<ProtectedRoute><CompanyForm /></ProtectedRoute>} />

      {/* Internal Application Routes (Wrapped in MainLayout) */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Ledger Routes */}
        <Route path="/ledgers" element={<LedgerList />} />
        <Route path="/ledgers/create" element={<LedgerForm />} />
        <Route path="/ledgers/edit/:id" element={<LedgerForm />} />

        {/* Item Routes / Stock Item Routes */}
        <Route path="/inventory" element={<ItemList />} />
        <Route path="/inventory/create" element={<ItemForm />} />
        <Route path="/inventory/edit/:id" element={<ItemForm />} />

        {/* Voucher Routes */}
        <Route path="/vouchers" element={<VoucherSelection />} />
        <Route path="/vouchers/purchase" element={<PurchaseVoucherForm />} />
        <Route path="/vouchers/sales" element={<SalesVoucherForm />} />


        <Route path="/reports" element={<Reports />} />
        <Route path="/vouchers/sales/print/:id" element={<PrintInvoice />} />
      </Route>

      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App