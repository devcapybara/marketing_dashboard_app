import { useState, useEffect } from 'react';
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

        {/* Summary Cards - Sesuai Spreadsheet */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Biaya Marketing + PPN"
            value={formatCurrency(summary?.totalSpend || 0)}
            icon="💰"
            className="bg-green-500/20 border-green-500"
          />
          <SummaryCard
            title="Total Leads"
            value={formatNumber(summary?.totalLeads || 0)}
            icon="📋"
          />
          <SummaryCard
            title="Total Pelanggan"
            value={summary?.totalClients || 0}
            icon="👥"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Omset"
            value={formatCurrency(summary?.totalRevenue || 0)}
            icon="📈"
          />
          <SummaryCard
            title="CAC"
            value={summary?.cac ? formatCurrency(summary.cac) : formatCurrency(0)}
            subtitle="Customer Acquisition Cost"
            icon="💵"
          />
          <SummaryCard
            title="ROAS"
            value={summary?.roas ? `${summary.roas.toFixed(2)}x` : '0.00x'}
            subtitle="Return on Ad Spend"
            icon="📊"
          />
        </div>

        {/* Total Impression Bulan ini */}
        <div className="card mb-8 bg-cyan-500/20 border-cyan-500">
          <h2 className="text-xl font-semibold mb-2">Total Impression Bulan ini</h2>
          <p className="text-4xl font-bold">{formatNumber(summary?.totalImpressions || 0)}</p>
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
