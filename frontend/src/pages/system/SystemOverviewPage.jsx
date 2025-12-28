import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#60A5FA', '#34D399', '#F59E0B', '#A78BFA', '#F87171'];

const SystemOverviewPage = () => {
  const [health, setHealth] = useState({ status: 'unknown', environment: '-' });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);
        const [healthRes, dashRes] = await Promise.all([
          api.get('/health'),
          api.get('/api/dashboard/super-admin'),
        ]);
        setHealth(healthRes?.data || { status: 'unknown', environment: '-' });
        setSummary(dashRes?.data?.data || null);
      } catch (e) {
        setError(e?.response?.data?.message || 'Gagal memuat overview sistem');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const platformData = (summary?.platformMetrics || []).map((p) => ({
    name: p._id,
    spend: p.spend,
    revenue: p.revenue,
  }));
  const funnelData = summary?.chartData?.funnel
    ? [
        { name: 'No Reply', value: summary.chartData.funnel.noReply },
        { name: 'Just Asking', value: summary.chartData.funnel.justAsking },
        { name: 'Potential', value: summary.chartData.funnel.potential },
        { name: 'Closing', value: summary.chartData.funnel.closing },
        { name: 'Retention', value: summary.chartData.funnel.retention },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Overview Sistem</h1>
            <p className="text-dark-text-muted">Kesehatan sistem dan ringkasan status</p>
          </div>
        </div>

        {error && (
          <div className="card mb-6 bg-red-500/20 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-sm text-dark-text-muted mb-1">Health</div>
            <div className="text-xl font-semibold">{health.status?.toUpperCase?.() || 'UNKNOWN'}</div>
            <div className="text-xs text-dark-text-muted mt-1">Env: {health.environment}</div>
          </div>
          <div className="card">
            <div className="text-sm text-dark-text-muted mb-1">Spend</div>
            <div className="text-xl font-semibold">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(summary?.totalSpend || 0)}</div>
            <div className="text-xs text-dark-text-muted mt-1">Revenue: {new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(summary?.totalRevenue || 0)}</div>
          </div>
          <div className="card">
            <div className="text-sm text-dark-text-muted mb-1">ROAS</div>
            <div className="text-xl font-semibold">{(summary?.roas || 0).toFixed(2)}x</div>
            <div className="text-xs text-dark-text-muted mt-1">Leads: {summary?.totalLeads || 0}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="card">
            <div className="font-semibold mb-2">Platform Spend vs Revenue</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="spend" fill="#60A5FA" name="Spend" />
                  <Bar dataKey="revenue" fill="#34D399" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="font-semibold mb-2">Lead Funnel</div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={funnelData} dataKey="value" nameKey="name" outerRadius={100} label>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-6 card">
            <div className="text-dark-text-muted">Memuat data overview…</div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SystemOverviewPage;
