import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLicense, createLicense, updateLicense } from '../../services/license.service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function LicenseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', key: '', seats: '', expiry_date: '', vendor: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      getLicense(id)
        .then(({ data }) => {
          const l = data.license || data;
          setForm({
            name: l.name || '',
            key: l.key || '',
            seats: l.seats || '',
            expiry_date: l.expiry_date ? l.expiry_date.split('T')[0] : '',
            vendor: l.vendor || '',
            notes: l.notes || '',
          });
        })
        .catch(() => setError('Failed to load license.'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.seats) delete payload.seats;
      if (isEdit) await updateLicense(id, payload);
      else await createLicense(payload);
      navigate('/licenses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save license.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/licenses')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit License' : 'Add License'}</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">License Key</label>
            <input type="text" name="key" value={form.key} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
            <input type="number" name="seats" value={form.seats} onChange={handleChange} min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
            <input type="text" name="vendor" value={form.vendor} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/licenses')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create License'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
