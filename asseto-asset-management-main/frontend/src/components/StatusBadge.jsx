export default function StatusBadge({ status }) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    assigned: 'bg-blue-100 text-blue-800',
    unassigned: 'bg-yellow-100 text-yellow-800',
    maintenance: 'bg-orange-100 text-orange-800',
    retired: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    open: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    resolved: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
  };
  const label = status || 'unknown';
  const cls = styles[label.toLowerCase()] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {label}
    </span>
  );
}
