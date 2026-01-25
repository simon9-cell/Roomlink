import { useEffect } from "react"; // 1. Added import
import { Outlet, useLocation } from "react-router-dom"; // 2. Added useLocation
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  const { pathname } = useLocation();

  // 3. Put the effect directly in the Layout
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* pt-20 handles the fixed navbar height */}
      <main className="flex-grow pt-10 dark:bg-slate-900">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;