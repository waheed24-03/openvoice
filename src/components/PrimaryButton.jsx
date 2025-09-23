// src/components/PrimaryButton.jsx
import React from "react";

export default function PrimaryButton({ children, onClick, className = "", style = {}, type = "button", disabled }) {
  const base = "rounded-xl px-5 py-3 font-semibold shadow-sm transition transform hover:scale-[1.02]";
  const mergedStyle = { backgroundColor: "var(--color-accent)", color: "#21183B", ...style }; // dark text on accent
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${className}`} style={mergedStyle}>
      {children}
    </button>
  );
}
