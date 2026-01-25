import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { signUpNewUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUpNewUser(email, password, name);

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user && !data?.session) {
        setIsSuccess(true);
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch {
      setError("Sign up failed. Please try again.");
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
              {isSuccess ? "Check your email" : "Create Account"}
            </h2>
          </div>

          {/* -------- SUCCESS SCREEN -------- */}
          {isSuccess ? (
            <div className="text-center space-y-4 py-4">

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                  We've sent a verification link to{" "}
                  <span className="font-bold">{email}</span>.
                </p>
              </div>

              <p className="text-xs text-gray-500">
                Click the link in your email to activate your account.
              </p>

              <button
                onClick={() => navigate("/signin", { replace: true })}
                className="w-full bg-[#1877F2] text-white font-bold py-2.5 rounded-xl text-sm hover:brightness-105"
              >
                Go to Sign In
              </button>

            </div>
          ) : (
            <>
              {/* -------- FORM -------- */}
              <form onSubmit={handleSubmit} className="space-y-3">

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full text-slate-700 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full text-slate-700 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className="w-full text-slate-700 p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm disabled:opacity-60"
                  />
                </div>

                {/* -------- BUTTON WITH SPINNER -------- */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl text-sm transition
                    ${loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#1877F2] hover:bg-blue-600 text-white"
                    }`}
                >

                  {loading && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}

                  {loading ? "Creating Account..." : "Sign Up"}

                </button>

              </form>
            </>
          )}

          {/* -------- ERROR -------- */}
          {error && (
            <p className="mt-3 text-center text-[10px] font-bold text-red-500">
              {error}
            </p>
          )}

          <p className="text-center mt-5 text-gray-500 text-[11px]">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#1877F2] font-black">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignUp;
