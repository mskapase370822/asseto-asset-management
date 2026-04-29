import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLicenses, deleteLicense } from '../../services/license.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function LicenseList() {
  const navigate = useNavigate();
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 20 };
      if (search) params.q = search;
      const { data } = await getLicenses(params);
      setLicenses(data.licenses || data.data || data || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch {
      setError('Failed to load licenses.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchLicenses(); }, [fetchLicenses]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteLicense(deleteTarget._id);
      setDeleteTarget(null);
      fetchLicenses();
    } catch {
      setError('Failed to delete license.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Licenses</h1>
        <Link to="/licenses/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add License
        </Link>
      </div>
      <SearchBar placeholder="Search licenses..." onSearch={(q) => { setSearch(q); setPage(1); }} className="max-w-md" />
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Key</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Seats</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Expires</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {licenses.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400">No licenses found.</td></tr>
                ) : licenses.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/licenses/${l._id}`} className="font-medium text-indigo-600 hover:underline">{l.name}</Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{l.key ? `${l.key.substring(0, 10)}...` : '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{l.seats || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{l.expiry_date ? new Date(l.expiry_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={l.status || 'active'} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/licenses/${l._id}/edit`)} className="p-1.5 text-gray-400 hover:text-indigo-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(l)} className="p-1.5 text-gray-400 hover:text-red-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        loading={deleting} title="Delete License" message={`Delete license "${deleteTarget?.name}"?`} />
    </div>
  );
}
