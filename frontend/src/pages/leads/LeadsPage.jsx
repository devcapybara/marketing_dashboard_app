import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { leadService } from '../../services/leadService';
import { clientService } from '../../services/clientService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_STATUS = ['Tidak ada balasan','Masih tanya-tanya','Potensial','Closing','Retensi'];
const DEFAULT_SOURCE = ['Google Ads','TikTok Ads','Facebook','Instagram','Teman','Pelanggan Lama','Organik'];

const LeadsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(user?.role === 'CLIENT' ? user?.clientId : '');
  const [clientDetail, setClientDetail] = useState(null);

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
            leadService.list(activeClientId),
            clientService.getClientById(activeClientId),
          ]);
          setLeads(leadsRes?.data || []);
          setClientDetail(clientRes?.data || null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Gagal memuat leads');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user?.role, user?.clientId, clientId]);

  const refreshLeads = async () => {
    const res = await leadService.list(clientId || user?.clientId);
    setLeads(res?.data || []);
  };

  const createLead = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      clientId: clientId || user?.clientId,
      name: form.get('name'),
      phone: form.get('phone'),
      username: form.get('username'),
      csPic: form.get('csPic'),
      source: form.get('source'),
      address: form.get('address'),
      notes: form.get('notes'),
      status: form.get('status'),
      followUp1: form.get('followUp1') || null,
      followUp2: form.get('followUp2') || null,
      followUp3: form.get('followUp3') || null,
      followUp4: form.get('followUp4') || null,
      followUp5: form.get('followUp5') || null,
    };
    await leadService.create(payload);
    e.currentTarget.reset();
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CRM Leads</h1>
            <p className="text-dark-text-muted">Kelola leads dan status follow‑up</p>
          </div>
          {user?.role === 'ADMIN' && (
            <select className="input w-60" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">Pilih Client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.name || c.companyName || c._id}</option>
              ))}
            </select>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card md:col-span-2">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="text-left">
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
                  {leads.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-dark-text-muted" colSpan={13}>Belum ada leads</td>
                    </tr>
                  ) : (
                    leads.map((l) => (
                      <tr key={l._id} className="border-t border-dark-border">
                        <td className="px-4 py-2">{l.name}</td>
                        <td className="px-4 py-2">{l.phone}</td>
                        <td className="px-4 py-2">{l.username}</td>
                        <td className="px-4 py-2">
                          <select className="input" value={l.csPic || ''} onChange={(e) => updateLeadField(l._id, 'csPic', e.target.value)}>
                            <option value="">-</option>
                            {csPicOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <select className="input" value={l.source || ''} onChange={(e) => updateLeadField(l._id, 'source', e.target.value)}>
                            {sourceOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                          </select>
                        </td>
                        <td className="px-4 py-2">{l.address}</td>
                        <td className="px-4 py-2">{l.notes}</td>
                        <td className="px-4 py-2">
                          <select className="input" value={l.status || ''} onChange={(e) => updateLeadField(l._id, 'status', e.target.value)}>
                            {statusOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                          </select>
                        </td>
                        {[1,2,3,4,5].map((n) => (
                          <td key={n} className="px-2 py-2">
                            <input type="date" className="input" value={(l[`followUp${n}`] || '').slice ? (l[`followUp${n}`] || '').slice(0,10) : ''} onChange={(e) => updateLeadField(l._id, `followUp${n}`, e.target.value)} />
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Tambah Lead</h3>
            <form onSubmit={createLead} className="space-y-3">
              <input name="name" className="input w-full" placeholder="Nama" required />
              <input name="phone" className="input w-full" placeholder="Nomor HP" />
              <input name="username" className="input w-full" placeholder="Username IG/TikTok" />
              <select name="csPic" className="input w-full">
                <option value="">Pilih CS PIC</option>
                {csPicOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              <select name="source" className="input w-full" defaultValue={sourceOptions[0]}>
                {sourceOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              <input name="address" className="input w-full" placeholder="Alamat" />
              <textarea name="notes" className="input w-full" rows={3} placeholder="Catatan" />
              <select name="status" className="input w-full" defaultValue={statusOptions[0]}>
                {statusOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3,4,5].map((n) => (
                  <input key={n} type="date" name={`followUp${n}`} className="input" />
                ))}
              </div>
              <button className="btn-primary w-full" type="submit">Simpan</button>
            </form>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Pengaturan Dropdown</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget);
                const payload = {
                  leadSourceOptions: form.get('leadSourceOptions').split(',').map((s) => s.trim()).filter(Boolean),
                  leadStatusOptions: form.get('leadStatusOptions').split(',').map((s) => s.trim()).filter(Boolean),
                  csPicOptions: form.get('csPicOptions').split(',').map((s) => s.trim()).filter(Boolean),
                };
                await api.put(`/api/clients/${clientId || user?.clientId}/lead-settings`, payload);
                const clientRes = await clientService.getClientById(clientId || user?.clientId);
                setClientDetail(clientRes?.data || null);
              }}
              className="space-y-3"
            >
              <label className="text-sm text-dark-text-muted">Sumber (pisahkan dengan koma)</label>
              <textarea name="leadSourceOptions" className="input w-full" rows={2} defaultValue={(sourceOptions || []).join(', ')} />
              <label className="text-sm text-dark-text-muted">Status (pisahkan dengan koma)</label>
              <textarea name="leadStatusOptions" className="input w-full" rows={2} defaultValue={(statusOptions || []).join(', ')} />
              <label className="text-sm text-dark-text-muted">CS PIC (pisahkan dengan koma)</label>
              <textarea name="csPicOptions" className="input w-full" rows={2} defaultValue={(csPicOptions || []).join(', ')} />
              <button className="btn-secondary w-full" type="submit">Simpan Pengaturan</button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeadsPage;
