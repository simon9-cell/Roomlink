import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  HiOutlineOfficeBuilding, 
  HiOutlineUserGroup,
  HiOutlineHome, 
  HiOutlinePlus,
} from "react-icons/hi";

const Navbar = () => {
  const { session, userProfile } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="font-sans">
      {/* FIXED TOP NAV */}
      <nav className="fixed top-0 left-0 w-full h-16 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between h-full px-6">
          
          <Link to="/">
            <h1 className="text-blue-600 tracking-tighter font-black text-2xl uppercase italic">
              Room<span className="text-slate-900">Link</span>
            </h1>
          </Link>

          {/* RIGHT SIDE: AUTH STATE */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-[12px] font-black uppercase tracking-widest mr-4">
              <Link to="/house" className={`transition-colors ${isActive('/house') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Houses</Link>
              <Link to="/rooms" className={`transition-colors ${isActive('/rooms') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Roomies</Link>
            </div>

            {session ? (
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {userProfile?.full_name?.charAt(0) || "U"}
                </div>
                <span className="text-xs font-black uppercase tracking-tighter hidden sm:block">Dashboard</span>
              </Link>
            ) : (
              <Link 
                to="/signin" 
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV - Simplified to 4 main zones */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-slate-100 z-50 px-4 pb-5 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between h-16 max-w-md mx-auto relative">
          
          <Link to="/" className={`flex flex-col items-center gap-1 transition-all ${isActive('/') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
            <HiOutlineHome size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
          </Link>

          <Link to="/house" className={`flex flex-col items-center gap-1 transition-all ${isActive('/house') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
            <HiOutlineOfficeBuilding size={24} strokeWidth={isActive('/house') ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Houses</span>
          </Link>

          {/* ACTION BUTTON - The Squircle Plus */}
          <div className="relative -mt-12">
            <Link 
              to="/dashboard" 
              className="bg-blue-600 text-white w-14 h-14 rounded-[20px] flex items-center justify-center shadow-2xl shadow-blue-400 border-[5px] border-white active:scale-90 transition-all"
            >
              <HiOutlinePlus size={28} strokeWidth={3} />
            </Link>
          </div>

          <Link to="/rooms" className={`flex flex-col items-center gap-1 transition-all ${isActive('/rooms') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
            <HiOutlineUserGroup size={24} strokeWidth={isActive('/rooms') ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Roomies</span>
          </Link>

          <Link to="/dashboard" className={`flex flex-col items-center gap-1 transition-all ${isActive('/dashboard') ? 'text-blue-600 scale-110' : 'text-slate-400'}`}>
             {/* Using User Group or simple profile icon for the 4th slot */}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center overflow-hidden ${isActive('/dashboard') ? 'border-blue-600' : 'border-slate-400'}`}>
               <span className="text-[10px] font-bold">{userProfile?.full_name?.charAt(0) || "U"}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Profile</span>
          </Link>
          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;