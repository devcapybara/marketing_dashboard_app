import DashboardLayout from '../../components/layout/DashboardLayout';

const WebhooksPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Webhooks</h1>
          <p className="text-dark-text-muted">Daftar webhook dan health</p>
        </div>
        <div className="card">
          <div className="text-dark-text-muted">Monitoring webhook akan ditampilkan di sini</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WebhooksPage;
