import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { customMetricFieldService } from '../../services/customMetricFieldService';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';
import CreateCustomFieldModal from '../../components/custom-fields/CreateCustomFieldModal';

const CustomFieldsPage = () => {
  const [customFields, setCustomFields] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    clientId: '',
    platform: '',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      fetchClients();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {};
      if (filters.clientId) filterParams.clientId = filters.clientId;
      if (filters.platform) filterParams.platform = filters.platform;

      const response = await customMetricFieldService.listCustomFields(filterParams);
      setCustomFields(response.data || []);
    } catch (err) {
      console.error('Error fetching custom fields:', err);
      setError(err.response?.data?.message || 'Failed to load custom fields');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientService.listClients();
      setClients(response.data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const handleDelete = async (fieldId, fieldName) => {
    if (!window.confirm(`Are you sure you want to delete field "${fieldName}"?`)) {
      return;
    }

    try {
      await customMetricFieldService.deleteCustomField(fieldId);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete custom field');
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchData(); // Refresh list
  };

  const getFieldTypeBadge = (type) => {
    const typeColors = {
      NUMBER: 'bg-blue-500/20 text-blue-400 border-blue-500',
      TEXT: 'bg-green-500/20 text-green-400 border-green-500',
      PERCENTAGE: 'bg-purple-500/20 text-purple-400 border-purple-500',
      CURRENCY: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs border ${typeColors[type] || typeColors.NUMBER}`}>
        {type}
      </span>
    );
  };

  const getPlatformBadge = (platform) => {
    if (platform === 'ALL') {
      return (
        <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500">
          All Platforms
        </span>
      );
    }

    const platformColors = {
      META: 'bg-blue-500/20 text-blue-400 border-blue-500',
      TIKTOK: 'bg-black text-white border-gray-600',
      GOOGLE: 'bg-red-500/20 text-red-400 border-red-500',
      X: 'bg-gray-500/20 text-gray-400 border-gray-500',
      LINKEDIN: 'bg-blue-600/20 text-blue-500 border-blue-600',
      OTHER: 'bg-gray-500/20 text-gray-400 border-gray-500',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs border ${platformColors[platform] || platformColors.OTHER}`}>
        {platform}
      </span>
    );
  };

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
            <h1 className="text-3xl font-bold mb-2">Custom Metric Fields</h1>
            <p className="text-dark-text-muted">Kelola field definitions untuk metrics</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            + Create Custom Field
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && clients.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select
                  value={filters.clientId}
                  onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
                  className="input w-full"
                >
                  <option value="">All Clients</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select
                value={filters.platform}
                onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                className="input w-full"
              >
                <option value="">All Platforms</option>
                <option value="ALL">All Platforms</option>
                <option value="META">Meta</option>
                <option value="TIKTOK">TikTok</option>
                <option value="GOOGLE">Google</option>
                <option value="X">X</option>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="OTHER">Other</option>
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

        {/* Custom Fields Table */}
        {customFields.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left p-4 font-semibold">Field Name</th>
                  <th className="text-left p-4 font-semibold">Field Label</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Platform</th>
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <th className="text-left p-4 font-semibold">Client</th>
                  )}
                  <th className="text-left p-4 font-semibold">Required</th>
                  <th className="text-left p-4 font-semibold">Order</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customFields.map((field) => (
                  <tr key={field._id} className="border-b border-dark-border hover:bg-dark-surface">
                    <td className="p-4 font-mono text-sm">{field.fieldName}</td>
                    <td className="p-4 font-medium">{field.fieldLabel}</td>
                    <td className="p-4">{getFieldTypeBadge(field.fieldType)}</td>
                    <td className="p-4">{getPlatformBadge(field.platform)}</td>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <td className="p-4 text-dark-text-muted">
                        {field.clientId?.name || '-'}
                      </td>
                    )}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs border ${
                        field.isRequired
                          ? 'bg-green-500/20 text-green-400 border-green-500'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500'
                      }`}>
                        {field.isRequired ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4 text-dark-text-muted">{field.displayOrder}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(field._id, field.fieldName)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-dark-text-muted text-lg mb-2">No custom fields found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary mt-4"
            >
              Create First Custom Field
            </button>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <CreateCustomFieldModal
            clients={clients}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleCreateSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CustomFieldsPage;

