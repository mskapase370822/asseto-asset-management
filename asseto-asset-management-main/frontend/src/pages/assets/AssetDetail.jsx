import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAsset, assignAsset, unassignAsset, updateAssetStatus } from '../../services/asset.service';
import { searchUsers } from '../../services/user.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignModal, setAssignModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const fetchAsset = () => {
    setLoading(true);
    getAsset(id)
      .then(({ data }) => setAsset(data.asset || data))
      .catch(() => setError('Failed to load asset.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAsset(); }, [id]);

  const handleUserSearch = async (q) => {
    setUserSearch(q);
    if (!q) { setUserResults([]); return; }
    try {
      const { data } = await searchUsers({ q });
      setUserResults(data.users || data || []);
    } catch {
      setUserResults([]);
    }
  };

  const handleAssign = async (userId) => {
    setAssigning(true);
    try {
      await assignAsset(id, { userId });
      setAssignModal(false);
      fetchAsset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign asset.');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    setAssigning(true);
    try {
      await unassignAsset(id, {});
      fetchAsset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unassign asset.');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!asset) return <div className="text-center py-12 text-gray-400">Asset not found.</div>;

  const fields = [
    { label: 'Tag', value: asset.tag },
    { label: 'Serial No.', value: asset.serial_no },
    { label: 'Status', value: <StatusBadge status={asset.status} /> },
    { label: 'Price', value: asset.price ? `$${asset.price.toLocaleString()}` : '—' },
    { label: 'Purchase Type', value: asset.purchase_type },
    { label: 'Location', value: asset.location },
    { label: 'Product', value: asset.product?.name || '—' },
    { label: 'Vendor', value: asset.vendor?.name || '—' },
    { label: 'Purchase Date', value: asset.purchase_date ? new Date(asset.purchase_date).toLocaleDateString() : '—' },
    { label: 'Warranty Expiry', value: asset.warranty_expiry_date ? new Date(asset.warranty_expiry_date).toLocaleDateString() : '—' },
    { label: 'Assigned To', value: asset.assigned_to?.name || '—' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/assets')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{asset.name || asset.tag}</h1>
          <p className="text-sm text-gray-500">{asset.tag}</p>
        </div>
        <Link to={`/assets/${id}/edit`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          Edit
        </Link>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Asset Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value || '—'}</dd>
            </div>
          ))}
        </dl>
        {asset.description && (
          <div className="mt-4 pt-4 border-t">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{asset.description}</dd>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Assignment</h2>
        {asset.assigned_to ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{asset.assigned_to.name}</p>
              <p className="text-xs text-gray-500">{asset.assigned_to.email}</p>
            </div>
            <button
              onClick={handleUnassign}
              disabled={assigning}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50"
            >
              {assigning ? 'Processing...' : 'Unassign'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">This asset is not currently assigned.</p>
            <button
              onClick={() => setAssignModal(true)}
              className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Assign User
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Assign Asset to User">
        <div className="space-y-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={userSearch}
              onChange={(e) => handleUserSearch(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {userResults.length > 0 && (
            <div className="border border-gray-200 rounded-lg divide-y max-h-64 overflow-y-auto">
              {userResults.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleAssign(u._id)}
                  disabled={assigning}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left disabled:opacity-50"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold flex-shrink-0">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
