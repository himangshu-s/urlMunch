import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyUrls } from "../services/url.service";
import { getUrlAnalytics } from "../services/analytics.service";

function Analytics() {
  const { accessToken } = useAuth();

  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState("");
  const [analytics, setAnalytics] = useState(null);

  const [loadingUrls, setLoadingUrls] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setError("");

        const data = await getMyUrls(accessToken);

        setUrls(data.data);

        if (data.data.length > 0) {
          setSelectedUrlId(data.data[0]._id);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch your URLs.");
      } finally {
        setLoadingUrls(false);
      }
    };

    if (accessToken) {
      fetchUrls();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!selectedUrlId) {
        setAnalytics(null);
        return;
      }

      try {
        setError("");
        setLoadingAnalytics(true);
        setAnalytics(null);

        const data = await getUrlAnalytics(selectedUrlId, accessToken);

        setAnalytics(data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch analytics.");
        setAnalytics(null);
      } finally {
        setLoadingAnalytics(false);
      }
    };

    if (accessToken) {
      fetchAnalytics();
    }
  }, [selectedUrlId, accessToken]);

  if (loadingUrls) {
    return <p>Loading your URLs...</p>;
  }

  if (error && !analytics) {
    return (
      <div className="dashboard-page">
        <p className="form-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-intro">
        <h2>Analytics</h2>

        <p>View click activity for your short URLs.</p>
      </div>

      {urls.length === 0 ? (
        <div className="empty-state">
          <h3>No links yet</h3>

          <p>Create a short URL to start viewing analytics.</p>
        </div>
      ) : (
        <>
          <section className="analytics-selector">
            <div className="form-field">
              <label htmlFor="analytics-url">Select a short URL</label>

              <select
                id="analytics-url"
                value={selectedUrlId}
                onChange={(event) => setSelectedUrlId(event.target.value)}
              >
                {urls.map((url) => (
                  <option key={url._id} value={url._id}>
                    /{url.shortCode} — {url.originalUrl}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {loadingAnalytics ? (
            <p>Loading analytics...</p>
          ) : analytics ? (
            <>
              <section className="analytics-summary">
                <div className="analytics-card">
                  <span>Total clicks</span>
                  <strong>{analytics.totalClicks}</strong>
                </div>

                <div className="analytics-card">
                  <span>Short URL</span>
                  <strong>/{analytics.url.shortCode}</strong>
                </div>

                <div className="analytics-card">
                  <span>Created</span>
                  <strong>
                    {new Date(analytics.url.createdAt).toLocaleDateString()}
                  </strong>
                </div>
              </section>

              <section className="analytics-details">
                <div className="analytics-details-header">
                  <div>
                    <h3>Click activity</h3>

                    <p>Recorded clicks for this short URL.</p>
                  </div>
                </div>

                {analytics.clicks.length === 0 ? (
                  <div className="empty-state">
                    <h3>No clicks yet</h3>

                    <p>
                      Click activity will appear here once someone visits your
                      short URL.
                    </p>
                  </div>
                ) : (
                  <div className="links-table-wrapper">
                    <table className="links-table">
                      <thead>
                        <tr>
                          <th>Short URL</th>
                          <th>Clicked at</th>
                        </tr>
                      </thead>

                      <tbody>
                        {analytics.clicks.map((click, index) => (
                          <tr key={`${click.timestamp}-${index}`}>
                            <td>/{click.shortCode}</td>

                            <td>
                              {new Date(click.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Analytics;
