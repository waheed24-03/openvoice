// src/components/PrimaryInput.jsx
// A reusable, modern text input field with a focus glow that uses the dynamic accent color.
// Props: All standard input props (value, onChange, placeholder, type, etc.)

import React from 'react';

const PrimaryInput = ({ ...props }) => {
  return (
    <input
      {...props}
      className="w-full bg-secondary text-text-primary rounded-lg p-3 border border-border-color focus:outline-none focus:ring-2"
      style={{
        '--tw-ring-color': 'var(--color-accent, #EBCD3E)'
      }}
    />
  );
};

export default PrimaryInput;
