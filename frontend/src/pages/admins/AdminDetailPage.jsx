import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { listAdmins } from '../../services/userService';

const AdminDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        const res = await listAdmins();
        const data = Array.isArray(res?.data) ? res.data : res;
        const found = (data || []).find((a) => a._id === id);
        if (!found) {
          setError('Admin tidak ditemukan');
        } else {
          setAdmin(found);
        }
      } catch (err) {
        setError(err?.message || 'Gagal memuat detail admin');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, [id]);

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="alert-error">{error}</div>
          <div className="mt-4">
            <button className="btn-secondary" onClick={() => navigate('/admins')}>Kembali</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Detail</h1>
            <p className="text-dark-text-muted">Informasi administrator</p>
          </div>
          <button className="btn-secondary" onClick={() => navigate('/admins')}>Kembali</button>
        </div>

        <div className="card space-y-3">
          <div><span className="font-semibold">Name:</span> {admin?.name}</div>
          <div><span className="font-semibold">Email:</span> {admin?.email}</div>
          <div><span className="font-semibold">Role:</span> <span className="badge">{admin?.role}</span></div>
          <div><span className="font-semibold">Status:</span> {admin?.isActive ? 'Active' : 'Inactive'}</div>
          <div>
            <span className="font-semibold">Managed Clients:</span>
            <div className="mt-2">
              {Array.isArray(admin?.managedClientIds) && admin?.managedClientIds.length > 0 ? (
                <ul className="list-disc ml-6">
                  {admin.managedClientIds.map((c) => (
                    <li key={c._id || c}>
                      {c.name || c.companyName || c._id || c}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>-</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDetailPage;