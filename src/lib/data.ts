import { Employee, TimeEntry, TaskLog, TaskCategory } from "./types";

export const employees: Employee[] = [
  {
    id: "emp-001",
    name: "Lavitta Johnson",
    email: "lavitta@lavittamm.com",
    role: "admin",
    department: "Executive",
    avatar: "LJ",
    hourlyRate: 85,
    status: "active",
    joinDate: "2021-03-15",
  },
  {
    id: "emp-002",
    name: "Marcus Rivera",
    email: "marcus@lavittamm.com",
    role: "manager",
    department: "Digital Marketing",
    avatar: "MR",
    hourlyRate: 65,
    status: "active",
    joinDate: "2022-01-10",
  },
  {
    id: "emp-003",
    name: "Aisha Patel",
    email: "aisha@lavittamm.com",
    role: "employee",
    department: "Content Strategy",
    avatar: "AP",
    hourlyRate: 50,
    status: "active",
    joinDate: "2022-06-20",
  },
  {
    id: "emp-004",
    name: "Jordan Kim",
    email: "jordan@lavittamm.com",
    role: "employee",
    department: "Social Media",
    avatar: "JK",
    hourlyRate: 48,
    status: "active",
    joinDate: "2023-02-01",
  },
  {
    id: "emp-005",
    name: "Destiny Williams",
    email: "destiny@lavittamm.com",
    role: "employee",
    department: "Brand Design",
    avatar: "DW",
    hourlyRate: 55,
    status: "active",
    joinDate: "2022-09-15",
  },
  {
    id: "emp-006",
    name: "Carlos Mendez",
    email: "carlos@lavittamm.com",
    role: "manager",
    department: "Client Relations",
    avatar: "CM",
    hourlyRate: 62,
    status: "active",
    joinDate: "2021-11-01",
  },
  {
    id: "emp-007",
    name: "Brianna Foster",
    email: "brianna@lavittamm.com",
    role: "employee",
    department: "SEO & Analytics",
    avatar: "BF",
    hourlyRate: 52,
    status: "active",
    joinDate: "2023-05-10",
  },
  {
    id: "emp-008",
    name: "Tyler Okafor",
    email: "tyler@lavittamm.com",
    role: "employee",
    department: "Digital Marketing",
    avatar: "TO",
    hourlyRate: 47,
    status: "active",
    joinDate: "2023-08-20",
  },
  {
    id: "emp-009",
    name: "Natalie Chen",
    email: "natalie@lavittamm.com",
    role: "employee",
    department: "Content Strategy",
    avatar: "NC",
    hourlyRate: 50,
    status: "inactive",
    joinDate: "2022-04-01",
  },
  {
    id: "emp-010",
    name: "Derek Washington",
    email: "derek@lavittamm.com",
    role: "employee",
    department: "Social Media",
    avatar: "DWa",
    hourlyRate: 45,
    status: "active",
    joinDate: "2024-01-08",
  },
];

function generateTimeEntries(): TimeEntry[] {
  const entries: TimeEntry[] = [];
  const projects = [
    "Nike Spring Campaign",
    "Tesla Social Launch",
    "Airbnb Rebrand",
    "Spotify Wrapped",
    "Apple Event Prep",
    "Samsung Galaxy Push",
    "Internal Operations",
    "Client Onboarding",
    "Q1 Strategy Review",
    "Website Redesign",
  ];

  const today = new Date();
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split("T")[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    for (const emp of employees) {
      if (emp.status === "inactive") continue;
      if (isWeekend && Math.random() > 0.15) continue;

      const clockInHour = 8 + Math.floor(Math.random() * 2);
      const clockInMin = Math.floor(Math.random() * 60);
      const workHours = 7 + Math.random() * 3;
      const breakMin = 30 + Math.floor(Math.random() * 30);

      const clockIn = `${String(clockInHour).padStart(2, "0")}:${String(clockInMin).padStart(2, "0")}`;
      const clockOutTotalMin =
        clockInHour * 60 + clockInMin + workHours * 60 + breakMin;
      const clockOutHour = Math.floor(clockOutTotalMin / 60);
      const clockOutMin = Math.floor(clockOutTotalMin % 60);

      const isToday = dayOffset === 0;
      const clockOut = isToday && Math.random() > 0.5
        ? null
        : `${String(Math.min(clockOutHour, 23)).padStart(2, "0")}:${String(clockOutMin).padStart(2, "0")}`;

      const totalHours = clockOut
        ? Math.round((workHours - breakMin / 60) * 100) / 100
        : null;

      const statuses: TimeEntry["status"][] = [
        "approved",
        "approved",
        "approved",
        "pending",
        "rejected",
      ];

      entries.push({
        id: `te-${emp.id}-${dateStr}`,
        employeeId: emp.id,
        date: dateStr,
        clockIn,
        clockOut,
        breakMinutes: breakMin,
        project: projects[Math.floor(Math.random() * projects.length)],
        notes: "",
        status: isToday ? "pending" : statuses[Math.floor(Math.random() * statuses.length)],
        totalHours,
      });
    }
  }

  return entries;
}

