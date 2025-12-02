import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { topupService } from '../../services/topupService';
import { useAuth } from '../../context/AuthContext';

const TopupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topup, setTopup] = useState(null);

  useEffect(() => {
    fetchTopup();
  }, [id]);

  const fetchTopup = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await topupService.getTopupById(id);
      setTopup(response.data);
    } catch (err) {
      console.error('Error fetching topup:', err);
      setError(err.response?.data?.message || 'Failed to load topup');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this topup?`)) {
      return;
    }

    try {
      await topupService.deleteTopup(id);
      navigate('/topups');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete topup');
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

  if (error || !topup) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="card">
            <div className="text-red-400">
              <p className="font-semibold mb-2">Error loading topup</p>
              <p className="text-sm">{error || 'Topup not found'}</p>
              <button
                onClick={() => navigate('/topups')}
                className="btn-primary mt-4"
              >
                Back to Topups
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
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
      <span className={`px-3 py-1 rounded text-sm border ${platformColors[platform] || platformColors.OTHER}`}>
        {platform}
      </span>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const methodLabels = {
      BANK_TRANSFER: 'Bank Transfer',
      CREDIT_CARD: 'Credit Card',
      E_WALLET: 'E-Wallet',
      OTHER: 'Other',
    };
    return methodLabels[method] || method;
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/topups')}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Topups
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Topup - {new Date(topup.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h1>
              <p className="text-dark-text-muted">Topup details</p>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => navigate(`/topups/${id}/edit`)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-text-muted">Date</label>
                <p className="font-medium">
                  {new Date(topup.date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Platform</label>
                <div className="mt-1">{getPlatformBadge(topup.platform)}</div>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Ad Account</label>
                <p className="font-medium">{topup.adAccountId?.accountName || '-'}</p>
                {topup.adAccountId?.accountId && (
                  <p className="text-xs text-dark-text-muted font-mono mt-1">
                    ID: {topup.adAccountId.accountId}
                  </p>
                )}
              </div>
              {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                <div>
                  <label className="text-sm text-dark-text-muted">Client</label>
                  <p className="font-medium">{topup.clientId?.name || '-'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-text-muted">Amount</label>
                <p className="font-medium text-lg">{formatCurrency(topup.amount)}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Payment Method</label>
                <p className="font-medium">{getPaymentMethodLabel(topup.paymentMethod)}</p>
              </div>
              {topup.receiptUrl && (
                <div>
                  <label className="text-sm text-dark-text-muted">Receipt</label>
                  <div className="mt-2">
                    <a
                      href={topup.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-hover text-sm"
                    >
                      View Receipt →
                    </a>
                  </div>
                  <img
                    src={topup.receiptUrl}
                    alt="Receipt"
                    className="mt-2 max-w-full max-h-64 rounded border border-dark-border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {topup.notes && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <p className="text-dark-text-muted whitespace-pre-wrap">{topup.notes}</p>
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-dark-text-muted">Created At</label>
              <p className="font-medium">
                {new Date(topup.createdAt).toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <label className="text-sm text-dark-text-muted">Updated At</label>
              <p className="font-medium">
                {new Date(topup.updatedAt).toLocaleString('id-ID')}
              </p>
            </div>
            {topup.createdBy && (
              <div>
                <label className="text-sm text-dark-text-muted">Created By</label>
                <p className="font-medium">
                  {topup.createdBy.name || topup.createdBy.email || '-'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TopupDetailPage;

