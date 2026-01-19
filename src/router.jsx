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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "house",
        element: <HousePage />,
      },
      {
        path: "house/:id",
        element: <HouseDetail />, // This shows the specific house based on ID
      },
      {
        path: "rooms",
        element: <RoomPage />
      },
      {
        path: "rooms/:id",
        element: <RoomateDetail />
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoutes>
            {" "}
            <Dashboard />{" "}
          </PrivateRoutes>
        ),
      },
    ],
  },
]);
