import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function TrendingPage() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("http://localhost:5050/news"); // ✅ Use local proxy
        if (!response.ok) throw new Error(`Failed to fetch news: ${response.statusText}`);

        const data = await response.json();
        if (!data.results || data.results.length === 0) {
          throw new Error("No trending news available right now.");
        }

        setTrending(data.results);
      } catch (err) {
        console.error("Error fetching trending news:", err);
        setError(err.message);
      }

      setLoading(false);
    };

    fetchTrending();
  }, []);

  return (
    <div className="p-6 bg-primary min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-text-primary tracking-tight mb-6"
      >
        🔥 Trending Now
      </motion.h1>

      {loading && (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-accent w-10 h-10" />
          <span className="ml-3 text-lg text-text-secondary">Fetching the latest trends...</span>
        </div>
      )}

      {!loading && error && (
        <div className="text-red-400 bg-red-500/10 p-4 rounded-lg text-center">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && trending.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {trending.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              className="bg-secondary/40 backdrop-blur-xl border border-border-color rounded-2xl shadow-lg hover:shadow-accent/30 transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden"
              onClick={() => window.open(article.link, "_blank")}
            >
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-56 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-400">
                  📰 No Image Available
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-text-primary leading-snug line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-text-secondary mt-2 line-clamp-3">
                  {article.description || "No description available."}
                </p>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                  <span>{article.source_id ? `📌 ${article.source_id.toUpperCase()}` : "📌 Unknown Source"}</span>
                  <span>{article.pubDate ? new Date(article.pubDate).toLocaleDateString() : "Today"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && !error && trending.length === 0 && (
        <p className="text-center text-text-secondary mt-10">
          🔥 No trending news available at the moment.
        </p>
      )}
    </div>
  );
}
