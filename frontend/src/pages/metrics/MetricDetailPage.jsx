import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { metricsService } from '../../services/metricsService';
import { useAuth } from '../../context/AuthContext';

const MetricDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState(null);

  useEffect(() => {
    fetchMetric();
  }, [id]);

  const fetchMetric = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await metricsService.getDailyMetricById(id);
      setMetric(response.data);
    } catch (err) {
      console.error('Error fetching metric:', err);
      setError(err.response?.data?.message || 'Failed to load metric');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this metric?`)) {
      return;
    }

    try {
      await metricsService.deleteDailyMetric(id);
      navigate('/metrics');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete metric');
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

  if (error || !metric) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="card">
            <div className="text-red-400">
              <p className="font-semibold mb-2">Error loading metric</p>
              <p className="text-sm">{error || 'Metric not found'}</p>
              <button
                onClick={() => navigate('/metrics')}
                className="btn-primary mt-4"
              >
                Back to Metrics
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

  const formatNumber = (value) => {
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const roas = metric.spend > 0 ? (metric.revenue / metric.spend).toFixed(2) : '0.00';

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
            onClick={() => navigate('/metrics')}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Metrics
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Daily Metric - {new Date(metric.date).toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h1>
              <p className="text-dark-text-muted">Metric details</p>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <button
                  onClick={() => navigate(`/metrics/${id}/edit`)}
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
                  {new Date(metric.date).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Platform</label>
                <div className="mt-1">{getPlatformBadge(metric.platform)}</div>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Ad Account</label>
                <p className="font-medium">{metric.adAccountId?.accountName || '-'}</p>
                {metric.adAccountId?.accountId && (
                  <p className="text-xs text-dark-text-muted font-mono mt-1">
                    ID: {metric.adAccountId.accountId}
                  </p>
                )}
              </div>
              {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                <div>
                  <label className="text-sm text-dark-text-muted">Client</label>
                  <p className="font-medium">{metric.clientId?.name || '-'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-dark-text-muted">Spend</label>
                <p className="font-medium text-lg">{formatCurrency(metric.spend)}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Revenue</label>
                <p className="font-medium text-lg">{formatCurrency(metric.revenue)}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">ROAS</label>
                <p className={`font-medium text-lg ${parseFloat(roas) >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                  {roas}x
                </p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Impressions</label>
                <p className="font-medium">{formatNumber(metric.impressions)}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Clicks</label>
                <p className="font-medium">{formatNumber(metric.clicks)}</p>
              </div>
              <div>
                <label className="text-sm text-dark-text-muted">Leads</label>
                <p className="font-medium">{formatNumber(metric.leads)}</p>
              </div>
            </div>
          </div>
        </div>

        {metric.notes && (
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <p className="text-dark-text-muted whitespace-pre-wrap">{metric.notes}</p>
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-dark-text-muted">Created At</label>
              <p className="font-medium">
                {new Date(metric.createdAt).toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <label className="text-sm text-dark-text-muted">Updated At</label>
              <p className="font-medium">
                {new Date(metric.updatedAt).toLocaleString('id-ID')}
              </p>
            </div>
            {metric.createdBy && (
              <div>
                <label className="text-sm text-dark-text-muted">Created By</label>
                <p className="font-medium">
                  {metric.createdBy.name || metric.createdBy.email || '-'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MetricDetailPage;

