// src/pages/SettingsPage.jsx (Production Final - Upgraded)

import React, { useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Lock, Bell, Palette, Shield, Trash2, Camera, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';
import BlockedUsersModal from '../components/BlockedUsersModal'; // Import the new modal

// --- Reusable UI Components ---
const Notification = ({ message, type, onClose }) => {
    if (!message) return null;
    return (
        <div className={`fixed top-5 right-5 flex items-center p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-danger'} text-white`}>
            {type === 'success' ? <CheckCircle className="w-6 h-6 mr-3" /> : <AlertTriangle className="w-6 h-6 mr-3" />}
            <span className="flex-1">{message}</span>
            <button onClick={onClose} className="ml-4 font-bold">&times;</button>
        </div>
    );
};
const ToggleSwitch = ({ enabled, onChange }) => (
    <button onClick={onChange} className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-secondary focus:ring-accent border-2 ${enabled ? 'bg-accent border-accent' : 'bg-transparent border-border-color'}`}>
        <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-5 h-5 bg-white transform rounded-full transition-transform duration-300`} />
    </button>
);
const SettingsCard = ({ title, icon, children }) => (
    <div className="bg-secondary rounded-2xl shadow-lg p-6"><div className="flex items-center mb-4">{icon}<h3 className="text-xl font-bold text-text-primary ml-3">{title}</h3></div><div className="space-y-4">{children}</div></div>
);
const SettingsRow = ({ label, description, children }) => (
    <div className="flex justify-between items-center border-b border-border-color pb-4 last:border-b-0 last:pb-0"><div className="pr-4"><p className="text-text-primary text-lg">{label}</p>{description && <p className="text-text-secondary text-sm">{description}</p>}</div><div className="flex-shrink-0">{children}</div></div>
);


