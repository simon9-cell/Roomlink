import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signInUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signInUser(email, password);
      if (!result.success) {
        setError(result.error.message);
        setLoading(false);
        return;
      }
      navigate('/dashboard');
    } catch (error) {
      setError("An Error Occurred, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background is now a soft Facebook gray (#F0F2F5)
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] px-6 py-12">
      
      {/* Brand Label Above Card */}
      <h1 className="text-4xl font-black text-[#1877F2] mb-6 tracking-tighter">RoomLink</h1>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Log Into RoomLink</h2>
        <p className="text-gray-500 mb-8 text-center text-sm">
          New here? <Link className="text-[#1877F2] font-bold hover:underline" to='/signup'>Create an account</Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input 
            type="email" 
            placeholder="Email address" 
            // High contrast: Gray border, white background, dark text
            className="p-4 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            className="p-4 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit"
            // Facebook Blue Button
            className={`mt-2 text-white font-black py-3 rounded-lg text-lg transition-all ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#1877F2] hover:bg-[#166fe5] active:scale-[0.98]"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="border-t border-gray-200 mt-6 pt-6">
           <p className="text-center text-gray-400 text-xs italic">
             Secure login powered by Supabase
           </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 mt-4 py-3 px-3 rounded-lg flex items-center gap-2">
            <span className="text-red-600 font-bold">⚠️</span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;