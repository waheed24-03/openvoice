// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const ThemeContext = createContext();

export const ThemeProvider = ({ children, initialProfile }) => {
  const [theme, setTheme] = useState(initialProfile?.dark_mode ? "dark" : "dark"); // default dark
  const [accent, setAccent] = useState(initialProfile?.accent_color || "#EBCD3E");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load from localStorage first (fast)
    const storedTheme = localStorage.getItem("ov_theme");
    const storedAccent = localStorage.getItem("ov_accent");
    if (storedTheme) setTheme(storedTheme);
    if (storedAccent) setAccent(storedAccent);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.setProperty("--color-accent", accent);
    localStorage.setItem("ov_theme", theme);
    localStorage.setItem("ov_accent", accent);
  }, [theme, accent]);

  // Call this to persist to Supabase profile (if logged in)
  const persistToProfile = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      await supabase.from("profiles").upsert({ id: userId, dark_mode: theme === "dark", accent_color: accent }, { returning: "minimal" });
    } catch (e) {
      console.error("Persist theme error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent, persistToProfile, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
