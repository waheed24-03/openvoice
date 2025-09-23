// File: src/pages/LoginPage.jsx

import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import logo from "../assets/OpenVoice.png";

const LoginPage = ({ onSwitchToSignup }) => {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

   // eslint-disable-next-line no-unused-vars
let { data: userData, error: fetchError } = await supabase
  .from("profiles")
  .select("email")
  .eq("username", identifier)
  .single();

    const emailToUse = userData?.email || identifier;

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (error) setError(error.message);
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12 bg-black">
        <img
          src={logo}
          alt="OpenVoice Logo"
          className="w-[550px] h-auto object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
        />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-[#121212]/60 backdrop-blur-xl rounded-2xl p-10 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
          <p className="text-center text-gray-400 mb-6">
            Log in to continue your journey on{" "}
            <span className="text-accent">OpenVoice</span>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <InputField
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <InputField
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PrimaryButton
              type="submit"
              disabled={loading}
              className="w-full text-lg rounded-xl"
            >
              {loading ? "Logging in..." : "Login"}
            </PrimaryButton>

            {error && (
              <p className="text-red-500 text-center text-sm pt-2">{error}</p>
            )}
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black rounded-xl py-3 font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-400">Don't have an account? </span>
            <button
              onClick={onSwitchToSignup}
              className="text-accent font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
