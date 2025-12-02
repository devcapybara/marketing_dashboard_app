import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { listAdmins } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const AdminsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await listAdmins();
        const data = Array.isArray(res?.data) ? res.data : res; // handle service returning res.data
        setAdmins(data || []);
      } catch (err) {
        setError(err?.message || 'Failed to load admins');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const canCreate = user?.role === 'SUPER_ADMIN';

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="alert-error">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administrators</h1>
            <p className="text-dark-text-muted">Kelola administrator (SUPER_ADMIN only)</p>
          </div>
          {canCreate && (
            <button onClick={() => navigate('/admins/create')} className="btn-primary">
              + Create Admin
            </button>
          )}
        </div>

        <div className="card">
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Managed Clients</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-dark-text-muted" colSpan={6}>
                      Belum ada admin.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin._id} className="border-t border-dark-border">
                      <td className="px-4 py-3">{admin.name}</td>
                      <td className="px-4 py-3">{admin.email}</td>
                      <td className="px-4 py-3"><span className="badge">{admin.role}</span></td>
                      <td className="px-4 py-3">
                        {Array.isArray(admin.managedClientIds) && admin.managedClientIds.length > 0
                          ? admin.managedClientIds.map((c) => c.name || c.companyName || c._id).join(', ')
                          : '-'}
                      </td>
                      <td className="px-4 py-3">{admin.isActive ? 'Active' : 'Inactive'}</td>
                      <td className="px-4 py-3">
                        <button
                          className="btn-secondary"
                          onClick={() => navigate(`/admins/${admin._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminsPage;