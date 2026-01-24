const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* The Spinning Circle */}
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">
        Securing your session...
      </p>
    </div>
  );
};

export default LoadingSpinner;