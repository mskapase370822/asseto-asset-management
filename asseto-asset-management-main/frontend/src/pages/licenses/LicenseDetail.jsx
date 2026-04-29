import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLicense, assignLicense, unassignLicense } from '../../services/license.service';
import { searchUsers } from '../../services/user.service';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';

export default function LicenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignModal, setAssignModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const fetchLicense = () => {
    getLicense(id)
      .then(({ data }) => setLicense(data.license || data))
      .catch(() => setError('Failed to load license.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLicense(); }, [id]);

  const handleUserSearch = async (q) => {
    setUserSearch(q);
    if (!q) { setUserResults([]); return; }
    try {
      const { data } = await searchUsers({ q });
      setUserResults(data.users || data || []);
    } catch { setUserResults([]); }
  };

  const handleAssign = async (userId) => {
    setAssigning(true);
    try {
      await assignLicense(id, { userId });
      setAssignModal(false);
      fetchLicense();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign license.');
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async (userId) => {
    setAssigning(true);
    try {
      await unassignLicense(id, { userId });
      fetchLicense();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unassign.');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!license) return <div className="text-center py-12 text-gray-400">License not found.</div>;

  const isExpired = license.expiry_date && new Date(license.expiry_date) < new Date();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/licenses')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{license.name}</h1>
        <Link to={`/licenses/${id}/edit`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Edit</Link>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      {isExpired && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">⚠️ This license has expired.</div>}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">License Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'License Key', value: license.key },
            { label: 'Seats', value: license.seats },
            { label: 'Vendor', value: license.vendor },
            { label: 'Expiry Date', value: license.expiry_date ? new Date(license.expiry_date).toLocaleDateString() : '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{value || '—'}</dd>
            </div>
          ))}
        </dl>
        {license.notes && (
          <div className="mt-4 pt-4 border-t">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900">{license.notes}</dd>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Assigned Users</h2>
          <button onClick={() => setAssignModal(true)}
            className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Assign User
          </button>
        </div>
        {license.assigned_to?.length > 0 ? (
          <div className="divide-y">
            {license.assigned_to.map((u) => (
              <div key={u._id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <button onClick={() => handleUnassign(u._id)} disabled={assigning}
                  className="px-2.5 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50">
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No users assigned.</p>
        )}
      </div>

      <Modal isOpen={assignModal} onClose={() => setAssignModal(false)} title="Assign License to User">
        <div className="space-y-4">
          <input type="text" value={userSearch} onChange={(e) => handleUserSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          {userResults.length > 0 && (
            <div className="border border-gray-200 rounded-lg divide-y max-h-64 overflow-y-auto">
              {userResults.map((u) => (
                <button key={u._id} onClick={() => handleAssign(u._id)} disabled={assigning}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left disabled:opacity-50">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold flex-shrink-0">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
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
