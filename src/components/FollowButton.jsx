// src/components/FollowButton.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PrimaryButton from "./PrimaryButton";

export default function FollowButton({ targetUserId }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const currentUser = supabase.auth.getUser();

  useEffect(() => {
    const checkFollowing = async () => {
      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", currentUser.id)
        .eq("following_id", targetUserId);
      setIsFollowing(data?.length > 0);
    };
    checkFollowing();
  }, [targetUserId]);

  const handleFollow = async () => {
    setLoading(true);
    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUser.id)
        .eq("following_id", targetUserId);
      setIsFollowing(false);
    } else {
      await supabase.from("follows").insert([
        { follower_id: currentUser.id, following_id: targetUserId },
      ]);
      setIsFollowing(true);
    }
    setLoading(false);
  };

  return (
    <PrimaryButton onClick={handleFollow} disabled={loading}>
      {isFollowing ? "Following" : "Follow"}
    </PrimaryButton>
  );
}
