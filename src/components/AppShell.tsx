"use client";

import { useAppStore } from "@/lib/store";
import LoginPage from "./LoginPage";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardPage from "./DashboardPage";
import ClockPage from "./ClockPage";
import TimesheetsPage from "./TimesheetsPage";
import TaskLogPage from "./TaskLogPage";
import EmployeesPage from "./EmployeesPage";
import ReportsPage from "./ReportsPage";
import SettingsPage from "./SettingsPage";

const pages: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  clock: ClockPage,
  timesheets: TimesheetsPage,
  tasks: TaskLogPage,
  employees: EmployeesPage,
  reports: ReportsPage,
  settings: SettingsPage,
};

export default function AppShell() {
  const { isAuthenticated, currentPage, sidebarOpen } = useAppStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const PageComponent = pages[currentPage] || DashboardPage;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <Header />
        <main className="p-6">
          <PageComponent />
        </main>
      </div>
    </div>
  );
}
