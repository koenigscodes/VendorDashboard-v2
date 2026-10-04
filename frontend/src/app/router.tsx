import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Vendors from "../pages/Vendors";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
        {
            index: true,
            element: <Dashboard />
        },
        {
            path: "orders",
            element: <Orders />
        },
        {
            path: "products",
            element: <Products />,
        },
        {
            path: "vendors",
            element: <Vendors />,
        },
    ],
  },
]);

export default router;