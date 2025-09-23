// File: src/pages/SignupPage.jsx

import React, { useState } from "react";
import { supabase } from "../services/supabaseClient";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import logo from "../assets/OpenVoice.png";

const SignupPage = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUser) {
      setError("Username already taken. Try another.");
      setLoading(false);
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          username: username,
          email: email,
        },
      ]);
      setSuccess("Signup successful! Please check your email to verify.");
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
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
          <h1 className="text-3xl font-bold text-center mb-2">Join OpenVoice</h1>
          <p className="text-center text-gray-400 mb-6">
            Create your free account and start connecting.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <InputField
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputField
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </PrimaryButton>

            {error && (
              <p className="text-red-500 text-center text-sm pt-2">{error}</p>
            )}
            {success && (
              <p className="text-green-500 text-center text-sm pt-2">
                {success}
              </p>
            )}
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignup}
              className="w-full bg-white text-black rounded-xl py-3 font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Continue with Google
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-400">Already have an account? </span>
            <button
              onClick={onSwitchToLogin}
              className="text-accent font-semibold hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
