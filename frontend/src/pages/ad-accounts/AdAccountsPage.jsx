import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adAccountService } from '../../services/adAccountService';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';

const AdAccountsPage = () => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    clientId: '',
    platform: '',
    isActive: '',
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch clients for filter (only for SUPER_ADMIN and ADMIN)
      if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
        try {
          const clientsResponse = await clientService.listClients();
          setClients(clientsResponse.data || []);
        } catch (err) {
          // Ignore error if can't fetch clients
        }
      }

      // Fetch ad accounts
      const filterParams = {};
      if (filters.clientId) filterParams.clientId = filters.clientId;
      if (filters.platform) filterParams.platform = filters.platform;
      if (filters.isActive !== '') filterParams.isActive = filters.isActive === 'true';

      const response = await adAccountService.listAdAccounts(filterParams);
      setAdAccounts(response.data || []);
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
      setError(err.response?.data?.message || 'Failed to load ad accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adAccountId, accountName) => {
    if (!window.confirm(`Are you sure you want to delete "${accountName}"?`)) {
      return;
    }

    try {
      await adAccountService.deleteAdAccount(adAccountId);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete ad account');
    }
  };

  const getPlatformBadge = (platform) => {
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

  const canCreate = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'CLIENT';
  const canEdit = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'CLIENT';
  const canDelete = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'CLIENT';

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
            <h1 className="text-3xl font-bold mb-2">Ad Accounts</h1>
            <p className="text-dark-text-muted">Kelola akun iklan per platform</p>
          </div>
          {canCreate && (
            <button
              onClick={() => navigate('/ad-accounts/create')}
              className="btn-primary"
            >
              + Create Ad Account
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="META">Meta</option>
                <option value="TIKTOK">TikTok</option>
                <option value="GOOGLE">Google</option>
                <option value="X">X (Twitter)</option>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filters.isActive}
                onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
                className="input w-full"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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

        {/* Ad Accounts Table */}
        {adAccounts.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left p-4 font-semibold">Account Name</th>
                  <th className="text-left p-4 font-semibold">Platform</th>
                  <th className="text-left p-4 font-semibold">Account ID</th>
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <th className="text-left p-4 font-semibold">Client</th>
                  )}
                  <th className="text-left p-4 font-semibold">Currency</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adAccounts.map((account) => (
                  <tr key={account._id} className="border-b border-dark-border hover:bg-dark-surface">
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/ad-accounts/${account._id}`)}
                        className="text-primary hover:underline font-medium"
                      >
                        {account.accountName}
                      </button>
                    </td>
                    <td className="p-4">{getPlatformBadge(account.platform)}</td>
                    <td className="p-4 text-dark-text-muted font-mono text-sm">{account.accountId}</td>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <td className="p-4 text-dark-text-muted">
                        {account.clientId?.name || '-'}
                      </td>
                    )}
                    <td className="p-4 text-dark-text-muted">{account.currency}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs border ${
                        account.isActive
                          ? 'bg-green-500/20 text-green-400 border-green-500'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500'
                      }`}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/ad-accounts/${account._id}`)}
                          className="text-primary hover:text-primary-hover text-sm"
                        >
                          View
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => navigate(`/ad-accounts/${account._id}/edit`)}
                            className="text-primary hover:text-primary-hover text-sm"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(account._id, account.accountName)}
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
            <p className="text-dark-text-muted text-lg mb-2">No ad accounts found</p>
            {canCreate && (
              <button
                onClick={() => navigate('/ad-accounts/create')}
                className="btn-primary mt-4"
              >
                Create First Ad Account
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdAccountsPage;
