import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