export const timeEntries: TimeEntry[] = generateTimeEntries();

export const departments = [
  "Executive",
  "Digital Marketing",
  "Content Strategy",
  "Social Media",
  "Brand Design",
  "Client Relations",
  "SEO & Analytics",
];

export const projects = [
  "Nike Spring Campaign",
  "Tesla Social Launch",
  "Airbnb Rebrand",
  "Spotify Wrapped",
  "Apple Event Prep",
  "Samsung Galaxy Push",
  "Internal Operations",
  "Client Onboarding",
  "Q1 Strategy Review",
  "Website Redesign",
];

export const taskCategories: TaskCategory[] = [
  "Design",
  "Development",
  "Meeting",
  "Research",
  "Content Creation",
  "Client Communication",
  "Strategy",
  "Review",
  "Admin",
  "Other",
];

function generateTaskLogs(): TaskLog[] {
  const logs: TaskLog[] = [];
  const taskTemplates: { name: string; category: TaskCategory; minDuration: number; maxDuration: number }[] = [
    { name: "Design social media graphics", category: "Design", minDuration: 30, maxDuration: 120 },
    { name: "Write blog post draft", category: "Content Creation", minDuration: 60, maxDuration: 180 },
    { name: "Client strategy call", category: "Client Communication", minDuration: 30, maxDuration: 60 },
    { name: "Review campaign analytics", category: "Review", minDuration: 20, maxDuration: 60 },
    { name: "Team standup meeting", category: "Meeting", minDuration: 15, maxDuration: 30 },
    { name: "SEO keyword research", category: "Research", minDuration: 45, maxDuration: 90 },
    { name: "Update brand guidelines doc", category: "Admin", minDuration: 30, maxDuration: 60 },
    { name: "Create campaign strategy deck", category: "Strategy", minDuration: 60, maxDuration: 150 },
    { name: "Edit video content", category: "Content Creation", minDuration: 45, maxDuration: 120 },
    { name: "Build landing page", category: "Development", minDuration: 60, maxDuration: 240 },
    { name: "Client feedback review", category: "Review", minDuration: 20, maxDuration: 45 },
    { name: "Competitor analysis", category: "Research", minDuration: 30, maxDuration: 90 },
    { name: "Sprint planning session", category: "Meeting", minDuration: 45, maxDuration: 90 },
    { name: "Design email template", category: "Design", minDuration: 30, maxDuration: 90 },
    { name: "Write ad copy variations", category: "Content Creation", minDuration: 20, maxDuration: 60 },
    { name: "Update project timeline", category: "Admin", minDuration: 15, maxDuration: 30 },
    { name: "A/B test setup", category: "Development", minDuration: 30, maxDuration: 60 },
    { name: "Quarterly review presentation", category: "Strategy", minDuration: 60, maxDuration: 120 },
    { name: "Client onboarding call", category: "Client Communication", minDuration: 45, maxDuration: 90 },
    { name: "Social media scheduling", category: "Content Creation", minDuration: 20, maxDuration: 45 },
  ];

  const today = new Date();
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split("T")[0];
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    for (const emp of employees) {
      if (emp.status === "inactive") continue;
      if (isWeekend && Math.random() > 0.1) continue;

      const taskCount = 2 + Math.floor(Math.random() * 4);
      const usedTasks = new Set<number>();

      for (let t = 0; t < taskCount; t++) {
        let taskIdx: number;
        do {
          taskIdx = Math.floor(Math.random() * taskTemplates.length);
        } while (usedTasks.has(taskIdx) && usedTasks.size < taskTemplates.length);
        usedTasks.add(taskIdx);

        const template = taskTemplates[taskIdx];
        const duration =
          template.minDuration +
          Math.floor(Math.random() * (template.maxDuration - template.minDuration));
        const project = projects[Math.floor(Math.random() * projects.length)];

        logs.push({
          id: `tl-${emp.id}-${dateStr}-${t}`,
          employeeId: emp.id,
          date: dateStr,
          taskName: template.name,
          description: "",
          project,
          duration,
          category: template.category,
          status: dayOffset === 0 && Math.random() > 0.6 ? "in-progress" : "completed",
          createdAt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            8 + Math.floor(Math.random() * 8),
            Math.floor(Math.random() * 60)
          ).toISOString(),
        });
      }
    }
  }

  return logs;
}

export const taskLogs: TaskLog[] = generateTaskLogs();