const SettingsPage = ({ user, profile, refetchProfile }) => {
    const [notification, setNotification] = useState({ message: '', type: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
    const pfpInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const showNotification = (message, type, duration = 4000) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), duration);
    };

    const handleUpdate = async (table, data, successMessage) => {
        const { error } = await supabase.from(table).update(data).eq('id', user.id);
        if (error) showNotification(`Error: ${error.message}`, 'error');
        else { showNotification(successMessage, 'success'); refetchProfile(); }
    };
    
    const handleUpdateUser = async (data, successMessage) => {
        const updates = Object.fromEntries(Object.entries(data).filter(([_, v]) => v));
        if (Object.keys(updates).length === 0) return showNotification('Please enter a value.', 'error');
        const { error } = await supabase.auth.updateUser(updates);
        if (error) showNotification(`Error: ${error.message}`, 'error');
        else {
            showNotification(successMessage, 'success');
            if (updates.email) setNewEmail('');
            if (updates.password) setNewPassword('');
        }
    };

    // Generic file upload handler for PFP and Cover images
    const handleFileUpload = async (file, bucket, filePath, columnName, successMessage) => {
        showNotification(`Uploading ${columnName.replace('_url', '')}...`, 'success');
        const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });
        if (error) return showNotification(`Error: ${error.message}`, 'error');

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        const newUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
        handleUpdate('profiles', { [columnName]: newUrl }, successMessage);
    };
    
    const handlePfpChange = (event) => {
        const file = event.target.files[0];
        if (file) handleFileUpload(file, 'avatars', `${user.id}/avatar`, 'avatar_url', 'Profile picture updated!');
    };

    const handleCoverImageChange = (event) => {
        const file = event.target.files[0];
        if (file) handleFileUpload(file, 'covers', `${user.id}/cover`, 'cover_url', 'Cover image updated!');
    };

    const handleSaveProfile = async (profileData) => {
        await handleUpdate('profiles', {
            full_name: profileData.fullName,
            username: profileData.username,
            bio: profileData.bio,
        }, 'Profile updated successfully!');
        setIsEditModalOpen(false);
    };
    
    const handleDeleteAccount = () => { if(window.confirm('Are you sure? This is irreversible.')) showNotification('Account deletion is a placeholder feature.', 'success'); };

    return (
        <div className="bg-primary text-text-primary p-4 sm:p-6 lg:p-8">
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            <input type="file" ref={pfpInputRef} className="hidden" accept="image/*" onChange={handlePfpChange} />
            <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverImageChange} />
            
            <div className="max-w-6xl mx-auto">
                <header className="mb-8"><h1 className="text-4xl font-bold text-text-primary">Settings</h1><p className="text-text-secondary mt-1">Manage your account and preferences.</p></header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <SettingsCard title="Profile" icon={<User className="text-accent" />}>
                        <SettingsRow label="Edit Profile" description="Name, username, bio"><button onClick={() => setIsEditModalOpen(true)} className="text-accent font-bold hover:underline">Edit</button></SettingsRow>
                        <SettingsRow label="Change Profile Picture"><button onClick={() => pfpInputRef.current.click()} className="bg-accent text-primary p-2 rounded-xl hover:scale-105 transition"><Camera /></button></SettingsRow>
                        <SettingsRow label="Change Cover Image"><button onClick={() => coverInputRef.current.click()} className="bg-accent text-primary p-2 rounded-xl hover:scale-105 transition"><ImageIcon /></button></SettingsRow>
                    </SettingsCard>

                    <SettingsCard title="Account" icon={<Lock className="text-accent" />}>
                        <div className="space-y-2"><label className="text-text-secondary text-sm font-bold">New Email</label><input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-primary rounded-lg p-3 border border-border-color"/><button onClick={() => handleUpdateUser({ email: newEmail }, 'Confirmation email sent!')} className="text-accent text-sm font-bold hover:underline pt-1">Update Email</button></div>
                        <div className="space-y-2"><label className="text-text-secondary text-sm font-bold">New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-primary rounded-lg p-3 border border-border-color"/><button onClick={() => handleUpdateUser({ password: newPassword }, 'Password updated!')} className="text-accent text-sm font-bold hover:underline pt-1">Update Password</button></div>
                        <SettingsRow label="Delete Account" description="This action is permanent."><button onClick={handleDeleteAccount} className="bg-danger text-white font-bold px-4 py-2 rounded-xl hover:scale-105 transition flex items-center"><Trash2 className="w-4 h-4 mr-2"/> Delete</button></SettingsRow>
                    </SettingsCard>

                    <SettingsCard title="Appearance" icon={<Palette className="text-accent" />}>
                        <SettingsRow label="Dark Mode"><ToggleSwitch enabled={profile?.dark_mode} onChange={() => handleUpdate('profiles', { dark_mode: !profile.dark_mode }, 'Theme updated!')} /></SettingsRow>
                        <SettingsRow label="Accent Color">
                            <div className="flex space-x-2">
                                {['#EBCD3E', '#000080', '#FF4B4B'].map(color => (
                                    <button key={color} onClick={() => handleUpdate('profiles', { accent_color: color }, 'Accent color updated!')} style={{ backgroundColor: color }} className={`w-8 h-8 rounded-full border-2 ${profile?.accent_color === color ? 'border-text-primary' : 'border-transparent'}`}></button>
                                ))}
                            </div>
                        </SettingsRow>
                    </SettingsCard>
                    
                    <SettingsCard title="Privacy & Security" icon={<Shield className="text-accent" />}>
                        <SettingsRow label="Private Account"><ToggleSwitch enabled={profile?.is_private} onChange={() => handleUpdate('profiles', { is_private: !profile.is_private }, 'Privacy updated!')}/></SettingsRow>
                        <SettingsRow label="Blocked Users"><button onClick={() => setIsBlockedModalOpen(true)} className="text-accent font-bold hover:underline">Manage</button></SettingsRow>
                        <SettingsRow label="Two-Factor Authentication"><ToggleSwitch enabled={profile?.two_factor_enabled} onChange={() => handleUpdate('profiles', { two_factor_enabled: !profile.two_factor_enabled }, '2FA status updated!')}/></SettingsRow>
                    </SettingsCard>

                    <SettingsCard title="Notifications" icon={<Bell className="text-accent" />}>
                        <SettingsRow label="Push Notifications"><ToggleSwitch enabled={true} onChange={() => {}} /></SettingsRow>
                        <SettingsRow label="Mentions"><ToggleSwitch enabled={true} onChange={() => {}} /></SettingsRow>
                        <SettingsRow label="New Followers"><ToggleSwitch enabled={false} onChange={() => {}} /></SettingsRow>
                    </SettingsCard>
                </div>
            </div>
            {isEditModalOpen && <EditProfileModal profile={profile} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveProfile} />}
            {isBlockedModalOpen && <BlockedUsersModal user={user} onClose={() => setIsBlockedModalOpen(false)} />}
        </div>
    );
};

export default SettingsPage;

