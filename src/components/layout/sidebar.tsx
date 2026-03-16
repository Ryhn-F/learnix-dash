"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquareText, FileQuestion, LineChart } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

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
        <div className="text-sm text-muted-foreground">User Profile</div>
      </div>
    </div>
  );
}
