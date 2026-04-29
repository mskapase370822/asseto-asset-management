export default function LoadingSpinner({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
    </div>
  );
}
