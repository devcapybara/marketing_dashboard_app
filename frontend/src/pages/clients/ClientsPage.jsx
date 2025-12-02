import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchClients();
  }, [searchTerm, statusFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (statusFilter) filters.status = statusFilter;
      
      const response = await clientService.listClients(filters);
      setClients(response.data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err.response?.data?.message || 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (clientId, clientName) => {
    if (!window.confirm(`Are you sure you want to delete "${clientName}"?`)) {
      return;
    }

    try {
      await clientService.deleteClient(clientId);
      fetchClients(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete client');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      ACTIVE: 'bg-green-500/20 text-green-400 border-green-500',
      INACTIVE: 'bg-gray-500/20 text-gray-400 border-gray-500',
      SUSPENDED: 'bg-red-500/20 text-red-400 border-red-500',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs border ${statusColors[status] || statusColors.INACTIVE}`}>
        {status}
      </span>
    );
  };

  const canCreate = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canEdit = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const canView = true; // All roles can view

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

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clients</h1>
            <p className="text-dark-text-muted">Kelola data klien</p>
          </div>
          {canCreate && (
            <button
              onClick={() => navigate('/clients/create')}
              className="btn-primary"
            >
              + Create Client
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, company, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card mb-6 bg-red-500/20 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Clients Table */}
        {clients.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left p-4 font-semibold">Name</th>
                  <th className="text-left p-4 font-semibold">Company</th>
                  <th className="text-left p-4 font-semibold">Email</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Created</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id} className="border-b border-dark-border hover:bg-dark-surface">
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/clients/${client._id}`)}
                        className="text-primary hover:underline font-medium"
                      >
                        {client.name}
                      </button>
                    </td>
                    <td className="p-4 text-dark-text-muted">{client.companyName || '-'}</td>
                    <td className="p-4 text-dark-text-muted">{client.contactEmail || '-'}</td>
                    <td className="p-4">{getStatusBadge(client.status)}</td>
                    <td className="p-4 text-dark-text-muted text-sm">
                      {new Date(client.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/clients/${client._id}`)}
                          className="text-primary hover:text-primary-hover text-sm"
                        >
                          View
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => navigate(`/clients/${client._id}/edit`)}
                            className="text-primary hover:text-primary-hover text-sm"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(client._id, client.name)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-dark-text-muted text-lg mb-2">No clients found</p>
            {canCreate && (
              <button
                onClick={() => navigate('/clients/create')}
                className="btn-primary mt-4"
              >
                Create First Client
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;
