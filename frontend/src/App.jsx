import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import CompanyInfo from './components/CompanyInfo';
import DashboardLayoutAdmin from './components/DashboardLayoutAdmin';
import DashboardLayoutEmployee from './components/DashboardLayoutEmployee';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeProductList from './components/EmployeeProductList';
import InventoryChart from './components/InventoryChart';
import RealizarVenta from './components/RealizarVenta';
import Boleta from './components/Boleta';
import VentaExitosaModal from './components/VentaExitosaModal';
import HistorialVentasEmpleado from './components/HistorialVentasEmpleado';
import SalesChart from './components/SalesChart'; // 👈 Nuevo componente importado

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [isVentaModalOpen, setVentaModalOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const savedRole = sessionStorage.getItem('userRole');

    if (token && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }
  }, []);

  const handleLogin = (userRole, token) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userRole', userRole);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setRole('');
  };

  const handleVentaModalOpen = () => setVentaModalOpen(true);
  const handleVentaModalClose = () => setVentaModalOpen(false);

  return (
    <Router>
      <div style={{ height: '100vh', overflow: 'hidden' }}>
        <Routes>
          {!isAuthenticated && (
            <>
              <Route path="/login" element={<Login login={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}

          {isAuthenticated && (
            <>
              <Route path="/" element={<Navigate to={role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} />} />

              {/* Admin Routes */}
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} role="admin">
                    <DashboardLayoutAdmin role={role} onLogout={handleLogout} />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="employees" element={<EmployeeList />} />
                <Route path="add-employee" element={<AddEmployee />} />
                <Route path="settings/company" element={<CompanyInfo />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/inventory" element={<InventoryChart />} />
                <Route path="stats" element={<SalesChart />} /> {/* 👈 Nueva ruta añadida */}
              </Route>

              {/* Empleado Routes */}
              <Route
                path="/employee-dashboard"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated} role="employee">
                    <DashboardLayoutEmployee role={role} onLogout={handleLogout} />
                  </ProtectedRoute>
                }
              >
                <Route path="products" element={<EmployeeProductList />} />
                <Route path="sales/new" element={<RealizarVenta />} />
                <Route index element={<EmployeeDashboard />} />
                <Route path="sales" element={<HistorialVentasEmpleado />} />
              </Route>

              {/* Rutas para la venta y boleta */}
              <Route path="/boleta" element={<Boleta />} />
              <Route path="/venta-exitosa" element={<VentaExitosaModal open={isVentaModalOpen} onClose={handleVentaModalClose} />} />

              {/* Ruta por defecto */}
              <Route path="*" element={<Navigate to={role === 'admin' ? '/admin-dashboard' : '/employee-dashboard'} />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
