"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/store";
import { formatHours } from "@/lib/utils";
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
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Calendar,
  Download,
} from "lucide-react";

export default function ReportsPage() {
  const { employees, timeEntries } = useAppStore();
  const [dateRange, setDateRange] = useState("30");

  const rangeDays = parseInt(dateRange);

  const dateSet = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      set.add(d.toISOString().split("T")[0]);
    }
    return set;
  }, [rangeDays]);

  const rangeEntries = useMemo(
    () => timeEntries.filter((e) => dateSet.has(e.date)),
    [timeEntries, dateSet]
  );

  const totalHours = useMemo(
    () =>
      Math.round(
        rangeEntries.reduce((sum, e) => sum + (e.totalHours || 0), 0) * 10
      ) / 10,
    [rangeEntries]
  );

  const totalCost = useMemo(() => {
    return rangeEntries.reduce((sum, entry) => {
      const emp = employees.find((e) => e.id === entry.employeeId);
      return sum + (entry.totalHours || 0) * (emp?.hourlyRate || 0);
    }, 0);
  }, [rangeEntries, employees]);

  const avgDailyHours = useMemo(
    () => Math.round((totalHours / Math.max(rangeDays, 1)) * 10) / 10,
    [totalHours, rangeDays]
  );

  const uniqueWorkers = useMemo(
    () => new Set(rangeEntries.map((e) => e.employeeId)).size,
    [rangeEntries]
  );

  // Employee ranking
  const employeeRanking = useMemo(() => {
    const hours: Record<string, number> = {};
    rangeEntries.forEach((e) => {
      hours[e.employeeId] = (hours[e.employeeId] || 0) + (e.totalHours || 0);
    });
    return Object.entries(hours)
      .map(([id, h]) => ({
        employee: employees.find((e) => e.id === id),
        hours: Math.round(h * 10) / 10,
      }))
      .filter((r) => r.employee)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 8);
  }, [rangeEntries, employees]);

  // Project breakdown
  const projectData = useMemo(() => {
    const hours: Record<string, number> = {};
    rangeEntries.forEach((e) => {
      hours[e.project] = (hours[e.project] || 0) + (e.totalHours || 0);
    });
    const colors = [
      "#7c3aed",
      "#3b82f6",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#ec4899",
      "#8b5cf6",
      "#06b6d4",
      "#84cc16",
      "#f97316",
    ];
    return Object.entries(hours)
      .map(([name, value], i) => ({
        name,
        value: Math.round(value * 10) / 10,
        color: colors[i % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [rangeEntries]);

  // Daily trend
  const dailyTrend = useMemo(() => {
    const data = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayEntries = rangeEntries.filter((e) => e.date === dateStr);
      const hours = dayEntries.reduce(
        (sum, e) => sum + (e.totalHours || 0),
        0
      );
      const headcount = new Set(dayEntries.map((e) => e.employeeId)).size;
      data.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        hours: Math.round(hours * 10) / 10,
        headcount,
      });
    }
    return data;
  }, [rangeEntries, rangeDays]);

  // Department hours
  const deptHoursData = useMemo(() => {
    const hours: Record<string, number> = {};
    rangeEntries.forEach((entry) => {
      const emp = employees.find((e) => e.id === entry.employeeId);
      if (emp) {
        hours[emp.department] =
          (hours[emp.department] || 0) + (entry.totalHours || 0);
      }
    });
    return Object.entries(hours)
      .map(([dept, h]) => ({
        department: dept,
        hours: Math.round(h * 10) / 10,
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [rangeEntries, employees]);

  // Cost by department
  const deptCostData = useMemo(() => {
    const costs: Record<string, number> = {};
    rangeEntries.forEach((entry) => {
      const emp = employees.find((e) => e.id === entry.employeeId);
      if (emp) {
        costs[emp.department] =
          (costs[emp.department] || 0) +
          (entry.totalHours || 0) * emp.hourlyRate;
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
    return Object.entries(costs)
      .map(([name, value], i) => ({
        name,
        value: Math.round(value),
        color: colors[i % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [rangeEntries, employees]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {["7", "14", "30", "90"].map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                dateRange === range
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-card border border-border text-foreground hover:bg-gray-50"
              }`}
            >
              {range}d
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Hours",
            value: formatHours(totalHours),
            icon: Clock,
            color: "bg-purple-100 text-purple-600",
          },
          {
            label: "Labor Cost",
            value: `$${totalCost.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Avg Daily Hours",
            value: formatHours(avgDailyHours),
            icon: TrendingUp,
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Active Workers",
            value: uniqueWorkers.toString(),
            icon: Users,
            color: "bg-amber-100 text-amber-600",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-card rounded-xl border border-border p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}
              >
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted">{card.label}</p>
                <p className="text-xl font-bold text-foreground">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily hours trend */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Daily Hours & Headcount
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                interval={Math.floor(rangeDays / 8)}
              />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#7c3aed"
                fill="#7c3aed"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="headcount"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Project breakdown */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Hours by Project
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={projectData.slice(0, 6)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
              >
                {projectData.slice(0, 6).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
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
            {projectData.slice(0, 5).map((proj) => (
              <div
                key={proj.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: proj.color }}
                  />
                  <span className="text-muted truncate max-w-[160px]">
                    {proj.name}
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {formatHours(proj.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Department hours */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Department Hours
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={deptHoursData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <YAxis
                type="category"
                dataKey="department"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                width={110}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="hours" fill="#7c3aed" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost by department */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Labor Cost by Department
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deptCostData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
              >
                {deptCostData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
                formatter={(value) => `$${Number(value).toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {deptCostData.slice(0, 5).map((dept) => (
              <div
                key={dept.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-muted truncate max-w-[160px]">
                    {dept.name}
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  ${dept.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Employee ranking */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h4 className="font-semibold text-foreground mb-4">
          Top Employees by Hours
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {employeeRanking.map((item, i) => (
            <div
              key={item.employee!.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-border"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs">
                #{i + 1}
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
                {item.employee!.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.employee!.name}
                </p>
                <p className="text-xs text-muted">{formatHours(item.hours)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
