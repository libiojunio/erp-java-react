import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ClientesPage } from './pages/ClientesPage';
import { ClienteDetalhesPage } from './pages/ClienteDetalhesPage';
import { EmpresasPage } from './pages/EmpresasPage';
import { EmpresaDetalhesPage } from './pages/EmpresaDetalhesPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        {/* Rotas de Clientes */}
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="clientes/novo" element={<ClienteDetalhesPage />} />
        <Route path="clientes/visualizar/:id" element={<ClienteDetalhesPage />} />
        <Route path="clientes/editar/:id" element={<ClienteDetalhesPage />} />

        {/* Rotas de Empresas (Restritas a Administradores) */}
        <Route
          path="empresas"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <EmpresasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="empresas/novo"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <EmpresaDetalhesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="empresas/visualizar/:id"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <EmpresaDetalhesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="empresas/editar/:id"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <EmpresaDetalhesPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
