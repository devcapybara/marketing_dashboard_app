import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useEffect, useState } from 'react';
import { pageService } from '../../services/pageService';
import PageRenderer from '../../components/site/PageRenderer';

const LandingPage = () => {
  const [dynamicPage, setDynamicPage] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await pageService.getBySlugPublic('home');
        setDynamicPage(res?.data || null);
      } catch {}
    };
    fetchHome();
  }, []);

  if (dynamicPage && Array.isArray(dynamicPage.sections) && dynamicPage.sections.length > 0) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="container mx-auto px-4 py-12">
          <PageRenderer page={dynamicPage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-bg">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute -top-20 -left-20 blob" />
      <div className="absolute -bottom-24 -right-24 blob delay-700" />

      <div className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-dark-border bg-dark-surface/60 backdrop-blur">
            <img src={logo} alt="Marketing Dashboard" className="w-8 h-8" />
            <span className="text-sm text-dark-text-muted">Marketing Intelligence untuk Tim Performa</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">Naikkan ROAS dan turunkan CAC dengan satu dashboard terpadu</h1>
          <p className="text-lg md:text-xl text-dark-text-muted mb-8 max-w-2xl mx-auto">Satukan performa iklan dari Google, Meta, dan TikTok. Lihat spend, leads, dan omset secara real‑time, ambil keputusan lebih cepat, dan skala profit.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/login" className="btn-primary shine">Coba Gratis</Link>
            <a href="#features" className="btn-secondary">Lihat Fitur</a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <div className="px-3 py-2 rounded-lg border border-dark-border bg-dark-surface/60">Google Ads</div>
            <div className="px-3 py-2 rounded-lg border border-dark-border bg-dark-surface/60">Meta Ads</div>
            <div className="px-3 py-2 rounded-lg border border-dark-border bg-dark-surface/60">TikTok Ads</div>
          </div>
        </div>

        <div id="features" className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="card glass">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="text-xl font-semibold mb-2">Ringkasan Pintar</h3>
            <p className="text-dark-text-muted">Total spend, omset, ROAS, CAC, dan metrics inti siap pakai.</p>
          </div>
          <div className="card glass">
            <div className="text-2xl mb-2">🧭</div>
            <h3 className="text-xl font-semibold mb-2">Multi‑Client & Platform</h3>
            <p className="text-dark-text-muted">Kelola banyak klien dan akun iklan lintas Google, Meta, TikTok.</p>
          </div>
          <div className="card glass">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Keputusan Lebih Cepat</h3>
            <p className="text-dark-text-muted">Insight yang dapat ditindaklanjuti untuk optimasi budget dan scaling.</p>
          </div>
          <div className="card glass">
            <div className="text-2xl mb-2">🧮</div>
            <h3 className="text-xl font-semibold mb-2">ROAS & CAC Tracking</h3>
            <p className="text-dark-text-muted">Pantau efisiensi biaya akuisisi dan return on ad spend harian.</p>
          </div>
          <div className="card glass">
            <div className="text-2xl mb-2">🧱</div>
            <h3 className="text-xl font-semibold mb-2">Funnel Leads</h3>
            <p className="text-dark-text-muted">Visualisasi funnel untuk memantau respons, potensial, closing, retensi.</p>
          </div>
          <div className="card glass">
            <div className="text-2xl mb-2">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Akses Aman</h3>
            <p className="text-dark-text-muted">Role‑based access untuk Super Admin, Admin, dan Client.</p>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="text-3xl font-bold mb-2">+X</div>
            <div className="text-dark-text-muted">Peningkatan ROAS melalui alokasi budget cerdas.</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold mb-2">−Y%</div>
            <div className="text-dark-text-muted">Penurunan CAC dengan optimasi kreatif dan target.</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold mb-2">Real‑time</div>
            <div className="text-dark-text-muted">Kecepatan insight untuk keputusan harian yang tepat.</div>
          </div>
        </div>

        <div className="mt-20 card text-center">
          <h3 className="text-2xl font-semibold mb-2">Siap memaksimalkan performa iklan?</h3>
          <p className="text-dark-text-muted mb-6">Mulai uji coba gratis dan rasakan kemudahan mengelola marketing performance.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-primary shine">Mulai Sekarang</Link>
            <a href="#features" className="btn-secondary">Jelajahi Fitur</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

