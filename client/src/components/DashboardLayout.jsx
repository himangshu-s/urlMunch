import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">urlMunch</div>

        <nav className="sidebar-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/dashboard/links">My Links</Link>
          <Link to="/dashboard/analytics">Analytics</Link>
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
          </div>

          <div className="dashboard-user">
            <span>{user?.username}</span>

            <button className="button button-secondary">
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;