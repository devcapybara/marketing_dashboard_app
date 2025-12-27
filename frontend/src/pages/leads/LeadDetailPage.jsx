import { useEffect, useMemo, useState, useRef } from 'react';
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
  const [transactions, setTransactions] = useState([]);
  const [newTx, setNewTx] = useState({ date: '', product: '', amount: '', paymentMethod: '', attachment: '' });
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const [txPage, setTxPage] = useState(1);
  const [txLimit, setTxLimit] = useState(14);

  const statusOptions = useMemo(() => clientDetail?.leadStatusOptions || ['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'], [clientDetail]);
  const sourceOptions = useMemo(() => clientDetail?.leadSourceOptions || ['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'], [clientDetail]);
  const csPicOptions = useMemo(() => clientDetail?.csPicOptions || [], [clientDetail]);
  const productOptions = useMemo(() => clientDetail?.productOptions || ['Jasa Konsultasi','Paket Desain','Produk Fisik'], [clientDetail]);
  const paymentOptions = useMemo(() => clientDetail?.paymentMethodOptions || ['Transfer','Tunai','QRIS'], [clientDetail]);

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
    try {
      const v = JSON.parse(localStorage.getItem(`lead_transactions_${id}`) || '[]');
      setTransactions(Array.isArray(v) ? v : []);
    } catch {}
  }, [id]);

  const persistTx = (list) => {
    setTransactions(list);
    try { localStorage.setItem(`lead_transactions_${id}`, JSON.stringify(list)); } catch {}
  };

  const formatCurrency = (v) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Number(v||0));

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

        <div className="mt-6 card overflow-hidden" ref={cardRef}>
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-lg font-semibold">Transaksi</h3>
          </div>
          <div className="overflow-x-auto no-x-scrollbar relative" ref={scrollRef}>
            <table className="table-auto table-compact min-w-[1400px]">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-center p-2">No.</th>
                  <th className="text-center p-4 font-semibold">Tanggal</th>
                  <th className="text-center p-4 font-semibold">Produk/Layanan</th>
                  <th className="text-center p-4 font-semibold">Jumlah Harga</th>
                  <th className="text-center p-4 font-semibold">Metode Pembayaran</th>
                  <th className="text-center p-4 font-semibold">Lampiran</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-dark-border bg-dark-card">
                  <td className="p-2 text-center w-[80px]">{transactions.length + 1}</td>
                  <td className="p-2"><input type="date" className="input w-full" value={newTx.date} onChange={(e)=>setNewTx((t)=>({...t,date:e.target.value}))} /></td>
                  <td className="p-2">
                    <DropdownEditor kind="Produk/Layanan" options={productOptions} value={newTx.product} onChange={(v)=>setNewTx((t)=>({...t,product:v}))}
                      canDelete={(label)=>label && !['Jasa Konsultasi','Paket Desain','Produk Fisik'].includes(label)}
                      onCreate={async (label)=>{ const next=[...productOptions,label]; setClientDetail((prev)=>({...prev, productOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ productOptions:next}); setNewTx((t)=>({...t,product:label})); }}
                      onDelete={async (label)=>{ if(['Jasa Konsultasi','Paket Desain','Produk Fisik'].includes(label))return; const next=productOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, productOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ productOptions:next}); if(newTx.product===label) setNewTx((t)=>({...t,product:''})); }} placeholder="Pilih" />
                  </td>
                  <td className="p-2"><input type="number" className="input w-full" value={newTx.amount} onChange={(e)=>setNewTx((t)=>({...t,amount:e.target.value}))} placeholder="0" /></td>
                  <td className="p-2">
                    <DropdownEditor kind="Metode Pembayaran" options={paymentOptions} value={newTx.paymentMethod} onChange={(v)=>setNewTx((t)=>({...t,paymentMethod:v}))}
                      canDelete={(label)=>label && !['Transfer','Tunai','QRIS'].includes(label)}
                      onCreate={async (label)=>{ const next=[...paymentOptions,label]; setClientDetail((prev)=>({...prev, paymentMethodOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ paymentMethodOptions:next}); setNewTx((t)=>({...t,paymentMethod:label})); }}
                      onDelete={async (label)=>{ if(['Transfer','Tunai','QRIS'].includes(label))return; const next=paymentOptions.filter((o)=>o!==label); setClientDetail((prev)=>({...prev, paymentMethodOptions:next})); await api.put(`/api/clients/${lead?.clientId}/lead-settings`,{ paymentMethodOptions:next}); if(newTx.paymentMethod===label) setNewTx((t)=>({...t,paymentMethod:''})); }} placeholder="Pilih" />
                  </td>
                  <td className="p-2"><input className="input w-full" value={newTx.attachment} onChange={(e)=>setNewTx((t)=>({...t,attachment:e.target.value}))} placeholder="Link lampiran (opsional)" /></td>
                  <td className="p-2">
                    <button className="btn-primary" onClick={()=>{ const item={ id: Date.now(), date:newTx.date, product:newTx.product, amount:Number(newTx.amount||0), paymentMethod:newTx.paymentMethod, attachment:newTx.attachment }; const next=[item,...transactions]; persistTx(next); setNewTx({ date:'', product:'', amount:'', paymentMethod:'', attachment:'' }); }}>Simpan</button>
                  </td>
                </tr>
                {transactions.length===0 && (
                  <tr>
                    <td className="p-6 text-center text-dark-text-muted" colSpan={7}>Belum ada transaksi</td>
                  </tr>
                )}
                {transactions.slice((txPage-1)*txLimit, (txPage-1)*txLimit + txLimit).map((tx, i)=> (
                  <tr key={tx.id} className="border-b border-dark-border hover:bg-dark-surface">
                    <td className="p-2 text-center w-[80px]">{((txPage-1)*txLimit) + i + 1}</td>
                    <td className="p-4 text-center">{tx.date ? new Date(tx.date).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="p-4 text-center text-dark-text-muted">{tx.product || '-'}</td>
                    <td className="p-4 text-center font-medium">{formatCurrency(tx.amount)}</td>
                    <td className="p-4 text-center text-dark-text-muted">{tx.paymentMethod || '-'}</td>
                    <td className="p-4 text-center text-dark-text-muted">{tx.attachment ? <a href={tx.attachment} target="_blank" rel="noopener noreferrer" className="text-primary">Lampiran</a> : '-'}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-primary hover:text-primary-hover text-sm" onClick={()=>alert(JSON.stringify(tx,null,2))}>View</button>
                        <button className="text-red-400 hover:text-red-300 text-sm" onClick={()=>{ const next=transactions.filter((t)=>t.id!==tx.id); persistTx(next); }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length>0 && (()=>{
                  const totalAmount = transactions.reduce((s,t)=> s + Number(t.amount||0), 0);
                  return (
                    <tr className="border-t border-dark-border bg-dark-card">
                      <td className="p-4 text-right font-semibold" colSpan={3}>Total</td>
                      <td className="p-4 text-center font-semibold">{formatCurrency(totalAmount)}</td>
                      <td className="p-4 text-center font-semibold" colSpan={3}></td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-2 px-4 py-2">
            <select className="input w-24" value={txLimit} onChange={(e)=>{ setTxLimit(Number(e.target.value)); setTxPage(1); }}>
              <option value="7">7</option>
              <option value="14">14</option>
              <option value="31">31</option>
              <option value="60">60</option>
              <option value="90">90</option>
            </select>
            <button className="btn-secondary" disabled={txPage<=1} onClick={()=>setTxPage((p)=>Math.max(1,p-1))}>Prev</button>
            <span className="text-sm">Page {txPage} / {Math.max(1, Math.ceil(transactions.length / txLimit))}</span>
            <button className="btn-secondary" disabled={txPage>=Math.ceil(transactions.length/txLimit)} onClick={()=>setTxPage((p)=>p+1)}>Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadDetailPage;
