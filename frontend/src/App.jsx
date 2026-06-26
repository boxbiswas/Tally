import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

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
  const toastToneClasses = {
    success: 'border-green-400/30 bg-green-500/10 text-green-100 shadow-green-950/30',
    error: 'border-red-400/30 bg-red-500/10 text-red-100 shadow-red-950/30',
    warning: 'border-amber-400/30 bg-amber-500/10 text-amber-100 shadow-amber-950/30',
    info: 'border-blue-400/30 bg-blue-500/10 text-blue-100 shadow-blue-950/30',
    default: 'border-blue-400/30 bg-blue-500/10 text-blue-100 shadow-blue-950/30',
  };

  return (
    <>
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
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="pointer-events-none fixed right-4 top-4 z-9999 flex w-[min(92vw,24rem)] flex-col items-stretch"
        toastClassName={({ type }) => [
          'pointer-events-auto relative mb-3 min-h-0 overflow-hidden rounded-2xl border px-4 py-3 backdrop-blur-2xl shadow-2xl',
          'bg-white/10 text-sm font-medium ring-1 ring-white/10',
          toastToneClasses[type] || toastToneClasses.default,
        ].join(' ')}
        bodyClassName={() => 'm-0 flex items-center gap-3 p-0 leading-snug'}
        closeButton={false}
      />
    </>
  );
}

export default App
