import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SummaryCard from '../../components/common/SummaryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImpressionSourceChart from '../../components/charts/ImpressionSourceChart';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';
import FunnelChart from '../../components/charts/FunnelChart';
import { dashboardService } from '../../services/dashboardService';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const toISO = (d) => d.toISOString().slice(0,10);
  const today = new Date();
  const start30 = new Date(today); start30.setDate(start30.getDate() - 29);
  const [filters, setFilters] = useState({ dateFrom: toISO(start30), dateTo: toISO(today) });
  const [preset, setPreset] = useState('30');

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await clientService.listClients();
        setClients(res.data || []);
      } catch {}
    };
    if (user?.role === 'ADMIN') loadClients();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getAdminSummary(filters);
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="card">
            <div className="text-red-400">
              <p className="font-semibold mb-2">Error loading dashboard</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="btn-primary mt-4"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-dark-text-muted">Overview klien yang Anda kelola</p>
        </div>

        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Preset</label>
              <select value={preset} onChange={(e)=>{
                const v = e.target.value; setPreset(v);
                const t = new Date(); const isoT = toISO(t);
                const setRange = (days)=>{ const s = new Date(t); s.setDate(s.getDate()- (days-1)); setFilters({ dateFrom: toISO(s), dateTo: isoT }); };
                if (v==='1') setRange(1);
                else if (v==='7') setRange(7);
                else if (v==='14') setRange(14);
                else if (v==='28') setRange(28);
                else if (v==='3m') { const s = new Date(t); s.setMonth(s.getMonth()-3); setFilters({ dateFrom: toISO(s), dateTo: isoT }); }
                else if (v==='this-year') { const s = new Date(t.getFullYear(),0,1); setFilters({ dateFrom: toISO(s), dateTo: isoT }); }
                else if (v==='last-year') { const s = new Date(t.getFullYear()-1,0,1); const e = new Date(t.getFullYear()-1,11,31); setFilters({ dateFrom: toISO(s), dateTo: toISO(e) }); }
                else setRange(30);
              }} className="input w-full">
                <option value="30">30 hari terakhir</option>
                <option value="28">28 hari terakhir</option>
                <option value="14">14 hari terakhir</option>
                <option value="7">7 hari terakhir</option>
                <option value="1">Hari ini</option>
                <option value="3m">3 bulan terakhir</option>
                <option value="this-year">Tahun ini</option>
                <option value="last-year">Tahun lalu</option>
              </select>
            </div>
            {user?.role === 'ADMIN' && (
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select value={filters.clientId || ''} onChange={(e)=>setFilters((f)=>({...f, clientId: e.target.value }))} className="input w-full">
                  <option value="">Semua</option>
                  {clients.map((c)=>(<option key={c._id} value={c._id}>{c.name}</option>))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Dari</label>
              <input type="date" value={filters.dateFrom} onChange={(e)=>setFilters((f)=>({...f,dateFrom:e.target.value}))} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sampai</label>
              <input type="date" value={filters.dateTo} onChange={(e)=>setFilters((f)=>({...f,dateTo:e.target.value}))} className="input w-full" />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button className="btn-secondary" onClick={()=>fetchDashboardData()}>Update</button>
            </div>
          </div>
        </div>

        {/* Summary Cards Ordered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard title="Total Ad Accounts" value={summary?.totalAdAccounts || 0} icon="📱" />
          <SummaryCard title="Total Biaya Marketing + PPN" value={formatCurrency(summary?.totalSpendWithVat ?? summary?.totalSpend ?? 0)} icon="💰" className="bg-green-500/20 border-green-500" />
          <SummaryCard title="Total Omset" value={formatCurrency(summary?.totalRevenue || 0)} icon="📈" />
          <SummaryCard title="Total Budget Top Up" value={formatCurrency(summary?.totalTopup || 0)} icon="💳" />
          <SummaryCard title="Saldo efektif hari ini" value={formatCurrency(summary?.effectiveBalance ?? 0)} icon="💳" className="bg-purple-500/20 border-purple-500" />
          <SummaryCard title="Total Impressions" value={formatNumber(summary?.totalImpressions || 0)} icon="👁️" />
          <SummaryCard title="Total Clicks" value={formatNumber(summary?.totalClicks || 0)} icon="🖱️" />
          <SummaryCard title="Total Leads" value={formatNumber(summary?.totalLeads || 0)} icon="📋" />
          <SummaryCard title="Cost per Lead" value={formatCurrency(summary?.cpl || 0)} icon="💡" />
          <SummaryCard title="Closing" value={formatNumber(summary?.chartData?.funnel?.closing || 0)} icon="✅" />
          <SummaryCard title="CAC" value={summary?.cac ? formatCurrency(summary.cac) : formatCurrency(0)} subtitle="Customer Acquisition Cost" icon="💵" />
          <SummaryCard title="ROAS" value={summary?.roas ? `${summary.roas.toFixed(2)}x` : '0.00x'} subtitle="Return on Ad Spend" icon="📊" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {summary?.platformMetrics && (
            <ImpressionSourceChart data={summary.platformMetrics} />
          )}
          {summary?.chartData?.funnel && (
            <FunnelChart data={summary.chartData.funnel} />
          )}
        </div>

        

        {/* Platform Metrics */}
        {summary?.platformMetrics && summary.platformMetrics.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Per Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.platformMetrics.map((platform) => (
                <div key={platform._id} className="bg-dark-surface p-4 rounded-lg border border-dark-border">
                  <h3 className="font-semibold mb-2">{platform._id}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-dark-text-muted">Spend:</span>
                      <span className="font-medium">{formatCurrency(platform.spend || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-text-muted">Revenue:</span>
                      <span className="font-medium">{formatCurrency(platform.revenue || 0)}</span>
                    </div>
                    {platform.spend > 0 && (
                      <div className="flex justify-between">
                        <span className="text-dark-text-muted">ROAS:</span>
                        <span className="font-medium">
                          {(platform.revenue / platform.spend).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!summary || summary.totalAdAccounts === 0) && (
          <div className="card text-center py-12">
            <p className="text-dark-text-muted text-lg mb-2">Belum ada data</p>
            <p className="text-dark-text-muted text-sm">
              Mulai dengan membuat ad account dan input metrics untuk melihat dashboard
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
