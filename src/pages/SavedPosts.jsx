// src/pages/SavedPosts.jsx (Production Final - Redesigned)

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { Bookmark, Image as ImageIcon } from "lucide-react";
import PostCard from "../components/PostCard"; // <-- We use the main, fully functional PostCard

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // This data fetching logic is preserved and correct.
  const fetchSavedPosts = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data: saves, error: savesError } = await supabase.from("saves").select("post_id").eq("user_id", user.id);
    if (savesError) {
      console.error("Error fetching saves:", savesError);
      setLoading(false);
      return;
    }
    if (!saves || saves.length === 0) {
      setSavedPosts([]);
      setLoading(false);
      return;
    }
    const postIds = saves.map((s) => s.post_id);
    const { data: posts, error: postsError } = await supabase.from("posts").select(`*, profiles!user_id(username, avatar_url)`).in("id", postIds).order("created_at", { ascending: false });
    if (postsError) {
      console.error("Error fetching posts:", postsError);
      setLoading(false);
      return;
    }
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      user_id: post.user_id,
      name: post.profiles?.username || "Anonymous",
      handle: `@${post.profiles?.username || "..."}`,
      timestamp: new Date(post.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
      avatarUrl: post.profiles?.avatar_url || `https://placehold.co/100x100/71767b/e7e9ea?text=${post.profiles?.username?.charAt(0) || "?"}`,
      text: post.content,
      imageUrl: post.image_url,
    }));
    setSavedPosts(formattedPosts);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSavedPosts();
  }, [fetchSavedPosts]);

  // --- NEW LOGIC: This function is called from the PostCard when a user unsaves an item. ---
  // This allows the page to update in real-time without a full refresh.
  const handlePostInteraction = () => {
    fetchSavedPosts(); // Simply refetch the list of saved posts
  };

  return (
    <div className="w-full min-h-screen bg-primary text-text-primary">
      {/* The header is preserved as you requested. */}
      <div className="p-4 border-b border-border-color sticky top-0 bg-primary/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <Bookmark size={28} className="text-accent" />
          <h1 className="text-2xl font-bold">Saved Posts</h1>
        </div>
        <p className="text-sm text-text-secondary mt-1">Your personal collection of posts from across OpenVoice.</p>
      </div>

      {/* The loading and empty states are preserved. */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : savedPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-16 p-4">
          <ImageIcon size={64} className="text-text-secondary mb-4" />
          <h2 className="text-xl font-bold text-text-primary">No saved posts yet</h2>
          <p className="text-text-secondary mt-1">When you save posts using the bookmark icon, they'll appear here.</p>
        </div>
      ) : (
        // --- THIS IS THE FIX: Replaced the grid with a simple vertical list of full PostCards ---
        <div>
          {savedPosts.map((post) => (
            <PostCard 
              key={post.id} 
              {...post} 
              onInteraction={handlePostInteraction} // Pass the handler down
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPosts;
