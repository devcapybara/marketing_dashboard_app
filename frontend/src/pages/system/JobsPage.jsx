import DashboardLayout from '../../components/layout/DashboardLayout';

const JobsPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Jobs & Queue</h1>
          <p className="text-dark-text-muted">Daftar job, status, dan kontrol</p>
        </div>
        <div className="card">
          <div className="text-dark-text-muted">Monitoring jobs akan ditampilkan di sini</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobsPage;
