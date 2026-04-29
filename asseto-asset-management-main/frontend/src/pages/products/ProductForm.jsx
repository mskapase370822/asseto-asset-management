import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct, createProduct, updateProduct } from '../../services/product.service';
import { getProductTypes, getProductCategories } from '../../services/config.service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name: '', product_type: '', product_category: '', description: '' });
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.allSettled([getProductTypes(), getProductCategories()]).then(([t, c]) => {
      setTypes(t.value?.data || []);
      setCategories(c.value?.data || []);
    });
    if (isEdit) {
      setFetchLoading(true);
      getProduct(id)
        .then(({ data }) => {
          const p = data.product || data;
          setForm({ name: p.name || '', product_type: p.product_type || '', product_category: p.product_category || '', description: p.description || '' });
        })
        .catch(() => setError('Failed to load product.'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) await updateProduct(id, form);
      else await createProduct(form);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
            <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">— Select Type —</option>
              {types.map((t, i) => <option key={i} value={t.name || t}>{t.name || t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Category</label>
            <select value={form.product_category} onChange={(e) => setForm({ ...form, product_category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">— Select Category —</option>
              {categories.map((c, i) => <option key={i} value={c.name || c}>{c.name || c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/products')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
