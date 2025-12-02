import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';
import { listAdmins, assignClientToAdmin, unassignClientFromAdmin } from '../../services/userService';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [adminsError, setAdminsError] = useState(null);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchClient();
  }, [id]);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      fetchAdmins();
    }
  }, [user, id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientService.getClientById(id);
      setClient(response.data);
    } catch (err) {
      console.error('Error fetching client:', err);
      setError(err.response?.data?.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      setAdminsError(null);
      const res = await listAdmins();
      setAdmins(res.data || []);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setAdminsError(err.response?.data?.message || 'Failed to load admins');
    } finally {
      setAdminsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${client.name}"?`)) {
      return;
    }

    try {
      await clientService.deleteClient(id);
      navigate('/clients');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete client');
    }
  };

  const handleAssign = async () => {
    if (!selectedAdminId) return;
    try {
      setAssigning(true);
      await assignClientToAdmin(selectedAdminId, id);
      await fetchAdmins();
      setSelectedAdminId('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign admin');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (adminId) => {
    if (!window.confirm('Unassign admin dari klien ini?')) return;
    try {
      setAssigning(true);
      await unassignClientFromAdmin(adminId, id);
      await fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unassign admin');
    } finally {
      setAssigning(false);
    }
  };

  const canEdit = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canManageAdmins = user?.role === 'SUPER_ADMIN';

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

  if (error || !client) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="card">
            <div className="text-red-400">
              <p className="font-semibold mb-2">Error loading client</p>
              <p className="text-sm">{error || 'Client not found'}</p>
              <button
                onClick={() => navigate('/clients')}
                className="btn-primary mt-4"
              >
                Back to Clients
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      ACTIVE: 'bg-green-500/20 text-green-400 border-green-500',
      INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500',
      SUSPENDED: 'bg-red-500/20 text-red-400 border-red-500',
    };

    return (
      <span className={`px-3 py-1 rounded text-sm border ${statusColors[status] || statusColors.INACTIVE}`}>
        {status}
      </span>
    );
  };

  const assignedAdmins = admins.filter((admin) =>
    (admin.managedClientIds || []).some((mc) => (mc?._id || mc)?.toString() === id.toString())
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/clients')}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Clients
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{client.name}</h1>
              <p className="text-dark-text-muted">Client details</p>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => navigate(`/clients/${id}/edit`)}
                  className="btn-secondary"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="btn-secondary text-red-400 border-red-400 hover:bg-red-500/20"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-text-muted">Client Name</label>
                <p className="font-medium">{client.name}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Company Name</label>
                <p className="font-medium">{client.companyName || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Contact Email</label>
                <p className="font-medium">{client.contactEmail || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Status</label>
                <div className="mt-1">{getStatusBadge(client.status)}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-text-muted">Created At</label>
                <p className="font-medium">
                  {new Date(client.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Updated At</label>
                <p className="font-medium">
                  {new Date(client.updatedAt).toLocaleString('id-ID')}
                </p>
              </div>
              {client.createdBy && (
                <div>
                  <label className="text-sm text-dark-text-muted">Created By</label>
                  <p className="font-medium">
                    {client.createdBy.name || client.createdBy.email || '-'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {canManageAdmins && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Assign Admin ke Klien</h2>
              {adminsLoading ? (
                <div className="flex items-center justify-center min-h-[120px]">
                  <LoadingSpinner />
                </div>
              ) : adminsError ? (
                <p className="text-red-400">{adminsError}</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pilih Admin</label>
                    <select
                      value={selectedAdminId}
                      onChange={(e) => setSelectedAdminId(e.target.value)}
                      className="input w-full"
                    >
                      <option value="">-- Pilih Admin --</option>
                      {admins.map((admin) => (
                        <option key={admin._id} value={admin._id}>
                          {admin.name || admin.email} {admin.isActive === false ? '(inactive)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={!selectedAdminId || assigning}
                    onClick={handleAssign}
                    className={`btn-primary ${assigning ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {assigning ? 'Assigning...' : 'Assign Admin'}
                  </button>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Admin yang Mengelola Klien Ini</h2>
              {adminsLoading ? (
                <div className="flex items-center justify-center min-h-[120px]">
                  <LoadingSpinner />
                </div>
              ) : assignedAdmins.length > 0 ? (
                <ul className="space-y-2">
                  {assignedAdmins.map((admin) => (
                    <li key={admin._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{admin.name || admin.email}</p>
                        <p className="text-sm text-dark-text-muted">Last login: {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString('id-ID') : '-'}</p>
                      </div>
                      <button
                        onClick={() => handleUnassign(admin._id)}
                        className="btn-secondary text-red-400 border-red-400 hover:bg-red-500/20"
                      >
                        Unassign
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-dark-text-muted">Belum ada admin yang mengelola klien ini.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailPage;

