import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import PostCard from "../components/PostCard";
import EditProfileModal from "../components/EditProfileModal";

const PencilIcon = () => (
  <svg
    className="w-7 h-7 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036
         a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="animate-spin h-7 w-7 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0
         C5.373 0 0 5.373 0 12h4zm2
         5.291A7.962 7.962 0 014 12H0
         c0 3.042 1.135 5.824 3
         7.938l3-2.647z"
    ></path>
  </svg>
);

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPfp, setUploadingPfp] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const pfpInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Get current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, []);

  // Fetch profile + posts dynamically based on :id
  const fetchProfileData = useCallback(async () => {
    if (!id) return;
    setLoading(true);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, created_at, full_name, bio, avatar_url, banner_url")
      .eq("id", id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error fetching profile:", profileError);
    } else {
      setProfile(profileData);
    }

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select(`*, profiles!user_id ( username, avatar_url )`)
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error("Error fetching posts:", postsError);
    } else {
      const formattedPosts = postsData.map((post) => ({
        id: post.id,
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
  }, [id]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Save updated profile
  const handleSaveProfile = async ({ fullName, username, bio }) => {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, username, bio })
      .eq("id", currentUser.id);

    if (error) {
      console.error("Error updating profile:", error);
      alert("Could not update profile.");
    } else {
      await fetchProfileData();
      setIsEditModalOpen(false);
    }
  };

  const handleFileUpload = async (
    file,
    bucket,
    filePath,
    columnName,
    onUploadStateChange
  ) => {
    onUploadStateChange(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      const newUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ [columnName]: newUrl })
        .eq("id", currentUser.id);
      if (updateError) throw updateError;

      await fetchProfileData();
    } catch (error) {
      console.error(`Error uploading ${columnName}:`, error);
      alert(`Failed to upload ${columnName}.`);
    }
    onUploadStateChange(false);
  };

  const handlePfpChange = (e) => {
    const file = e.target.files[0];
    if (file)
      handleFileUpload(
        file,
        "avatars",
        `${currentUser.id}/avatar`,
        "avatar_url",
        setUploadingPfp
      );
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file)
      handleFileUpload(
        file,
        "banners",
        `${currentUser.id}/banner`,
        "banner_url",
        setUploadingBanner
      );
  };

  if (loading)
    return (
      <p className="text-center text-text-secondary p-8">Loading profile...</p>
    );

  if (!profile)
    return <p className="text-center text-red-500 p-8">Profile not found.</p>;

  return (
    <div className="bg-primary text-text-primary min-h-screen">
      {/* Hidden inputs */}
      <input
        type="file"
        ref={pfpInputRef}
        className="hidden"
        accept="image/*"
        onChange={handlePfpChange}
        disabled={uploadingPfp}
      />
      <input
        type="file"
        ref={bannerInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleBannerChange}
        disabled={uploadingBanner}
      />

      {/* Banner */}
      <div
        className="group h-52 bg-secondary relative cursor-pointer"
        onClick={() =>
          currentUser?.id === profile.id &&
          !uploadingBanner &&
          bannerInputRef.current.click()
        }
      >
        <img
          src={profile.banner_url || "https://placehold.co/1200x300/1A1A1A/1A1A1A"}
          alt="Banner"
          className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
          onClick={() => navigate(`/profile/${profile.id}`)} // ✅ fixed
        />
        {currentUser?.id === profile.id && (
          <div className="absolute inset-0 bg-black flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
            {uploadingBanner ? <SpinnerIcon /> : <PencilIcon />}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div
            className="group w-32 h-32 rounded-full -mt-20 border-4 border-primary bg-secondary relative cursor-pointer"
            onClick={() =>
              currentUser?.id === profile.id &&
              !uploadingPfp &&
              pfpInputRef.current.click()
            }
          >
            <img
              src={
                profile.avatar_url ||
                `https://placehold.co/200x200/71767b/e7e9ea?text=${profile.username?.charAt(
                  0
                ) || "?"}`
              }
              alt="Profile"
              className="w-full h-full rounded-full object-cover group-hover:opacity-50 transition-opacity"
              onClick={() => navigate(`/profile/${profile.id}`)} // ✅ fixed
            />
            {currentUser?.id === profile.id && (
              <div className="absolute inset-0 bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-50 transition-opacity">
                {uploadingPfp ? <SpinnerIcon /> : <PencilIcon />}
              </div>
            )}
          </div>
          {currentUser?.id === profile.id && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="border-2 border-border-color text-text-primary font-semibold py-2 px-5 rounded-full hover:bg-secondary transition-colors"
            >
              Edit profile
            </button>
          )}
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold">
            {profile.full_name || profile.username}
          </p>
          <p className="text-text-secondary">@{profile.username}</p>
          {profile.bio && (
            <p className="text-text-primary mt-2">{profile.bio}</p>
          )}
          <p className="text-text-secondary mt-2">
            Joined{" "}
            {new Date(profile.created_at).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-color flex">
        {["Posts", "Replies", "Reshares", "Likes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`py-4 px-6 font-semibold ${
              activeTab === tab.toLowerCase()
                ? "text-text-primary border-b-2 border-accent"
                : "text-text-secondary hover:bg-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="mt-4">
        {activeTab === "posts" &&
          (posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} {...post} />)
          ) : (
            <p className="text-center text-text-secondary p-8">
              No posts yet.
            </p>
          ))}
        {activeTab !== "posts" && (
          <p className="text-center text-text-secondary p-8">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} will be
            shown here.
          </p>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
