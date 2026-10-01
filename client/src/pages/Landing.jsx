import { Link } from "react-router-dom";

function Landing() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">urlMunch</div>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-link">
            Login
          </Link>

          <Link to="/register" className="button button-primary">
            Get started
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-content">
          <p className="landing-label">URL SHORTENER</p>

          <h1>
            Short links.
            <br />
            Nothing unnecessary.
          </h1>

          <p className="landing-description">
            Create, manage, and track short URLs from one simple dashboard.
          </p>

          <div className="landing-actions">
            <Link to="/register" className="button button-primary">
              Create an account
            </Link>

            <Link to="/login" className="button button-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-feature">
          <h3>Custom links</h3>

          <p>Create a short URL with your own alias when you need one.</p>
        </div>

        <div className="landing-feature">
          <h3>Link management</h3>

          <p>View, edit, and delete the short URLs you've created.</p>
        </div>

        <div className="landing-feature">
          <h3>Click analytics</h3>

          <p>Track visits to your short URLs from the dashboard.</p>
        </div>
      </section>
    </main>
  );
}

export default Landing;
