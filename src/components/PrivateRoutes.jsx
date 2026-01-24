import { useAuth } from "../context/AuthContext"
import { Navigate, useLocation } from "react-router-dom"

const PrivateRoutes = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation(); // Keeps track of where the user was trying to go

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1877F2]"></div>
          <p className="text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // If not logged in, we send them to /signin but save the 'from' location
  // so we can redirect them back to the dashboard after they log in.
  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoutes;