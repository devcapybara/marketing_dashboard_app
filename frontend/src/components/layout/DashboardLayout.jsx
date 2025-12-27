import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg">
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={()=>setMobileSidebarOpen(false)} />
      <div className="ml-0 md:ml-64">
        <Header onToggleSidebar={()=>setMobileSidebarOpen((v)=>!v)} />
        <main className="pt-16 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

