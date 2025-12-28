import { useEffect, useState } from 'react';
import { auditLogService } from '../../services/auditLogService';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

function AuditLogContent() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);

  const [filters, setFilters] = useState({
    email: '',
    action: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await auditLogService.getAuditLogs({ page, limit, filters });
        setLogs(res.data || []);
        setTotalPages(res.pagination?.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, limit, filters]);

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
  };

  const handleCloseModal = () => {
    setSelectedLog(null);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Audit Log</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            name="email"
            value={filters.email}
            onChange={onFilterChange}
            placeholder="Filter by user email"
            className="input"
          />
          <select name="action" value={filters.action} onChange={onFilterChange} className="input">
            <option value="">All Actions</option>
            <option value="CREATE_CLIENT">CREATE_CLIENT</option>
            <option value="UPDATE_CLIENT">UPDATE_CLIENT</option>
            <option value="DELETE_CLIENT">DELETE_CLIENT</option>
            <option value="ASSIGN_CLIENT_TO_ADMIN">ASSIGN_CLIENT_TO_ADMIN</option>
            <option value="USER_LOGIN_SUCCESS">USER_LOGIN_SUCCESS</option>
            <option value="USER_LOGIN_FAIL">USER_LOGIN_FAIL</option>
          </select>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={onFilterChange}
            className="input"
          />
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={onFilterChange}
            className="input"
          />
        </div>

        {loading && <div className="text-dark-text-muted">Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="overflow-x-auto rounded-lg border border-dark-border mb-4">
          <table className="min-w-full text-left">
            <thead className="bg-dark-surface">
              <tr>
                <th className="px-4 py-3 border-b border-dark-border">Timestamp</th>
                <th className="px-4 py-3 border-b border-dark-border">User</th>
                <th className="px-4 py-3 border-b border-dark-border">Action</th>
                <th className="px-4 py-3 border-b border-dark-border">Target</th>
                <th className="px-4 py-3 border-b border-dark-border">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-dark-surface">
                  <td className="px-4 py-3 border-b border-dark-border">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b border-dark-border">
                    {log.user?.email || log.user?.name || 'System'}
                  </td>
                  <td className="px-4 py-3 border-b border-dark-border">{log.action}</td>
                  <td className="px-4 py-3 border-b border-dark-border">
                    {log.targetModel} / {log.targetId}
                  </td>
                  <td className="px-4 py-3 border-b border-dark-border">
                    <button className="btn-secondary" onClick={() => handleViewDetails(log)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr>
                  <td className="px-4 py-3" colSpan={5}>
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn-secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn-secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
          <select
            className="input ml-2"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {selectedLog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-dark-surface p-6 rounded-lg shadow-xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Log Details</h2>
            <pre className="bg-dark-background p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(selectedLog.details, null, 2)}
            </pre>
            <div className="text-right mt-4">
              <button className="btn-primary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function AuditLogPage() {
  const { user } = useAuth();
  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <AuditLogContent key={user?._id} />
    </ProtectedRoute>
  );
}
