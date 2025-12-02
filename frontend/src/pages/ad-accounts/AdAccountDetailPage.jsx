import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adAccountService } from '../../services/adAccountService';
import { useAuth } from '../../context/AuthContext';

const AdAccountDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adAccount, setAdAccount] = useState(null);

  useEffect(() => {
    fetchAdAccount();
  }, [id]);

  const fetchAdAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adAccountService.getAdAccountById(id);
      setAdAccount(response.data);
    } catch (err) {
      console.error('Error fetching ad account:', err);
      setError(err.response?.data?.message || 'Failed to load ad account');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${adAccount.accountName}"?`)) {
      return;
    }

    try {
      await adAccountService.deleteAdAccount(id);
      navigate('/ad-accounts');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete ad account');
    }
  };

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

  if (error || !adAccount) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="card">
            <div className="text-red-400">
              <p className="font-semibold mb-2">Error loading ad account</p>
              <p className="text-sm">{error || 'Ad account not found'}</p>
              <button
                onClick={() => navigate('/ad-accounts')}
                className="btn-primary mt-4"
              >
                Back to Ad Accounts
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
      <span className={`px-3 py-1 rounded text-sm border ${platformColors[platform] || platformColors.OTHER}`}>
        {platform}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/ad-accounts')}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Ad Accounts
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{adAccount.accountName}</h1>
              <p className="text-dark-text-muted">Ad account details</p>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => navigate(`/ad-accounts/${id}/edit`)}
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
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-text-muted">Account Name</label>
                <p className="font-medium">{adAccount.accountName}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Platform</label>
                <div className="mt-1">{getPlatformBadge(adAccount.platform)}</div>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Account ID</label>
                <p className="font-medium font-mono text-sm">{adAccount.accountId}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Currency</label>
                <p className="font-medium">{adAccount.currency}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Status</label>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded text-sm border ${
                    adAccount.isActive
                      ? 'bg-green-500/20 text-green-400 border-green-500'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500'
                  }`}>
                    {adAccount.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
            <div className="space-y-4">
              {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && adAccount.clientId && (
                <div>
                  <label className="text-sm text-dark-text-muted">Client</label>
                  <p className="font-medium">
                    {adAccount.clientId.name}
                    {adAccount.clientId.companyName && ` (${adAccount.clientId.companyName})`}
                  </p>
                </div>
              )}
              <div>
                <label className="text-sm text-dark-text-muted">Created At</label>
                <p className="font-medium">
                  {new Date(adAccount.createdAt).toLocaleString('id-ID')}
                </p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Updated At</label>
                <p className="font-medium">
                  {new Date(adAccount.updatedAt).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdAccountDetailPage;

