import DashboardLayout from '../../components/layout/DashboardLayout';

const StoragePage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Storage & Integrasi</h1>
          <p className="text-dark-text-muted">Penggunaan storage dan status integrasi</p>
        </div>
        <div className="card">
          <div className="text-dark-text-muted">Ringkasan storage dan integrasi akan ditampilkan di sini</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StoragePage;
