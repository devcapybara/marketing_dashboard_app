import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { clientService } from '../../services/clientService';

const CreateClientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    contactEmail: '',
    status: 'ACTIVE',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await clientService.createClient(formData);
      navigate('/clients');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create client');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/clients')}
            className="text-dark-text-muted hover:text-dark-text mb-4"
          >
            ← Back to Clients
          </button>
          <h1 className="text-3xl font-bold mb-2">Create Client</h1>
          <p className="text-dark-text-muted">Tambahkan klien baru</p>
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
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/clients')}
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

export default CreateClientPage;

