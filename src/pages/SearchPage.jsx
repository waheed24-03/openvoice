// File: src/pages/SearchPage.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import PostCard from '../components/PostCard';

const UserCard = ({ profile }) => (
    <div className="p-4 border-b border-border-color flex items-center space-x-4 hover:bg-secondary transition-colors">
        <img src={profile.avatar_url || `https://placehold.co/100`} alt="avatar" className="w-12 h-12 rounded-full" />
        <div>
            <p className="font-bold text-text-primary">{profile.full_name || profile.username}</p>
            <p className="text-text-secondary">@{profile.username}</p>
            <p className="text-text-primary text-sm mt-1 line-clamp-2">{profile.bio}</p>
        </div>
    </div>
);

const SearchPage = ({ query }) => {
    const [results, setResults] = useState({ posts: [], users: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) return;
            setLoading(true);

            // Use Supabase Full-Text Search for posts and ilike for profiles
            const [postsRes, usersRes] = await Promise.all([
                supabase.from('posts').select(`*, profiles!user_id ( username, avatar_url, full_name )`).textSearch('content', `'${query}'`),
                supabase.from('profiles').select('*').or(`username.ilike.%${query}%,full_name.ilike.%${query}%`).limit(10)
            ]);

            const formattedPosts = postsRes.data?.map(post => ({
                id: post.id,
                name: post.profiles?.full_name || post.profiles?.username,
                handle: `@${post.profiles?.username}`,
                timestamp: new Date(post.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
                avatarUrl: post.profiles?.avatar_url || `https://placehold.co/100x100/71767b/e7e9ea?text=${post.profiles?.username?.charAt(0) || '?'}`,
                text: post.content,
                imageUrl: post.image_url,
            })) || [];

            setResults({ posts: formattedPosts, users: usersRes.data || [] });
            setLoading(false);
        };

        performSearch();
    }, [query]);

    return (
        <div>
            <div className="p-4 border-b border-border-color sticky top-0 bg-primary/80 backdrop-blur-md">
                <h1 className="text-xl font-bold text-text-primary">Search Results</h1>
                <p className="text-text-secondary">Showing results for "{query}"</p>
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div>
                    {results.users.length > 0 && (
                        <div className="border-b border-border-color">
                            <h2 className="p-4 text-lg font-bold text-text-primary">Users</h2>
                            {results.users.map(user => <UserCard key={user.id} profile={user} />)}
                        </div>
                    )}
                    {results.posts.length > 0 && (
                        <div>
                            <h2 className="p-4 text-lg font-bold text-text-primary">Posts</h2>
                            {results.posts.map(post => <PostCard key={post.id} {...post} />)}
                        </div>
                    )}
                    {results.users.length === 0 && results.posts.length === 0 && (
                        <p className="text-center text-text-secondary p-8">No results found for "{query}".</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;