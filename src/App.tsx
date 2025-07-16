import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { RoleSelection } from './components/RoleSelection';
import { ClientDashboard } from './pages/ClientDashboard';
import { LabelerDashboard } from './pages/LabelerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E2A] via-[#0A0E2A] to-[#1a1f4a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00FFB2]/30 border-t-[#00FFB2] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to Internet Identity...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <LoginPage />;
  }

  if (!authState.user?.role) {
    return <RoleSelection />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/dashboard/${authState.user.role}`} replace />} />
      <Route 
        path="/dashboard/client" 
        element={authState.user.role === 'client' ? <ClientDashboard /> : <Navigate to={`/dashboard/${authState.user.role}`} replace />} 
      />
      <Route 
        path="/dashboard/labeler" 
        element={authState.user.role === 'labeler' ? <LabelerDashboard /> : <Navigate to={`/dashboard/${authState.user.role}`} replace />} 
      />
      <Route 
        path="/dashboard/admin" 
        element={authState.user.role === 'admin' ? <AdminDashboard /> : <Navigate to={`/dashboard/${authState.user.role}`} replace />} 
      />
      <Route path="*" element={<Navigate to={`/dashboard/${authState.user.role}`} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;