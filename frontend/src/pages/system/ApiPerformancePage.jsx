import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';

const ApiPerformancePage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/api/system/metrics');
        setData(res?.data?.data || null);
      } catch (e) {
        setError(e?.response?.data?.message || 'Gagal memuat kinerja API');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Kinerja API</h1>
          <p className="text-dark-text-muted">Latency, error rate, dan jumlah request per route</p>
        </div>
        {error && (
          <div className="card mb-6 bg-red-500/20 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        <div className="card">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-dark-text-muted">Total Requests</div>
              <div className="text-xl font-semibold">{data?.totalCount || 0}</div>
            </div>
            <div>
              <div className="text-sm text-dark-text-muted">Total Errors</div>
              <div className="text-xl font-semibold">{data?.totalError || 0}</div>
            </div>
            <div>
              <div className="text-sm text-dark-text-muted">Routes</div>
              <div className="text-xl font-semibold">{data?.routes?.length || 0}</div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto table-compact min-w-[1000px]">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left p-2">Route</th>
                  <th className="text-right p-2">Requests</th>
                  <th className="text-right p-2">Error Rate</th>
                  <th className="text-right p-2">Avg Latency (ms)</th>
                  <th className="text-right p-2">p95 (ms)</th>
                  <th className="text-right p-2">Max (ms)</th>
                </tr>
              </thead>
              <tbody>
                {(data?.routes || []).map((r) => (
                  <tr key={r.route} className="border-t border-dark-border">
                    <td className="p-2">{r.route}</td>
                    <td className="p-2 text-right">{r.count}</td>
                    <td className="p-2 text-right">{r.errorRate}%</td>
                    <td className="p-2 text-right">{r.avgMs}</td>
                    <td className="p-2 text-right">{r.p95Ms}</td>
                    <td className="p-2 text-right">{r.maxMs}</td>
                  </tr>
                ))}
                {(!data || (data.routes||[]).length===0) && (
                  <tr>
                    <td className="p-4 text-center text-dark-text-muted" colSpan={6}>Belum ada data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {loading && (
          <div className="mt-4 card">
            <div className="text-dark-text-muted">Memuat data kinerja…</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApiPerformancePage;
