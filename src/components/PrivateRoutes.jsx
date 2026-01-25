import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = ({ children }) => {
  const { user, loadingSession } = useAuth();

  if (loadingSession) return null; // prevents flicker

  if (!user) return <Navigate to="/signin" replace />;

  return children;
};

export default PrivateRoutes;
