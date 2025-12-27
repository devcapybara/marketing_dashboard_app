import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const formatCurrency = (v) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v||0);
const formatPercent = (v) => `${new Intl.NumberFormat('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v||0)}%`;

const CalculatorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('calculator_saves') || '[]');
      const found = list.find((x) => String(x.id) === String(id));
      setItem(found || null);
      setNotes(found?.notes || '');
    } catch {
      setItem(null);
    }
  }, [id]);

  const saveNotes = () => {
    try {
      const list = JSON.parse(localStorage.getItem('calculator_saves') || '[]');
      const next = list.map((x) => (String(x.id) === String(id) ? { ...x, notes } : x));
      localStorage.setItem('calculator_saves', JSON.stringify(next));
      alert('Perubahan disimpan');
    } catch {}
  };

  if (!item) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="card">
            <div className="p-4">Data tidak ditemukan</div>
            <div className="p-4">
              <button className="btn-secondary" onClick={()=>navigate('/calculator')}>Back</button>
            </div>
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
            <h1 className="text-3xl font-bold">Detail Simulasi</h1>
            <p className="text-dark-text-muted">{new Date(item.createdAt).toLocaleString('id-ID')}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={()=>navigate('/calculator')}>Back</button>
            <button className="btn-secondary" onClick={()=>navigate(`/calculator/${item.id}/edit`)}>Edit</button>
            <button className="btn-primary" onClick={saveNotes}>Save</button>
          </div>
        </div>

        {(() => {
          const baseCost = (item.manpowerWage||0) + (item.operationalCost||0) + (item.toolsCost||0) || item.hpp || 0;
          const marketingAmt = (item.price||0) * ((item.marketingPercent||0)/100);
          const profitAmt = (item.price||0) * ((item.profitPercent||0)/100);
          return (
            <>
              {item.businessType==='JASA' && (
                <div className="card mb-6">
                  <div className="font-semibold mb-2">Breakdown</div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="flex justify-between"><span>Biaya Dasar (Upah + Operasional + Alat/Software)</span><span>{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(baseCost)}</span></div>
                    <div className="flex justify-between"><span>Biaya Marketing</span><span>{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(marketingAmt)}</span></div>
                    <div className="flex justify-between"><span>Profit Bisnis</span><span>{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(profitAmt)}</span></div>
                  </div>
                </div>
              )}
              {item.businessType==='JASA' && (
                <div className="card mb-6">
                  <div className="font-semibold mb-2">Tier Pricing Generator <span className="ml-1 text-xs text-dark-text-muted" title="Basic: layanan standar. Pro: prioritas/revisi tambahan. Sultan: all-in atau express 24 jam">ⓘ</span></div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="flex justify-between"><span>Paket Basic <span className="ml-1 text-xs text-dark-text-muted" title="Paket Basic (Sesuai Hitungan): Deskripsi: Layanan standar.">ⓘ</span></span><span className="font-medium">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(item.price||0)}</span></div>
                    <div className="flex justify-between"><span>Paket Pro (1.5x) <span className="ml-1 text-xs text-dark-text-muted" title="Paket Pro (Mark up 1.5x): Strategi: Tambahkan fitur Prioritas atau Revisi Tambahan. Margin profit jadi tebal.">ⓘ</span></span><span className="font-medium">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format((item.price||0)*1.5)}</span></div>
                    <div className="flex justify-between"><span>Paket Sultan (3x) <span className="ml-1 text-xs text-dark-text-muted" title="Paket Sultan (Mark up 3x): Strategi: Paket All in One atau Express 24 Jam.">ⓘ</span></span><span className="font-medium">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format((item.price||0)*3)}</span></div>
                  </div>
                </div>
              )}
            </>
          );
        })()}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm text-dark-text-muted">Produk</div>
                <div className="font-semibold">{item.productName || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-dark-text-muted">Jenis</div>
                <div className="font-semibold">{item.businessType?.replace('_',' ')}</div>
              </div>
              {item.businessType === 'PRODUK_DIGITAL' ? (
                <>
                  <div>
                    <div className="text-sm text-dark-text-muted">Target Bersih per Unit</div>
                    <div className="font-semibold">{formatCurrency(item.targetNetIncome)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-muted">Marketing%</div>
                    <div className="font-semibold">{formatPercent(item.marketingPercent)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-muted">Affiliate%</div>
                    <div className="font-semibold">{formatPercent(item.affiliatePercent)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-muted">Admin</div>
                    <div className="font-semibold">{item.adminType==='PERCENT'? formatPercent(item.adminValue) : formatCurrency(item.adminValue)}</div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="text-sm text-dark-text-muted">HPP</div>
                    <div className="font-semibold">{formatCurrency(item.hpp)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-muted">Marketing%</div>
                    <div className="font-semibold">{formatPercent(item.marketingPercent)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-muted">Profit%</div>
                    <div className="font-semibold">{formatPercent(item.profitPercent)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-dark-text-muted">Admin</div>
                    <div className="font-semibold">{item.adminType==='PERCENT'? formatPercent(item.adminValue) : formatCurrency(item.adminValue)}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="card">
            <div className="space-y-2">
              <div className="flex justify-between"><span>Harga Jual</span><span className="font-semibold">{formatCurrency(item.price)}</span></div>
              <div className="flex justify-between"><span>BEP</span><span>{formatCurrency(item.bep)}</span></div>
              <div className="flex justify-between"><span>CPA Max</span><span>{formatCurrency(item.cpaMax)}</span></div>
              <div className="flex justify-between"><span>ROAS</span><span>{item.roasTarget?.toFixed?.(2)}x</span></div>
              <div className="flex justify-between"><span>Budget Marketing per Unit</span><span>{formatCurrency(item.marketingBudget)}</span></div>
              <div className="flex justify-between"><span>Diskon</span><span>{formatPercent(item.discountPercent)}</span></div>
              <div className="flex justify-between"><span>Harga Diskon</span><span>{formatCurrency(item.priceAfterDiscount)}</span></div>
              <div className="flex justify-between"><span>Net Profit Diskon</span><span>{formatCurrency(item.netProfitAfterDiscount)}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 card">
          <h3 className="text-lg font-semibold mb-2">Simulasi Skala Iklan</h3>
          <div className="grid md:grid-cols-4 gap-3">
            <div className="flex justify-between"><span>Budget</span><span>{formatCurrency(item.scaleBudget)}</span></div>
            <div className="flex justify-between"><span>Estimasi Omset</span><span>{formatCurrency(item.estimatedOmset)}</span></div>
            <div className="flex justify-between"><span>Estimasi Penjualan</span><span>{item.estimatedSales} pcs</span></div>
            <div className="flex justify-between"><span>Estimasi Profit Bersih</span><span>{formatCurrency(item.estimatedProfit)}</span></div>
          </div>
        </div>

        <div className="mt-6 card">
          <label className="block text-sm mb-2">Catatan</label>
          <textarea className="input w-full h-32" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Catatan strategi atau observasi" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalculatorDetailPage;
