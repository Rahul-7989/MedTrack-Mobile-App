import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface DashboardFooterProps {
  userName: string;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = ({ userName }) => {
  const [dailyLine, setDailyLine] = useState("One small tablet. One big habit.");
  const [isLoadingLine, setIsLoadingLine] = useState(false);

  useEffect(() => {
    const fetchDailyLine = async () => {
      const today = new Date().toDateString();
      const cached = localStorage.getItem('medtrack_daily_line');
      const cachedDate = localStorage.getItem('medtrack_daily_date');

      if (cached && cachedDate === today) {
        setDailyLine(cached);
        return;
      }

      setIsLoadingLine(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Generate a single, short, gentle, medication-related care line. Tone: Friendly, human, no guilt, no jokes about illness. Max 12 words. Examples: 'Your future self just smiled.', 'Care is a habit, not a hassle.', 'Small tablets. Big commitment.'",
          config: { 
            systemInstruction: "You are the warm, human voice of MedTrack. You provide gentle, lighthearted encouragement for family health routines.",
            temperature: 0.9 
          }
        });
        const newLine = response.text?.trim() || "Care is a routine, not a reminder.";
        setDailyLine(newLine);
        localStorage.setItem('medtrack_daily_line', newLine);
        localStorage.setItem('medtrack_daily_date', today);
      } catch (e) {
        console.error("Failed to generate care line", e);
      } finally {
        setIsLoadingLine(false);
      }
    };

    fetchDailyLine();
  }, []);

  return (
    <footer className="w-full bg-[#EFEAE3] mt-auto pt-10 pb-8 px-6 md:px-12 rounded-t-[3.5rem] shadow-[0_-10px_30px_-15px_rgba(46,42,74,0.05)] border-t border-[#2E2A4A]/5 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* 1️⃣ LEFT ZONE: DAILY CARE LINE (REMOVED) */}

        {/* 2️⃣ CENTER ZONE: QUICK LINKS (REMOVED) */}
        <div className="flex items-center gap-10 justify-center order-1 md:order-2">
        </div>

        {/* 3️⃣ RIGHT ZONE: APP INFO & STATUS */}
        <div className="flex-1 flex flex-col items-center md:items-end gap-1.5 order-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-[#2E2A4A] tracking-tighter uppercase opacity-80">MedTrack</span>
            <div className="w-1 h-1 rounded-full bg-[#6A6875]/20" />
            <span className="text-[9px] font-bold text-[#6A6875]/40 tracking-widest">v1.0</span>
          </div>
          <div className="flex items-center gap-2.5 bg-[#F4F1EC]/60 px-3 py-1 rounded-full border border-white/40 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#9DB8AD] animate-pulse shadow-[0_0_8px_rgba(157,184,173,0.5)]" />
            <span className="text-[9px] font-bold text-[#6A6875] uppercase tracking-[0.15em] opacity-60">All systems calm</span>
          </div>
        </div>
      </div>

      {/* Trust Micro-copy */}
      <div className="mt-10 pt-6 border-t border-[#2E2A4A]/5 text-center">
        <p className="text-[9px] font-black text-[#6A6875]/30 uppercase tracking-[0.4em]">
          Your data stays within your family hub.
        </p>
      </div>
    </footer>
  );
};