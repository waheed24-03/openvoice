// src/components/RightWidgetTrending.jsx
// A simple "What's happening" widget for the right sidebar.
// Renders plausible placeholder data.

import React from 'react';

const RightWidgetTrending = () => {
    const trends = [
        { category: 'Politics · Trending', topic: '#DigitalSovereignty', posts: '15.2K posts' },
        { category: 'Technology · Trending', topic: '#OpenSourceAI', posts: '8,992 posts' },
        { category: 'Global News · Trending', topic: 'Free Speech Debate', posts: '42.1K posts' },
    ];

    return (
        <div className="bg-secondary rounded-lg p-4">
            <h2 className="text-xl font-bold text-text-primary mb-4">What's happening</h2>
            <ul className="space-y-4">
                {trends.map(trend => (
                    <li key={trend.topic}>
                        <p className="text-sm text-text-secondary">{trend.category}</p>
                        <p className="font-bold text-text-primary">{trend.topic}</p>
                        <p className="text-sm text-text-secondary">{trend.posts}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RightWidgetTrending;
