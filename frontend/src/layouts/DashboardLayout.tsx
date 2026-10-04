import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div>
      <header>VendorDashboard</header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;