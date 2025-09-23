// src/components/BlockedUsersModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import PrimaryButton from './PrimaryButton';

const BlockedUsersModal = ({ user, onClose }) => {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlockedUsers = useCallback(async () => {
        setLoading(true);
        // Fetch users that the current user has blocked, and join with profiles to get their usernames.
        const { data, error } = await supabase
            .from('blocked_users')
            .select(`
                blocked_id,
                profiles:blocked_id ( username, avatar_url )
            `)
            .eq('blocker_id', user.id);

        if (error) {
            console.error('Error fetching blocked users:', error);
        } else {
            setBlockedUsers(data);
        }
        setLoading(false);
    }, [user.id]);

    useEffect(() => {
        fetchBlockedUsers();
    }, [fetchBlockedUsers]);

    const handleUnblock = async (blockedUserId) => {
        const { error } = await supabase
            .from('blocked_users')
            .delete()
            .eq('blocker_id', user.id)
            .eq('blocked_id', blockedUserId);
        
        if (error) {
            console.error('Error unblocking user:', error);
            alert('Could not unblock user.');
        } else {
            // Refresh the list after unblocking
            fetchBlockedUsers();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-secondary rounded-lg p-6 w-full max-w-md border border-border-color mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-primary">Blocked Users</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-3xl">&times;</button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {loading ? (
                        <p className="text-text-secondary">Loading...</p>
                    ) : blockedUsers.length > 0 ? (
                        blockedUsers.map(({ blocked_id, profiles }) => (
                            <div key={blocked_id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={profiles.avatar_url || `https://placehold.co/100`} alt="avatar" className="w-10 h-10 rounded-full" />
                                    <span className="ml-3 font-bold text-text-primary">@{profiles.username}</span>
                                </div>
                                <PrimaryButton label="Unblock" onClick={() => handleUnblock(blocked_id)} />
                            </div>
                        ))
                    ) : (
                        <p className="text-text-secondary text-center py-4">You haven't blocked anyone.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlockedUsersModal;
