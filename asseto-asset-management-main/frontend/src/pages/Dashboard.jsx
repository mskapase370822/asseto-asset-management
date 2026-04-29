import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getDashboardAssets,
  getDashboardUsers,
  getDashboardProducts,
  getDashboardVendors,
  getDashboardLocations,
  getDashboardActivity,
} from '../services/dashboard.service';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';

function StatCard({ title, value, icon, color, to }) {
  const content = (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 hover:shadow-md transition-shadow`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [activity, setActivity] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [assets, users, products, vendors, locations, act] = await Promise.allSettled([
          getDashboardAssets(),
          getDashboardUsers(),
          getDashboardProducts(),
          getDashboardVendors(),
          getDashboardLocations(),
          getDashboardActivity(),
        ]);
        setStats({
          assets: assets.value?.data,
          users: users.value?.data,
          products: products.value?.data,
          vendors: vendors.value?.data,
          locations: locations.value?.data,
        });
        setActivity(act.value?.data?.activities || act.value?.data || []);
        setWarranties(assets.value?.data?.expiringWarranties || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your asset management system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Assets"
          value={stats.assets?.total}
          to="/assets"
          color="bg-indigo-100"
          icon={<svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <StatCard
          title="Total Users"
          value={stats.users?.total}
          to="/users"
          color="bg-blue-100"
          icon={<svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          title="Products"
          value={stats.products?.total}
          to="/products"
          color="bg-green-100"
          icon={<svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
        />
        <StatCard
          title="Vendors"
          value={stats.vendors?.total}
          to="/vendors"
          color="bg-orange-100"
          icon={<svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard
          title="Locations"
          value={stats.locations?.total}
          color="bg-purple-100"
          icon={<svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
      </div>

      {stats.assets && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Assigned', value: stats.assets.assigned, color: 'bg-blue-50 border-blue-200 text-blue-700' },
            { label: 'Unassigned', value: stats.assets.unassigned, color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
            { label: 'In Maintenance', value: stats.assets.maintenance, color: 'bg-orange-50 border-orange-200 text-orange-700' },
            { label: 'Retired', value: stats.assets.retired, color: 'bg-red-50 border-red-200 text-red-700' },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
              <p className="text-xs font-medium">{item.label}</p>
              <p className="text-xl font-bold mt-1">{item.value ?? 0}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warranties.length > 0 && (
          <div className="bg-white rounded-xl border border-orange-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Warranty Expiring Soon
            </h2>
            <div className="space-y-2">
              {warranties.slice(0, 5).map((asset) => (
                <div key={asset._id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                  <Link to={`/assets/${asset._id}`} className="text-indigo-600 hover:underline font-medium">
                    {asset.name || asset.tag}
                  </Link>
                  <span className="text-orange-600 text-xs">
                    {asset.warranty_expiry_date ? new Date(asset.warranty_expiry_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activity.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activity.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate">{item.description || item.action || JSON.stringify(item)}</p>
                    {item.createdAt && (
                      <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                    )}
                  </div>
                  {item.status && <StatusBadge status={item.status} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {activity.length === 0 && warranties.length === 0 && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
            <svg className="h-12 w-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No recent activity to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
