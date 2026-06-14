"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { SessionChatRecord } from "@/types/chat";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquareText,
  FileQuestion,
  LineChart,
  LogOut,
  User,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Clock,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const [sessions, setSessions] = useState<SessionChatRecord[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const user = JSON.parse(stored);

      const response = await fetch(`/api/sessions?userId=${user.id}`, {
        cache: "no-store",
      });
      const result = await response.json();

      if (response.ok && result.data) {
        setSessions(result.data);
      }
    } catch (e) {
      console.error("Failed to fetch sessions:", e);
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isActiveSession = (sessionId: string) => {
    return pathname === `/tutor/${sessionId}`;
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions, pathname]);

  return (
    <div className="hidden md:flex pr-0 z-20">
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
        className="w-64 backdrop-blur-xl bg-white/5 border border-white/10  flex flex-col h-full sticky top-6 shadow-xl shadow-indigo-500/5"
      >
        <div className="p-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 group w-fit"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Learnix
            </h2>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
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
                <Icon
                  className={`w-5 h-5 relative z-10 ${isActive ? "text-indigo-400" : "group-hover:text-white transition-colors"}`}
                />
                <span className="relative z-10 font-medium">{link.label}</span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto relative z-10 text-indigo-400" />
                )}
              </Link>
            );
          })}
          <div>
            <p className="text-sm text-white/50"> Recent Chats</p>
          </div>
          <ScrollArea className="flex-1 max-h-[30vh]">
            <div className="p-2 space-y-1">
              {isLoadingSessions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-white/40" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 px-3">
                  <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-xs text-white/50">No chats yet</p>
                  <p className="text-xs text-white/30 mt-1">
                    Start a new conversation!
                  </p>
                </div>
              ) : (
                sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/tutor/${session.session_id}`}
                    className={`flex items-start gap-3 px-3 py-2.5 rounded-xl truncate transition-all group overflow-hidden ${
                      isActiveSession(session.session_id)
                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.1)]"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0 truncate" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.chat_title || "New Chat"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 opacity-50" />
                        <span className="text-[11px] opacity-60">
                          {formatDate(session.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/5">
            {userName ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 pl-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-300 flex-shrink-0 border border-white/10">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate text-white/90">
                    {userName}
                  </span>
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
