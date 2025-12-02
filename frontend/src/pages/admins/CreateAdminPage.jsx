import { useEffect, useState, useMemo } from 'react';
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
  const [clientSearch, setClientSearch] = useState('');

  const filteredClients = useMemo(() => {
    const q = clientSearch.toLowerCase();
    return clients.filter((c) => {
      const name = (c.name || '').toLowerCase();
      const company = (c.companyName || '').toLowerCase();
      return name.includes(q) || company.includes(q);
    });
  }, [clients, clientSearch]);

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
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Cari klien..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="input"
                />
                <select
                  multiple
                  value={managedClientIds}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions);
                    const ids = options.map((opt) => opt.value);
                    setManagedClientIds(ids);
                  }}
                  className="input h-40"
                >
                  {filteredClients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.companyName ? `- ${c.companyName}` : ''}
                    </option>
                  ))}
                </select>
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
// removed trailing filteredClients declaration outside component