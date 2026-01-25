import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await resetPassword(email);
      setMessage("Check your email for the reset link!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:text-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-lg p-7 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-xs text-gray-500 mt-2">Enter your email to receive a recovery link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-2.5 rounded-xl bg-gray-100 border text-slate-700 border-gray-200 text-sm outline-none focus:ring-1 focus:ring-[#1877F2]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1877F2] text-white font-bold py-2.5 rounded-xl text-sm hover:brightness-105 disabled:bg-gray-300"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-xs font-bold text-green-600">{message}</p>}
        {error && <p className="mt-4 text-center text-xs font-bold text-red-500">{error}</p>}

        <div className="mt-6 text-center">
          <Link to="/signin" className="text-[11px] text-[#1877F2] font-black hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;