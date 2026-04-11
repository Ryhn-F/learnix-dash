"use client";

import { Sidebar } from "./sidebar";
import { motion } from "framer-motion";
import { Bell, User } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserName(user.name || user.email || "User");
      } catch {
        // ignore
      }
    }
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Dashboard";
    if (pathname.includes("/tutor")) return "AI Tutor";
    if (pathname.includes("/quiz")) return "Practice Quiz";
    if (pathname.includes("/progress")) return "Progress";
    return "";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#050816] via-[#090a1f] to-[#020617] text-white relative overflow-hidden">
      {/* Floating blur glow layers */}
      <motion.div 
        animate={{ y: [0, -30, 0], opacity: [0.15, 0.25, 0.15] }} 
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }} 
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} 
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-600 rounded-full blur-[100px] pointer-events-none" 
      />

      <Sidebar />
      <main className="flex-1 flex flex-col h-screen relative z-10 w-full overflow-hidden">
        {/* Glass Floating Header */}
        <header className="sticky top-0 z-50 p-4 md:p-6 pb-0 flex-shrink-0">
          <div className="h-16 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 flex items-center justify-between px-6 shadow-lg shadow-indigo-500/10">
            <div className="flex text-lg font-semibold text-white/90">
              {getPageTitle()}
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-white/60 hover:text-white transition-colors group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <span className="text-sm font-medium text-white/80 hidden sm:block">{userName || "Guest"}</span>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto pb-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
