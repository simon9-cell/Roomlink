import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signUpNewUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signUpNewUser(email, password, name);
      if (!result.success) {
        setError(result.error.message);
        setLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Sign up failed. Please try again.");
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
      
      {/* Compact Card (360px width) */}
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-7">
          
          {/* INTERNAL BRANDING */}
          <div className="text-center mb-5">
            <Link to="/" className="inline-block mb-1 hover:opacity-80 transition-opacity">
              <h1 className="text-[#1877F2] tracking-tighter font-black text-xl uppercase italic leading-none">
                Room<span className="text-slate-900">Link</span>
              </h1>
            </Link>
            <h2 className="text-lg font-bold text-gray-800">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1877F2] text-sm"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Email Address
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

            {/* Password Field */}
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#1877F2] text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#1877F2] text-white font-bold py-2.5 rounded-xl text-sm hover:brightness-105  active:scale-[0.98] transition-all disabled:bg-gray-300 mt-1"
            >
              {loading ? "..." : "Sign Up"}
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
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-2 p-2 border border-gray-100 rounded-xl bg-white hover:bg-gray-50 transition-all font-bold text-gray-700 text-xs shadow-sm"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="G" 
              className="w-4 h-4" 
            />
            {googleLoading ? "..." : "Google"}
          </button>

          {error && (
            <p className="mt-3 text-center text-[10px] font-bold text-red-500 leading-tight">
              {error}
            </p>
          )}

          <p className="text-center mt-5 text-gray-500 text-[11px]">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#1877F2] font-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      
      {/* Policy Text - Outside card to keep card short */}
      <p className="max-w-[300px] text-[9px] text-gray-400 text-center mt-4 leading-tight">
        By signing up, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default SignUp;