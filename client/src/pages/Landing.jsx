import { Link } from "react-router-dom";

function Landing() {
  return (
    <main className="landing">
      <nav className="navbar">
        <div className="logo">urlMunch</div>

        <div className="nav-actions">
          <Link to="/login" className="button button-secondary">
  Login
</Link>

<Link to="/register" className="button button-primary">
  Get Started
</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">URL SHORTENER</p>

          <h1>Turn long URLs into short links.</h1>

          <p className="hero-description">
            Create, manage, and track your short links from one
            simple dashboard.
          </p>

          <div className="url-form">
            <input
              type="url"
              placeholder="Paste your long URL"
            />

            <button className="button button-primary">
              Shorten
            </button>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Short links</h3>
          <p>
            Create compact URLs that are easy to share.
          </p>
        </div>

        <div className="feature">
          <h3>Custom aliases</h3>
          <p>
            Use your own short code when you need a memorable link.
          </p>
        </div>

        <div className="feature">
          <h3>Analytics</h3>
          <p>
            Track clicks on the links you create.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Landing;