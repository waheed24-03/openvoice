// File: src/components/PostCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  Send,
  MessageSquare,
  Repeat,
  Bookmark,
  Heart,
  Share2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

const parseDbId = (id) => {
  if (id === null || typeof id === "undefined") return null;
  if (typeof id === "number") return id;
  if (typeof id === "string") {
    if (id.startsWith("db:")) return Number(id.split(":")[1]);
    const n = Number(id);
    return isNaN(n) ? null : n;
  }
  return null;
};

// --- ICON COMPONENTS ---
const LikeIcon = ({ isEngaged }) => (
  <Heart
    className={`w-5 h-5 transition-colors ${
      isEngaged ? "text-accent fill-current" : "text-text-secondary"
    }`}
  />
);
const SaveIcon = ({ isEngaged }) => (
  <Bookmark
    className={`w-5 h-5 transition-colors ${
      isEngaged ? "text-accent fill-current" : "text-text-secondary"
    }`}
  />
);
const RepostIcon = ({ isEngaged }) => (
  <Repeat
    className={`w-5 h-5 transition-colors ${
      isEngaged ? "text-accent" : "text-text-secondary"
    }`}
  />
);

export default function PostCard(props) {
  const {
    id,
    dbId,
    avatarUrl,
    userId,
    user_id,
    name,
    handle,
    timestamp,
    text,
    imageUrl,
    verified,
    source = "user",
    externalLink = null,
    showQuoteButton = true,
    onInteraction,
    onPostDeleted, // callback from parent
  } = props;

  const navigate = useNavigate();
  const ownerId = userId ?? user_id;
  const postDbId = parseDbId(dbId ?? id);

  const [currentUser, setCurrentUser] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [repostCount, setRepostCount] = useState(0);
  const [isReposted, setIsReposted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Step 1: Identify current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data?.user ?? null);
    });
  }, []);

  // Step 2: Load interaction state
  useEffect(() => {
    const loadInteractionState = async () => {
      if (!postDbId) return;

      const [likes, reposts] = await Promise.all([
        supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postDbId),
        supabase
          .from("reposts")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postDbId),
      ]);
      setLikeCount(likes.count || 0);
      setRepostCount(reposts.count || 0);

      setIsLiked(false);
      setIsSaved(false);
      setIsReposted(false);

      if (currentUser) {
        const [likeData, saveData, repData] = await Promise.all([
          supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postDbId)
            .eq("user_id", currentUser.id),
          supabase
            .from("saves")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postDbId)
            .eq("user_id", currentUser.id),
          supabase
            .from("reposts")
            .select("*", { count: "exact", head: true })
            .eq("post_id", postDbId)
            .eq("user_id", currentUser.id),
        ]);
        setIsLiked((likeData.count || 0) > 0);
        setIsSaved((saveData.count || 0) > 0);
        setIsReposted((repData.count || 0) > 0);
      }
    };

    loadInteractionState();
  }, [currentUser, postDbId]);

  // --- HANDLERS ---
  const goToProfile = () => {
    if (ownerId) navigate(`/profile/${ownerId}`);
  };

  const toggleInteraction = async (
    table,
    isEngaged,
    setEngaged,
    count,
    setCount
  ) => {
    if (!currentUser || !postDbId) return alert("Sign in to interact.");

    setEngaged(!isEngaged);
    if (setCount)
      setCount((prev) => (isEngaged ? Math.max(0, prev - 1) : prev + 1));

    try {
      if (isEngaged) {
        await supabase
          .from(table)
          .delete()
          .match({ post_id: postDbId, user_id: currentUser.id });
      } else {
        const payload = { post_id: postDbId, user_id: currentUser.id };
        if (table === "reposts") payload.quote = null;
        await supabase.from(table).insert(payload);
      }
      if (onInteraction && table === "saves") onInteraction();
    } catch (err) {
      console.error(`toggleInteraction error for ${table}:`, err);
      setEngaged(isEngaged);
      if (setCount) setCount(count);
      alert("Could not complete action.");
    }
  };

  const submitQuote = async () => {
    if (!currentUser || !postDbId || !quoteText.trim())
      return alert("Sign in and write a comment to quote.");
    try {
      const { error } = await supabase.from("reposts").upsert({
        post_id: postDbId,
        user_id: currentUser.id,
        quote: quoteText.trim(),
      });
      if (error) throw error;
      setQuoteOpen(false);
      setQuoteText("");
      if (!isReposted) {
        setIsReposted(true);
        setRepostCount((c) => c + 1);
      }
      alert("Quoted & reposted ✔");
    } catch (err) {
      console.error("submitQuote error", err);
      alert("Could not quote-repost.");
    }
  };

  const handleShare = async () => {
    const url =
      externalLink || `${window.location.origin}/post/${postDbId || ""}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("share error", err);
      alert("Could not copy link.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentUser || currentUser.id !== ownerId) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postDbId);
      if (error) throw error;

      if (onPostDeleted) onPostDeleted(postDbId);
      setConfirmDeleteOpen(false);
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Could not delete the post. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const isDbPost = Boolean(postDbId);
  const isOwner = currentUser?.id === ownerId;

  return (
    <>
      <article className="bg-primary p-4 border-b border-border-color">
        <div className="flex items-start gap-4">
          <img
            src={avatarUrl || `https://placehold.co/100x100`}
            alt="avatar"
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={goToProfile}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div onClick={goToProfile} className="cursor-pointer">
                  <p className="font-bold text-text-primary hover:underline">
                    {name || (source === "api" ? "News" : "Unknown")}
                  </p>
                  <p className="text-sm text-text-secondary">{handle}</p>
                </div>
                {verified && <span className="text-xs font-bold">Verified</span>}
                <span className="text-sm text-text-secondary ml-3">
                  · {timestamp}
                </span>
              </div>

              {/* Options Menu */}
              <div className="relative">
                {isOwner && (
                  <button
                    onClick={() => setOptionsOpen((o) => !o)}
                    className="text-text-secondary hover:text-accent p-1 rounded-full"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                )}
                {optionsOpen && (
                  <div className="absolute right-0 top-8 bg-secondary border border-border-color rounded-lg shadow-lg z-10 w-48">
                    <ul>
                      <li>
                        <button
                          onClick={() => {
                            setConfirmDeleteOpen(true);
                            setOptionsOpen(false);
                          }}
                          className="w-full text-left flex items-center px-4 py-2 text-danger hover:bg-danger/10 transition-colors"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Post
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-text-primary whitespace-pre-wrap">
              {text}
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="media"
                className="w-full mt-3 rounded-lg object-cover max-h-96"
              />
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center space-x-4 text-text-secondary">
                <button
                  onClick={() => alert("Comments are not implemented yet")}
                  className="flex items-center hover:text-blue-400"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                {isDbPost ? (
                  <button
                    onClick={() =>
                      toggleInteraction(
                        "reposts",
                        isReposted,
                        setIsReposted,
                        repostCount,
                        setRepostCount
                      )
                    }
                    className={`flex items-center ${
                      isReposted ? "text-accent" : "hover:text-accent"
                    }`}
                  >
                    <RepostIcon isEngaged={isReposted} />
                    <span className="ml-1 text-sm font-semibold">
                      {repostCount}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => window.open(externalLink || "#", "_blank")}
                    className="flex items-center hover:text-green-400"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() =>
                    toggleInteraction(
                      "likes",
                      isLiked,
                      setIsLiked,
                      likeCount,
                      setLikeCount
                    )
                  }
                  className={`flex items-center ${
                    isLiked ? "text-accent" : "hover:text-accent"
                  }`}
                >
                  <LikeIcon isEngaged={isLiked} />
                  <span className="ml-1 text-sm font-semibold">{likeCount}</span>
                </button>
                <button
                  onClick={() => toggleInteraction("saves", isSaved, setIsSaved)}
                  className={`flex items-center ${
                    isSaved ? "text-accent" : "hover:text-accent"
                  }`}
                >
                  <SaveIcon isEngaged={isSaved} />
                </button>
              </div>
              <div className="flex items-center gap-3 text-text-secondary">
                {showQuoteButton && isDbPost && (
                  <button
                    onClick={() => setQuoteOpen((s) => !s)}
                    className="text-sm hover:text-accent"
                  >
                    Quote
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center hover:text-accent"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {quoteOpen && (
              <div className="mt-3 bg-secondary rounded-md p-3 border border-border-color">
                <textarea
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="Add your comment..."
                  className="w-full bg-primary/10 p-2 rounded-md text-text-primary"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setQuoteOpen(false);
                      setQuoteText("");
                    }}
                    className="px-3 py-1 border border-border-color text-text-primary rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitQuote}
                    className="px-3 py-1 bg-accent text-black rounded-md font-semibold"
                  >
                    Quote & Repost
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Confirmation Modal for Delete */}
      {confirmDeleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-secondary rounded-lg p-6 max-w-md w-full border border-border-color">
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Delete post?
            </h3>
            <p className="text-text-secondary mb-4">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 rounded-md border border-border-color text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-danger text-white rounded-md font-semibold"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
