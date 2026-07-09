import { useState } from "react";
import axios from "axios";

const API_BASE = "https://url-shortener-production-6166.up.railway.app";



export default function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    try {
      const parsed = new URL(inputUrl);
      if (
          parsed.protocol !== "http:" &&
          parsed.protocol !== "https:"
      ) {
        throw new Error();
      }
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

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h1 className="text-3xl font-bold tracking-tight">
                URL Shortener
              </h1>
            </div>
            <p className="text-gray-500 text-sm">
              Paste a long URL and get a clean short link instantly.
            </p>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-3">
            <input
                autoFocus
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                placeholder="https://example.com/very/long/url"
                aria-label="Enter URL"
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm outline-none focus:border-white transition placeholder-zinc-600"
            />
            <button
                aria-label="Enter URL"
                onClick={handleShorten}
                disabled={loading || !inputUrl.trim()}
                className="bg-white text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              {loading ? (
                  <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Shortening
              </span>
              ) : "Shorten"}
            </button>
          </div>

          {/* Error */}
          {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
          )}

          {/* Result */}
          {result && (
              <div className="mt-6 border border-zinc-800 rounded-xl overflow-hidden">

                {/* Result header */}
                <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-zinc-400 font-medium">Link shortened successfully</span>
                </div>

                <table className="w-full text-sm">
                  <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 text-left">
                    <th className="px-4 py-3 font-medium">Short URL</th>
                    <th className="px-4 py-3 font-medium">Original URL</th>
                    <th className="px-4 py-3 font-medium text-center">Clicks</th>
                    <th className="px-4 py-3 font-medium text-center">Copy</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className="hover:bg-zinc-900 transition">
                    <td className="px-4 py-4">
                      <a
                          href={result.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-white hover:underline font-mono text-sm group"
                      >
                        <svg
                            className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        /{result.shortCode}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-zinc-400 max-w-xs truncate text-xs" title={result.originalUrl}>
                      {result.originalUrl}
                    </td>
                    <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-zinc-400 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {result.clickCount}
                    </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                          aria-label="Copy short URL"
                          onClick={handleCopy}
                          className="inline-flex items-center gap-1.5 text-xs border border-zinc-700 hover:border-white px-3 py-1.5 rounded-md transition"
                      >
                        {copied ? (
                            <>
                              <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Copied ✓
                            </>
                        ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </>
                        )}
                      </button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
          )}

          {/* Empty state */}
          {!result && !error && (
              <div className="mt-10 flex flex-col items-center gap-2 text-zinc-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <p className="text-sm">Your shortened URL will appear here.</p>
              </div>
          )}

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-700">
            <span>Built by Sai Gargey</span>
            <div className="flex gap-4">
              <a
                  href="https://github.com/SaiGargey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a
                  href="https://linkedin.com/in/YOUR_LINKEDIN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

        </div>
      </div>
  );
}