import { Sidebar } from "./sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-6">{children}</div>
      </main>
    </div>
  );
}
