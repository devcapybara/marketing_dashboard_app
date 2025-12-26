import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SummaryCard from '../../components/common/SummaryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImpressionSourceChart from '../../components/charts/ImpressionSourceChart';
import FunnelChart from '../../components/charts/FunnelChart';
import { dashboardService } from '../../services/dashboardService';

const SuperAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getSuperAdminSummary();
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
          <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
          <p className="text-dark-text-muted">Overview semua klien dan performa iklan</p>
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
          {summary?.chartData?.impressionSource && (
            <ImpressionSourceChart data={summary.chartData.impressionSource} />
          )}
          {summary?.chartData?.funnel && (
            <FunnelChart data={summary.chartData.funnel} />
          )}
        </div>

        {/* Platform Metrics */}
        {summary?.platformMetrics && summary.platformMetrics.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Per Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {/* Shortcut cards */}
              <button
                className="card hover:bg-dark-surface transition"
                onClick={() => navigate('/clients')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="font-semibold">Manage Clients</div>
                    <div className="text-dark-text-muted text-sm">Kelola data klien</div>
                  </div>
                </div>
              </button>
              
              <button
                className="card hover:bg-dark-surface transition"
                onClick={() => navigate('/ad-accounts')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="font-semibold">Manage Ad Accounts</div>
                    <div className="text-dark-text-muted text-sm">Kelola akun iklan</div>
                  </div>
                </div>
              </button>
              
              <button
                className="card hover:bg-dark-surface transition"
                onClick={() => navigate('/admins')}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛠️</span>
                  <div>
                    <div className="font-semibold">Manage Administrators</div>
                    <div className="text-dark-text-muted text-sm">Tambah & kelola admin</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!summary || (summary.totalClients === 0 && summary.totalAdAccounts === 0)) && (
          <div className="card text-center py-12">
            <p className="text-dark-text-muted text-lg mb-2">Belum ada data</p>
            <p className="text-dark-text-muted text-sm">
              Mulai dengan membuat client dan ad account untuk melihat dashboard
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
