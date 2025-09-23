// File: src/components/Header.jsx

import React from 'react';
import logo from '../assets/OpenVoice.png'; 

// We now accept 'onSignOut' as a prop
const Header = ({ onSignOut }) => {
    return (
        // This header is now full-width with a max-width container inside
        <header className="w-full bg-secondary border-b border-gray-800 sticky top-0 z-10">
            <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* LOGO - Bigger and more visible */}
                <div className="w-12 h-12">
                    <img src={logo} alt="OpenVoice Logo" className="w-full h-full object-contain" />
                </div>

                {/* LOGOUT BUTTON */}
                <button 
                    onClick={onSignOut} 
                    className="text-textLight hover:text-white font-bold transition-colors duration-200"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;