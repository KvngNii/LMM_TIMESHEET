"use client";

import { useState, useCallback, useMemo, ReactNode } from "react";
import { AppContext, AppState } from "@/lib/store";
import { Employee, TimeEntry, TaskLog, ClockSession, Page } from "@/lib/types";
import {
  employees as initialEmployees,
  timeEntries as initialTimeEntries,
  taskLogs as initialTaskLogs,
} from "@/lib/data";
import { generateId } from "@/lib/utils";

export default function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [timeEntries, setTimeEntries] =
    useState<TimeEntry[]>(initialTimeEntries);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>(initialTaskLogs);
  const [clockSession, setClockSession] = useState<ClockSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = useCallback(
    (email: string, _password: string): boolean => {
      const user = employees.find(
        (e) => e.email.toLowerCase() === email.toLowerCase()
      );
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setCurrentPage("dashboard");
        return true;
      }
      return false;
    },
    [employees]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setClockSession(null);
    setCurrentPage("dashboard");
  }, []);

  const setPage = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const clockIn = useCallback(
    (project: string) => {
      if (!currentUser) return;
      setClockSession({
        employeeId: currentUser.id,
        clockInTime: new Date().toISOString(),
        isOnBreak: false,
        breakStart: null,
        totalBreakMinutes: 0,
        project,
      });

      const today = new Date().toISOString().split("T")[0];
      const clockInTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      setTimeEntries((prev) => [
        {
          id: generateId(),
          employeeId: currentUser.id,
          date: today,
          clockIn: clockInTime,
          clockOut: null,
          breakMinutes: 0,
          project,
          notes: "",
          status: "pending",
          totalHours: null,
        },
        ...prev,
      ]);
    },
    [currentUser]
  );

  const clockOut = useCallback(() => {
    if (!currentUser || !clockSession) return;

    const now = new Date();
    const clockOutTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const start = new Date(clockSession.clockInTime);
    const totalMs = now.getTime() - start.getTime();
    const totalHours =
      Math.round(
        (totalMs / 3600000 - clockSession.totalBreakMinutes / 60) * 100
      ) / 100;

    const today = new Date().toISOString().split("T")[0];

    setTimeEntries((prev) =>
      prev.map((entry) => {
        if (
          entry.employeeId === currentUser.id &&
          entry.date === today &&
          entry.clockOut === null
        ) {
          return {
            ...entry,
            clockOut: clockOutTime,
            breakMinutes: clockSession.totalBreakMinutes,
            totalHours: Math.max(0, totalHours),
          };
        }
        return entry;
      })
    );

    setClockSession(null);
  }, [currentUser, clockSession]);

  const toggleBreak = useCallback(() => {
    if (!clockSession) return;

    if (clockSession.isOnBreak && clockSession.breakStart) {
      const breakMs =
        new Date().getTime() - new Date(clockSession.breakStart).getTime();
      const breakMin = Math.floor(breakMs / 60000);
      setClockSession({
        ...clockSession,
        isOnBreak: false,
        breakStart: null,
        totalBreakMinutes: clockSession.totalBreakMinutes + breakMin,
      });
    } else {
      setClockSession({
        ...clockSession,
        isOnBreak: true,
        breakStart: new Date().toISOString(),
      });
    }
  }, [clockSession]);

  const updateTimeEntry = useCallback(
    (id: string, updates: Partial<TimeEntry>) => {
      setTimeEntries((prev) =>
        prev.map((entry) =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      );
    },
    []
  );

  const addEmployee = useCallback((employee: Employee) => {
    setEmployees((prev) => [...prev, employee]);
  }, []);

  const updateEmployee = useCallback(
    (id: string, updates: Partial<Employee>) => {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
      );
      if (currentUser && currentUser.id === id) {
        setCurrentUser((prev) => (prev ? { ...prev, ...updates } : prev));
      }
    },
    [currentUser]
  );

  const addTaskLog = useCallback((task: TaskLog) => {
    setTaskLogs((prev) => [task, ...prev]);
  }, []);

  const updateTaskLog = useCallback(
    (id: string, updates: Partial<TaskLog>) => {
      setTaskLogs((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
      );
    },
    []
  );

  const deleteTaskLog = useCallback((id: string) => {
    setTaskLogs((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const store = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      currentPage,
      employees,
      timeEntries,
      taskLogs,
      clockSession,
      sidebarOpen,
      login,
      logout,
      setPage,
      clockIn,
      clockOut,
      toggleBreak,
      updateTimeEntry,
      addEmployee,
      updateEmployee,
      addTaskLog,
      updateTaskLog,
      deleteTaskLog,
      toggleSidebar,
    }),
    [
      currentUser,
      isAuthenticated,
      currentPage,
      employees,
      timeEntries,
      taskLogs,
      clockSession,
      sidebarOpen,
      login,
      logout,
      setPage,
      clockIn,
      clockOut,
      toggleBreak,
      updateTimeEntry,
      addEmployee,
      updateEmployee,
      addTaskLog,
      updateTaskLog,
      deleteTaskLog,
      toggleSidebar,
    ]
  );

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}
