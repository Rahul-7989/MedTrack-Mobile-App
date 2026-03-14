
import React from 'react';
import { View } from '../App';
import { LogoIcon } from './Illustrations';

interface LandingPageProps {
  onNavigate: (view: View) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="h-screen w-full bg-[#F4F1EC] flex flex-col items-center justify-center gap-y-12 p-8 overflow-hidden">
      {/* Section 1: App Identity */}
      <div className="flex flex-col items-center mt-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-[#4FA3B1]/10 mb-4">
          <LogoIcon className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-bold text-[#2E2A4A] tracking-tight">MedTrack</h1>
        <p className="text-[#4FA3B1] font-medium mt-2 italic text-center">Medication care, shared with family.</p>
      </div>

      {/* Section 2: Short Description */}
      <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <p className="text-lg font-bold text-[#2E2A4A] leading-tight">
          MedTrack helps families remember medicines together.
        </p>
        <p className="text-sm text-[#6A6875] font-medium">
          Simple reminders so no dose goes unnoticed.
        </p>
      </div>

      {/* Section 3: Illustration */}
      <div className="w-full max-w-sm mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <svg viewBox="0 0 400 300" className="w-full h-auto drop-shadow-2xl">
          {/* Background Circle */}
          <circle cx="200" cy="150" r="120" fill="#EFEAE3" />
          
          {/* Elderly Person (Simplified) */}
          <g transform="translate(120, 100)">
            <circle cx="30" cy="30" r="25" fill="#D1C7B7" /> {/* Head */}
            <path d="M10,80 Q30,40 50,80" fill="#2E2A4A" /> {/* Body */}
            <circle cx="25" cy="25" r="2" fill="#2E2A4A" /> {/* Eye */}
            <path d="M25,35 Q30,40 35,35" stroke="#2E2A4A" fill="none" strokeWidth="2" /> {/* Smile */}
          </g>

          {/* Parent (Simplified) */}
          <g transform="translate(220, 110)">
            <circle cx="30" cy="30" r="25" fill="#4FA3B1" /> {/* Head */}
            <path d="M10,80 Q30,40 50,80" fill="#2E2A4A" /> {/* Body */}
            <circle cx="35" cy="25" r="2" fill="#F4F1EC" /> {/* Eye */}
            <path d="M25,35 Q30,40 35,35" stroke="#F4F1EC" fill="none" strokeWidth="2" /> {/* Smile */}
          </g>

          {/* Phone with Reminder */}
          <g transform="translate(180, 160)">
            <rect x="0" y="0" width="40" height="70" rx="8" fill="#2E2A4A" />
            <rect x="5" y="10" width="30" height="50" rx="4" fill="#F4F1EC" />
            <circle cx="20" cy="35" r="10" fill="#E5A23C" opacity="0.8" />
            <path d="M16,35 L19,38 L24,32" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>

          {/* Floating Hearts/Care Icons */}
          <path d="M100,80 Q110,60 120,80 Q110,100 100,80" fill="#E5A23C" opacity="0.6" transform="rotate(-15, 110, 80)" />
          <path d="M300,100 Q310,80 320,100 Q310,120 300,100" fill="#4FA3B1" opacity="0.6" transform="rotate(15, 310, 100)" />
        </svg>
      </div>

      {/* Section 4: Action Buttons */}
      <div className="w-full max-w-xs space-y-3 animate-in fade-in zoom-in-95 duration-700 delay-400">
        <button 
          onClick={() => onNavigate('signup')}
          className="w-full bg-[#4FA3B1] text-[#F4F1EC] py-4 rounded-[2rem] font-bold text-base hover-lift shadow-lg shadow-[#4FA3B1]/20 transition-all"
        >
          Get Started
        </button>
        <button 
          onClick={() => onNavigate('login')}
          className="w-full bg-white text-[#2E2A4A] py-4 rounded-[2rem] font-bold text-base hover-lift shadow-sm border border-[#2E2A4A]/5 transition-all"
        >
          Login
        </button>
      </div>

      {/* Trust Micro-copy */}
      <p className="text-[10px] font-black text-[#6A6875]/30 uppercase tracking-[0.4em] text-center w-full flex items-center justify-center">
        Your data stays within your family hub.
      </p>
    </div>
  );
};
