import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";

import { 
  HiOutlineOfficeBuilding, 
  HiOutlineUserGroup,
  HiOutlineHome, 
  HiOutlinePlus,
} from "react-icons/hi";

const Navbar = () => {
  const { session, userProfile } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="font-sans">
      {/* FIXED TOP NAV */}
      <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm dark:text-white dark:bg-gray-900">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between h-full px-6">

          {/* LOGO */}
          <NavLink to="/" end>
            <h1 className="text-blue-600 tracking-tighter font-black text-2xl uppercase italic">
              Room<span className="text-slate-900 dark:text-white">Link</span>
            </h1>
          </NavLink>

          {/* RIGHT SIDE: NAV LINKS + AUTH + DARK TOGGLE */}
          <div className="flex items-center gap-4">
            {/* Links */}
            <div className="hidden md:flex items-center gap-6 text-[12px] font-black uppercase tracking-widest mr-4">
              <Link to="/house" className={`transition-colors ${isActive('/house') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'}`}>Houses</Link>
              <Link to="/rooms" className={`transition-colors ${isActive('/rooms') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'}`}>Roommates</Link>
            </div>

            {/* Auth */}
            {session ? (
              <NavLink 
                to="/dashboard" 
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {userProfile?.full_name?.charAt(0) || "U"}
                </div>
                <span className="text-xs font-black uppercase tracking-tighter hidden sm:block">Dashboard</span>
              </NavLink>
            ) : (
              <NavLink
                to="/signin" 
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg border border-gray-50"
              >
                Log In
              </NavLink>
            )}

            {/* DARK MODE TOGGLE */}
            <button
              onClick={toggleDarkMode}
              className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:brightness-105 transition"
              title="Toggle Dark Mode"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full  dark:text-white dark:bg-gray-900 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-50 px-8 pb-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between h-16 max-w-md mx-auto relative">
          
          <NavLink to="/" className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-blue-600 scale-110' : 'text-slate-400'}`} end>
            <HiOutlineHome size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
          </NavLink>

          <NavLink to="/house" className={`flex flex-col items-center gap-1 transition-all ${isActive('/house') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
            <HiOutlineOfficeBuilding size={24} strokeWidth={isActive('/house') ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Houses</span>
          </NavLink>

          <div className="relative -mt-12">
            <NavLink
              to="/dashboard" 
              className="bg-blue-600 text-white w-14 h-14 rounded-[20px] flex items-center justify-center shadow-2xl shadow-blue-400 border-[5px] border-white active:scale-90 transition-all"
            >
              <HiOutlinePlus size={28} strokeWidth={3} />
            </NavLink>
          </div>

          <NavLink to="/rooms" className={`flex flex-col items-center gap-1 transition-all ${isActive('/rooms') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
            <HiOutlineUserGroup size={24} strokeWidth={isActive('/rooms') ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Roommates</span>
          </NavLink>
          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
