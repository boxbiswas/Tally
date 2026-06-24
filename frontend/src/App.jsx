import React from 'react'
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompanyList from './pages/CompanyList';
import CompanyForm from './pages/CompanyForm';


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

      {/* Protected Routes */}
      <Route path="/companies" element={<ProtectedRoute><CompanyList /></ProtectedRoute>} />
      <Route path="/company/create" element={<ProtectedRoute><CompanyForm /></ProtectedRoute>} />
      <Route path="/company/edit/:id" element={<ProtectedRoute><CompanyForm /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Redirect any unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


export default App