import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingAudits } from '../../services/audit.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

export default function AuditPending() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPendingAudits()
      .then(({ data }) => setAudits(data.audits || data || []))
      .catch(() => setError('Failed to load audits.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Audits</h1>
          <div className="flex gap-4 mt-2">
            <Link to="/audit/pending" className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1">Pending</Link>
            <Link to="/audit/completed" className="text-sm font-medium text-gray-500 hover:text-gray-700">Completed</Link>
          </div>
        </div>
        <Link to="/audit/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Audit
        </Link>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Asset Tag</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Assigned To</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {audits.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No pending audits.</td></tr>
              ) : audits.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{a.tag || a.asset?.tag || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{a.assigned_to?.name || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status || 'pending'} /></td>
                  <td className="px-4 py-3 text-gray-600">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3">
                    <Link to={`/audit/${a._id}`} className="text-indigo-600 hover:underline text-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
