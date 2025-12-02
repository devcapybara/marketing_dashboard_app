import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clientService } from '../../services/clientService';

const EditClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactEmail: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await clientService.getClientById(id);
      const client = response.data;
      setFormData({
        name: client.name || '',
        companyName: client.companyName || '',
        contactEmail: client.contactEmail || '',
        status: client.status || 'ACTIVE',
      });
    } catch (err) {
      console.error('Error fetching client:', err);
      setError(err.response?.data?.message || 'Failed to load client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await clientService.updateClient(id, formData);
      navigate(`/clients/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update client');
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
            onClick={() => navigate(`/clients/${id}`)}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Client Detail
          </button>
          <h1 className="text-3xl font-bold mb-2">Edit Client</h1>
          <p className="text-dark-text-muted">Update informasi klien</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Client Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input w-full"
              required
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium mb-2">
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              className="input w-full"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium mb-2">
              Contact Email
            </label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={handleChange}
              className="input w-full"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
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
              onClick={() => navigate(`/clients/${id}`)}
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

export default EditClientPage;

