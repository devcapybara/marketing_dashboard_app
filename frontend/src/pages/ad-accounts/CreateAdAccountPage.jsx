import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adAccountService } from '../../services/adAccountService';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';

const CreateAdAccountPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [error, setError] = useState('');
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: user?.role === 'CLIENT' ? user.clientId : '',
    platform: 'META',
    accountName: '',
    accountId: '',
    currency: 'IDR',
    isActive: true,
  });

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const response = await clientService.listClients();
      setClients(response.data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adAccountService.createAdAccount(formData);
      navigate('/ad-accounts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ad account');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/ad-accounts')}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Ad Accounts
          </button>
          <h1 className="text-3xl font-bold mb-2">Create Ad Account</h1>
          <p className="text-dark-text-muted">Tambahkan akun iklan baru</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium mb-2">
                Client <span className="text-red-400">*</span>
              </label>
              {loadingClients ? (
                <LoadingSpinner />
              ) : (
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
              )}
            </div>
          )}

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
            <label htmlFor="accountName" className="block text-sm font-medium mb-2">
              Account Name <span className="text-red-400">*</span>
            </label>
            <input
              id="accountName"
              name="accountName"
              type="text"
              value={formData.accountName}
              onChange={handleChange}
              className="input w-full"
              required
              placeholder="Enter account name"
            />
          </div>

          <div>
            <label htmlFor="accountId" className="block text-sm font-medium mb-2">
              Account ID <span className="text-red-400">*</span>
            </label>
            <input
              id="accountId"
              name="accountId"
              type="text"
              value={formData.accountId}
              onChange={handleChange}
              className="input w-full font-mono"
              required
              placeholder="Enter account ID"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-2">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="IDR">IDR (Indonesian Rupiah)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
              <option value="SGD">SGD (Singapore Dollar)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-dark-border"
            />
            <label htmlFor="isActive" className="ml-2 text-sm font-medium">
              Active
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Ad Account'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/ad-accounts')}
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

export default CreateAdAccountPage;

