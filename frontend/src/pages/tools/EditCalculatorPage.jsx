import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

function percentToDecimal(p){ return Math.max(0, Math.min(100, Number(p||0))) / 100; }
const formatCurrency = (v) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v||0);

const EditCalculatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('calculator_saves') || '[]');
      const found = list.find((x) => String(x.id) === String(id));
      setData(found || null);
      setNotes(found?.notes || '');
    } catch { setData(null); }
  }, [id]);

  if (!data) {
    return (
      <DashboardLayout>
        <div className="container mx-auto">
          <div className="card p-4">Data tidak ditemukan</div>
        </div>
      </DashboardLayout>
    );
  }

  const save = () => {
    const m = percentToDecimal(data.marketingPercent);
    const adminP = data.adminType==='PERCENT' ? percentToDecimal(data.adminValue) : 0;
    const adminFixed = data.adminType==='FIXED' ? Number(data.adminValue||0) : 0;
    const aff = percentToDecimal(data.affiliatePercent||0);
    const mEff = m + aff;

    let price = 0, marketingBudget = 0, roasTarget = 0, cpaMax = 0, bep = 0;
    if (data.businessType === 'PRODUK_DIGITAL') {
      const net = Number(data.targetNetIncome||0);
      const denom = 1 - (mEff + adminP);
      price = denom > 0 ? ((net + adminFixed) / denom) : 0;
      marketingBudget = price * mEff;
      roasTarget = marketingBudget > 0 ? (price / marketingBudget) : 0;
      cpaMax = marketingBudget;
      const denomBep = 1 - (mEff + adminP);
      bep = denomBep > 0 ? (adminFixed / denomBep) : 0;
    } else {
      const prof = percentToDecimal(data.profitPercent);
      const denom = 1 - (m + prof + adminP);
      const basePrice = denom > 0 ? (Number(data.hpp||0) / denom) : 0;
      price = data.adminType==='FIXED' ? (basePrice + adminFixed) : basePrice;
      marketingBudget = price * m;
      roasTarget = marketingBudget > 0 ? (price / marketingBudget) : 0;
      cpaMax = marketingBudget;
      const denomBep = 1 - (m + adminP);
      const bepBase = denomBep > 0 ? (Number(data.hpp||0) / denomBep) : 0;
      bep = data.adminType==='FIXED' ? (bepBase + adminFixed) : bepBase;
    }

    const priceAfterDiscount = price * (1 - percentToDecimal(data.discountPercent));
    const netProfitAfterDiscount = data.businessType==='PRODUK_DIGITAL'
      ? (priceAfterDiscount - (priceAfterDiscount*mEff + priceAfterDiscount*adminP + adminFixed))
      : (priceAfterDiscount - (Number(data.hpp||0) + priceAfterDiscount*m + priceAfterDiscount*adminP + adminFixed));

    try {
      const list = JSON.parse(localStorage.getItem('calculator_saves') || '[]');
      const next = list.map((x)=> String(x.id)===String(id) ? {
        ...data,
        price,
        bep,
        marketingBudget,
        cpaMax,
        roasTarget,
        priceAfterDiscount,
        netProfitAfterDiscount,
        notes,
      } : x);
      localStorage.setItem('calculator_saves', JSON.stringify(next));
      alert('Perubahan disimpan');
      navigate(`/calculator/${id}`);
    } catch {}
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Simulasi</h1>
            <p className="text-dark-text-muted">{new Date(data.createdAt).toLocaleString('id-ID')}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={()=>navigate(`/calculator/${id}`)}>Back</button>
            <button className="btn-primary" onClick={save}>Save</button>
          </div>
        </div>

        <div className="card">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Nama Produk</label>
              <input className="input w-full" value={data.productName||''} onChange={(e)=>setData({...data, productName:e.target.value})} />
            </div>
            <div>
              <label className="block text-sm mb-2">Jenis</label>
              <select className="input w-full" value={data.businessType} onChange={(e)=>setData({...data, businessType:e.target.value})}>
                <option value="JASA">Jasa</option>
                <option value="PRODUK_FISIK">Produk Fisik</option>
                <option value="PRODUK_DIGITAL">Produk Digital</option>
              </select>
            </div>
            {data.businessType !== 'PRODUK_DIGITAL' ? (
              <div>
                <label className="block text-sm mb-2">HPP</label>
                <input type="number" className="input w-full" value={data.hpp} onChange={(e)=>setData({...data, hpp:Number(e.target.value)})} />
              </div>
            ) : (
              <div>
                <label className="block text-sm mb-2">Target Bersih (Rp)</label>
                <input type="number" className="input w-full" value={data.targetNetIncome||0} onChange={(e)=>setData({...data, targetNetIncome:Number(e.target.value)})} />
              </div>
            )}
            <div>
              <label className="block text-sm mb-2">Marketing (%)</label>
              <input type="number" className="input w-full" value={data.marketingPercent} onChange={(e)=>setData({...data, marketingPercent:Number(e.target.value)})} />
            </div>
            {data.businessType !== 'PRODUK_DIGITAL' ? (
              <div>
                <label className="block text-sm mb-2">Profit (%)</label>
                <input type="number" className="input w-full" value={data.profitPercent} onChange={(e)=>setData({...data, profitPercent:Number(e.target.value)})} />
              </div>
            ) : (
              <div>
                <label className="block text-sm mb-2">Affiliate (%)</label>
                <input type="number" className="input w-full" value={data.affiliatePercent||0} onChange={(e)=>setData({...data, affiliatePercent:Number(e.target.value)})} />
              </div>
            )}
            <div>
              <label className="block text-sm mb-2">Admin Tipe</label>
              <select className="input w-full" value={data.adminType} onChange={(e)=>setData({...data, adminType:e.target.value})}>
                <option value="PERCENT">%</option>
                <option value="FIXED">Rp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Admin Nilai</label>
              <input type="number" className="input w-full" value={data.adminValue} onChange={(e)=>setData({...data, adminValue:Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm mb-2">Diskon (%)</label>
              <input type="number" className="input w-full" value={data.discountPercent} onChange={(e)=>setData({...data, discountPercent:Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm mb-2">Budget Iklan</label>
              <input type="number" className="input w-full" value={data.scaleBudget} onChange={(e)=>setData({...data, scaleBudget:Number(e.target.value)})} />
            </div>
          </div>
        </div>

        <div className="mt-6 card">
          <label className="block text-sm mb-2">Catatan</label>
          <textarea className="input w-full h-32" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Catatan strategi atau observasi" />
        </div>

        <div className="mt-6 card">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="flex justify-between"><span>Harga Jual</span><span className="font-semibold">{formatCurrency(data.price)}</span></div>
            <div className="flex justify-between"><span>BEP</span><span>{formatCurrency(data.bep)}</span></div>
            <div className="flex justify-between"><span>CPA Max</span><span>{formatCurrency(data.cpaMax)}</span></div>
            <div className="flex justify-between"><span>ROAS</span><span>{data.roasTarget?.toFixed?.(2)}x</span></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditCalculatorPage;
