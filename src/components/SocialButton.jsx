import React from 'react';

/**
 * Usage:
 * <SocialButton provider="google" label="Sign up with Google" onClick={...} />
 */
export default function SocialButton({ provider, label, onClick }) {
  const base = "w-full flex items-center justify-center gap-3 py-3 rounded-full border border-[#2b2b2b] bg-white text-black font-medium shadow-sm";
  const icon = provider === 'google' ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21.35 11.1H12v2.8h5.35c-.24 1.6-1.84 4.5-5.35 4.5-3.22 0-5.85-2.66-5.85-5.94s2.63-5.94 5.85-5.94c1.84 0 3.07.78 3.77 1.45l2.57-2.5C17.9 3.3 15.3 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.8 0 9.94-4.07 9.94-9.8 0-.65-.07-1.14-.59-1.1z" fill="#4285F4"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.37 2.15-.98 2.94-.72.98-1.9 1.98-3.1 1.98-.1-1.26.39-2.72 1.1-3.6.8-.95 1.94-1.64 3-1.64.03 0 .03 0 .03.32z" fill="black"/>
      <path d="M12.02 4.13c1 .03 2.2.66 3 1.6.9 1.04 1.54 2.55 1.27 4.15-.32 1.9-1.44 3.42-3.02 4.3-1.01.54-2.05.85-3.07.85-1.04 0-2.15-.28-3.16-.84C6.02 13.6 5 12.32 4.5 10.8c-.65-1.9-.12-3.8 1.13-5.28C6.82 3.3 8.95 2.9 11 3.03c.38 0 .76.03 1.02.1z" fill="black"/>
    </svg>
  );

  return (
    <button type="button" onClick={onClick} className={base}>
      {icon}
      <span>{label}</span>
    </button>
  );
}
