export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee";
  department: string;
  avatar: string;
  hourlyRate: number;
  status: "active" | "inactive";
  joinDate: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  breakMinutes: number;
  project: string;
  notes: string;
  status: "pending" | "approved" | "rejected";
  totalHours: number | null;
}

export interface ClockSession {
  employeeId: string;
  clockInTime: string;
  isOnBreak: boolean;
  breakStart: string | null;
  totalBreakMinutes: number;
  project: string;
}

export interface DashboardStats {
  totalEmployees: number;
  activeToday: number;
  totalHoursToday: number;
  pendingApprovals: number;
  avgHoursPerDay: number;
  overtimeHours: number;
}

export type Page =
  | "dashboard"
  | "clock"
  | "timesheets"
  | "employees"
  | "reports"
  | "settings";
