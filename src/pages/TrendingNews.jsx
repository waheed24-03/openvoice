// File: src/pages/TrendingFeed.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { MessageCircle, Repeat2, Heart, Share2, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function TrendingFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quoteText, setQuoteText] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const navigate = useNavigate();
  const { topic } = useParams(); // from /trending/:topic

  useEffect(() => {
    fetchTrendingPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const fetchTrendingPosts = async () => {
    setLoading(true);

    let query = supabase
      .from("posts")
      .select("id, content, created_at, user_id, image_url")
      .order("created_at", { ascending: false });

    if (topic) {
      query = query.ilike("content", `%${topic}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  const handleQuoteRepost = async (postId) => {
    if (!quoteText.trim()) return;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      return;
    }

    const userId = userData?.data?.user?.id;
    if (!userId) return;

    const { error } = await supabase.from("posts").insert([
      {
        content: quoteText,
        user_id: userId,
        quote_of: postId,
      },
    ]);

    if (error) console.error("Error quoting post:", error);

    setQuoteText("");
    setActivePostId(null);
    fetchTrendingPosts();
  };

  const extractHashtags = (text) => {
    const regex = /#(\w+)/g;
    return text.match(regex) || [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-accent" />
      </div>
    );
  }

  return (
    <div className="bg-primary min-h-screen p-6">
      <h1 className="text-3xl font-bold text-accent mb-6">
         Trending Topic: {topic}
      </h1>

      <div className="space-y-6">
        {posts.length === 0 && (
          <p className="text-text-secondary">No posts for this topic yet.</p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-secondary rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-200 border border-border-color"
          >
            {/* User Info */}
            <div className="flex items-center mb-3">
              <img
                src="https://via.placeholder.com/50"
                alt="User Avatar"
                className="w-12 h-12 rounded-full cursor-pointer"
                onClick={() => navigate(`/profile/${post.user_id}`)}
              />
              <div className="ml-3">
                <h3 className="font-semibold text-lg">User {post.user_id.slice(0, 6)}</h3>
                <p className="text-text-secondary text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-text-primary text-base leading-relaxed mb-3 whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {extractHashtags(post.content).map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(`/trending/${tag.replace("#", "")}`)}
                  className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm hover:bg-accent/30 transition"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Image */}
            {post.image_url && (
              <img
                src={post.image_url}
                alt="Post"
                className="rounded-xl w-full max-h-96 object-cover mb-3"
              />
            )}

            {/* Actions */}
            <div className="flex items-center justify-between text-text-secondary mt-4">
              <button className="flex items-center gap-2 hover:text-accent transition">
                <MessageCircle size={20} /> Reply
              </button>
              <button
                className="flex items-center gap-2 hover:text-accent transition"
                onClick={() => setActivePostId(post.id)}
              >
                <Repeat2 size={20} /> Quote
              </button>
              <button className="flex items-center gap-2 hover:text-red-400 transition">
                <Heart size={20} /> Like
              </button>
              <button className="flex items-center gap-2 hover:text-accent transition">
                <Share2 size={20} /> Share
              </button>
            </div>

            {/* Quote Box */}
            {activePostId === post.id && (
              <div className="mt-4 bg-primary border border-border-color rounded-lg p-3">
                <textarea
                  placeholder="Add a comment to your repost..."
                  className="w-full bg-secondary rounded-lg p-2 text-text-primary outline-none resize-none"
                  rows="2"
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => handleQuoteRepost(post.id)}
                    className="bg-accent px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
                  >
                    Repost with Quote
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
