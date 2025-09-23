// File: src/components/UpdateEmailForm.jsx

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import PrimaryButton from './PrimaryButton';

const UpdateEmailForm = ({ user }) => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setCurrentEmail(user.email);
        }
    }, [user]);

    const handleUpdateEmail = async () => {
        setLoading(true);
        setMessage('');
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('A confirmation link has been sent to your new email address. Please verify to complete the change.');
            setNewEmail(''); // Clear the input on success
        }
        setLoading(false);
    };

    return (
        <div className="bg-secondary rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Change Email</h3>
            <p className="text-textLight mb-2">Current email: {currentEmail}</p>
            <div>
                <input
                    type="email"
                    placeholder="New email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-white rounded-lg p-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
                />
            </div>
            <div className="mt-4">
                <PrimaryButton label={loading ? 'Sending...' : 'Update Email'} onClick={handleUpdateEmail} disabled={loading || !newEmail} />
            </div>
            {message && <p className="text-accent text-sm mt-4">{message}</p>}
        </div>
    );
};

export default UpdateEmailForm;