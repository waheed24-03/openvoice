// File: src/pages/TrendingFeed.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import PostCard from "../components/PostCard";
import { Loader2 } from "lucide-react";

export default function TrendingFeed() {
  const { topic } = useParams(); // grabs topic from /trending/:topic
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);

      try {
        // 1️⃣ Fetch Supabase posts filtered by topic hashtag
        let query = supabase
          .from("posts")
          .select("id, content, created_at, user_id, image_url, profiles(username, avatar_url)")
          .order("created_at", { ascending: false })
          .limit(20);

        if (topic) {
          query = query.ilike("content", `%${topic}%`); // filter by topic text
        }

        const { data: postData, error: postError } = await query;
        if (postError) throw postError;

        const enrichedPosts = postData.map((p) => ({
          type: "post",
          id: p.id,
          dbId: p.id,
          avatarUrl: p.profiles?.avatar_url,
          userId: p.user_id,
          name: p.profiles?.username || "Unknown",
          handle: `@${p.profiles?.username || "user"}`,
          timestamp: new Date(p.created_at).toLocaleString(),
          text: p.content,
          imageUrl: p.image_url,
        }));

        // 2️⃣ Fetch news from local proxy filtered by topic
        let newsItems = [];
        try {
          const newsRes = await fetch(`http://localhost:5050/news?query=${encodeURIComponent(topic || "")}`);
          const newsData = await newsRes.json();
          if (newsData.results) {
            newsItems = newsData.results.slice(0, 10).map((n, idx) => ({
              type: "news",
              id: `news-${idx}`,
              title: n.title,
              description: n.description,
              imageUrl: n.image_url,
              link: n.link,
              source: n.source_id,
              pubDate: n.pubDate,
            }));
          }
        } catch (e) {
          console.error("News fetch error:", e);
        }

        // 3️⃣ Merge feed (posts first, news later)
        setPosts([...enrichedPosts, ...newsItems]);
      } catch (err) {
        console.error("Fetch feed error:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [topic]); // re-run when topic changes

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-accent" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-6 text-center text-text-secondary">
         No posts or news found for "{topic}".
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen p-6">
      <h1 className="text-3xl font-bold text-accent mb-6">Trending: {topic}</h1>
      <div className="mt-6 space-y-5 max-w-3xl mx-auto">
        {posts.map((item) =>
          item.type === "post" ? (
            <PostCard
              key={item.id}
              id={item.id}
              dbId={item.dbId}
              avatarUrl={item.avatarUrl}
              userId={item.userId}
              name={item.name}
              handle={item.handle}
              timestamp={item.timestamp}
              text={item.text}
              imageUrl={item.imageUrl}
              verified={false}
              showQuoteButton={true}
            />
          ) : (
            <div
              key={item.id}
              className="bg-secondary/40 border border-border-color rounded-2xl shadow-md p-4 flex flex-col cursor-pointer hover:shadow-accent/30 transition-shadow"
              onClick={() => window.open(item.link, "_blank")}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-800/50 flex items-center justify-center rounded-xl text-gray-400 mb-3">
                  📰 No Image
                </div>
              )}
              <h2 className="font-bold text-text-primary text-lg line-clamp-2">{item.title}</h2>
              <p className="text-text-secondary mt-1 line-clamp-3">{item.description || "No description"}</p>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>📌 {item.source || "Unknown"}</span>
                <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : "Today"}</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
