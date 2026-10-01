import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/auth.service";

function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    } finally {
      logout();
      navigate("/login");
    }
  };

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

            <button className="button button-secondary" onClick={handleLogout}>
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
