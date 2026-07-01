import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8081";

export default function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    try {
      new URL(inputUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/shorten`, {
        url: inputUrl,
      });
      setResult(res.data);
      setInputUrl("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Is your backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
  if (!result) return;

  try {
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch {
    setError("Failed to copy.");
  }
};
 
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl">

        <h1 className="text-4xl font-bold mb-2 tracking-tight">
          URL Shortener
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Paste a long URL and get a clean short link instantly.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            placeholder="https://example.com/very/long/url"
            className="flex-1 bg-black border border-white/20 rounded-lg px-4 py-3 text-sm outline-none focus:border-white transition placeholder-gray-600"
          />
          <button
            onClick={handleShorten}
            disabled={loading}
            className="bg-white text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 disabled:opacity-40 transition"
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {result && (
          <div className="border border-white/10 rounded-xl overflow-hidden mt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-left">
                  <th className="px-4 py-3 font-medium">Short URL</th>
                  <th className="px-4 py-3 font-medium">Original URL</th>
                  <th className="px-4 py-3 font-medium text-center">Clicks</th>
                  <th className="px-4 py-3 font-medium text-center">Copy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-white/5 transition">
                  <td className="px-4 py-3">
                    <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white hover:underline font-mono"
                    >
                      /{result.shortCode}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                    {result.originalUrl}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-400">
                    {result.clickCount}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={handleCopy}
                      className="text-xs border border-white/20 hover:border-white px-3 py-1 rounded transition"
                    >
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {!result && !error && (
          <p className="text-gray-600 text-sm mt-8 text-center">
            Your shortened URL will appear here.
          </p>
        )}

      </div>
    </div>
  );
}