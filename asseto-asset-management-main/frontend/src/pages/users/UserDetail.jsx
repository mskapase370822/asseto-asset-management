import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUser } from '../../services/user.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUser(id)
      .then(({ data }) => setUser(data.user || data))
      .catch(() => setError('Failed to load user.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="text-center py-12 text-gray-400">User not found.</div>;

  const fields = [
    { label: 'Email', value: user.email },
    { label: 'Role', value: user.role },
    { label: 'Department', value: user.department },
    { label: 'Location', value: user.location },
    { label: 'Status', value: <StatusBadge status={user.status || 'active'} /> },
    { label: 'Joined', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/users')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <Link to={`/users/${id}/edit`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Edit
        </Link>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">User Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>

      {user.assets?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Assigned Assets</h2>
          <div className="divide-y">
            {user.assets.map((a) => (
              <div key={a._id} className="py-3 flex items-center justify-between">
                <div>
                  <Link to={`/assets/${a._id}`} className="text-sm font-medium text-indigo-600 hover:underline">{a.name || a.tag}</Link>
                  <p className="text-xs text-gray-500">{a.tag}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
