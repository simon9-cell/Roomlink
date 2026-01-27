import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {

  useEffect(()=> {
    document.title = "Page Not Found | Roomlink"
  }, [])
  return (
    <div className="min-h-screen dark:text-white dark:bg-gray-900 bg-[#F0F2F5] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-9xl font-black text-blue-600/20 tracking-tighter">404</h1>
      <div className="relative -mt-16">
        <h2 className="text-3xl font-black text-slate-900 uppercase italic">Lost in the <span className="text-blue-600">Link?</span></h2>
        <p className="text-slate-500 mt-4 max-w-xs mx-auto font-medium">
          We can't find the room or page you're looking for. It might have been moved or deleted.
        </p>
        <Link 
          to="/" 
          className="mt-8 inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:scale-105 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;