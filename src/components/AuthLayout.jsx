import React from 'react';
import logo from '../assets/OpenVoice.png';

export default function AuthLayout({ children, heading = 'Your Voice. Your Power.', subheading = 'Join' }) {
  return (
    <div className="min-h-screen w-full flex bg-black text-white">
      {/* Left: big logo/art */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center p-12">
        <div className="flex items-center justify-center">
          <img src={logo} alt="OpenVoice Logo" className="w-72 h-72 object-contain opacity-90" />
        </div>
      </div>

      {/* Right: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <header className="mb-8">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">{heading}</h1>
            <p className="mt-6 text-2xl font-semibold">{subheading}</p>
          </header>

          <div className="bg-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
