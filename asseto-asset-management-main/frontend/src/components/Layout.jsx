import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

function getBreadcrumbs(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((part, i) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
    path: '/' + parts.slice(0, i + 1).join('/'),
  }));
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} />
      <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${sidebarOpen ? 'ml-64' : 'ml-16'}`}
      >
        {breadcrumbs.length > 0 && (
          <nav className="px-6 py-3 bg-white border-b border-gray-200">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  <span className={i === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                    {crumb.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
