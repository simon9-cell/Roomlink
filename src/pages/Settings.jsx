import { useDarkMode } from "../context/DarkModeContext";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

const Settings = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-gray-900 pt-24 pb-24 px-6">
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
            Settings
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Preferences & Account</p>
        </header>

        {/* APPEARANCE SECTION */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400">
                {darkMode ? <HiOutlineMoon size={24} /> : <HiOutlineSun size={24} />}
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-tight">Appearance</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Toggle Dark Mode</p>
              </div>
            </div>

            {/* YOUR EMOJI TOGGLE */}
            <button
              onClick={toggleDarkMode}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 text-2xl active:scale-90 transition-all border border-transparent hover:border-blue-200"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;