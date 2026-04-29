import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAsset, createAsset, updateAsset } from '../../services/asset.service';
import { getProductsDropdown } from '../../services/product.service';
import { getVendorsDropdown } from '../../services/vendor.service';
import { getLocations } from '../../services/config.service';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUSES = ['active', 'unassigned', 'assigned', 'maintenance', 'retired'];
const PURCHASE_TYPES = ['purchased', 'leased', 'donated', 'rented'];

export default function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', tag: '', serial_no: '', price: '', status: 'unassigned',
    product: '', vendor: '', location: '', purchase_date: '',
    warranty_expiry_date: '', purchase_type: 'purchased', description: '',
  });
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [p, v, l] = await Promise.allSettled([
          getProductsDropdown(),
          getVendorsDropdown(),
          getLocations(),
        ]);
        setProducts(p.value?.data || []);
        setVendors(v.value?.data || []);
        setLocations(l.value?.data || []);
      } catch {
        // continue with empty dropdowns
      }
    };
    loadDropdowns();

    if (isEdit) {
      setFetchLoading(true);
      getAsset(id)
        .then(({ data }) => {
          const asset = data.asset || data;
          setForm({
            name: asset.name || '',
            tag: asset.tag || '',
            serial_no: asset.serial_no || '',
            price: asset.price || '',
            status: asset.status || 'unassigned',
            product: asset.product?._id || asset.product || '',
            vendor: asset.vendor?._id || asset.vendor || '',
            location: asset.location || '',
            purchase_date: asset.purchase_date ? asset.purchase_date.split('T')[0] : '',
            warranty_expiry_date: asset.warranty_expiry_date ? asset.warranty_expiry_date.split('T')[0] : '',
            purchase_type: asset.purchase_type || 'purchased',
            description: asset.description || '',
          });
        })
        .catch(() => setError('Failed to load asset.'))
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.price) delete payload.price;
      if (isEdit) {
        await updateAsset(id, payload);
      } else {
        await createAsset(payload);
      }
      navigate('/assets');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save asset.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/assets')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Asset' : 'Add Asset'}</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag</label>
              <input type="text" name="tag" value={form.tag} onChange={handleChange}
                placeholder="AST-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="MacBook Pro 14"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input type="text" name="serial_no" value={form.serial_no} onChange={handleChange}
                placeholder="SN123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="number" name="price" value={form.price} onChange={handleChange}
                placeholder="0.00" min="0" step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Type</label>
              <select name="purchase_type" value={form.purchase_type} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {PURCHASE_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select name="product" value={form.product} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">— Select Product —</option>
                {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <select name="vendor" value={form.vendor} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">— Select Vendor —</option>
                {vendors.map((v) => <option key={v._id} value={v._id}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select name="location" value={form.location} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">— Select Location —</option>
                {locations.map((l, i) => <option key={i} value={l.name || l}>{l.name || l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
              <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiry Date</label>
              <input type="date" name="warranty_expiry_date" value={form.warranty_expiry_date} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                rows={3} placeholder="Optional description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/assets')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
