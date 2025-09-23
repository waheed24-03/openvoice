// File: src/components/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import PrimaryButton from './PrimaryButton';

const EditProfileModal = ({ profile, onClose, onSave }) => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setUsername(profile.username || '');
            setBio(profile.bio || '');
        }
    }, [profile]);

    const handleSave = () => {
        setLoading(true);
        onSave({ fullName, username, bio });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-secondary rounded-lg p-6 w-full max-w-lg border border-border-color mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-primary">Edit profile</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-3xl">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-text-secondary text-sm font-bold mb-2">Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-primary text-text-primary rounded-lg p-3 border border-border-color"/>
                    </div>
                     <div>
                        <label className="block text-text-secondary text-sm font-bold mb-2">Username</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-primary text-text-primary rounded-lg p-3 border border-border-color"/>
                    </div>
                    <div>
                        <label className="block text-text-secondary text-sm font-bold mb-2">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full h-24 bg-primary text-text-primary rounded-lg p-3 border border-border-color"/>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <PrimaryButton label={loading ? 'Saving...' : 'Save'} onClick={handleSave} disabled={loading} />
                </div>
            </div>
        </div>
    );
};
export default EditProfileModal;