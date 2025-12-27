import { useState, useMemo, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import BottomScrollSync from '../../components/common/BottomScrollSync';
import { useNavigate } from 'react-router-dom';

const presets = {
  JASA: { marketingMin: 5, marketingMax: 15 },
  PRODUK_FISIK: { marketingMin: 20, marketingMax: 30 },
  PRODUK_DIGITAL: { marketingMin: 40, marketingMax: 50 },
};

function percentToDecimal(p) { return Math.max(0, Math.min(100, Number(p||0))) / 100; }

const CalculatorPage = () => {
  const { user } = useAuth();
  const [businessType, setBusinessType] = useState('PRODUK_FISIK');
  const [productName, setProductName] = useState('');
  const [hpp, setHpp] = useState('');
  const [marketingPercent, setMarketingPercent] = useState(25);
  const [profitPercent, setProfitPercent] = useState(20);
  const [adminType, setAdminType] = useState('PERCENT');
  const [adminValue, setAdminValue] = useState(5);
  const [discountPercent, setDiscountPercent] = useState('');
  const [scaleBudget, setScaleBudget] = useState('1000000');
  const [waNumber, setWaNumber] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [affiliatePercent, setAffiliatePercent] = useState(0);
  const [targetNetIncome, setTargetNetIncome] = useState('');
  const [manpowerWage, setManpowerWage] = useState('');
  const [operationalCost, setOperationalCost] = useState('');
  const [toolsCost, setToolsCost] = useState('');
  const [showBaseEditor, setShowBaseEditor] = useState(false);
  const [wageHelperOpen, setWageHelperOpen] = useState(false);
  const [monthlySalary, setMonthlySalary] = useState('');
  const [hoursPerMonth, setHoursPerMonth] = useState('160');
  const [projectHours, setProjectHours] = useState('');
  const [saved, setSaved] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(31);
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const recommendationText = useMemo(() => {
    const p = presets[businessType];
    if (!p) return '';
    return `Untuk bisnis ${businessType.replace('_',' ')}, disarankan budget marketing ${p.marketingMin}–${p.marketingMax}% dari omset.`;
  }, [businessType]);
  const productPlaceholder = useMemo(() => {
    if (businessType === 'PRODUK_DIGITAL') return 'Webinar Digital Marketing';
    if (businessType === 'JASA') return 'Jasa Pendirian Perusahaan';
    return 'Sambal Botol 200ml';
  }, [businessType]);

  const costSection = useMemo(() => {
    if (businessType === 'PRODUK_DIGITAL') {
      return (
        <div>
          <label className="block text-sm mb-2">Target Penghasilan Bersih per Unit (Rp)</label>
          <input type="number" className="input w-full" value={targetNetIncome} onChange={(e)=>setTargetNetIncome(e.target.value)} placeholder="50000" />
        </div>
      );
    }
    if (businessType === 'JASA') {
      const computedWage = (Number(monthlySalary||0)/Math.max(1,Number(hoursPerMonth||0)))*Number(projectHours||0) || 0;
      return (
        <div className="card bg-dark-surface">
          <div className="font-semibold mb-2">Biaya Dasar Jasa</div>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm mb-2">Estimasi Upah Pengerjaan</label>
              <input type="number" className="input w-full" value={manpowerWage} onChange={(e)=>setManpowerWage(e.target.value)} placeholder="Contoh: 100000" />
            </div>
            <div>
              <label className="block text-sm mb-2">Biaya Operasional (Transport, Listrik, Kuota)</label>
              <input type="number" className="input w-full" value={operationalCost} onChange={(e)=>setOperationalCost(e.target.value)} placeholder="Contoh: 25000" />
            </div>
            <div>
              <label className="block text-sm mb-2">Biaya Alat & Software (Per Proyek)</label>
              <input type="number" className="input w-full" value={toolsCost} onChange={(e)=>setToolsCost(e.target.value)} placeholder="Contoh: 10000" />
            </div>
          </div>
          <div className="mt-3 p-4 border border-dark-border rounded">
            <div className="grid md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs mb-1">Gaji per bulan</label>
                <input type="number" className="input w-full" value={monthlySalary} onChange={(e)=>setMonthlySalary(e.target.value)} placeholder="5000000" />
              </div>
              <div>
                <label className="block text-xs mb-1">Jam/bulan</label>
                <input type="number" className="input w-full" value={hoursPerMonth} onChange={(e)=>setHoursPerMonth(e.target.value)} placeholder="160" />
              </div>
              <div>
                <label className="block text-xs mb-1">Jam proyek</label>
                <input type="number" className="input w-full" value={projectHours} onChange={(e)=>setProjectHours(e.target.value)} placeholder="5" />
              </div>
              <div className="flex items-end">
                <div className="w-full">
                  <div className="text-xs mb-1">Upah terhitung</div>
                  <div className="font-semibold">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(Math.round(computedWage))}</div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <button className="btn-primary" onClick={()=>setManpowerWage(String(Math.round(computedWage)))}>Gunakan</button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm">Total Biaya Dasar</span>
            <span className="font-semibold">{new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format((Number(manpowerWage||0)+Number(operationalCost||0)+Number(toolsCost||0))||0)}</span>
          </div>
        </div>
      );
    }
    return (
      <div>
        <label className="block text-sm mb-2">HPP (Harga Pokok Penjualan)</label>
        <input type="number" className="input w-full" value={hpp} onChange={(e)=>setHpp(e.target.value)} placeholder="0" />
      </div>
    );
  }, [businessType, targetNetIncome, manpowerWage, operationalCost, toolsCost, monthlySalary, hoursPerMonth, projectHours, hpp]);

  const numbers = useMemo(() => {
    const hppN = businessType==='JASA' 
      ? (Number(manpowerWage||0) + Number(operationalCost||0) + Number(toolsCost||0)) 
      : Number(hpp||0);
    const m = percentToDecimal(marketingPercent);
    const prof = percentToDecimal(profitPercent);
    const adminP = adminType === 'PERCENT' ? percentToDecimal(adminValue) : 0;
    const adminFixed = adminType === 'FIXED' ? Number(adminValue||0) : 0;
    const aff = percentToDecimal(affiliatePercent);
    const mEff = m + aff;

    if (businessType === 'PRODUK_DIGITAL') {
      const net = Number(targetNetIncome||0);
      const denom = 1 - (mEff + adminP);
      const price = denom > 0 ? ((net + adminFixed) / denom) : 0;
      const marketingBudget = price * mEff;
      const roasTarget = marketingBudget > 0 ? (price / marketingBudget) : 0;
      const cpaMax = marketingBudget;
      const denomBep = 1 - (mEff + adminP);
      const bep = denomBep > 0 ? (adminFixed / denomBep) : 0;
      const profitPerUnit = net;
      const adminPercentAmount = price * adminP;
      return { price, bep, cpaMax, roasTarget, marketingBudget, profitPerUnit, adminFixed, adminPercentAmount, m, mEff, prof, adminP };
    }

    const denom = 1 - (m + prof + adminP);
    const basePrice = denom > 0 ? (hppN / denom) : 0;
    const price = adminType === 'FIXED' ? (basePrice + adminFixed) : basePrice;
    const marketingBudget = price * m;
    const roasTarget = marketingBudget > 0 ? (price / marketingBudget) : 0;
    const cpaMax = marketingBudget;
    const denomBep = 1 - (m + adminP);
    const bepBase = denomBep > 0 ? (hppN / denomBep) : 0;
    const bep = adminType === 'FIXED' ? (bepBase + adminFixed) : bepBase;
    const profitPerUnit = price * prof;
    const adminPercentAmount = price * adminP;
    return { price, bep, cpaMax, roasTarget, marketingBudget, profitPerUnit, adminFixed, adminPercentAmount, m, mEff, prof, adminP };
  }, [businessType, hpp, marketingPercent, profitPercent, adminType, adminValue, affiliatePercent, targetNetIncome, manpowerWage, operationalCost, toolsCost]);

  const formatCurrency = (v) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(v||0);
  const formatPercent = (v) => `${new Intl.NumberFormat('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v)}%`;
  const suggestPrices = (p) => {
    const n = Math.max(0, Number(p||0));
    const step = n < 100000 ? 100 : 1000;
    const toEnding = (ending) => {
      const base = Math.floor(n/step)*step;
      return base + ending;
    };
    const s1 = toEnding(step===100?90:900);
    const s2 = Math.round(n/step)*step;
    const s3 = toEnding(step===100? (step-10) : (step-100));
    return [s1, s2, s3].map((x)=> x<100 ? n : x);
  };
  const discounted = useMemo(()=>{
    const d = percentToDecimal(discountPercent);
    const p = numbers.price;
    const pd = p * (1 - d);
    const baseCost = businessType==='JASA' ? (Number(manpowerWage||0)+Number(operationalCost||0)+Number(toolsCost||0)) : Number(hpp||0);
    const mDec = percentToDecimal(marketingPercent);
    const affDec = percentToDecimal(affiliatePercent);
    const adminPerc = adminType==='PERCENT' ? percentToDecimal(adminValue) : 0;
    const adminFix = adminType==='FIXED' ? Number(adminValue||0) : 0;
    const totalMarketing = businessType==='PRODUK_DIGITAL' ? (mDec + affDec) : mDec;
    const net = pd - (baseCost + pd*totalMarketing + pd*adminPerc + adminFix);
    return { priceAfterDiscount: pd, netProfit: net };
  }, [discountPercent, numbers.price, businessType, manpowerWage, operationalCost, toolsCost, hpp, marketingPercent, affiliatePercent, adminType, adminValue]);
  const scaleSim = useMemo(()=>{
    const budget = Number(scaleBudget||0);
    const omset = budget * numbers.roasTarget;
    const sales = numbers.price>0 ? Math.floor(omset / numbers.price) : 0;
    const profit = sales * numbers.profitPerUnit;
    return { budget, omset, sales, profit };
  }, [scaleBudget, numbers]);
  const waMessage = () => {
    const txt = `Kalkulator Harga & Iklan\nHarga Jual: ${formatCurrency(numbers.price)}\nBEP: ${formatCurrency(numbers.bep)}\nMarketing per unit: ${formatCurrency(numbers.marketingBudget)}\nCPA Max: ${formatCurrency(numbers.cpaMax)}\nTarget ROAS: ${numbers.roasTarget.toFixed(2)}x\nDiskon: ${discountPercent||0}% → Harga: ${formatCurrency(discounted.priceAfterDiscount)} → Net: ${formatCurrency(discounted.netProfit)}\nSimulasi Budget: ${formatCurrency(scaleSim.budget)} → Omset: ${formatCurrency(scaleSim.omset)} → Penjualan: ${scaleSim.sales} pcs → Profit: ${formatCurrency(scaleSim.profit)}`;
    return encodeURIComponent(txt);
  };

  const defaultCtaLink = `https://wa.me/${waNumber || ''}?text=${encodeURIComponent('Saya ingin konsultasi iklan untuk mencapai ROAS ' + numbers.roasTarget.toFixed(2) + 'x.')}`;

  const effectiveCtaLink = ctaUrl && ctaUrl.trim().length > 0 ? ctaUrl : defaultCtaLink;

  const loadCtaUrl = () => {
    try { const v = localStorage.getItem('calculator_cta_url'); if (v) setCtaUrl(v); } catch {}
  };
  const saveCtaUrl = () => {
    try { localStorage.setItem('calculator_cta_url', ctaUrl || ''); alert('CTA URL disimpan'); } catch {}
  };

  const loadSaved = () => {
    try { const v = JSON.parse(localStorage.getItem('calculator_saves') || '[]'); setSaved(Array.isArray(v)?v:[]); } catch { setSaved([]); }
  };
  const persistSaved = (list) => {
    setSaved(list);
    try { localStorage.setItem('calculator_saves', JSON.stringify(list)); } catch {}
  };
  useEffect(()=>{ loadCtaUrl(); loadSaved(); }, []);

  const saveCurrent = () => {
    const baseCost = businessType==='JASA' ? (Number(manpowerWage||0)+Number(operationalCost||0)+Number(toolsCost||0)) : Number(hpp||0);
    const item = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      productName,
      businessType,
      hpp: baseCost,
      marketingPercent: Number(marketingPercent||0),
      profitPercent: Number(profitPercent||0),
      adminType,
      adminValue: Number(adminValue||0),
      discountPercent: Number(discountPercent||0),
      scaleBudget: Number(scaleBudget||0),
      affiliatePercent: Number(affiliatePercent||0),
      targetNetIncome: Number(targetNetIncome||0),
      manpowerWage: Number(manpowerWage||0),
      operationalCost: Number(operationalCost||0),
      toolsCost: Number(toolsCost||0),
      price: numbers.price,
      bep: numbers.bep,
      marketingBudget: numbers.marketingBudget,
      cpaMax: numbers.cpaMax,
      roasTarget: numbers.roasTarget,
      priceAfterDiscount: discounted.priceAfterDiscount,
      netProfitAfterDiscount: discounted.netProfit,
      estimatedOmset: scaleSim.omset,
      estimatedSales: scaleSim.sales,
      estimatedProfit: scaleSim.profit,
    };
    const next = [item, ...saved];
    persistSaved(next);
    alert('Simulasi disimpan');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Kalkulator Harga & Iklan</h1>
          <p className="text-dark-text-muted">Hitung harga jual optimal, BEP, CPA maksimal, dan target ROAS.</p>
          {user?.role === 'SUPER_ADMIN' && (
            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-2">CTA URL tombol “Konsultasi Iklan Sekarang”</label>
                <input className="input w-full" value={ctaUrl} onChange={(e)=>setCtaUrl(e.target.value)} placeholder="https://..." onFocus={loadCtaUrl} />
              </div>
              <button className="btn-primary" onClick={saveCtaUrl}>Simpan</button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-2">Jenis Bisnis</label>
                <select className="input w-full" value={businessType} onChange={(e)=>{
                  const val = e.target.value; setBusinessType(val);
                  const p = presets[val]; if (p) setMarketingPercent(Math.round((p.marketingMin+p.marketingMax)/2));
                }}>
                  <option value="JASA">Jasa</option>
                  <option value="PRODUK_FISIK">Produk Fisik</option>
                  <option value="PRODUK_DIGITAL">Produk Digital</option>
                </select>
                <p className="text-xs text-dark-text-muted mt-1">{recommendationText}</p>
              </div>
              <div>
                <label className="block text-sm mb-2">Nama Produk</label>
                <input className="input w-full" value={productName} onChange={(e)=>setProductName(e.target.value)} placeholder={productPlaceholder} />
              </div>
              {costSection}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Marketing (%) <span className="ml-1 text-xs text-dark-text-muted" title="Biaya iklan per unit sebagai persen dari harga jual">ⓘ</span></label>
                  <input type="number" className="input w-full" value={marketingPercent} onChange={(e)=>setMarketingPercent(e.target.value)} min={0} max={100} />
                </div>
                {businessType !== 'PRODUK_DIGITAL' ? (
                  <div>
                    <label className="block text-sm mb-2">Target Net Profit (%) <span className="ml-1 text-xs text-dark-text-muted" title="Persentase keuntungan bersih yang diinginkan dari harga jual">ⓘ</span></label>
                    <input type="number" className="input w-full" value={profitPercent} onChange={(e)=>setProfitPercent(e.target.value)} min={0} max={100} />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm mb-2">Komisi Afiliasi (%)</label>
                    <input type="number" className="input w-full" value={affiliatePercent} onChange={(e)=>setAffiliatePercent(e.target.value)} min={0} max={100} />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm mb-2">Biaya Platform/Admin <span className="ml-1 text-xs text-dark-text-muted" title="Fee marketplace atau biaya admin per unit, dalam persen atau rupiah">ⓘ</span></label>
                <div className="flex gap-2">
                  <select className="input w-40" value={adminType} onChange={(e)=>setAdminType(e.target.value)}>
                    <option value="PERCENT">%</option>
                    <option value="FIXED">Rp</option>
                  </select>
                  <input type="number" className="input flex-1" value={adminValue} onChange={(e)=>setAdminValue(e.target.value)} />
                </div>
                <p className="text-xs text-dark-text-muted mt-1">Contoh: Marketplace fee 5–8% atau biaya tetap per unit.</p>
              </div>
              <div>
                <label className="block text-sm mb-2">Rencana Diskon (%)</label>
                <input type="number" className="input w-full" value={discountPercent} onChange={(e)=>setDiscountPercent(e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="block text-sm mb-2">Simulasi Skala Iklan — Budget</label>
                <input type="number" className="input w-full" value={scaleBudget} onChange={(e)=>setScaleBudget(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-semibold mb-3">Hasil</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Rekomendasi Harga Jual</span><span className="font-semibold">{formatCurrency(numbers.price)}</span></div>
              <div className="flex justify-between"><span>Break Even Price (BEP)</span><span>{formatCurrency(numbers.bep)}</span></div>
              <div className="flex justify-between"><span>Budget Marketing per Unit</span><span>{formatCurrency(numbers.marketingBudget)}</span></div>
              <div className="flex justify-between"><span>Maksimal CPA (Cost per Acquisition)</span><span>{formatCurrency(numbers.cpaMax)}</span></div>
              <div className="flex justify-between"><span>Target ROAS <span className="ml-1 text-xs text-dark-text-muted" title="Omset per 1 rupiah iklan. 4x berarti 1 rupiah iklan menghasilkan 4 rupiah omset">ⓘ</span></span><span className="font-medium">{numbers.roasTarget.toFixed(2)}x</span></div>
            </div>
            {businessType==='JASA' && (
              <div className="mt-4">
                <div className="font-semibold mb-2">Breakdown</div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Biaya Dasar (Upah + Operasional + Alat/Software)</span><span>{formatCurrency(Number(manpowerWage||0)+Number(operationalCost||0)+Number(toolsCost||0))}</span></div>
                  <div className="flex justify-between"><span>Biaya Marketing</span><span>{formatCurrency(numbers.price * (Number(marketingPercent||0)/100))}</span></div>
                  <div className="flex justify-between"><span>Profit Bisnis</span><span>{formatCurrency(numbers.price * (Number(profitPercent||0)/100))}</span></div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <div className="font-semibold mb-2">Simulator Diskon</div>
              <div className="flex justify-between"><span>Harga Setelah Diskon</span><span>{formatCurrency(discounted.priceAfterDiscount)}</span></div>
              <div className="flex justify-between"><span>Estimasi Profit per Transaksi</span><span className={discounted.netProfit>=0? 'text-green-400' : 'text-red-400'}>{formatCurrency(discounted.netProfit)} {discounted.netProfit>=0?'Aman ✅':'BAHAYA ⚠️'}</span></div>
            </div>
            {businessType==='JASA' && (
              <div className="mt-4">
                <div className="font-semibold mb-2">Tier Pricing Generator <span className="ml-1 text-xs text-dark-text-muted" title="Basic: layanan standar. Pro: prioritas/revisi tambahan. Sultan: all-in atau express 24 jam">ⓘ</span></div>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Paket Basic <span className="ml-1 text-xs text-dark-text-muted" title="Paket Basic (Sesuai Hitungan): Deskripsi: Layanan standar.">ⓘ</span></span><span className="font-medium">{formatCurrency(numbers.price)}</span></div>
                  <div className="flex justify-between"><span>Paket Pro (1.5x) <span className="ml-1 text-xs text-dark-text-muted" title="Paket Pro (Mark up 1.5x): Strategi: Tambahkan fitur Prioritas atau Revisi Tambahan. Margin profit jadi tebal.">ⓘ</span></span><span className="font-medium">{formatCurrency(numbers.price * 1.5)}</span></div>
                  <div className="flex justify-between"><span>Paket Sultan (3x) <span className="ml-1 text-xs text-dark-text-muted" title="Paket Sultan (Mark up 3x): Strategi: Paket All in One atau Express 24 Jam.">ⓘ</span></span><span className="font-medium">{formatCurrency(numbers.price * 3)}</span></div>
                </div>
              </div>
            )}
            <div className="mt-4">
              <div className="font-semibold mb-2">Saran Harga Psikologis</div>
              <div className="flex gap-2 flex-wrap">
                {suggestPrices(numbers.price).map((sp,idx)=> (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-dark-surface border border-dark-border text-sm">{formatCurrency(sp)}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-2">Simulasi Skala Iklan</div>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Estimasi Omset</span><span>{formatCurrency(scaleSim.omset)}</span></div>
                <div className="flex justify-between"><span>Estimasi Penjualan</span><span>{scaleSim.sales} pcs</span></div>
                <div className="flex justify-between"><span>Estimasi Profit Bersih</span><span>{formatCurrency(scaleSim.profit)}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Catatan Rumus</h3>
            <div className="flex items-center gap-2">
              <button className="btn-secondary" onClick={()=>window.print()}>Cetak / Download</button>
              <button className="btn-primary" onClick={saveCurrent}>Simpan</button>
            </div>
          </div>
          <p className="text-sm text-dark-text-muted">
            {businessType==='PRODUK_DIGITAL'
              ? 'Harga Jual = (Target Bersih + Admin(Rp)) / (1 - (Marketing% + Affiliate% + Admin%))'
              : businessType==='JASA'
              ? 'Harga Jual = Biaya Modal Kerja / (1 - (Marketing% + Profit%))'
              : 'Harga Jual = HPP / (1 - (Marketing% + Profit% + Admin%)) lalu + biaya admin tetap jika dipilih.'}
          </p>
        </div>

        <div className="mt-6 card">
          <div className="flex items-center justify-between">
            <div>Bingung cara mencapai target ROAS {numbers.roasTarget.toFixed(2)}x di atas?</div>
            <a className="btn-primary" target="_blank" rel="noopener noreferrer" href={effectiveCtaLink}>Konsultasi Iklan Sekarang</a>
          </div>
        </div>

        <div className="mt-6 card overflow-hidden" ref={cardRef}>
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-lg font-semibold">Hasil Simulasi Tersimpan</h3>
          </div>
          <div className="overflow-x-auto no-x-scrollbar relative" ref={scrollRef}>
            <table className="table-auto table-compact min-w-[1600px]">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-center p-2">No.</th>
                  <th className="text-center p-4 font-semibold">Tanggal</th>
                  <th className="text-center p-4 font-semibold">Produk</th>
                  <th className="text-center p-4 font-semibold">Jenis</th>
                  <th className="text-center p-4 font-semibold">HPP</th>
                  <th className="text-center p-4 font-semibold">Marketing%</th>
                  <th className="text-center p-4 font-semibold">Profit%</th>
                  <th className="text-center p-4 font-semibold">Admin</th>
                  <th className="text-center p-4 font-semibold">Harga Jual</th>
                  <th className="text-center p-4 font-semibold">BEP</th>
                  <th className="text-center p-4 font-semibold">CPA Max</th>
                  <th className="text-center p-4 font-semibold">ROAS</th>
                  <th className="text-center p-4 font-semibold">Diskon%</th>
                  <th className="text-center p-4 font-semibold">Harga Diskon</th>
                  <th className="text-center p-4 font-semibold">Net Profit Diskon</th>
                  <th className="text-center p-4 font-semibold">Budget</th>
                  <th className="text-center p-4 font-semibold">Omset</th>
                  <th className="text-center p-4 font-semibold">Penjualan</th>
                  <th className="text-center p-4 font-semibold">Profit</th>
                  <th className="text-center p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {saved.slice((page-1)*limit, (page-1)*limit + limit).map((s, idx) => (
                  <tr key={s.id} className="border-b border-dark-border hover:bg-dark-surface">
                    <td className="p-2 text-center w-[80px]">{((page-1)*limit) + idx + 1}</td>
                    <td className="p-4 text-center">{new Date(s.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="p-4 text-center text-dark-text-muted">{s.productName || '-'}</td>
                    <td className="p-4 text-center text-dark-text-muted">{s.businessType.replace('_',' ')}</td>
                    <td className="p-4 text-center">{formatCurrency(s.hpp)}</td>
                    <td className="p-4 text-center text-dark-text-muted">{formatPercent(s.marketingPercent)}</td>
                    <td className="p-4 text-center text-dark-text-muted">{formatPercent(s.profitPercent)}</td>
                    <td className="p-4 text-center text-dark-text-muted">{s.adminType==='PERCENT'? formatPercent(s.adminValue) : formatCurrency(s.adminValue)}</td>
                    <td className="p-4 text-center font-medium">{formatCurrency(s.price)}</td>
                    <td className="p-4 text-center">{formatCurrency(s.bep)}</td>
                    <td className="p-4 text-center">{formatCurrency(s.cpaMax)}</td>
                    <td className="p-4 text-center">{s.roasTarget.toFixed(2)}x</td>
                    <td className="p-4 text-center">{formatPercent(s.discountPercent)}</td>
                    <td className="p-4 text-center">{formatCurrency(s.priceAfterDiscount)}</td>
                    <td className="p-4 text-center">{formatCurrency(s.netProfitAfterDiscount)}</td>
                    <td className="p-4 text-center">{formatCurrency(s.scaleBudget)}</td>
                    <td className="p-4 text-center">{formatCurrency(s.estimatedOmset)}</td>
                    <td className="p-4 text-center">{s.estimatedSales} pcs</td>
                    <td className="p-4 text-center">{formatCurrency(s.estimatedProfit)}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-primary hover:text-primary-hover text-sm" onClick={()=>navigate(`/calculator/${s.id}`)}>View</button>
                        <button className="text-primary hover:text-primary-hover text-sm" onClick={()=>navigate(`/calculator/${s.id}/edit`)}>Edit</button>
                        <button className="text-red-400 hover:text-red-300 text-sm" onClick={()=>{
                          if (!window.confirm('Hapus simulasi ini?')) return;
                          const next = saved.filter((x)=>x.id!==s.id);
                          persistSaved(next);
                        }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {saved.length===0 && (
                  <tr>
                    <td className="p-6 text-center text-dark-text-muted" colSpan={20}>Belum ada simulasi tersimpan</td>
                  </tr>
                )}
              </tbody>
            </table>
            <BottomScrollSync forRef={scrollRef} />
          </div>
          <div className="flex items-center justify-end gap-2 px-4 py-2">
            <select className="input w-24" value={limit} onChange={(e)=>{ setLimit(Number(e.target.value)); setPage(1); }}>
              <option value="7">7</option>
              <option value="14">14</option>
              <option value="31">31</option>
              <option value="60">60</option>
              <option value="90">90</option>
            </select>
            <button className="btn-secondary" disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))}>Prev</button>
            <span className="text-sm">Page {page} / {Math.max(1, Math.ceil(saved.length / limit))}</span>
            <button className="btn-secondary" disabled={page>=Math.ceil(saved.length/limit)} onClick={()=>setPage((p)=>p+1)}>Next</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalculatorPage;
