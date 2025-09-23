// src/components/GlassCard.jsx
// A reusable glassmorphism card component.
// Props: title (string, optional), children

import React from 'react';

const GlassCard = ({ title, children }) => {
  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
      {title && <h2 className="text-2xl font-bold text-text-primary mb-4">{title}</h2>}
      <div>{children}</div>
    </div>
  );
};

export default GlassCard;
