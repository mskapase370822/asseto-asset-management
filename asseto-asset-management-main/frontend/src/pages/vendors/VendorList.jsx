import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVendors, deleteVendor } from '../../services/vendor.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function VendorList() {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 20 };
      if (search) params.q = search;
      const { data } = await getVendors(params);
      setVendors(data.vendors || data.data || data || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch {
      setError('Failed to load vendors.');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchVendors(); }, [fetchVendors]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteVendor(deleteTarget._id);
      setDeleteTarget(null);
      fetchVendors();
    } catch {
      setError('Failed to delete vendor.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
        <Link to="/vendors/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vendor
        </Link>
      </div>
      <SearchBar placeholder="Search vendors..." onSearch={(q) => { setSearch(q); setPage(1); }} className="max-w-md" />
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Website</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendors.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400">No vendors found.</td></tr>
                ) : vendors.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/vendors/${v._id}`} className="font-medium text-indigo-600 hover:underline">{v.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{v.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{v.phone || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {v.website ? <a href={v.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate block max-w-xs">{v.website}</a> : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/vendors/${v._id}/edit`)} className="p-1.5 text-gray-400 hover:text-indigo-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(v)} className="p-1.5 text-gray-400 hover:text-red-600">
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
        loading={deleting} title="Delete Vendor" message={`Delete vendor "${deleteTarget?.name}"?`} />
    </div>
  );
}
