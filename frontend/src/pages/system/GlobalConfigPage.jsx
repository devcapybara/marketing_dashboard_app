import DashboardLayout from '../../components/layout/DashboardLayout';

const GlobalConfigPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Konfigurasi Global</h1>
          <p className="text-dark-text-muted">Pengaturan sistem lintas klien</p>
        </div>
        <div className="card">
          <div className="text-dark-text-muted">Form konfigurasi global akan ditampilkan di sini</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GlobalConfigPage;
