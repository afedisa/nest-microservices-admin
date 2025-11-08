import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OrganizationsPage from './pages/OrganizationsPage';
import EstablishmentsPage from './pages/EstablishmentsPage';
import UsersPage from './pages/UsersPage';
import OrganizationFormPage from './pages/OrganizationFormPage';
import EstablishmentFormPage from './pages/EstablishmentFormPage';
import UserFormPage from './pages/UserFormPage';
import OrganizationDetailPage from './pages/OrganizationDetailPage';
import EstablishmentDetailPage from './pages/EstablishmentDetailPage';
import UserDetailPage from './pages/UserDetailPage';
import StatisticsPage from './pages/StatisticsPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#10B981',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: '#EF4444',
                },
              },
            }}
          />
          
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="organizations" element={<OrganizationsPage />} />
              <Route path="organizations/:id" element={<OrganizationDetailPage />} />
              <Route path="organizations/new" element={<OrganizationFormPage />} />
              <Route path="organizations/:id/edit" element={<OrganizationFormPage />} />
              <Route path="establishments" element={<EstablishmentsPage />} />
              <Route path="establishments/:id" element={<EstablishmentDetailPage />} />
              <Route path="establishments/new" element={<EstablishmentFormPage />} />
              <Route path="establishments/:id/edit" element={<EstablishmentFormPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="users/new" element={<UserFormPage />} />
              <Route path="users/:id/edit" element={<UserFormPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Configuración</h1><p>Página en construcción...</p></div>} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
