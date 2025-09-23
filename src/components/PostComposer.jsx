// File: src/components/PostComposer.jsx
import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";

/*
 PostComposer
 - Top-of-feed composer for user-created posts (news-style)
 - Fields: headline (optional), content, image URL (optional)
 - On submit -> insert into `posts` table in Supabase with source='user'
*/

export default function PostComposer({ user, onPosted }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Sign in to post.");
    if (!content.trim() && !title.trim()) return alert("Write something first.");

    setLoading(true);
    const payload = {
      user_id: user.id,
      title: title || content.slice(0, 80),
      content,
      image_url: imageUrl || null,
      source: "user",
    };

    const { error } = await supabase.from("posts").insert(payload);
    setLoading(false);
    if (error) {
      console.error("create post error:", error);
      return alert("Could not create post: " + error.message);
    }
    setTitle("");
    setContent("");
    setImageUrl("");
    onPosted && onPosted();
  };

  return (
    <div className="bg-secondary/30 backdrop-blur-xl border border-border-color rounded-2xl p-4">
      <form onSubmit={submit} className="space-y-3">
        <div className="flex items-start gap-3">
          <img
            src={user?.user_metadata?.avatar_url || `https://placehold.co/48x48/71767b/e7e9ea?text=${(user?.email?.charAt(0)||"U").toUpperCase()}`}
            alt="you"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Headline (optional)"
              className="w-full bg-transparent text-text-primary placeholder:text-text-secondary outline-none text-lg font-semibold"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share news, eyewitness updates, or a short thread..."
              rows={3}
              className="w-full mt-2 bg-transparent text-text-primary placeholder:text-text-secondary outline-none resize-none"
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="w-full mt-2 bg-transparent text-text-secondary placeholder:text-text-secondary outline-none text-sm"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-xs text-text-secondary">Be mindful — no doxxing / illegal content</div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent text-black px-4 py-2 rounded-full font-semibold"
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
