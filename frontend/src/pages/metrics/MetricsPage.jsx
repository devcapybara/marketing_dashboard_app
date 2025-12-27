import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { metricsService } from '../../services/metricsService';
import BottomScrollSync from '../../components/common/BottomScrollSync';
import { clientService } from '../../services/clientService';
import { adAccountService } from '../../services/adAccountService';
import { useAuth } from '../../context/AuthContext';

const MetricsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [clients, setClients] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    clientId: '',
    adAccountId: '',
    platform: '',
    dateFrom: '',
    dateTo: '',
  });
  const [filterDraft, setFilterDraft] = useState({
    clientId: '',
    adAccountId: '',
    platform: '',
    dateFrom: '',
    dateTo: '',
  });
  const [appliedFilters, setAppliedFilters] = useState({
    clientId: '',
    adAccountId: '',
    platform: '',
    dateFrom: '',
    dateTo: '',
  });
  const [page, setPage] = useState(1);
  const LIMIT = 25;
  const [total, setTotal] = useState(0);
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newMetric, setNewMetric] = useState({ date: '', platform: '', adAccountId: '', spend: '', revenue: '', impressions: '', clicks: '', leads: '' });

  useEffect(() => {
    fetchData();
  }, [appliedFilters, page]);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
      fetchClients();
    }
    fetchAdAccounts();
  }, [user, filterDraft.clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {};
      if (appliedFilters.clientId) filterParams.clientId = appliedFilters.clientId;
      if (appliedFilters.adAccountId) filterParams.adAccountId = appliedFilters.adAccountId;
      if (appliedFilters.platform) filterParams.platform = appliedFilters.platform;
      if (appliedFilters.dateFrom) filterParams.dateFrom = appliedFilters.dateFrom;
      if (appliedFilters.dateTo) filterParams.dateTo = appliedFilters.dateTo;

      const response = await metricsService.listDailyMetrics({ ...filterParams, page, limit: LIMIT });
      setMetrics(response.data || []);
      setTotal(response.meta?.total || (response.data?.length || 0));
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError(err.response?.data?.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await clientService.listClients();
      setClients(response.data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  const fetchAdAccounts = async () => {
    try {
      const filterParams = {};
      if (filters.clientId) filterParams.clientId = filters.clientId;
      
      const response = await adAccountService.listAdAccounts(filterParams);
      setAdAccounts(response.data || []);
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
    }
  };

  const handleDelete = async (metricId, date) => {
    if (!window.confirm(`Are you sure you want to delete metric for ${new Date(date).toLocaleDateString('id-ID')}?`)) {
      return;
    }

    try {
      await metricsService.deleteDailyMetric(metricId);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete metric');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const getPlatformBadge = (platform) => {
    const platformColors = {
      META: 'bg-blue-500/20 text-blue-400 border-blue-500',
      TIKTOK: 'bg-black text-white border-gray-600',
      GOOGLE: 'bg-red-500/20 text-red-400 border-red-500',
      X: 'bg-gray-500/20 text-gray-400 border-gray-500',
      LINKEDIN: 'bg-blue-600/20 text-blue-500 border-blue-600',
      OTHER: 'bg-gray-500/20 text-gray-400 border-gray-500',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs border ${platformColors[platform] || platformColors.OTHER}`}>
        {platform}
      </span>
    );
  };

  const canCreate = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'CLIENT';
  const canEdit = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'CLIENT';
  const canDelete = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'CLIENT';

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

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Daily Metrics</h1>
            <p className="text-dark-text-muted">Kelola data performa iklan harian</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && clients.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">Client</label>
                <select
                  value={filterDraft.clientId}
                  onChange={(e) => {
                    setFilterDraft({ ...filterDraft, clientId: e.target.value, adAccountId: '' });
                  }}
                  className="input w-full"
                >
                  <option value="">All Clients</option>
                  {clients.map((client) => (
                    <option key={client._id} value={client._id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Ad Account</label>
              <select
                value={filterDraft.adAccountId}
                onChange={(e) => setFilterDraft({ ...filterDraft, adAccountId: e.target.value })}
                className="input w-full"
              >
                <option value="">All Ad Accounts</option>
                {adAccounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.accountName} ({account.platform})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <select
                value={filterDraft.platform}
                onChange={(e) => setFilterDraft({ ...filterDraft, platform: e.target.value })}
                className="input w-full"
              >
                <option value="">All Platforms</option>
                <option value="META">Meta</option>
                <option value="TIKTOK">TikTok</option>
                <option value="GOOGLE">Google</option>
                <option value="X">X</option>
                <option value="LINKEDIN">LinkedIn</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date From</label>
              <input
                type="date"
                value={filterDraft.dateFrom}
                onChange={(e) => setFilterDraft({ ...filterDraft, dateFrom: e.target.value })}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date To</label>
              <input
                type="date"
                value={filterDraft.dateTo}
                onChange={(e) => setFilterDraft({ ...filterDraft, dateTo: e.target.value })}
                className="input w-full"
              />
            </div>
            <div className="flex justify-end lg:col-span-1">
              <button className="btn-secondary" onClick={()=>{ setAppliedFilters(filterDraft); setPage(1); }}>Apply Filters</button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="card mb-6 bg-red-500/20 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Metrics Table */}
        {metrics.length > 0 ? (
          <div ref={cardRef} className="card overflow-hidden">
            <div ref={scrollRef} className="overflow-auto h-[70vh] no-x-scrollbar">
            <table className="table-auto table-compact min-w-[1600px]">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-center p-2">No.</th>
                  <th className="text-center p-4 font-semibold">Date</th>
                  <th className="text-center p-4 font-semibold">Platform</th>
                  <th className="text-center p-4 font-semibold">Ad Account</th>
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <th className="text-center p-4 font-semibold">Client</th>
                  )}
                  <th className="text-center p-4 font-semibold">Spend</th>
                  <th className="text-center p-4 font-semibold">Revenue</th>
                  <th className="text-center p-4 font-semibold">Impressions</th>
                  <th className="text-center p-4 font-semibold">Clicks</th>
                  <th className="text-center p-4 font-semibold">Leads</th>
                  <th className="text-center p-4 font-semibold">CTR</th>
                  <th className="text-center p-4 font-semibold">CPL</th>
                  <th className="text-center p-4 font-semibold">ROAS</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-dark-border bg-dark-card">
                  <td className="p-2 text-center w-[80px]">{((page - 1) * LIMIT) + metrics.length + 1}</td>
                  <td className="p-2"><input type="date" className="input w-full" value={newMetric.date} onChange={(e)=>setNewMetric((m)=>({...m,date:e.target.value}))} /></td>
                  <td className="p-2">
                    <select className="input w-full" value={newMetric.platform} onChange={(e)=>setNewMetric((m)=>({...m,platform:e.target.value}))}>
                      <option value="">Pilih</option>
                      <option value="META">Meta</option>
                      <option value="TIKTOK">TikTok</option>
                      <option value="GOOGLE">Google</option>
                      <option value="X">X</option>
                      <option value="LINKEDIN">LinkedIn</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <select className="input w-full" value={newMetric.adAccountId} onChange={(e)=>setNewMetric((m)=>({...m,adAccountId:e.target.value}))}>
                      <option value="">Pilih</option>
                      {adAccounts.map((a)=>(<option key={a._id} value={a._id}>{a.accountName}</option>))}
                    </select>
                  </td>
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <td className="p-2 text-dark-text-muted">{clients.find(c=>c._id===appliedFilters.clientId)?.name || '-'}</td>
                  )}
                  <td className="p-2"><input type="number" className="input w-full" value={newMetric.spend} onChange={(e)=>setNewMetric((m)=>({...m,spend:e.target.value}))} placeholder="0" /></td>
                  <td className="p-2"><input type="number" className="input w-full" value={newMetric.revenue} onChange={(e)=>setNewMetric((m)=>({...m,revenue:e.target.value}))} placeholder="0" /></td>
                  <td className="p-2"><input type="number" className="input w-full" value={newMetric.impressions} onChange={(e)=>setNewMetric((m)=>({...m,impressions:e.target.value}))} placeholder="0" /></td>
                  <td className="p-2"><input type="number" className="input w-full" value={newMetric.clicks} onChange={(e)=>setNewMetric((m)=>({...m,clicks:e.target.value}))} placeholder="0" /></td>
                  <td className="p-2"><input type="number" className="input w-full" value={newMetric.leads} onChange={(e)=>setNewMetric((m)=>({...m,leads:e.target.value}))} placeholder="0" /></td>
                  <td className="p-2 text-center text-dark-text-muted">
                      {(() => {
                        const imp = Number(newMetric.impressions||0);
                        const clk = Number(newMetric.clicks||0);
                        const val = imp>0 ? (clk/imp)*100 : 0;
                        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + '%';
                      })()}
                  </td>
                  <td className="p-2 text-center text-dark-text-muted">
                      {(() => {
                        const spend = Number(newMetric.spend||0);
                        const leads = Number(newMetric.leads||0);
                        const val = leads>0 ? (spend/leads) : 0;
                        return new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:2, maximumFractionDigits:2 }).format(val);
                      })()}
                  </td>
                  <td className="p-2 text-center">
                      {(() => {
                        const spend = Number(newMetric.spend||0);
                        const revenue = Number(newMetric.revenue||0);
                        const val = spend>0 ? (revenue/spend) : 0;
                        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + 'x';
                      })()}
                  </td>
                  <td className="p-2">
                    <button className="btn-primary" onClick={async()=>{
                      const payload = {
                        clientId: appliedFilters.clientId || user?.clientId,
                        adAccountId: newMetric.adAccountId,
                        platform: newMetric.platform,
                        date: newMetric.date,
                        spend: Number(newMetric.spend||0),
                        revenue: Number(newMetric.revenue||0),
                        impressions: Number(newMetric.impressions||0),
                        clicks: Number(newMetric.clicks||0),
                        leads: Number(newMetric.leads||0),
                      };
                      await metricsService.createDailyMetric(payload);
                      setNewMetric({ date: '', platform: '', adAccountId: '', spend: '', revenue: '', impressions: '', clicks: '', leads: '' });
                      fetchData();
                    }}>Simpan</button>
                  </td>
                </tr>
                {metrics.map((metric, i) => {
                  const roas = metric.spend > 0 ? (metric.revenue / metric.spend) : 0;
                  const ctr = metric.impressions > 0 ? ((metric.clicks / metric.impressions) * 100) : 0;
                  const cpl = metric.leads > 0 ? (metric.spend / metric.leads) : 0;
                  return (
                    <tr key={metric._id} className="border-b border-dark-border hover:bg-dark-surface">
                      <td className="p-2 text-center w-[80px]">{((page - 1) * LIMIT) + i + 1}</td>
                      <td className="p-4 text-center">
                        {new Date(metric.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4 text-center">{getPlatformBadge(metric.platform)}</td>
                      <td className="p-4 text-center text-dark-text-muted">
                        {metric.adAccountId?.accountName || '-'}
                      </td>
                      {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                        <td className="p-4 text-center text-dark-text-muted">
                          {metric.clientId?.name || '-'}
                        </td>
                      )}
                      <td className="p-4 text-center font-medium">
                        {formatCurrency(metric.spend)}
                      </td>
                      <td className="p-4 text-center font-medium">
                        {formatCurrency(metric.revenue)}
                      </td>
                      <td className="p-4 text-center text-dark-text-muted">
                        {formatNumber(metric.impressions)}
                      </td>
                      <td className="p-4 text-center text-dark-text-muted">
                        {formatNumber(metric.clicks)}
                      </td>
                      <td className="p-4 text-center text-dark-text-muted">
                        {formatNumber(metric.leads)}
                      </td>
                      <td className="p-4 text-center text-dark-text-muted">
                        {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ctr)}%
                      </td>
                      <td className="p-4 text-center text-dark-text-muted">
                        {formatCurrency(cpl)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-medium ${roas >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(roas)}x
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/metrics/${metric._id}`)}
                            className="text-primary hover:text-primary-hover text-sm"
                          >
                            View
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => navigate(`/metrics/${metric._id}/edit`)}
                              className="text-primary hover:text-primary-hover text-sm"
                            >
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(metric._id, metric.date)}
                              className="text-red-400 hover:text-red-300 text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-2">
              <button className="btn-secondary" disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button>
              <span className="text-sm">Page {page} / {Math.max(1, Math.ceil(total / LIMIT))}</span>
              <button className="btn-secondary" disabled={page>=Math.ceil(total/LIMIT)} onClick={()=>setPage((p)=>p+1)}>Next</button>
            </div>
            <BottomScrollSync forRef={scrollRef} containerRef={cardRef} />
          </div>
        ) : (
          <div ref={cardRef} className="card overflow-hidden">
            <div ref={scrollRef} className="overflow-auto h-[70vh] no-x-scrollbar">
              <table className="table-auto table-compact min-w-[1600px]">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-center p-2">No.</th>
                    <th className="text-center p-4 font-semibold">Date</th>
                    <th className="text-center p-4 font-semibold">Platform</th>
                    <th className="text-center p-4 font-semibold">Ad Account</th>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <th className="text-center p-4 font-semibold">Client</th>
                    )}
                    <th className="text-center p-4 font-semibold">Spend</th>
                    <th className="text-center p-4 font-semibold">Revenue</th>
                    <th className="text-center p-4 font-semibold">Impressions</th>
                    <th className="text-center p-4 font-semibold">Clicks</th>
                    <th className="text-center p-4 font-semibold">Leads</th>
                    <th className="text-center p-4 font-semibold">CTR</th>
                    <th className="text-center p-4 font-semibold">CPL</th>
                    <th className="text-center p-4 font-semibold">ROAS</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-dark-border bg-dark-card">
                    <td className="p-2 text-center w-[80px]">{((page - 1) * LIMIT) + 1}</td>
                    <td className="p-2"><input type="date" className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newDate:e.target.value}))} /></td>
                    <td className="p-2">
                      <select className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newPlatform:e.target.value}))} defaultValue="">
                        <option value="">Pilih</option>
                        <option value="META">Meta</option>
                        <option value="TIKTOK">TikTok</option>
                        <option value="GOOGLE">Google</option>
                        <option value="X">X</option>
                        <option value="LINKEDIN">LinkedIn</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newAdAccountId:e.target.value}))} defaultValue="">
                        <option value="">Pilih</option>
                        {adAccounts.map((a)=>(<option key={a._id} value={a._id}>{a.accountName}</option>))}
                      </select>
                    </td>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <td className="p-2 text-dark-text-muted">{clients.find(c=>c._id===filters.clientId)?.name || '-'}</td>
                    )}
                    <td className="p-2"><input type="number" className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newSpend:e.target.value}))} placeholder="0" /></td>
                    <td className="p-2"><input type="number" className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newRevenue:e.target.value}))} placeholder="0" /></td>
                    <td className="p-2"><input type="number" className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newImpressions:e.target.value}))} placeholder="0" /></td>
                    <td className="p-2"><input type="number" className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newClicks:e.target.value}))} placeholder="0" /></td>
                    <td className="p-2"><input type="number" className="input w-full" onChange={(e)=>setFilters(prev=>({...prev, newLeads:e.target.value}))} placeholder="0" /></td>
                    <td className="p-2 text-center text-dark-text-muted">
                      {(() => {
                        const imp = Number(filters.newImpressions||0);
                        const clk = Number(filters.newClicks||0);
                        const val = imp>0 ? (clk/imp)*100 : 0;
                        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + '%';
                      })()}
                    </td>
                    <td className="p-2 text-center text-dark-text-muted">
                      {(() => {
                        const spend = Number(filters.newSpend||0);
                        const leads = Number(filters.newLeads||0);
                        const val = leads>0 ? (spend/leads) : 0;
                        return new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits:2, maximumFractionDigits:2 }).format(val);
                      })()}
                    </td>
                    <td className="p-2 text-center">
                      {(() => {
                        const spend = Number(filters.newSpend||0);
                        const revenue = Number(filters.newRevenue||0);
                        const val = spend>0 ? (revenue/spend) : 0;
                        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + 'x';
                      })()}
                    </td>
                    <td className="p-2">
                      <button className="btn-primary" onClick={async()=>{
                        const payload = {
                          clientId: filters.clientId || user?.clientId,
                          adAccountId: filters.newAdAccountId,
                          platform: filters.newPlatform,
                          date: filters.newDate,
                          spend: Number(filters.newSpend||0),
                          revenue: Number(filters.newRevenue||0),
                          impressions: Number(filters.newImpressions||0),
                          clicks: Number(filters.newClicks||0),
                          leads: Number(filters.newLeads||0),
                        };
                        await metricsService.createDailyMetric(payload);
                        fetchData();
                      }}>Simpan</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-6 text-center text-dark-text-muted" colSpan={(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') ? 14 : 13}>No metrics found</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-2">
              <button className="btn-secondary" disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button>
              <span className="text-sm">Page {page} / {Math.max(1, Math.ceil(total / LIMIT))}</span>
              <button className="btn-secondary" disabled={page>=Math.ceil(total/LIMIT)} onClick={()=>setPage((p)=>p+1)}>Next</button>
            </div>
            <BottomScrollSync forRef={scrollRef} containerRef={cardRef} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MetricsPage;
