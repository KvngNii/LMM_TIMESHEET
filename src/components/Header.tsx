"use client";

import { useAppStore } from "@/lib/store";
import { Bell, Search, Menu } from "lucide-react";
import { useState, useEffect } from "react";

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  clock: "Clock In / Out",
  timesheets: "Timesheets",
  employees: "Employees",
  reports: "Reports & Analytics",
  settings: "Settings",
};

export default function Header() {
  const { currentPage, toggleSidebar } = useAppStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {pageTitles[currentPage] || "Dashboard"}
          </h2>
          <p className="text-xs text-muted">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-border">
          <Search className="w-4 h-4 text-muted mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-48 text-foreground placeholder-muted"
          />
        </div>

        {/* Clock display */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-border">
          <div className="w-2 h-2 rounded-full bg-success pulse-dot" />
          <span className="text-sm font-mono font-medium text-foreground">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger rounded-full text-[10px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
