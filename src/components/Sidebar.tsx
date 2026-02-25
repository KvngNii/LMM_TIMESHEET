"use client";

import { useAppStore } from "@/lib/store";
import { Page } from "@/lib/types";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Timer,
  ListTodo,
} from "lucide-react";

const navItems: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { page: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "clock", label: "Clock In/Out", icon: Clock },
  { page: "timesheets", label: "Timesheets", icon: CalendarDays },
  { page: "tasks", label: "Task Log", icon: ListTodo },
  { page: "employees", label: "Employees", icon: Users },
  { page: "reports", label: "Reports", icon: BarChart3 },
  { page: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { currentPage, setPage, currentUser, logout, sidebarOpen, toggleSidebar, clockSession } =
    useAppStore();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar-bg text-white flex flex-col transition-all duration-300 z-50 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <Timer className="w-5 h-5 text-white" />
        </div>
        {sidebarOpen && (
          <div className="animate-fade-in">
            <h1 className="font-bold text-base leading-tight">Lavitta</h1>
            <p className="text-[11px] text-sidebar-text leading-tight">Marketing Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ page, label, icon: Icon }) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => setPage(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-sidebar-text hover:bg-white/8 hover:text-white"
              }`}
              title={label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="animate-fade-in">{label}</span>}
              {page === "clock" && clockSession && (
                <span className="ml-auto w-2 h-2 rounded-full bg-green-400 pulse-dot" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4">
        {currentUser && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {currentUser.avatar}
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in overflow-hidden">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-[11px] text-sidebar-text capitalize">{currentUser.role}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-text hover:bg-white/8 hover:text-white transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}
