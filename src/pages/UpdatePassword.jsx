import { useState } from "react";
import { supabase } from "../supabaseClient"; 
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend strength check
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      alert("Password updated successfully!");
      navigate("/signin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen dark:text-white dark:bg-gray-900 bg-[#F0F2F5] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px] bg-white rounded-2xl shadow-lg p-7 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Set New Password</h2>
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2.5 rounded-xl bg-gray-100  text-slate-700 border border-gray-200 text-sm outline-none focus:ring-1 focus:ring-[#1877F2]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1877F2] text-white font-bold py-2.5 rounded-xl text-sm hover:brightness-105"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-xs font-bold text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default UpdatePassword;