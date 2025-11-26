import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/AdminTheme.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import CompanyInfo from './pages/Company/CompanyInfo';
import HeroList from './pages/Hero/HeroList';
import ServiceList from './pages/Service/ServiceList';
import ValueList from './pages/Value/ValueList';
import ProductList from './pages/Product/ProductList';
import PartnerList from './pages/Partner/PartnerList';
import ClientList from './pages/Client/ClientList';
import NewsList from './pages/News/NewsList';
import EventList from './pages/Event/EventList';
import CareerList from './pages/Career/CareerList';
import ContactList from './pages/Contact/ContactList';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/company"
            element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <DashboardLayout>
                  <CompanyInfo />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/heroes"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <HeroList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/services"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ServiceList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/values"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ValueList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/products"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProductList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/partners"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PartnerList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/clients"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ClientList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/news"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <NewsList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/events"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EventList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/careers"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CareerList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/contacts"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ContactList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;