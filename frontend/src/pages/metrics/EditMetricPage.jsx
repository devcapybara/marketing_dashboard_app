import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { metricsService } from '../../services/metricsService';

const EditMetricPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    platform: 'META',
    date: '',
    spend: '',
    revenue: '',
    impressions: '',
    clicks: '',
    leads: '',
    notes: '',
  });

  useEffect(() => {
    fetchMetric();
  }, [id]);

  const fetchMetric = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await metricsService.getDailyMetricById(id);
      const metric = response.data;
      
      const dateStr = new Date(metric.date).toISOString().split('T')[0];
      
      setFormData({
        platform: metric.platform || 'META',
        date: dateStr,
        spend: metric.spend?.toString() || '',
        revenue: metric.revenue?.toString() || '',
        impressions: metric.impressions?.toString() || '',
        clicks: metric.clicks?.toString() || '',
        leads: metric.leads?.toString() || '',
        notes: metric.notes || '',
      });
    } catch (err) {
      console.error('Error fetching metric:', err);
      setError(err.response?.data?.message || 'Failed to load metric');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      const submitData = {
        ...formData,
        spend: parseFloat(formData.spend) || 0,
        revenue: parseFloat(formData.revenue) || 0,
        impressions: parseInt(formData.impressions) || 0,
        clicks: parseInt(formData.clicks) || 0,
        leads: parseInt(formData.leads) || 0,
      };

      await metricsService.updateDailyMetric(id, submitData);
      navigate(`/metrics/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update metric');
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
            onClick={() => navigate(`/metrics/${id}`)}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Metric Detail
          </button>
          <h1 className="text-3xl font-bold mb-2">Edit Daily Metric</h1>
          <p className="text-dark-text-muted">Update data performa iklan harian</p>
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
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/metrics/${id}`)}
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

export default EditMetricPage;

