import React, { useState, useEffect } from "react";
import { Search, Pen, Upload } from "lucide-react";
import { motion } from "framer-motion";

const RightSidebar = ({ onPostClick, onSearch }) => {
  const [query, setQuery] = useState("");
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top trending news via local proxy
  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5050/news");
        if (!response.ok) throw new Error("Failed to fetch trending news");

        const data = await response.json();
        setTrending(data.results ? data.results.slice(0, 5) : []);
      } catch (err) {
        console.error("Error fetching sidebar trending:", err);
      }
      setLoading(false);
    };

    fetchTrending();
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      onSearch(query);
    }
  };

  return (
    <aside className="w-80 p-4 hidden lg:flex flex-col bg-primary border-l border-border-color h-screen sticky top-0 space-y-6">
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-black placeholder-gray-400 text-sm shadow-md border border-border-color focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </motion.div>

      {/* Trending Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-secondary/40 backdrop-blur-xl rounded-xl shadow-lg border border-border-color p-4"
      >
        <h2 className="text-lg font-bold text-text-primary mb-3">🔥 Top Stories</h2>
        {loading ? (
          <p className="text-text-secondary text-sm">Loading trends...</p>
        ) : trending.length === 0 ? (
          <p className="text-text-secondary text-sm">No trending news.</p>
        ) : (
          <ul className="space-y-4">
            {trending.map((article, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="cursor-pointer"
                onClick={() => window.open(article.link, "_blank")}
              >
                <p className="text-sm font-semibold text-text-primary hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </p>
                <span className="text-xs text-text-secondary">
                  {article.source_id ? article.source_id.toUpperCase() : "Unknown Source"}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>

      {/* Floating Post Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-10 right-10 flex flex-col items-center space-y-3"
      >
        <button
          onClick={onPostClick}
          className="flex items-center bg-accent text-primary px-4 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition"
        >
          <Pen />
          <span className="ml-2 font-semibold">Write</span>
        </button>
        <button
          onClick={onPostClick}
          className="flex items-center bg-accent text-primary px-4 py-3 rounded-full shadow-lg hover:bg-yellow-500 transition"
        >
          <Upload />
          <span className="ml-2 font-semibold">Upload</span>
        </button>
      </motion.div>
    </aside>
  );
};

export default RightSidebar;
