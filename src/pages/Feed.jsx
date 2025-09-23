// File: src/pages/Feed.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate hook
import PostCard from "../components/PostCard";
import { supabase } from "../services/supabaseClient";

const FeedPage = ({ refreshKey }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ initialize navigate

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(`*, profiles!user_id ( username, avatar_url )`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        const formattedPosts = data.map((post) => ({
          id: post.id,
          userId: post.user_id, // ✅ keep track of user_id
          name: post.profiles?.username || "Anonymous",
          handle: `@${post.profiles?.username || "..."}`,
          timestamp: new Date(post.created_at).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          avatarUrl:
            post.profiles?.avatar_url ||
            `https://placehold.co/100x100/71767b/e7e9ea?text=${
              post.profiles?.username?.charAt(0) || "?"
            }`,
          text: post.content,
          imageUrl: post.image_url,
        }));
        setPosts(formattedPosts);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [refreshKey]);

  return (
    <div className="w-full">
      <div className="p-4 border-b border-border-color sticky top-0 bg-primary bg-opacity-80 backdrop-blur-md">
        <h1 className="text-xl font-bold text-text-primary">Home</h1>
      </div>
      {loading ? (
        <p className="text-center text-text-secondary mt-8">Loading posts...</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            {...post}
            // ✅ avatar click navigates to profile page
            onAvatarClick={() => navigate(`/profile/${post.userId}`)}
          />
        ))
      )}
    </div>
  );
};

export default FeedPage;
