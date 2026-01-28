import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner'; // 2. Import Spinner

const MainLayout = () => {
  const { pathname } = useLocation();
  const { loadingSession } = useAuth(); // 3. Get loading state

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 4. Check if we are on a page that shouldn't be blocked by a spinner
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // 5. If loading AND NOT an auth page, show spinner
  if (loadingSession && !isAuthPage) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow dark:bg-slate-900 bg-slate-200 pt-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;