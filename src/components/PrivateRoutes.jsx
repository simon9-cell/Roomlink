import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"

const PrivateRoutes = ({ children }) => {
  const { session, loading } = useAuth(); // Grab loading from context

  // 1. Show nothing or a spinner while checking login status
  if (loading) {
    return <div className="text-white">Loading...</div>; 
  }

  // 2. If no session, go to signin. If session, show the children (Dashboard)
  return session ? children : <Navigate to='/signin' />;
}

export default PrivateRoutes;