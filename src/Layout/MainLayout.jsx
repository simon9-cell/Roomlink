import { Outlet } from "react-router-dom";
import Navbar from '../components/Navbar';


const MainLayout = () => {
  return (
   // min-h-screen ensures the footer stays at the bottom even on short pages
    <div className="flex flex-col min-h-screen">
      <Navbar />
    
    {/* flex-grow pushes the footer down */}
      <main className="flex-grow pt-20">
       <Outlet />
      </main>

      
    </div>
  )
}

export default MainLayout