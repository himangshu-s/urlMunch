import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const data = await loginUser({
      email,
      password,
    });

    login(data);

    navigate("/dashboard");
  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data || error.message,
    );
  }
};

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">urlMunch</p>
          <h1>Welcome back</h1>
          <p>Log in to manage your short links.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              required
            />
          </div>

          <button
            type="submit"
            className="button button-primary auth-submit"
          >
            Log in
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <a href="/register">Create one</a>
        </p>
      </div>
    </main>
  );
}

export default Login;