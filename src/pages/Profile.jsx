// src/pages/Profile.jsx
import React from 'react';

const ProfilePage = () => {
  // Placeholder data
  const user = {
    full_name: 'Waheed',
    username: 'Waheed',
    avatar_url: 'https://placehold.co/150',
    cover_url: 'https://placehold.co/600x200',
    bio: 'Building the future of social media. #OpenVoice',
    joined_date: 'September 2025',
    following_count: 150,
    followers_count: 2750,
  };

  return (
    <div>
      <div className="relative">
        <img src={user.cover_url} alt="cover" className="w-full h-48 object-cover" />
        <img src={user.avatar_url} alt="avatar" className="w-32 h-32 rounded-full absolute -bottom-16 left-4 border-4 border-primary" />
      </div>
      <div className="p-4 pt-20">
        <div className="flex justify-end">
          <button className="px-4 py-2 rounded-full border-2 border-border-color font-bold text-text-primary hover:bg-secondary">Edit profile</button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary">{user.full_name}</h2>
          <p className="text-text-secondary">@{user.username}</p>
          <p className="mt-2 text-text-primary">{user.bio}</p>
          <p className="mt-2 text-text-secondary">Joined {user.joined_date}</p>
          <div className="flex space-x-4 mt-2">
            <p><span className="font-bold text-text-primary">{user.following_count}</span> <span className="text-text-secondary">Following</span></p>
            <p><span className="font-bold text-text-primary">{user.followers_count}</span> <span className="text-text-secondary">Followers</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
