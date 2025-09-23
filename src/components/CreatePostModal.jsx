// File: src/components/CreatePostModal.jsx (Final Redesign)

import React, { useState, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { Image as ImageIcon, X } from 'lucide-react';

const CreatePostModal = ({ profile, onClose, onPost }) => {
    const [postText, setPostText] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handlePost = async () => {
        setUploading(true);
        let mediaUrl = null;

        if (file) {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('You must be logged in to upload files.');
                setUploading(false);
                return;
            }
            const filePath = `public/${user.id}/${Date.now()}_${file.name}`;
            const { data, error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
            if (uploadError) {
                console.error('Error uploading file:', uploadError);
                alert('Failed to upload file. Please try again.');
                setUploading(false);
                return;
            }
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
            mediaUrl = publicUrl;
        }

        onPost(postText, mediaUrl);
        setUploading(false);
    };

    return (
        // The floating blurred backdrop for the entire screen.
        <div 
            className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            {/* The modal itself: now a solid, high-contrast, dark-themed card. */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#2f3336] p-4 flex flex-col"
            >
                <div className="flex items-center justify-between mb-4">
                    <button onClick={onClose} className="text-[#71767b] hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <div></div> 
                </div>

                {/* Main Content Area */}
                <div className="flex space-x-4">
                    <div className="flex-shrink-0">
                        <img 
                            src={profile.avatar_url || `https://placehold.co/100/71767b/e7e9ea?text=${profile.username?.charAt(0) || '?'}`} 
                            alt="Your avatar" 
                            className="w-12 h-12 rounded-full" 
                        />
                    </div>

                    <div className="flex-1">
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="What's happening?"
                            className="w-full bg-transparent text-[#e7e9ea] text-xl placeholder:text-[#71767b] resize-none focus:outline-none"
                            rows="4"
                            autoFocus
                        />
                        {previewUrl && (
                            <div className="mt-4 relative max-h-80 overflow-hidden rounded-lg border border-[#2f3336]">
                                {file.type.startsWith('image/') ? (
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <video src={previewUrl} controls className="w-full h-full" />
                                )}
                                <button 
                                    onClick={() => { setFile(null); setPreviewUrl(null); }}
                                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2f3336]">
                    <div className="flex items-center space-x-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
                        <button 
                            onClick={() => fileInputRef.current.click()} 
                            style={{ color: 'var(--color-accent, #EBCD3E)' }}
                            className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                            aria-label="Upload media"
                        >
                            <ImageIcon size={22} />
                        </button>
                    </div>

                    <button 
                        onClick={handlePost} 
                        disabled={uploading || (!postText.trim() && !file)}
                        style={{ backgroundColor: 'var(--color-accent, #EBCD3E)' }}
                        className="text-black font-bold tracking-wide px-5 py-2 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {uploading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;