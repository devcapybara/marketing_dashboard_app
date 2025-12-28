import DashboardLayout from '../../components/layout/DashboardLayout';

const UserActivityPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Aktivitas Pengguna</h1>
          <p className="text-dark-text-muted">DAU, WAU, dan event utama</p>
        </div>
        <div className="card">
          <div className="text-dark-text-muted">Grafik aktivitas akan ditampilkan di sini</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserActivityPage;
