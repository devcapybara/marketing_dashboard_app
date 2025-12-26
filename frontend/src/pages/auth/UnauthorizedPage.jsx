import DashboardLayout from '../../components/layout/DashboardLayout';

const UnauthorizedPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="card text-center">
          <h1 className="text-3xl font-bold mb-2">Tidak Diizinkan</h1>
          <p className="text-dark-text-muted">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UnauthorizedPage;
