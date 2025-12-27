import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { leadService } from '../../services/leadService';
import { clientService } from '../../services/clientService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DropdownEditor from '../../components/common/DropdownEditor';
import BottomScrollSync from '../../components/common/BottomScrollSync';
import { toCsv, downloadCsv, parseCsvFile } from '../../utils/csv';

const DEFAULT_STATUS = ['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'];
const DEFAULT_SOURCE = ['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'];

const LeadsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(user?.role === 'CLIENT' ? user?.clientId : '');
  const [clientDetail, setClientDetail] = useState(null);
  const [newLead, setNewLead] = useState({ name: '', phone: '', username: '', csPic: '', source: '', address: '', notes: '', status: '', followUp1: '', followUp2: '', followUp3: '', followUp4: '', followUp5: '' });
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const [limit, setLimit] = useState(31);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');

  const statusOptions = useMemo(() => clientDetail?.leadStatusOptions || DEFAULT_STATUS, [clientDetail]);
  const sourceOptions = useMemo(() => clientDetail?.leadSourceOptions || DEFAULT_SOURCE, [clientDetail]);
  const csPicOptions = useMemo(() => clientDetail?.csPicOptions || [], [clientDetail]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        if (user?.role === 'ADMIN') {
          const res = await clientService.listClients();
          setClients(res?.data || []);
        }
        const activeClientId = user?.role === 'CLIENT' ? user?.clientId : clientId;
        if (activeClientId) {
          const [leadsRes, clientRes] = await Promise.all([
            leadService.list(activeClientId, page, limit, search),
            clientService.getClientById(activeClientId),
          ]);
          setLeads(leadsRes?.data || []);
          setTotal(leadsRes?.meta?.total || 0);
          setClientDetail(clientRes?.data || null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat leads');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user?.role, user?.clientId, clientId, page, limit]);

  const refreshLeads = async () => {
    const res = await leadService.list(clientId || user?.clientId, page, limit, search);
    setLeads(res?.data || []);
    setTotal(res?.meta?.total || 0);
  };

  const createLead = async () => {
    const activeClientId = user?.role === 'CLIENT' ? user?.clientId : clientId;
    const payload = {
      clientId: activeClientId,
      name: newLead.name,
      phone: newLead.phone,
      username: newLead.username,
      csPic: newLead.csPic,
      source: newLead.source,
      address: newLead.address,
      notes: newLead.notes,
      status: newLead.status,
      followUp1: newLead.followUp1 || null,
      followUp2: newLead.followUp2 || null,
      followUp3: newLead.followUp3 || null,
      followUp4: newLead.followUp4 || null,
      followUp5: newLead.followUp5 || null,
    };
    await leadService.create(payload);
    setNewLead({ name: '', phone: '', username: '', csPic: '', source: sourceOptions[0] || '', address: '', notes: '', status: statusOptions[0] || '', followUp1: '', followUp2: '', followUp3: '', followUp4: '', followUp5: '' });
    await refreshLeads();
  };

  const updateLeadField = async (id, field, value) => {
    await leadService.update(id, { [field]: value });
    await refreshLeads();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner />
          </div>
        </div>
        
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full px-4 py-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">CRM Leads</h1>
            <p className="text-dark-text-muted">Kelola leads dan status follow‑up</p>
          </div>
          <div className="flex items-end gap-3">
            {user?.role === 'ADMIN' && (
              <select className="input w-60" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Pilih Client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>{c.name || c.companyName || c._id}</option>
                ))}
              </select>
            )}
            <input
              className="input w-64"
              placeholder="Cari: Nama / No HP / Username"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />
            <button className="btn-secondary" onClick={()=>{ setPage(1); refreshLeads(); }}>Cari</button>
            <button className="btn-secondary" onClick={()=>{ setSearch(''); setPage(1); refreshLeads(); }}>Reset</button>
            <button className="btn-secondary" onClick={()=>{
              const csv = toCsv(['createdAt','name','phone','username','csPic','source','address','notes','status','followUp1','followUp2','followUp3','followUp4','followUp5'], leads);
              downloadCsv('leads.csv', csv);
            }}>Export CSV</button>
            <label className="btn-secondary">
              Import CSV
              <input type="file" accept=".csv" className="hidden" onChange={async (e)=>{
                const file = e.target.files?.[0]; if (!file) return;
                const rows = await parseCsvFile(file);
                for (const r of rows) {
                  try {
                    await leadService.create({
                      clientId: clientId || user?.clientId,
                      name: r.name||'', phone: r.phone||'', username: r.username||'', csPic: r.csPic||'', source: r.source||'', address: r.address||'', notes: r.notes||'', status: r.status||'',
                      followUp1: r.followUp1||null, followUp2: r.followUp2||null, followUp3: r.followUp3||null, followUp4: r.followUp4||null, followUp5: r.followUp5||null,
                    });
                  } catch {}
                }
                await refreshLeads();
                e.target.value = '';
              }} />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div ref={cardRef} className="card min-h-[70vh] overflow-hidden">
            <div ref={scrollRef} className="overflow-x-auto no-x-scrollbar relative">
              <table className="table-auto table-compact min-w-[1760px]">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2 w-[80px]">No.</th>
                    <th className="px-4 py-2 w-[140px]">Tanggal</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">HP</th>
                    <th className="px-4 py-2">IG/TikTok</th>
                    <th className="px-4 py-2">CS PIC</th>
                    <th className="px-4 py-2">Sumber</th>
                    <th className="px-4 py-2">Alamat</th>
                    <th className="px-4 py-2">Catatan</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">FU1</th>
                    <th className="px-4 py-2">FU2</th>
                    <th className="px-4 py-2">FU3</th>
                    <th className="px-4 py-2">FU4</th>
                    <th className="px-4 py-2">FU5</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-dark-border bg-dark-card">
                    <td className="px-4 py-2 w-[80px] text-center">{(total || 0) + 1}</td>
                    <td className="px-4 py-2 w-[140px]">{new Date().toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2"><input className="input" value={newLead.name} onChange={(e)=>setNewLead({...newLead,name:e.target.value})} placeholder="Nama" /></td>
                    <td className="px-4 py-2"><input className="input" value={newLead.phone} onChange={(e)=>setNewLead({...newLead,phone:e.target.value})} placeholder="HP" /></td>
                    <td className="px-4 py-2"><input className="input" value={newLead.username} onChange={(e)=>setNewLead({...newLead,username:e.target.value})} placeholder="IG/TikTok" /></td>
                    <td className="px-4 py-2 min-w-[200px] w-[260px]">
                      <DropdownEditor
                        kind="CS PIC"
                        options={csPicOptions}
                        value={newLead.csPic || ''}
                        onChange={(v)=>setNewLead({...newLead,csPic:v})}
                        canDelete={(label)=>!!label}
                        onCreate={async (label)=>{
                          const activeClientId = user?.role==='CLIENT' ? user?.clientId : clientId;
                          const next = [...csPicOptions, label];
                          setClientDetail((prev)=> ({...prev, csPicOptions: next }));
                          await api.put(`/api/clients/${activeClientId}/lead-settings`, { csPicOptions: next });
                          setNewLead({...newLead, csPic: label});
                        }}
                        onDelete={async (label)=>{
                          const activeClientId = user?.role==='CLIENT' ? user?.clientId : clientId;
                          const next = csPicOptions.filter((o)=>o!==label);
                          setClientDetail((prev)=> ({...prev, csPicOptions: next }));
                          await api.put(`/api/clients/${activeClientId}/lead-settings`, { csPicOptions: next });
                          if (newLead.csPic===label) setNewLead({...newLead, csPic:''});
                        }}
                        placeholder="-"
                        menuClass="w-[200px]"
                      />
                    </td>
                    <td className="px-4 py-2 min-w-[160px] w-[200px]">
                      <DropdownEditor
                        kind="Sumber"
                        options={sourceOptions}
                        value={newLead.source || ''}
                        onChange={(v)=>setNewLead({...newLead,source:v})}
                        canDelete={(label)=>label && !DEFAULT_SOURCE.includes(label)}
                        onCreate={async (label)=>{
                          const activeClientId = user?.role==='CLIENT' ? user?.clientId : clientId;
                          const next = [...sourceOptions, label];
                          setClientDetail((prev)=> ({...prev, leadSourceOptions: next }));
                          await api.put(`/api/clients/${activeClientId}/lead-settings`, { leadSourceOptions: next });
                          setNewLead({...newLead, source: label});
                        }}
                        onDelete={async (label)=>{
                          if (DEFAULT_SOURCE.includes(label)) return;
                          const activeClientId = user?.role==='CLIENT' ? user?.clientId : clientId;
                          const next = sourceOptions.filter((o)=>o!==label);
                          setClientDetail((prev)=> ({...prev, leadSourceOptions: next }));
                          await api.put(`/api/clients/${activeClientId}/lead-settings`, { leadSourceOptions: next });
                          if (newLead.source===label) setNewLead({...newLead, source: sourceOptions[0] || ''});
                        }}
                        placeholder="-"
                        menuClass="w-[200px]"
                      />
                    </td>
                    <td className="px-4 py-2"><input className="input" value={newLead.address} onChange={(e)=>setNewLead({...newLead,address:e.target.value})} placeholder="Alamat" /></td>
                    <td className="px-4 py-2"><input className="input" value={newLead.notes} onChange={(e)=>setNewLead({...newLead,notes:e.target.value})} placeholder="Catatan" /></td>
                    <td className="px-4 py-2 min-w-[200px] w-[260px]">
                      <DropdownEditor
                        kind="Status"
                        options={statusOptions}
                        value={newLead.status || ''}
                        onChange={(v)=>setNewLead({...newLead,status:v})}
                        canDelete={(label)=>label && !DEFAULT_STATUS.includes(label)}
                        onCreate={async (label)=>{
                          const activeClientId = user?.role==='CLIENT' ? user?.clientId : clientId;
                          const next = [...statusOptions, label];
                          setClientDetail((prev)=> ({...prev, leadStatusOptions: next }));
                          await api.put(`/api/clients/${activeClientId}/lead-settings`, { leadStatusOptions: next });
                          setNewLead({...newLead, status: label});
                        }}
                        onDelete={async (label)=>{
                          if (DEFAULT_STATUS.includes(label)) return;
                          const activeClientId = user?.role==='CLIENT' ? user?.clientId : clientId;
                          const next = statusOptions.filter((o)=>o!==label);
                          setClientDetail((prev)=> ({...prev, leadStatusOptions: next }));
                          await api.put(`/api/clients/${activeClientId}/lead-settings`, { leadStatusOptions: next });
                          if (newLead.status===label) setNewLead({...newLead, status: statusOptions[0] || ''});
                        }}
                        placeholder="-"
                        menuClass="w-[260px]"
                      />
                    </td>
                    {[1,2,3,4,5].map((n)=> (
                      <td key={n} className="px-2 py-2 w-[120px] min-w-[120px]">
                        <input type="date" className="input w-full" value={newLead[`followUp${n}`]} onChange={(e)=>setNewLead({...newLead,[`followUp${n}`]:e.target.value})} />
                      </td>
                    ))}
                    <td className="px-4 py-2"><button className="btn-primary" onClick={createLead} disabled={!(user?.role==='CLIENT'?user?.clientId:clientId)}>Simpan</button></td>
                  </tr>
                  {leads.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-dark-text-muted" colSpan={14}>Belum ada leads</td>
                    </tr>
                  ) : (
                    leads.map((l, i) => (
                      <tr key={l._id} className="border-t border-dark-border bg-dark-surface/60 cursor-pointer hover:bg-dark-card" onClick={()=>navigate(`/leads/${l._id}`)}>
                    <td className="px-4 py-2 w-[80px] text-center">{l.counter ?? ((page - 1) * limit + i + 1)}</td>
                        <td className="px-4 py-2 w-[140px]">{l.createdAt ? new Date(l.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="px-4 py-2">{l.name || '-'}</td>
                        <td className="px-4 py-2">{l.phone || '-'}</td>
                        <td className="px-4 py-2">{l.username || '-'}</td>
                        <td className="px-4 py-2">{l.csPic || '-'}</td>
                        <td className="px-4 py-2">{l.source || '-'}</td>
                        <td className="px-4 py-2">{l.address || '-'}</td>
                        <td className="px-4 py-2">{l.notes || '-'}</td>
                        <td className="px-4 py-2">{l.status || '-'}</td>
                        {[1,2,3,4,5].map((n) => (
                          <td key={n} className="px-2 py-2 w-[120px] min-w-[120px]">
                            {(l[`followUp${n}`] || '').slice ? (l[`followUp${n}`] || '').slice(0,10) : ''}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <BottomScrollSync forRef={scrollRef} />
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-2">
              <select className="input w-24" value={limit} onChange={(e)=>{ setLimit(Number(e.target.value)); setPage(1); refreshLeads(); }}>
                <option value="7">7</option>
                <option value="14">14</option>
                <option value="31">31</option>
                <option value="60">60</option>
                <option value="90">90</option>
              </select>
              <button className="btn-secondary" disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button>
              <span className="text-sm">Page {page} / {Math.max(1, Math.ceil(total / limit))}</span>
              <button className="btn-secondary" disabled={page>=Math.ceil(total/limit)} onClick={()=>setPage((p)=>p+1)}>Next</button>
            </div>
            
          </div>
        </div>
      </div>
      
    </DashboardLayout>
  );
};

export default LeadsPage;
