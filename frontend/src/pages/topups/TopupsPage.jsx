import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { topupService } from '../../services/topupService';
import BottomScrollSync from '../../components/common/BottomScrollSync';
import { clientService } from '../../services/clientService';
import { adAccountService } from '../../services/adAccountService';
import { useAuth } from '../../context/AuthContext';

const TopupsPage = () => {
  const [topups, setTopups] = useState([]);
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
  const [filterDraft, setFilterDraft] = useState({ clientId:'', adAccountId:'', platform:'', dateFrom:'', dateTo:'' });
  const [appliedFilters, setAppliedFilters] = useState({ clientId:'', adAccountId:'', platform:'', dateFrom:'', dateTo:'' });
  const [page, setPage] = useState(1);
  const LIMIT = 25;
  const [total, setTotal] = useState(0);
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const [newTopup, setNewTopup] = useState({ date:'', platform:'', adAccountId:'', amount:'', paymentMethod:'BANK_TRANSFER', receiptUrl:'', notes:'' });
  const navigate = useNavigate();
  const { user } = useAuth();

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

      const response = await topupService.listTopups({ ...filterParams, page, limit: LIMIT });
      setTopups(response.data || []);
      setTotal(response.meta?.total || (response.data?.length || 0));
    } catch (err) {
      console.error('Error fetching topups:', err);
      setError(err.response?.data?.message || 'Failed to load topups');
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
      if (filterDraft.clientId) filterParams.clientId = filterDraft.clientId;
      
      const response = await adAccountService.listAdAccounts(filterParams);
      setAdAccounts(response.data || []);
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
    }
  };

  const handleDelete = async (topupId, amount) => {
    if (!window.confirm(`Are you sure you want to delete topup of ${formatCurrency(amount)}?`)) {
      return;
    }

    try {
      await topupService.deleteTopup(topupId);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete topup');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
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

  const getPaymentMethodBadge = (method) => {
    const methodLabels = {
      BANK_TRANSFER: 'Bank Transfer',
      CREDIT_CARD: 'Credit Card',
      E_WALLET: 'E-Wallet',
      OTHER: 'Other',
    };

    return (
      <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500">
        {methodLabels[method] || method}
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
            <h1 className="text-3xl font-bold mb-2">Topups</h1>
            <p className="text-dark-text-muted">Kelola data top-up akun iklan</p>
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

        {/* Topups Table */}
        {topups.length > 0 ? (
          <div ref={cardRef} className="card overflow-hidden">
            <div ref={scrollRef} className="overflow-auto h-[70vh] no-x-scrollbar">
            <table className="table-auto table-compact min-w-[1400px]">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-center p-2">No.</th>
                  <th className="text-center p-4 font-semibold">Date</th>
                  <th className="text-center p-4 font-semibold">Platform</th>
                  <th className="text-center p-4 font-semibold">Ad Account</th>
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <th className="text-center p-4 font-semibold">Client</th>
                  )}
                  <th className="text-center p-4 font-semibold">Amount</th>
                  <th className="text-center p-4 font-semibold">Payment Method</th>
                  <th className="text-center p-4 font-semibold">Receipt</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-dark-border bg-dark-card">
                  <td className="p-2 text-center w-[80px]">{((page - 1) * LIMIT) + topups.length + 1}</td>
                  <td className="p-2"><input type="date" className="input w-full" value={newTopup.date} onChange={(e)=>setNewTopup((t)=>({...t,date:e.target.value}))} /></td>
                  <td className="p-2">
                    <select className="input w-full" value={newTopup.platform} onChange={(e)=>setNewTopup((t)=>({...t,platform:e.target.value}))}>
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
                    <select className="input w-full" value={newTopup.adAccountId} onChange={(e)=>setNewTopup((t)=>({...t,adAccountId:e.target.value}))}>
                      <option value="">Pilih</option>
                      {adAccounts.map((a)=>(<option key={a._id} value={a._id}>{a.accountName}</option>))}
                    </select>
                  </td>
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <td className="p-2 text-dark-text-muted">{clients.find(c=>c._id===appliedFilters.clientId)?.name || '-'}</td>
                  )}
                  <td className="p-2"><input type="number" className="input w-full" value={newTopup.amount} onChange={(e)=>setNewTopup((t)=>({...t,amount:e.target.value}))} placeholder="0" /></td>
                  <td className="p-2">
                    <select className="input w-full" value={newTopup.paymentMethod} onChange={(e)=>setNewTopup((t)=>({...t,paymentMethod:e.target.value}))}>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="E_WALLET">E-Wallet</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </td>
                  <td className="p-2"><input className="input w-full" value={newTopup.receiptUrl} onChange={(e)=>setNewTopup((t)=>({...t,receiptUrl:e.target.value}))} placeholder="https://..." /></td>
                  <td className="p-2">
                    <button className="btn-primary" onClick={async()=>{
                      const payload = {
                        clientId: appliedFilters.clientId || user?.clientId,
                        adAccountId: newTopup.adAccountId,
                        platform: newTopup.platform,
                        date: newTopup.date,
                        amount: Number(newTopup.amount||0),
                        paymentMethod: newTopup.paymentMethod,
                        notes: newTopup.notes || '',
                        receiptUrl: newTopup.receiptUrl || '',
                      };
                      await topupService.createTopup(payload);
                      setNewTopup({ date:'', platform:'', adAccountId:'', amount:'', paymentMethod:'BANK_TRANSFER', receiptUrl:'', notes:'' });
                      fetchData();
                    }}>Simpan</button>
                  </td>
                </tr>
                {topups.map((topup, i) => (
                  <tr key={topup._id} className="border-b border-dark-border hover:bg-dark-surface">
                    <td className="p-2 text-center w-[80px]">{((page - 1) * LIMIT) + i + 1}</td>
                    <td className="p-4 text-center">
                      {new Date(topup.date).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 text-center">{getPlatformBadge(topup.platform)}</td>
                    <td className="p-4 text-center text-dark-text-muted">
                      {topup.adAccountId?.accountName || '-'}
                    </td>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <td className="p-4 text-center text-dark-text-muted">
                        {topup.clientId?.name || '-'}
                      </td>
                    )}
                    <td className="p-4 text-center font-medium">
                      {formatCurrency(topup.amount)}
                    </td>
                    <td className="p-4 text-center">
                      {getPaymentMethodBadge(topup.paymentMethod)}
                    </td>
                    <td className="p-4 text-center">
                      {topup.receiptUrl ? (
                        <a
                          href={topup.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-hover text-sm"
                        >
                          View Receipt
                        </a>
                      ) : (
                        <span className="text-dark-text-muted text-sm">-</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/topups/${topup._id}`)}
                          className="text-primary hover:text-primary-hover text-sm"
                        >
                          View
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => navigate(`/topups/${topup._id}/edit`)}
                            className="text-primary hover:text-primary-hover text-sm"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(topup._id, topup.amount)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
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
              <table className="table-auto table-compact min-w-[1400px]">
                <thead>
                  <tr className="border-b border-dark-border">
                    <th className="text-center p-2">No.</th>
                    <th className="text-center p-4 font-semibold">Date</th>
                    <th className="text-center p-4 font-semibold">Platform</th>
                    <th className="text-center p-4 font-semibold">Ad Account</th>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <th className="text-center p-4 font-semibold">Client</th>
                    )}
                    <th className="text-center p-4 font-semibold">Amount</th>
                    <th className="text-center p-4 font-semibold">Payment Method</th>
                    <th className="text-center p-4 font-semibold">Receipt</th>
                    <th className="text-center p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-dark-border bg-dark-card">
                    <td className="p-2 text-center w-[80px]">{((page - 1) * LIMIT) + 1}</td>
                    <td className="p-2"><input type="date" className="input w-full" value={newTopup.date} onChange={(e)=>setNewTopup((t)=>({...t,date:e.target.value}))} /></td>
                    <td className="p-2">
                      <select className="input w-full" value={newTopup.platform} onChange={(e)=>setNewTopup((t)=>({...t,platform:e.target.value}))}>
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
                      <select className="input w-full" value={newTopup.adAccountId} onChange={(e)=>setNewTopup((t)=>({...t,adAccountId:e.target.value}))}>
                        <option value="">Pilih</option>
                        {adAccounts.map((a)=>(<option key={a._id} value={a._id}>{a.accountName}</option>))}
                      </select>
                    </td>
                    {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                      <td className="p-2 text-dark-text-muted">{clients.find(c=>c._id===appliedFilters.clientId)?.name || '-'}</td>
                    )}
                    <td className="p-2"><input type="number" className="input w-full" value={newTopup.amount} onChange={(e)=>setNewTopup((t)=>({...t,amount:e.target.value}))} placeholder="0" /></td>
                    <td className="p-2">
                      <select className="input w-full" value={newTopup.paymentMethod} onChange={(e)=>setNewTopup((t)=>({...t,paymentMethod:e.target.value}))}>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="E_WALLET">E-Wallet</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </td>
                    <td className="p-2"><input className="input w-full" value={newTopup.receiptUrl} onChange={(e)=>setNewTopup((t)=>({...t,receiptUrl:e.target.value}))} placeholder="https://..." /></td>
                    <td className="p-2">
                      <button className="btn-primary" onClick={async()=>{
                        const payload = {
                          clientId: appliedFilters.clientId || user?.clientId,
                          adAccountId: newTopup.adAccountId,
                          platform: newTopup.platform,
                          date: newTopup.date,
                          amount: Number(newTopup.amount||0),
                          paymentMethod: newTopup.paymentMethod,
                          notes: newTopup.notes || '',
                          receiptUrl: newTopup.receiptUrl || '',
                        };
                        await topupService.createTopup(payload);
                        setNewTopup({ date:'', platform:'', adAccountId:'', amount:'', paymentMethod:'BANK_TRANSFER', receiptUrl:'', notes:'' });
                        fetchData();
                      }}>Simpan</button>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-6 text-center text-dark-text-muted" colSpan={(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') ? 10 : 9}>No topups found</td>
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

export default TopupsPage;
