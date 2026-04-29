import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../../services/product.service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getProduct(id)
      .then(({ data }) => setProduct(data.product || data))
      .catch(() => setError('Failed to load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <div className="text-center py-12 text-gray-400">Product not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{product.name}</h1>
        <Link to={`/products/${id}/edit`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Edit</Link>
      </div>
      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Product Details</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Type', value: product.product_type },
            { label: 'Category', value: product.product_category },
          ].map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900">{value || '—'}</dd>
            </div>
          ))}
        </dl>
        {product.description && (
          <div className="mt-4 pt-4 border-t">
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{product.description}</dd>
          </div>
        )}
      </div>
    </div>
  );
}
