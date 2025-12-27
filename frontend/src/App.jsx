import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Pages
import LandingPage from './pages/auth/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import ClientsPage from './pages/clients/ClientsPage';
import CreateClientPage from './pages/clients/CreateClientPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import EditClientPage from './pages/clients/EditClientPage';
import AdAccountsPage from './pages/ad-accounts/AdAccountsPage';
import CreateAdAccountPage from './pages/ad-accounts/CreateAdAccountPage';
import AdAccountDetailPage from './pages/ad-accounts/AdAccountDetailPage';
import EditAdAccountPage from './pages/ad-accounts/EditAdAccountPage';
import MetricsPage from './pages/metrics/MetricsPage';
import CreateMetricPage from './pages/metrics/CreateMetricPage';
import MetricDetailPage from './pages/metrics/MetricDetailPage';
import EditMetricPage from './pages/metrics/EditMetricPage';
import TopupsPage from './pages/topups/TopupsPage';
import CreateTopupPage from './pages/topups/CreateTopupPage';
import TopupDetailPage from './pages/topups/TopupDetailPage';
import EditTopupPage from './pages/topups/EditTopupPage';
import CustomFieldsPage from './pages/custom-fields/CustomFieldsPage';
import AdminsPage from './pages/admins/AdminsPage';
import CreateAdminPage from './pages/admins/CreateAdminPage';
import AdminDetailPage from './pages/admins/AdminDetailPage';
import PublicPage from './pages/site/PublicPage';
import PageBuilder from './pages/site/PageBuilder';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import LeadsPage from './pages/leads/LeadsPage';
import LeadDetailPage from './pages/leads/LeadDetailPage';
import EditLeadPage from './pages/leads/EditLeadPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard/super-admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />

          {/* Client Management pages */}
          <Route
            path="/clients"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/create"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <CreateClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <ClientDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clients/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']}>
                <EditClientPage />
              </ProtectedRoute>
            }
          />
          {/* Ad Account Management pages */}
          <Route
            path="/ad-accounts"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <AdAccountsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ad-accounts/create"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <CreateAdAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ad-accounts/:id"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <AdAccountDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ad-accounts/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <EditAdAccountPage />
              </ProtectedRoute>
            }
          />
          {/* Metrics Management pages */}
          <Route
            path="/metrics"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <MetricsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/metrics/create"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <CreateMetricPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/metrics/:id"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <MetricDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/metrics/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <EditMetricPage />
              </ProtectedRoute>
            }
          />
          {/* Topup Management pages */}
          <Route
            path="/topups"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <TopupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topups/create"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <CreateTopupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topups/:id"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <TopupDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/topups/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <EditTopupPage />
              </ProtectedRoute>
            }
          />
          {/* Custom Fields Management */}
          <Route
            path="/custom-fields"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CLIENT']}>
                <CustomFieldsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Management pages (SUPER_ADMIN only) */}
          <Route
            path="/admins"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <AdminsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/create"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <CreateAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admins/:id"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <AdminDetailPage />
              </ProtectedRoute>
            }
          />
          {/* Leads Management */}
          <Route
            path="/leads"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN","ADMIN","CLIENT"]}>
                <LeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN","ADMIN","CLIENT"]}>
                <LeadDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN","ADMIN","CLIENT"]}>
                <EditLeadPage />
              </ProtectedRoute>
            }
          />

          {/* Page Builder */}
          <Route
            path="/site/builder"
            element={
              <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
                <PageBuilder />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/p/:slug" element={<PublicPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
