"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, MessageSquare, Clock, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionChatRecord } from "@/types/chat";

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionChatRecord[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const user = JSON.parse(stored);

      const response = await fetch(`/api/sessions?userId=${user.id}`, { cache: "no-store" });
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

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions, pathname]);

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

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-in fade-in duration-500">
      {/* Chat History Sidebar */}
      <div
        className={`${
          isCollapsed ? "w-12" : "w-72"
        } flex-shrink-0 bg-card border rounded-2xl shadow-sm flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b flex items-center justify-between gap-2">
          {!isCollapsed && (
            <h3 className="text-sm font-semibold text-foreground truncate">
              Chat History
            </h3>
          )}
          <div className="flex items-center gap-1 flex-shrink-0">
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => router.push("/tutor")}
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                title="New Chat"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-muted-foreground hover:text-foreground"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-3.5 h-3.5" />
              ) : (
                <ChevronLeft className="w-3.5 h-3.5" />
              )}
            </Button>
          </div>
        </div>

        {/* Collapsed: just show new chat icon */}
        {isCollapsed ? (
          <div className="flex flex-col items-center pt-3 gap-2">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => router.push("/tutor")}
              className="text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              title="New Chat"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          /* Session List */
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {isLoadingSessions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 px-3">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground">
                    No chats yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Start a new conversation!
                  </p>
                </div>
              ) : (
                sessions.map((session) => (
                  <Link
                    key={session.id}
                    href={`/tutor/${session.session_id}`}
                    className={`flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                      isActiveSession(session.session_id)
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
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
        )}
      </div>

      {/* Main Chat Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
