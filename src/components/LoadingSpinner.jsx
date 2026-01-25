const LoadingSpinner = () => {
  return (
    // 'fixed inset-0' ignores all parents and locks to the phone glass
    // 'h-[100dvh]' handles the mobile address bar height perfectly
    // 'z-[9999]' stays on top of the long URL redirect layer
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999] w-full h-[100dvh]">
      <div className="flex flex-col items-center">
        {/* Spinner with a clear color so it's not invisible */}
        <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Securing Session
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;