"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { formatHours } from "@/lib/utils";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function DashboardPage() {
  const { employees, timeEntries, currentUser } = useAppStore();

  const today = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    const todayEntries = timeEntries.filter((e) => e.date === today);
    const activeToday = new Set(todayEntries.map((e) => e.employeeId)).size;
    const totalHoursToday = todayEntries.reduce(
      (sum, e) => sum + (e.totalHours || 0),
      0
    );
    const pendingApprovals = timeEntries.filter(
      (e) => e.status === "pending"
    ).length;

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayEntries = timeEntries.filter((e) => e.date === dateStr);
      const hours = dayEntries.reduce(
        (sum, e) => sum + (e.totalHours || 0),
        0
      );
      last7Days.push(hours);
    }
    const avgHours =
      last7Days.reduce((a, b) => a + b, 0) / Math.max(last7Days.length, 1);

    const currentlyClockedIn = todayEntries.filter(
      (e) => e.clockOut === null
    ).length;

    return {
      totalEmployees: employees.filter((e) => e.status === "active").length,
      activeToday,
      totalHoursToday: Math.round(totalHoursToday * 10) / 10,
      pendingApprovals,
      avgHoursPerDay: Math.round(avgHours * 10) / 10,
      currentlyClockedIn,
    };
  }, [employees, timeEntries, today]);

  const weeklyData = useMemo(() => {
    const data = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayEntries = timeEntries.filter((e) => e.date === dateStr);
      const hours = dayEntries.reduce(
        (sum, e) => sum + (e.totalHours || 0),
        0
      );
      data.push({
        day: dayNames[d.getDay()],
        hours: Math.round(hours * 10) / 10,
      });
    }
    return data;
  }, [timeEntries]);

  const departmentData = useMemo(() => {
    const deptHours: Record<string, number> = {};
    const last7 = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.add(d.toISOString().split("T")[0]);
    }

    timeEntries
      .filter((e) => last7.has(e.date))
      .forEach((entry) => {
        const emp = employees.find((e) => e.id === entry.employeeId);
        if (emp) {
          deptHours[emp.department] =
            (deptHours[emp.department] || 0) + (entry.totalHours || 0);
        }
      });

    const colors = [
      "#7c3aed",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
      "#8b5cf6",
    ];
    return Object.entries(deptHours).map(([name, value], i) => ({
      name,
      value: Math.round(value * 10) / 10,
      color: colors[i % colors.length],
    }));
  }, [employees, timeEntries]);

  const hoursTrendData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayEntries = timeEntries.filter((e) => e.date === dateStr);
      const hours = dayEntries.reduce(
        (sum, e) => sum + (e.totalHours || 0),
        0
      );
      data.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        hours: Math.round(hours * 10) / 10,
      });
    }
    return data;
  }, [timeEntries]);

  const recentActivity = useMemo(() => {
    return timeEntries
      .filter((e) => e.date === today)
      .slice(0, 8)
      .map((entry) => {
        const emp = employees.find((e) => e.id === entry.employeeId);
        return { ...entry, employee: emp };
      });
  }, [timeEntries, employees, today]);

  const statCards = [
    {
      label: "Active Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "bg-blue-500",
      change: "+2",
      trend: "up",
    },
    {
      label: "Clocked In Today",
      value: stats.activeToday,
      icon: Clock,
      color: "bg-green-500",
      change: `${stats.currentlyClockedIn} active`,
      trend: "up",
    },
    {
      label: "Hours Today",
      value: formatHours(stats.totalHoursToday),
      icon: Timer,
      color: "bg-purple-500",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: AlertCircle,
      color: "bg-amber-500",
      change: "-3",
      trend: "down",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold">
          Good{" "}
          {new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 17
              ? "afternoon"
              : "evening"}
          , {currentUser?.name?.split(" ")[0]}!
        </h3>
        <p className="text-purple-100 text-sm mt-1">
          Here&apos;s your team&apos;s activity overview for today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={card.label}
            className="bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-shadow animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted font-medium uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {card.trend === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-success" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-danger" />
              )}
              <span
                className={`text-xs font-medium ${card.trend === "up" ? "text-success" : "text-danger"}`}
              >
                {card.change}
              </span>
              <span className="text-xs text-muted ml-1">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly hours bar chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Weekly Team Hours
          </h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="hours" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department pie chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Hours by Department
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={45}
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {departmentData.slice(0, 4).map((dept) => (
              <div
                key={dept.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-muted truncate max-w-[120px]">{dept.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {formatHours(dept.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-day trend */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            30-Day Hours Trend
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hoursTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                interval={4}
              />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Today&apos;s Activity
          </h4>
          <div className="space-y-3 max-h-[260px] overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted text-center py-8">
                No activity yet today
              </p>
            ) : (
              recentActivity.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                    {entry.employee?.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {entry.employee?.name}
                    </p>
                    <p className="text-[11px] text-muted">
                      {entry.clockIn} - {entry.clockOut || "Active"}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      entry.clockOut === null
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {entry.clockOut === null ? "Active" : `${entry.totalHours}h`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
