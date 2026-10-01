import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyUrls, deleteUrl, updateUrl } from "../services/url.service";
const API_BASE_URL = import.meta.env.VITE_API_URL;

function MyLinks() {
  const { accessToken } = useAuth();

  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState("");
  const [editExpiresAt, setEditExpiresAt] = useState("");

  const handleDelete = async (urlId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this short URL?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(urlId);

      await deleteUrl(urlId, accessToken);

      setUrls((currentUrls) => currentUrls.filter((url) => url._id !== urlId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete the URL.");
    } finally {
      setDeletingId(null);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditOriginalUrl("");
    setEditExpiresAt("");
  };

  const handleEdit = async (urlId) => {
    try {
      setError("");
      const updates = {
        originalUrl: editOriginalUrl,
        expiresAt: editExpiresAt || null,
      };

      const data = await updateUrl(urlId, updates, accessToken);

      setUrls((currentUrls) =>
        currentUrls.map((url) => (url._id === urlId ? data.data : url)),
      );

      setEditingId(null);
      setEditOriginalUrl("");
      setEditExpiresAt("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update the URL.");
    }
  };

  const startEditing = (url) => {
    setEditingId(url._id);
    setEditOriginalUrl(url.originalUrl);

    if (url.expiresAt) {
      const date = new Date(url.expiresAt);

      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000,
      );

      setEditExpiresAt(localDate.toISOString().slice(0, 16));
    } else {
      setEditExpiresAt("");
    }
  };

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setError("");

        const data = await getMyUrls(accessToken);

        setUrls(data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch your URLs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, [accessToken]);

  if (loading) {
    return <p>Loading your links...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-intro">
        <h2>My Links</h2>

        <p>Manage the short URLs you've created.</p>
      </div>

      {urls.length === 0 ? (
        <div className="empty-state">
          <h3>No links yet</h3>

          <p>Create your first short URL from the dashboard.</p>
        </div>
      ) : (
        <div className="links-table-wrapper">
          <table className="links-table">
            <thead>
              <tr>
                <th>Original URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
                <th>Expiration</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {urls.map((url) => (
                <tr key={url._id}>
                  <td className="original-url">
                    {editingId === url._id ? (
                      <input
                        className="table-input"
                        type="url"
                        value={editOriginalUrl}
                        onChange={(event) =>
                          setEditOriginalUrl(event.target.value)
                        }
                      />
                    ) : (
                      url.originalUrl
                    )}
                  </td>

                  <td>
                    <a
                      href={`${API_BASE_URL}/${url.shortCode}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      /{url.shortCode}
                    </a>
                  </td>

                  <td>{url.clicks}</td>

                  <td>
                    {editingId === url._id ? (
                      <input
                        className="table-input"
                        type="datetime-local"
                        value={editExpiresAt}
                        onChange={(event) =>
                          setEditExpiresAt(event.target.value)
                        }
                      />
                    ) : url.expiresAt ? (
                      new Date(url.expiresAt).toLocaleDateString()
                    ) : (
                      "Never"
                    )}
                  </td>

                  <td>
                    {editingId === url._id ? (
                      <div className="table-actions">
                        <button
                          className="table-action"
                          onClick={() => handleEdit(url._id)}
                        >
                          Save
                        </button>

                        <button
                          className="table-action"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        <button
                          className="table-action"
                          onClick={() => startEditing(url)}
                        >
                          Edit
                        </button>

                        <button
                          className="table-action delete-action"
                          onClick={() => handleDelete(url._id)}
                          disabled={deletingId === url._id}
                        >
                          {deletingId === url._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyLinks;
