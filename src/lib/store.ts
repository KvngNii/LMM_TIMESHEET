"use client";

import { createContext, useContext } from "react";
import { Employee, TimeEntry, ClockSession, Page, TaskLog } from "./types";

export interface AppState {
  currentUser: Employee | null;
  isAuthenticated: boolean;
  currentPage: Page;
  employees: Employee[];
  timeEntries: TimeEntry[];
  taskLogs: TaskLog[];
  clockSession: ClockSession | null;
  sidebarOpen: boolean;
}

export interface AppActions {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setPage: (page: Page) => void;
  clockIn: (project: string) => void;
  clockOut: () => void;
  toggleBreak: () => void;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  addTaskLog: (task: TaskLog) => void;
  updateTaskLog: (id: string, updates: Partial<TaskLog>) => void;
  deleteTaskLog: (id: string) => void;
  toggleSidebar: () => void;
}

export type AppStore = AppState & AppActions;

export const AppContext = createContext<AppStore | null>(null);

export function useAppStore(): AppStore {
  const store = useContext(AppContext);
  if (!store) {
    throw new Error("useAppStore must be used within AppProvider");
  }
  return store;
}
