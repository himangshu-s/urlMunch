import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Welcome, {user?.username}
      </p>
    </main>
  );
}

export default Dashboard;