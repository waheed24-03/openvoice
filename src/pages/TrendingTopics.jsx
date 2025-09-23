// File: src/pages/TrendingTopics.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const dummyTopics = [
  "Palestine Recognition",
  "Climate Change",
  "AI Revolution",
  "OpenVoice Updates",
  "Tech Stocks",
  "Crypto Trends",
  "Space Exploration",
  "Education Reform",
  "Health & Wellness",
  "Sports Highlights",
  "Global Politics",
  "Music Trends",
];

// Dummy tweet counts for visual effect
const dummyCounts = [1200, 980, 4500, 320, 2100, 1340, 600, 890, 760, 1120, 1500, 980];

export default function TrendingTopics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-primary text-text-primary">
      {/* Header */}
      <h1 className="text-3xl font-bold text-accent mb-6"> Trending Topics</h1>

      {/* Search box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full p-3 rounded-full bg-secondary border border-border-color placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      {/* Trending Topics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {dummyTopics.map((topic, idx) => (
          <div
            key={idx}
            className="bg-secondary p-4 rounded-xl cursor-pointer hover:bg-accent/20 transition shadow-md hover:shadow-lg flex justify-between items-center"
            onClick={() => navigate(`/trending/${encodeURIComponent(topic)}`)}
          >
            <span className="font-semibold">{topic}</span>
            <span className="text-sm text-text-secondary">~{dummyCounts[idx]}k tweets</span>
          </div>
        ))}
      </div>

      {/* Optional: extra widgets on right side (if using 3-column layout) */}
      <div className="hidden lg:block mt-6">
        <div className="bg-secondary p-4 rounded-xl shadow-md mb-4">
          <h2 className="font-bold text-lg mb-2">Who to follow</h2>
          <div className="flex items-center justify-between mb-2">
            <span>OpenAI</span>
            <button className="bg-accent px-2 py-1 rounded-full text-sm text-black font-semibold hover:bg-yellow-500 transition">
              Follow
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span>TechCrunch</span>
            <button className="bg-accent px-2 py-1 rounded-full text-sm text-black font-semibold hover:bg-yellow-500 transition">
              Follow
            </button>
          </div>
        </div>

        <div className="bg-secondary p-4 rounded-xl shadow-md">
          <h2 className="font-bold text-lg mb-2">Trending News</h2>
          <p className="text-text-secondary text-sm">Stay updated with the latest trending topics and tweets.</p>
        </div>
      </div>
    </div>
  );
}
