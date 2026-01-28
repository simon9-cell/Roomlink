import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. Import useAuth
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner'; // 2. Import Spinner

const MainLayout = () => {
  const { pathname } = useLocation();
  const { loadingSession } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 1. Define only the strictly private area
  const isDashboard = pathname.startsWith("/dashboard");

  // 2. Only block the user if they are going to the Dashboard
  // This removes the "Securing Session" screen from 99% of your site.
  if (loadingSession && isDashboard) {
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