import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg gradient-hero relative overflow-hidden">
      <div className="absolute top-6 right-24 blob-static"></div>
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={()=>setMobileSidebarOpen(false)} />
      <div className="ml-0 md:ml-64">
        <Header onToggleSidebar={()=>setMobileSidebarOpen((v)=>!v)} />
        <main className="pt-4 md:pt-6 p-4 md:p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
