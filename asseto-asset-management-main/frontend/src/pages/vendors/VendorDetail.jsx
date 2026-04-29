import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVendor } from '../../services/vendor.service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getVendor(id)
      .then(({ data }) => setVendor(data.vendor || data))
      .catch(() => setError('Failed to load vendor.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!vendor) return <div className="text-center py-12 text-gray-400">Vendor not found.</div>;

  const fields = [
    { label: 'Email', value: vendor.email },
    { label: 'Phone', value: vendor.phone },
    { label: 'Website', value: vendor.website ? <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{vendor.website}</a> : null },
    { label: 'Address', value: vendor.address },
    { label: 'Notes', value: vendor.notes },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/vendors')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{vendor.name}</h1>
        <Link to={`/vendors/${id}/edit`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Edit</Link>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Vendor Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
