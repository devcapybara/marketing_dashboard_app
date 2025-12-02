import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { metricsService } from '../../services/metricsService';
import { clientService } from '../../services/clientService';
import { adAccountService } from '../../services/adAccountService';
import { useAuth } from '../../context/AuthContext';
import CustomFieldsInput from '../../components/metrics/CustomFieldsInput';

const CreateMetricPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [formData, setFormData] = useState({
    clientId: user?.role === 'CLIENT' ? user.clientId : '',
    adAccountId: '',
    platform: 'META',
    date: new Date().toISOString().split('T')[0],
    spend: '',
    revenue: '',
    impressions: '',
    clicks: '',
    leads: '',
    notes: '',
    customFields: {},
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      
      if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
        const clientsResponse = await clientService.listClients();
        setClients(clientsResponse.data || []);
      }

      const filterParams = {};
      if (formData.clientId) filterParams.clientId = formData.clientId;
      
      const accountsResponse = await adAccountService.listAdAccounts(filterParams);
      setAdAccounts(accountsResponse.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (formData.clientId) {
      fetchAdAccounts();
    }
  }, [formData.clientId]);

  const fetchAdAccounts = async () => {
    try {
      const filterParams = {};
      if (formData.clientId) filterParams.clientId = formData.clientId;
      
      const response = await adAccountService.listAdAccounts(filterParams);
      setAdAccounts(response.data || []);
      
      // Auto-set platform if only one account selected
      if (response.data?.length === 1 && !formData.adAccountId) {
        setFormData(prev => ({
          ...prev,
          adAccountId: response.data[0]._id,
          platform: response.data[0].platform,
        }));
      }
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
    }
  };

  useEffect(() => {
    // Auto-set platform when ad account changes
    if (formData.adAccountId) {
      const selectedAccount = adAccounts.find(acc => acc._id === formData.adAccountId);
      if (selectedAccount) {
        setFormData(prev => ({
          ...prev,
          platform: selectedAccount.platform,
        }));
      }
    }
  }, [formData.adAccountId, adAccounts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        spend: parseFloat(formData.spend) || 0,
        revenue: parseFloat(formData.revenue) || 0,
        impressions: parseInt(formData.impressions) || 0,
        clicks: parseInt(formData.clicks) || 0,
        leads: parseInt(formData.leads) || 0,
        customFields: formData.customFields || {},
      };

      await metricsService.createDailyMetric(submitData);
      navigate('/metrics');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create metric');
      setLoading(false);
    }
  };

  if (loadingData) {
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
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/metrics')}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Metrics
          </button>
          <h1 className="text-3xl font-bold mb-2">Input Daily Metrics</h1>
          <p className="text-dark-text-muted">Tambahkan data performa iklan harian</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && clients.length > 0 && (
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium mb-2">
                Client <span className="text-red-400">*</span>
              </label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className="input w-full"
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} {client.companyName && `(${client.companyName})`}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="adAccountId" className="block text-sm font-medium mb-2">
              Ad Account <span className="text-red-400">*</span>
            </label>
            <select
              id="adAccountId"
              name="adAccountId"
              value={formData.adAccountId}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="">Select Ad Account</option>
              {adAccounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.accountName} ({account.platform})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="platform" className="block text-sm font-medium mb-2">
              Platform <span className="text-red-400">*</span>
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="input w-full"
              required
            >
              <option value="META">Meta (Facebook/Instagram)</option>
              <option value="TIKTOK">TikTok</option>
              <option value="GOOGLE">Google Ads</option>
              <option value="X">X (Twitter)</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="input w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="spend" className="block text-sm font-medium mb-2">
                Spend <span className="text-red-400">*</span>
              </label>
              <input
                id="spend"
                name="spend"
                type="number"
                step="0.01"
                value={formData.spend}
                onChange={handleChange}
                className="input w-full"
                required
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="revenue" className="block text-sm font-medium mb-2">
                Revenue
              </label>
              <input
                id="revenue"
                name="revenue"
                type="number"
                step="0.01"
                value={formData.revenue}
                onChange={handleChange}
                className="input w-full"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="impressions" className="block text-sm font-medium mb-2">
                Impressions
              </label>
              <input
                id="impressions"
                name="impressions"
                type="number"
                value={formData.impressions}
                onChange={handleChange}
                className="input w-full"
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="clicks" className="block text-sm font-medium mb-2">
                Clicks
              </label>
              <input
                id="clicks"
                name="clicks"
                type="number"
                value={formData.clicks}
                onChange={handleChange}
                className="input w-full"
                min="0"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="leads" className="block text-sm font-medium mb-2">
                Leads
              </label>
              <input
                id="leads"
                name="leads"
                type="number"
                value={formData.leads}
                onChange={handleChange}
                className="input w-full"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          {/* Custom Fields */}
          <CustomFieldsInput
            clientId={formData.clientId}
            platform={formData.platform}
            formData={formData}
            onChange={setFormData}
          />

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input w-full"
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Metric'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/metrics')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateMetricPage;

