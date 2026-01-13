import { useState } from "react";

function UrlShortener() {
  const [activeTab, setActiveTab] = useState("shorten");
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [analyticsUrl, setAnalyticsUrl] = useState("");
  const [totalClicks, setTotalClicks] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleShorten() {
    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await fetch("http://localhost:5054/api/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(data.Shorturl);
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }
  async function fetchAnalytics() {
    if (!analyticsUrl.trim()) {
      setError("Short URL is required");
      return;
    }

    setLoading(true);
    setError("");
    setTotalClicks(null);
    setAnalytics([]);

    try {
      const shortId = analyticsUrl.split("/").pop();

      const response = await fetch(
        `http://localhost:5054/api/url/analytics/${shortId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch analytics");
      }
     console.log("Analytics API response:", data);
      setTotalClicks(data.totalClicks ?? data.totalclicks ?? data.clicks ?? 0);
      setAnalytics(data.analytics || []);
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl p-6">

        <h2 className="text-2xl font-bold text-center mb-4">
          URL Shortener System
        </h2>
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${activeTab === "shorten" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("shorten")}
          >
            Shorten URL
          </button>
          <button
            className={`tab ${activeTab === "analytics" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            View Analytics
          </button>
        </div>
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        {activeTab === "shorten" && (
          <>
            <input
              type="text"
              placeholder="Enter long URL"
              className="input input-bordered w-full mb-4"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              className="btn btn-primary w-full"
              onClick={handleShorten}
              disabled={loading}
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>

            {shortUrl && (
              <div className="alert alert-success mt-4 flex flex-col">
                <span className="font-semibold">Short URL</span>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="link link-primary break-all"
                >
                  {shortUrl}
                </a>
              </div>
            )}
          </>
        )}
        {activeTab === "analytics" && (
          <>
            <input
              type="text"
              placeholder="Paste short URL"
              className="input input-bordered w-full mb-4"
              value={analyticsUrl}
              onChange={(e) => setAnalyticsUrl(e.target.value)}
            />

            <button
              className="btn btn-secondary w-full"
              onClick={fetchAnalytics}
              disabled={loading}
            >
              {loading ? "Fetching..." : "View Analytics"}
            </button>
            {totalClicks !== null && (
              <div className="alert alert-info mt-4">
                <span className="font-semibold mb-1">
                  Total Clicks: {totalClicks}
                </span>
              </div>
            )}
            {analytics.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Visit History</h3>
                <ul className="text-sm max-h-40 overflow-y-auto">
                  {analytics.map((item, index) => (
                    <li key={index} className="mb-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default UrlShortener;
