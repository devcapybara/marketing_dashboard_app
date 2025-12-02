import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adAccountService } from '../../services/adAccountService';

const EditAdAccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    platform: 'META',
    accountName: '',
    accountId: '',
    currency: 'IDR',
    isActive: true,
  });

  useEffect(() => {
    fetchAdAccount();
  }, [id]);

  const fetchAdAccount = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adAccountService.getAdAccountById(id);
      const account = response.data;
      setFormData({
        platform: account.platform || 'META',
        accountName: account.accountName || '',
        accountId: account.accountId || '',
        currency: account.currency || 'IDR',
        isActive: account.isActive !== undefined ? account.isActive : true,
      });
    } catch (err) {
      console.error('Error fetching ad account:', err);
      setError(err.response?.data?.message || 'Failed to load ad account');
    } finally {
      setLoading(false);
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
    setSaving(true);

    try {
      await adAccountService.updateAdAccount(id, formData);
      navigate(`/ad-accounts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ad account');
      setSaving(false);
    }
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
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => navigate(`/ad-accounts/${id}`)}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Ad Account Detail
          </button>
          <h1 className="text-3xl font-bold mb-2">Edit Ad Account</h1>
          <p className="text-dark-text-muted">Update informasi akun iklan</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
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
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/ad-accounts/${id}`)}
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

export default EditAdAccountPage;

