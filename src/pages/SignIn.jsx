import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signInUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signInUser(email, password);
      if (!result.success) {
        setError(result.error.message);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Google connection failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F2F5] flex flex-col items-center justify-center p-4">
      
      {/* Reduced max-width to 360px for a more "portable" feel */}
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-7">
          
          {/* Tighter Branding Section */}
          <div className="text-center mb-5">
            <Link to="/" className="inline-block mb-1 hover:opacity-80 transition-opacity">
              <h1 className="text-[#1877F2] tracking-tighter font-black text-xl uppercase italic leading-none">
                Room<span className="text-slate-900">Link</span>
              </h1>
            </Link>
            <h2 className="text-lg font-bold text-gray-800">Welcome Back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Compact Email Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1877F2] text-sm"
                placeholder="name@email.com"
                required
              />
            </div>

            {/* Compact Password Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1877F2] text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#1877F2] text-white font-bold py-2.5 rounded-xl text-sm hover:brightness-105 active:scale-[0.98] transition-all disabled:bg-gray-300 mt-1"
            >
              {loading ? "..." : "Log In"}
            </button>
          </form>

          {/* Minimalist Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="px-3 text-gray-300 text-[8px] font-black uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* Slim Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 p-2 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 transition-all font-bold text-gray-700 text-xs shadow-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4" />
            Google
          </button>

          {error && (
            <p className="mt-3 text-center text-[10px] font-bold text-red-500">{error}</p>
          )}

          <p className="text-center mt-5 text-gray-500 text-[11px]">
            New here?{" "}
            <Link to="/signup" className="text-[#1877F2] font-black hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;