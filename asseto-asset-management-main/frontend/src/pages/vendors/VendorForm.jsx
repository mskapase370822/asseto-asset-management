import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVendor, createVendor, updateVendor } from '../../services/vendor.service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function VendorForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', email: '', phone: '', website: '', address: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      getVendor(id)
        .then(({ data }) => {
          const v = data.vendor || data;
          setForm({ name: v.name || '', email: v.email || '', phone: v.phone || '', website: v.website || '', address: v.address || '', notes: v.notes || '' });
        })
        .catch(() => setError('Failed to load vendor.'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) await updateVendor(id, form);
      else await createVendor(form);
      navigate('/vendors');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vendor.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  const fields = [
    { label: 'Name *', name: 'name', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: false },
    { label: 'Phone', name: 'phone', type: 'text', required: false },
    { label: 'Website', name: 'website', type: 'url', required: false },
    { label: 'Address', name: 'address', type: 'text', required: false },
  ];

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/vendors')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Vendor' : 'Add Vendor'}</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} required={f.required}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/vendors')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
