export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = currentPage - delta;
  const right = currentPage + delta + 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i < right)) {
      pages.push(i);
    }
  }

  const withEllipsis = [];
  let prev = null;
  for (const page of pages) {
    if (prev && page - prev > 1) withEllipsis.push('...');
    withEllipsis.push(page);
    prev = page;
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border text-sm disabled:opacity-50 hover:bg-gray-100"
      >
        &laquo;
      </button>
      {withEllipsis.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1 text-sm text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded border text-sm ${
              page === currentPage
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border text-sm disabled:opacity-50 hover:bg-gray-100"
      >
        &raquo;
      </button>
    </div>
  );
}
