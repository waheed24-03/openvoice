// src/pages/Home.jsx
import React from 'react';
import PostCard from '../components/PostCard';

const HomePage = () => {
  // Placeholder data
  const posts = [
    { id: 1, content: 'This is the first post on OpenVoice!', author: { full_name: 'John Doe', username: 'johndoe', avatar_url: 'https://placehold.co/100' }, created_at: '2h', reply_count: 5, repost_count: 2, like_count: 15 },
    { id: 2, content: 'Excited to see where this platform goes. #Transparency', author: { full_name: 'Jane Smith', username: 'janesmith', avatar_url: 'https://placehold.co/100' }, created_at: '3h', reply_count: 12, repost_count: 8, like_count: 42 },
  ];

  return (
    <div>
      <div className="p-4 border-b border-border-color">
        <h1 className="text-xl font-bold text-text-primary">Home</h1>
      </div>
      <div>
        {posts.map(post => <PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
};

export default HomePage;
