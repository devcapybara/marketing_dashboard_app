import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clientService } from '../../services/clientService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CreateAdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [managedClientIds, setManagedClientIds] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setClientsLoading(true);
        const res = await clientService.listClients();
        setClients(res?.data || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setClientsLoading(false);
      }
    };
    fetchClients();
  }, []);

  const canCreate = user?.role === 'SUPER_ADMIN';

  const toggleClient = (clientId) => {
    setManagedClientIds((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canCreate) return;
    try {
      setLoading(true);
      setError(null);
      const payload = { name, email, password, managedClientIds };
      const res = await api.post('/api/users/admin', payload);
      if (res?.data?.success) {
        navigate('/admins');
      } else {
        setError(res?.data?.message || 'Failed to create admin');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create Admin</h1>
            <p className="text-dark-text-muted">Tambah administrator baru (SUPER_ADMIN only)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assign Managed Clients (optional)</label>
            {clientsLoading ? (
              <div className="flex items-center gap-2 text-dark-text-muted">
                <LoadingSpinner size="sm" /> Loading clients...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {clients.map((c) => (
                  <label key={c._id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={managedClientIds.includes(c._id)}
                      onChange={() => toggleClient(c._id)}
                    />
                    <span>{c.name} {c.companyName ? `- ${c.companyName}` : ''}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => navigate('/admins')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading || !canCreate}>
              {loading ? 'Saving...' : 'Create Admin'}
            </button>
          </div>

          {error && <div className="alert-error">{error}</div>}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateAdminPage;