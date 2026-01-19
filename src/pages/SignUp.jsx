import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signUpNewUser } = useAuth();
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
      // Note: Supabase usually requires email confirmation. 
      // If you haven't turned that off in Supabase settings, 
      // navigate('/dashboard') might show an empty session.
      navigate('/dashboard');
    } catch (error) {
      setError("An error occurred during sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Background: Facebook Light Gray (#F0F2F5)
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F2F5] px-6 py-12">
      
      {/* Brand Header */}
      <Link to="/" className="mb-8">
        <h1 className="text-4xl font-black text-[#1877F2] tracking-tighter">RoomLink</h1>
      </Link>

      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">Create a New Account</h2>
        <p className="text-gray-500 mb-8 text-center text-sm">
          It's quick and easy. Already have an account? <Link className="text-[#1877F2] font-bold hover:underline" to='/signin'>Sign in</Link>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="p-4 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent transition-all"
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="p-4 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="New Password" 
            className="p-4 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button 
            type="submit"
            className={`mt-2 text-white font-black py-3 rounded-lg text-lg transition-all ${
              loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#42b72a] hover:bg-[#36a420] active:scale-[0.98]"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 mt-4 py-3 px-3 rounded-lg flex items-center gap-2">
            <span className="text-red-600 font-bold">⚠️</span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-center mt-6">
          By clicking Sign Up, you agree to our Terms, Data Policy and Cookie Policy.
        </p>
      </div>
    </div>
  );
};

export default SignUp;