import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { metricsService } from '../../services/metricsService';
import { clientService } from '../../services/clientService';
import { adAccountService } from '../../services/adAccountService';
import { useAuth } from '../../context/AuthContext';

const MetricsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [clients, setClients] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    clientId: '',
    adAccountId: '',
    platform: '',
    dateFrom: '',
    dateTo: '',
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      fetchClients();
    }
    fetchAdAccounts();
  }, [user, filters.clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {};
      if (filters.clientId) filterParams.clientId = filters.clientId;
      if (filters.adAccountId) filterParams.adAccountId = filters.adAccountId;
      if (filters.platform) filterParams.platform = filters.platform;
      if (filters.dateFrom) filterParams.dateFrom = filters.dateFrom;
      if (filters.dateTo) filterParams.dateTo = filters.dateTo;

      const response = await metricsService.listDailyMetrics(filterParams);
      setMetrics(response.data || []);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.response?.data?.message || 'Failed to load metrics');
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

  const fetchAdAccounts = async () => {
    try {
      const filterParams = {};
      if (filters.clientId) filterParams.clientId = filters.clientId;
      
      const response = await adAccountService.listAdAccounts(filterParams);
      setAdAccounts(response.data || []);
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
    }
  };

  const handleDelete = async (metricId, date) => {
    if (!window.confirm(`Are you sure you want to delete metric for ${new Date(date).toLocaleDateString('id-ID')}?`)) {
      return;
    }

    try {
      await metricsService.deleteDailyMetric(metricId);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete metric');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
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
            <h1 className="text-3xl font-bold mb-2">Daily Metrics</h1>
            <p className="text-dark-text-muted">Kelola data performa iklan harian</p>
          </div>
          {canCreate && (
            <button
              onClick={() => navigate('/metrics/create')}
              className="btn-primary"
            >
              + Input Metrics
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && clients.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select
                  value={filters.clientId}
                  onChange={(e) => {
                    setFilters({ ...filters, clientId: e.target.value, adAccountId: '' });
                  }}
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
              <label className="block text-sm font-medium mb-2">Ad Account</label>
              <select
                value={filters.adAccountId}
                onChange={(e) => setFilters({ ...filters, adAccountId: e.target.value })}
                className="input w-full"
              >
                <option value="">All Ad Accounts</option>
                {adAccounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.accountName} ({account.platform})
                  </option>
                ))}
              </select>
            </div>
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
                <option value="X">X</option>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card mb-6 bg-red-500/20 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Metrics Table */}
        {metrics.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Platform</th>
                  <th className="text-left p-4 font-semibold">Ad Account</th>
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <th className="text-left p-4 font-semibold">Client</th>
                  )}
                  <th className="text-right p-4 font-semibold">Spend</th>
                  <th className="text-right p-4 font-semibold">Revenue</th>
                  <th className="text-right p-4 font-semibold">ROAS</th>
                  <th className="text-right p-4 font-semibold">Impressions</th>
                  <th className="text-right p-4 font-semibold">Clicks</th>
                  <th className="text-right p-4 font-semibold">Leads</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => {
                  const roas = metric.spend > 0 ? (metric.revenue / metric.spend).toFixed(2) : '0.00';
                  return (
                    <tr key={metric._id} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="p-4">
                        {new Date(metric.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4">{getPlatformBadge(metric.platform)}</td>
                      <td className="p-4 text-dark-text-muted">
                        {metric.adAccountId?.accountName || '-'}
                      </td>
                      {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                        <td className="p-4 text-dark-text-muted">
                          {metric.clientId?.name || '-'}
                        </td>
                      )}
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(metric.spend)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(metric.revenue)}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-medium ${parseFloat(roas) >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {roas}x
                        </span>
                      </td>
                      <td className="p-4 text-right text-dark-text-muted">
                        {formatNumber(metric.impressions)}
                      </td>
                      <td className="p-4 text-right text-dark-text-muted">
                        {formatNumber(metric.clicks)}
                      </td>
                      <td className="p-4 text-right text-dark-text-muted">
                        {formatNumber(metric.leads)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/metrics/${metric._id}`)}
                            className="text-primary hover:text-primary-hover text-sm"
                          >
                            View
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => navigate(`/metrics/${metric._id}/edit`)}
                              className="text-primary hover:text-primary-hover text-sm"
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(metric._id, metric.date)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-dark-text-muted text-lg mb-2">No metrics found</p>
            {canCreate && (
              <button
                onClick={() => navigate('/metrics/create')}
                className="btn-primary mt-4"
              >
                Input First Metric
              </button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MetricsPage;
