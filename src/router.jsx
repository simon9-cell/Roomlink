import { createBrowserRouter } from "react-router-dom";
import Signin from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./Layout/MainLayout";
import Homepage from "./pages/Homepage";
import HousePage from "./pages/HousePage";
import HouseDetail from "./pages/HouseDetail";
import RoomPage from "./pages/RoomPage";
import PrivateRoutes from "./components/PrivateRoutes";
import RoomateDetail from "./pages/RoomateDetail";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import NotFound from "./pages/NotFound";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "house", element: <HousePage /> },
      { path: "house/:id", element: <HouseDetail /> },
      { path: "rooms", element: <RoomPage /> },
      { path: "rooms/:id", element: <RoomateDetail /> },
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <SignUp /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "update-password", element: <UpdatePassword /> },
      
      { path: "dashboard", element: <PrivateRoutes><Dashboard /></PrivateRoutes> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
