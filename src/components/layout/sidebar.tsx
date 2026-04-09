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
} from "lucide-react";

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
    <div className="w-64 border-r bg-card flex flex-col h-full sticky top-0 hidden md:flex">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-500 to-indigo-500">
          Learnix
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        {userName ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-300 flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium truncate">{userName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 p-1"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
}
