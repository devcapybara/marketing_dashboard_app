import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DropdownEditor from '../../components/common/DropdownEditor';
import { leadService } from '../../services/leadService';
import { clientService } from '../../services/clientService';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DEFAULT_STATUS = ['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'];
const DEFAULT_SOURCE = ['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'];

const EditLeadPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lead, setLead] = useState(null);
  const [clientDetail, setClientDetail] = useState(null);

  const statusOptions = useMemo(() => clientDetail?.leadStatusOptions || DEFAULT_STATUS, [clientDetail]);
  const sourceOptions = useMemo(() => clientDetail?.leadSourceOptions || DEFAULT_SOURCE, [clientDetail]);
  const csPicOptions = useMemo(() => clientDetail?.csPicOptions || [], [clientDetail]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await leadService.getById(id);
        const ld = res?.data;
        setLead(ld || null);
        if (ld?.clientId) {
          const cRes = await clientService.getClientById(ld.clientId);
          setClientDetail(cRes?.data || null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat data lead');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  const save = async () => {
    await leadService.update(id, {
      name: lead?.name || '',
      phone: lead?.phone || '',
      username: lead?.username || '',
      csPic: lead?.csPic || '',
      source: lead?.source || '',
      address: lead?.address || '',
      notes: lead?.notes || '',
      status: lead?.status || '',
      followUp1: lead?.followUp1 || null,
      followUp2: lead?.followUp2 || null,
      followUp3: lead?.followUp3 || null,
      followUp4: lead?.followUp4 || null,
      followUp5: lead?.followUp5 || null,
    });
    navigate(`/leads/${id}`);
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
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Lead</h1>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => navigate(`/leads/${id}`)}>Back</button>
            <button className="btn-primary" onClick={save}>Save</button>
          </div>
        </div>
        {error && (
          <div className="card mb-4 bg-red-500/20 border-red-500"><p className="text-red-400">{error}</p></div>
        )}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" value={lead?.name || ''} onChange={(e)=>setLead((l)=>({...l,name:e.target.value}))} placeholder="Nama" />
            <input className="input" value={lead?.phone || ''} onChange={(e)=>setLead((l)=>({...l,phone:e.target.value}))} placeholder="HP" />
            <input className="input" value={lead?.username || ''} onChange={(e)=>setLead((l)=>({...l,username:e.target.value}))} placeholder="IG/TikTok" />
            <div>
              <DropdownEditor kind="CS PIC" options={csPicOptions} value={lead?.csPic || ''} onChange={(v)=>setLead((l)=>({...l,csPic:v}))} canDelete={()=>!!lead?.csPic} onCreate={async (label)=>{ const next=[...csPicOptions,label]; setClientDetail((prev)=>({...prev, csPicOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{csPicOptions:next}); setLead((l)=>({...l,csPic:label})); }} onDelete={async (label)=>{ const next=csPicOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, csPicOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{csPicOptions:next}); if(lead?.csPic===label) setLead((l)=>({...l,csPic:''})); }} placeholder="-" />
            </div>
            <div>
              <DropdownEditor kind="Sumber" options={sourceOptions} value={lead?.source || ''} onChange={(v)=>setLead((l)=>({...l,source:v}))} canDelete={(label)=>label && !DEFAULT_SOURCE.includes(label)} onCreate={async (label)=>{ const next=[...sourceOptions,label]; setClientDetail((prev)=>({...prev, leadSourceOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadSourceOptions:next}); setLead((l)=>({...l,source:label})); }} onDelete={async (label)=>{ if(DEFAULT_SOURCE.includes(label))return; const next=sourceOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, leadSourceOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadSourceOptions:next}); if(lead?.source===label) setLead((l)=>({...l,source: sourceOptions[0]||''})); }} placeholder="-" />
            </div>
            <input className="input" value={lead?.address || ''} onChange={(e)=>setLead((l)=>({...l,address:e.target.value}))} placeholder="Alamat" />
            <input className="input" value={lead?.notes || ''} onChange={(e)=>setLead((l)=>({...l,notes:e.target.value}))} placeholder="Catatan" />
            <div>
              <DropdownEditor kind="Status" options={statusOptions} value={lead?.status || ''} onChange={(v)=>setLead((l)=>({...l,status:v}))} canDelete={(label)=>label && !DEFAULT_STATUS.includes(label)} onCreate={async (label)=>{ const next=[...statusOptions,label]; setClientDetail((prev)=>({...prev, leadStatusOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadStatusOptions:next}); setLead((l)=>({...l,status:label})); }} onDelete={async (label)=>{ if(DEFAULT_STATUS.includes(label))return; const next=statusOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, leadStatusOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ leadStatusOptions:next}); if(lead?.status===label) setLead((l)=>({...l,status: statusOptions[0]||''})); }} placeholder="-" />
            </div>
            {[1,2,3,4,5].map((n)=> (
              <input key={n} type="date" className="input" value={(lead?.[`followUp${n}`] || '').slice ? (lead?.[`followUp${n}`] || '').slice(0,10) : ''} onChange={(e)=>setLead((l)=>({...l,[`followUp${n}`]: e.target.value}))} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditLeadPage;
