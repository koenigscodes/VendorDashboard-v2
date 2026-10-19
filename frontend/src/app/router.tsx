import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import CreateOrder from "../pages/CreateOrder";
import Products from "../pages/Products";
import Vendors from "../pages/Vendors";
import OrderDetails from "../pages/OrderDetails";

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
            element: <Orders />,   
        },
        {
            path: "orders/new",
            element: <CreateOrder />,
        },
        {
            path: "orders/:id",
            element: <OrderDetails />,   
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