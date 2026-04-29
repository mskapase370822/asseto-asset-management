import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, createUser, updateUser } from '../../services/user.service';
import { getRoles } from '../../services/user.service';
import { getDepartments, getLocations } from '../../services/config.service';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'user', department: '', location: '',
  });
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.allSettled([getRoles(), getDepartments(), getLocations()]).then(([r, d, l]) => {
      setRoles(r.value?.data || []);
      setDepartments(d.value?.data || []);
      setLocations(l.value?.data || []);
    });
    if (isEdit) {
      setFetchLoading(true);
      getUser(id)
        .then(({ data }) => {
          const user = data.user || data;
          setForm({
            name: user.name || '',
            email: user.email || '',
            password: '',
            role: user.role || 'user',
            department: user.department || '',
            location: user.location || '',
          });
        })
        .catch(() => setError('Failed to load user.'))
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
      if (!payload.password) delete payload.password;
      if (isEdit) {
        await updateUser(id, payload);
      } else {
        await createUser(payload);
      }
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/users')} className="text-gray-500 hover:text-gray-700">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit User' : 'Add User'}</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Name', name: 'name', type: 'text', placeholder: 'John Doe', required: true },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'john@example.com', required: true },
            { label: isEdit ? 'New Password (leave blank to keep)' : 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: !isEdit },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {roles.length > 0
                ? roles.map((r) => <option key={r} value={r}>{r}</option>)
                : ['admin', 'manager', 'user'].map((r) => <option key={r} value={r}>{r}</option>)
              }
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select name="department" value={form.department} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">— Select Department —</option>
              {departments.map((d, i) => <option key={i} value={d.name || d}>{d.name || d}</option>)}
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
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/users')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
