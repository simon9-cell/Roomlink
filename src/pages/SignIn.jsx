import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { signInUser, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  document.title = "Login | RoomLink";
}, []);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (session) {
      navigate(from, { replace: true });
    }
  }, [session, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await signInUser(email, password);
       toast.success("Logged in successfully!");
    } catch (err) {
      console.error("Login error:", err);

      const message = err?.message || "";

      if (message.toLowerCase().includes("email not confirmed")) {
        setError("Please confirm your email before logging in.");
      } else if (message.toLowerCase().includes("invalid login credentials")) {
        setError("Incorrect email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dark:text-white dark:bg-gray-900 w-full bg-[#F0F2F5] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-7">
          <div className="text-center mb-5">
            <Link to="/" className="inline-block mb-1 hover:opacity-80">
              <h1 className="text-[#1877F2] tracking-tighter font-black text-xl uppercase italic leading-none">
                Room<span className="text-slate-900">Link</span>
              </h1>
            </Link>
            <h2 className="text-lg font-bold text-gray-800">
              Welcome Back
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                disabled={loading}
                className="w-full text-slate-700 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm"
                placeholder="name@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                  className="w-full text-slate-700 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm"
                  placeholder="••••••••"
                  required
                />

                <span
                  
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1877F2] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={2.5} />
                  ) : (
                    <Eye size={18} strokeWidth={2.5} />
                  )}
                </span>
              </div>

              <div className="flex justify-end mt-1 px-1">
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold text-[#1877F2]"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-2.5 rounded-xl text-sm transition 
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#1877F2] hover:bg-blue-600 text-white"
              }`}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-center text-[10px] font-bold text-red-500">
              {error}
            </p>
          )}

          <p className="text-center mt-5 text-gray-500 text-[11px]">
            New here?{" "}
            <Link to="/signup" className="text-[#1877F2] font-black">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
