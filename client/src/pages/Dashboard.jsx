import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createShortUrl } from "../services/url.service";
const API_BASE_URL = import.meta.env.VITE_API_URL;
function Dashboard() {
  const { user, accessToken } = useAuth();

  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [createdUrl, setCreatedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (!createdUrl) {
      return;
    }

    const shortUrl = `${API_BASE_URL}/${createdUrl.shortCode}`;

    try {
      await navigator.clipboard.writeText(shortUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const handleCreateUrl = async (event) => {
    event.preventDefault();

    setError("");
    setCreatedUrl(null);
    setLoading(true);

    try {
      const urlData = {
        originalUrl,
      };

      if (customAlias.trim()) {
        urlData.customAlias = customAlias.trim();
      }

      if (expiresAt) {
        urlData.expiresAt = expiresAt;
      }

      const data = await createShortUrl(urlData, accessToken);

      setCreatedUrl(data.data);
      setCopied(false);

      setOriginalUrl("");
      setCustomAlias("");
      setExpiresAt("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create short URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-intro">
        <h2>Welcome, {user?.username}</h2>

        <p>Create and manage your short links.</p>
      </div>

      <section className="create-url-card">
        <div>
          <h3>Create a short URL</h3>

          <p>Enter a long URL to create a short, shareable link.</p>
        </div>

        <form onSubmit={handleCreateUrl} className="create-url-form">
          <div className="form-field">
            <label htmlFor="original-url">Original URL</label>

            <input
              id="original-url"
              type="url"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              placeholder="https://example.com/your-long-url"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="custom-alias">
              Custom alias
              <span className="optional">Optional</span>
            </label>

            <input
              id="custom-alias"
              type="text"
              value={customAlias}
              onChange={(event) => setCustomAlias(event.target.value)}
              placeholder="my-link"
            />
          </div>

          <div className="form-field">
            <label htmlFor="expires-at">
              Expiration
              <span className="optional">Optional</span>
            </label>

            <input
              id="expires-at"
              type="datetime-local"
              value={expiresAt}
              onChange={(event) => setExpiresAt(event.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create short URL"}
          </button>
        </form>

        {createdUrl && (
          <div className="created-url">
            <p>Short URL created</p>

            <div className="created-url-row">
              <a
                href={`${API_BASE_URL}/${createdUrl.shortCode}`}
                target="_blank"
                rel="noreferrer"
              >
                {API_BASE_URL}/{createdUrl.shortCode}
              </a>

              <button
                type="button"
                className="table-action"
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
