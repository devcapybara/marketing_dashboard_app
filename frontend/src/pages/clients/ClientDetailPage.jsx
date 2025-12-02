import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    fetchClient();
  }, [id]);

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

  const canEdit = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

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
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailPage;

