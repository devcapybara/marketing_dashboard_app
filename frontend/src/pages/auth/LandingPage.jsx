import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Marketing Dashboard</h1>
          <p className="text-xl text-dark-text-muted mb-8 max-w-2xl mx-auto">
            Kelola performa iklan digital marketing untuk semua klien Anda dalam satu dashboard terpusat.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-4">Multi-Client</h3>
            <p className="text-dark-text-muted">
              Kelola banyak klien dalam satu platform
            </p>
          </div>
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-4">Multi-Platform</h3>
            <p className="text-dark-text-muted">
              Track performa dari Meta, TikTok, Google, dan platform lainnya
            </p>
          </div>
          <div className="card text-center">
            <h3 className="text-xl font-semibold mb-4">Analytics</h3>
            <p className="text-dark-text-muted">
              Dashboard dan laporan yang mudah dipahami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

