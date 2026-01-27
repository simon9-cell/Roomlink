import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner"; // 1. Add this import

const PrivateRoutes = ({ children }) => {
  const { user, loadingSession } = useAuth();

  // 2. Swap null for the component
  if (loadingSession) return <LoadingSpinner />; 

  if (!user) return <Navigate to="/signin" replace />;

  return children;
};

export default PrivateRoutes;