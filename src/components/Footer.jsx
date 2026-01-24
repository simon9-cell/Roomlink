import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Only visible on large screens (lg), hidden on mobile/tablet
    <footer className="hidden lg:flex w-full  bg-white/80 backdrop-blur-md border-b border-slate-200 border-t  py-10 mt-20">
      <div className="max-w-[1240px] mx-auto px-6 w-full flex justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col">
          <h1 className="text-blue-600 tracking-tighter font-black text-2xl uppercase italic">
            Room<span className="text-slate-900">Link</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold ml-1">
            Connecting rooms & people
          </p>
        </div>

        {/* Copyright Section */}
        <div className="text-right">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            © {currentYear}{" "}
            <span className="text-blue-600 italic font-black">
              Room<span className="text-slate-900">Link</span>
            </span>
          </p>
          <p className="text-[9px] text-gray-500 uppercase mt-1 tracking-tighter font-bold">
            One click away from your new home
          </p>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;