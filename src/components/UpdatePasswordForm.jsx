// File: src/components/UpdatePasswordForm.jsx

import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import PrimaryButton from './PrimaryButton';

const UpdatePasswordForm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleUpdatePassword = async () => {
        setLoading(true);
        setMessage('');
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Password updated successfully.');
            setNewPassword(''); // Clear the input on success
        }
        setLoading(false);
    };

    return (
        <div className="bg-secondary rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Change Password</h3>
            <div>
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-white rounded-lg p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>
            <div className="mt-4">
                <PrimaryButton label={loading ? 'Saving...' : 'Update Password'} onClick={handleUpdatePassword} disabled={loading || newPassword.length < 6} />
            </div>
            {newPassword.length > 0 && newPassword.length < 6 && <p className="text-red-500 text-xs mt-2">Password must be at least 6 characters.</p>}
            {message && <p className="text-accent text-sm mt-4">{message}</p>}
        </div>
    );
};

export default UpdatePasswordForm;