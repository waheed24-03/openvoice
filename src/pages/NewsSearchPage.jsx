import React, { useEffect, useState } from "react";

export default function NewsSearchPage({ query }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError("");

      try {
        // ✅ Call local proxy instead of direct API
        const response = await fetch(`http://localhost:5050/news?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Failed to fetch news: ${response.statusText}`);

        const data = await response.json();

        if (data.results) {
          setNews(data.results);
        } else {
          setError("No results found");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to fetch news");
      }

      setLoading(false);
    };

    fetchNews();
  }, [query]);

  if (!query) {
    return <div className="p-6 text-text-secondary">Search for something to see news!</div>;
  }

  if (loading) {
    return <div className="p-6 text-text-secondary">Loading news...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-text-primary mb-4">News results for "{query}"</h1>
      <ul className="space-y-6">
        {news.map((article, index) => (
          <li key={index} className="bg-secondary rounded-lg p-4 shadow-md">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold text-accent hover:underline"
            >
              {article.title}
            </a>
            <p className="text-sm text-text-secondary mt-2">{article.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
