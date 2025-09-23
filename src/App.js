// File: src/App.js
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { supabase } from "./services/supabaseClient";

// Components
import Sidebar from "./components/Sidebar";
import RightSidebar from "./components/RightSidebar";
import CreatePostModal from "./components/CreatePostModal";

// Pages
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import FeedPage from "./pages/Feed";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NewsSearchPage from "./pages/NewsSearchPage";
import SavedPosts from "./pages/SavedPosts";
import TrendingFeed from "./pages/TrendingFeed";      // Posts for a topic
import TrendingNews from "./pages/TrendingNews";      // API news / trending topics
import TrendingTopics from "./pages/TrendingTopics";  // Dummy topics list

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authScreen, setAuthScreen] = useState("login");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState("feed");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch user profile
  const fetchUserProfile = useCallback(async (user) => {
    if (!user) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") console.error("Error fetching profile:", error);
    else setProfile(data);
  }, []);

  // Handle authentication state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchUserProfile(session?.user);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserProfile]);

  // Apply theme based on profile preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (session && profile) {
      if (profile.dark_mode) root.classList.add("dark");
      else root.classList.remove("dark");
      root.style.setProperty("--color-accent", profile.accent_color || "#EBCD3E");
    } else {
      root.classList.add("dark");
      root.style.setProperty("--color-accent", "#EBCD3E");
    }
  }, [session, profile]);

  // Sign out user
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  // Create a new post
  const handleCreatePost = async (newPostText, mediaUrl) => {
    if (!session?.user) return alert("You must be logged in to post.");
    const { error } = await supabase.from("posts").insert([
      { content: newPostText, user_id: session.user.id, image_url: mediaUrl },
    ]);
    if (error) console.error("Error creating post:", error);
    else setRefreshKey((prev) => prev + 1);
    setIsModalOpen(false);
  };

  // Search for news
  const handleNewsSearch = (query) => {
    if (query.trim()) {
      setSearchQuery(query);
      setCurrentPage("news-search");
    }
  };

  // Not logged in → Show auth pages
  if (!session) {
    return authScreen === "login" ? (
      <LoginPage onSwitchToSignup={() => setAuthScreen("signup")} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthScreen("login")} />
    );
  }

  // Loading profile state
  if (!profile) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center text-text-secondary">
        Loading Profile...
      </div>
    );
  }

  // Main Layout
  return (
    <Router>
      <div className="bg-primary text-text-primary">
        <div className="w-full max-w-7xl mx-auto flex">
          {/* Sidebar */}
          <Sidebar
            user={session.user}
            profile={profile}
            onSignOut={handleSignOut}
            onPostClick={() => setIsModalOpen(true)}
            onNavigate={(page) => setCurrentPage(page)}
            currentPage={currentPage}
          />

          {/* Main Content */}
          <main className="flex-1 bg-primary border-x border-border-color min-h-screen">
            <Routes>
              <Route path="/" element={<FeedPage refreshKey={refreshKey} />} />
              <Route path="/feed" element={<FeedPage refreshKey={refreshKey} />} />

              {/* Profile Page */}
              <Route path="/profile/:id" element={<ProfilePage />} />

              {/* Settings Page */}
              <Route
                path="/settings"
                element={
                  <SettingsPage
                    user={session.user}
                    profile={profile}
                    refetchProfile={() => fetchUserProfile(session.user)}
                  />
                }
              />

              {/* Trending Sections */}
              <Route path="/trending" element={<TrendingTopics />} />        {/* List of topics */}
              <Route path="/trending/:topic" element={<TrendingFeed />} />  {/* Posts for a topic */}
              <Route path="/trending-news" element={<TrendingNews />} />    {/* API news */}

              {/* News Search */}
              <Route path="/news-search" element={<NewsSearchPage query={searchQuery} />} />

              {/* Saved Posts */}
              <Route path="/saved" element={<SavedPosts />} />
            </Routes>
          </main>

          {/* Right Sidebar */}
          <RightSidebar onPostClick={() => setIsModalOpen(true)} onSearch={handleNewsSearch} />
        </div>

        {/* Create Post Modal */}
        {isModalOpen && (
          <CreatePostModal
            profile={profile}
            onClose={() => setIsModalOpen(false)}
            onPost={handleCreatePost}
          />
        )}
      </div>
    </Router>
  );
}
