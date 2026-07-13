import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

/**
 * Persistent app shell — Topbar + Sidebar + <Outlet /> for the current page.
 */
export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Topbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 min-w-0 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
