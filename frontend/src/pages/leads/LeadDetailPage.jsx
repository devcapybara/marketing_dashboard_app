import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DropdownEditor from '../../components/common/DropdownEditor';
import { leadService } from '../../services/leadService';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientDetail, setClientDetail] = useState(null);
  const [editingLeft, setEditingLeft] = useState(false);

  const statusOptions = useMemo(() => clientDetail?.leadStatusOptions || ['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'], [clientDetail]);
  const sourceOptions = useMemo(() => clientDetail?.leadSourceOptions || ['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'], [clientDetail]);
  const csPicOptions = useMemo(() => clientDetail?.csPicOptions || [], [clientDetail]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await leadService.getById(id);
        const ld = res?.data || null;
        setLead(ld);
        if (ld?.clientId) {
          const cRes = await clientService.getClientById(ld.clientId);
          setClientDetail(cRes?.data || null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat detail lead');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

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
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Lead Detail</h1>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => navigate('/leads')}>Back</button>
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'CLIENT') && (
              <button className="btn-primary" onClick={() => setEditingLeft((e)=>!e)}>{editingLeft?'Cancel Edit':'Edit'}</button>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="text-xl font-semibold">{lead?.name || '-'}</div>
        </div>
        {error && (
          <div className="card mb-4 bg-red-500/20 border-red-500">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="space-y-2">
              {!editingLeft ? (
                <>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">Nama</span><div className="col-span-2">{lead?.name || '-'}</div></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">HP</span><div className="col-span-2">{lead?.phone || '-'}</div></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">IG/TikTok</span><div className="col-span-2">{lead?.username || '-'}</div></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">CS PIC</span><div className="col-span-2">{lead?.csPic || '-'}</div></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">Sumber</span><div className="col-span-2">{lead?.source || '-'}</div></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">Alamat</span><div className="col-span-2">{lead?.address || '-'}</div></div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">Nama</span><input className="input col-span-2" value={lead?.name || ''} onChange={(e)=>setLead((l)=>({...l,name:e.target.value}))} placeholder="Nama" /></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">HP</span><input className="input col-span-2" value={lead?.phone || ''} onChange={(e)=>setLead((l)=>({...l,phone:e.target.value}))} placeholder="HP" /></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">IG/TikTok</span><input className="input col-span-2" value={lead?.username || ''} onChange={(e)=>setLead((l)=>({...l,username:e.target.value}))} placeholder="IG/TikTok" /></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">CS PIC</span><div className="col-span-2"><DropdownEditor kind="CS PIC" options={csPicOptions} value={lead?.csPic || ''} onChange={(v)=>setLead((l)=>({...l,csPic:v}))} canDelete={()=>!!lead?.csPic} onCreate={async (label)=>{ const next=[...csPicOptions,label]; setClientDetail((prev)=>({...prev, csPicOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{csPicOptions:next}); setLead((l)=>({...l,csPic:label})); }} onDelete={async (label)=>{ const next=csPicOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, csPicOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{csPicOptions:next}); if(lead?.csPic===label) setLead((l)=>({...l,csPic:''})); }} placeholder="-" /></div></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">Sumber</span><div className="col-span-2"><DropdownEditor kind="Sumber" options={sourceOptions} value={lead?.source || ''} onChange={(v)=>setLead((l)=>({...l,source:v}))} canDelete={(label)=>label && !['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'].includes(label)} onCreate={async (label)=>{ const next=[...sourceOptions,label]; setClientDetail((prev)=>({...prev, leadSourceOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadSourceOptions:next}); setLead((l)=>({...l,source:label})); }} onDelete={async (label)=>{ if(['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'].includes(label))return; const next=sourceOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, leadSourceOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadSourceOptions:next}); if(lead?.source===label) setLead((l)=>({...l,source: sourceOptions[0]||''})); }} placeholder="-" /></div></div>
                  <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">Alamat</span><input className="input col-span-2" value={lead?.address || ''} onChange={(e)=>setLead((l)=>({...l,address:e.target.value}))} placeholder="Alamat" /></div>
                </>
              )}
            </div>
          </div>
          <div className="card">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 items-start"><span className="text-dark-text-muted mt-2">Catatan</span><textarea className="input col-span-2" rows={3} value={lead?.notes || ''} onChange={(e)=>setLead((l)=>({...l,notes:e.target.value}))} placeholder="Catatan" /></div>
              <div className="grid grid-cols-3 gap-2 items-center"><span className="text-dark-text-muted">Status</span><div className="col-span-2"><DropdownEditor kind="Status" options={statusOptions} value={lead?.status || ''} onChange={(v)=>setLead((l)=>({...l,status:v}))} canDelete={(label)=>label && !['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'].includes(label)} onCreate={async (label)=>{ const next=[...statusOptions,label]; setClientDetail((prev)=>({...prev, leadStatusOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadStatusOptions:next}); setLead((l)=>({...l,status:label})); }} onDelete={async (label)=>{ if(['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'].includes(label))return; const next=statusOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, leadStatusOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadStatusOptions:next}); if(lead?.status===label) setLead((l)=>({...l,status: statusOptions[0]||''})); }} placeholder="-" /></div></div>
              {[1,2,3,4,5].map((n)=> (
                <div key={n} className="grid grid-cols-3 gap-2 items-center">
                  <span className="text-dark-text-muted">FU{n}</span>
                  <input type="date" className="input col-span-2" value={(lead?.[`followUp${n}`] || '').slice ? (lead?.[`followUp${n}`] || '').slice(0,10) : ''} onChange={(e)=>setLead((l)=>({...l,[`followUp${n}`]: e.target.value}))} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="btn-primary" onClick={async()=>{ try { await leadService.update(id, { name: lead?.name || '', phone: lead?.phone || '', username: lead?.username || '', csPic: lead?.csPic || '', source: lead?.source || '', address: lead?.address || '', notes: lead?.notes || '', status: lead?.status || '', followUp1: lead?.followUp1 || null, followUp2: lead?.followUp2 || null, followUp3: lead?.followUp3 || null, followUp4: lead?.followUp4 || null, followUp5: lead?.followUp5 || null }); setEditingLeft(false); alert('Data berhasil tersimpan'); } catch(e){ alert(e?.response?.data?.message || 'Gagal menyimpan data'); } }}>Save</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadDetailPage;
