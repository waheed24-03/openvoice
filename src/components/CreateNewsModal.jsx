// File: src/components/CreateNewsModal.jsx
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function CreateNewsModal({ user, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user) return alert('Sign in to post.');

    setLoading(true);
    const payload = {
      user_id: user.id,
      title: title || content.slice(0, 80),
      content,
      image_url: imageUrl || null,
      source: 'user'
    };

    const { error } = await supabase.from('posts').insert(payload);
    setLoading(false);
    if (error) return alert('Failed to create post: ' + error.message);
    setTitle(''); setContent(''); setImageUrl('');
    onCreated && onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="w-full max-w-2xl bg-primary rounded-xl p-6">
        <h3 className="text-xl font-bold text-text-primary mb-3">Share a news update</h3>
        <form onSubmit={handleCreate} className="space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Headline (optional)" className="w-full bg-secondary rounded-md p-3 text-text-primary" />
          <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Write the update..." rows={5} className="w-full bg-secondary rounded-md p-3 text-text-primary" />
          <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL (optional)" className="w-full bg-secondary rounded-md p-3 text-text-primary" />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-border-color">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-accent text-black rounded-md font-semibold">
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
