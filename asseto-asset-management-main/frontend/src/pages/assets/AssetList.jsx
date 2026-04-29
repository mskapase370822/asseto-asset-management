import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAssets, deleteAsset } from '../../services/asset.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AssetList() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 20 };
      if (search) params.q = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await getAssets(params);
      setAssets(data.assets || data.data || data || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch {
      setError('Failed to load assets.');
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const handleSearch = (q) => { setSearch(q); setPage(1); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAsset(deleteTarget._id);
      setDeleteTarget(null);
      fetchAssets();
    } catch {
      setError('Failed to delete asset.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
        <Link
          to="/assets/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Asset
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar placeholder="Search assets..." onSearch={handleSearch} className="flex-1" />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          {['active', 'assigned', 'unassigned', 'maintenance', 'retired'].map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tag</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Serial No.</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Assigned To</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Purchase Date</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">No assets found.</td>
                  </tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{asset.tag}</td>
                      <td className="px-4 py-3">
                        <Link to={`/assets/${asset._id}`} className="font-medium text-indigo-600 hover:underline">
                          {asset.name || '—'}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{asset.serial_no || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
                      <td className="px-4 py-3 text-gray-600">{asset.assigned_to?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/assets/${asset._id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(asset)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Asset"
        message={`Are you sure you want to delete asset "${deleteTarget?.name || deleteTarget?.tag}"? This action cannot be undone.`}
      />
    </div>
  );
}
