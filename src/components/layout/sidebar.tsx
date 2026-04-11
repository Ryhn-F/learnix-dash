"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  FileQuestion,
  LineChart,
  LogOut,
  User,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUserName(user.name || user.email || "User");
      } catch {
        setUserName(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userinfo");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tutor", label: "AI Tutor", icon: MessageSquareText },
    { href: "/quiz", label: "Practice Quiz", icon: FileQuestion },
    { href: "/progress", label: "Progress", icon: LineChart },
  ];

  return (
    <div className="hidden md:flex p-6 pr-0 z-20">
      <motion.div 
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
        className="w-64 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl flex flex-col h-full sticky top-6 shadow-xl shadow-indigo-500/5"
      >
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 group w-fit">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Learnix
            </h2>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all group overflow-hidden ${
                  isActive
                    ? "bg-white/10 text-white shadow-[0_4px_24px_-4px_rgba(99,102,241,0.2)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/10 pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-400 rounded-r-md" />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-indigo-400' : 'group-hover:text-white transition-colors'}`} />
                <span className="relative z-10 font-medium">{link.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto relative z-10 text-indigo-400" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/5">
            {userName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 pl-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-300 flex-shrink-0 border border-white/10">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate text-white/90">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white/50 hover:text-red-400 transition-colors flex-shrink-0 p-2 hover:bg-white/5 rounded-lg"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="px-2 py-1">
                <Link
                  href="/login"
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
