"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { departments } from "@/lib/data";
import { generateId, formatHours } from "@/lib/utils";
import { Employee } from "@/lib/types";
import {
  Search,
  Plus,
  X,
  UserCheck,
  UserX,
  Mail,
  Building2,
  DollarSign,
  Calendar,
  Edit3,
} from "lucide-react";

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, timeEntries, currentUser } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const isAdmin = currentUser?.role === "admin";

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (filterDept !== "all" && emp.department !== filterDept) return false;
      if (filterStatus !== "all" && emp.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [employees, searchQuery, filterDept, filterStatus]);

  const employeeStats = useMemo(() => {
    const stats: Record<string, { totalHours: number; daysWorked: number }> = {};
    const last30 = new Set<string>();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30.add(d.toISOString().split("T")[0]);
    }

    timeEntries
      .filter((e) => last30.has(e.date))
      .forEach((entry) => {
        if (!stats[entry.employeeId]) {
          stats[entry.employeeId] = { totalHours: 0, daysWorked: 0 };
        }
        stats[entry.employeeId].totalHours += entry.totalHours || 0;
        stats[entry.employeeId].daysWorked += 1;
      });

    return stats;
  }, [timeEntries]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">
            {employees.filter((e) => e.status === "active").length} active,{" "}
            {employees.filter((e) => e.status === "inactive").length} inactive
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-border flex-1">
          <Search className="w-4 h-4 text-muted mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm outline-none w-full text-foreground placeholder-muted"
          />
        </div>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Employee grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const stats = employeeStats[emp.id] || {
            totalHours: 0,
            daysWorked: 0,
          };
          return (
            <div
              key={emp.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm font-bold text-white">
                    {emp.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{emp.name}</h4>
                    <p className="text-xs text-muted capitalize">{emp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${emp.status === "active" ? "bg-green-400" : "bg-gray-300"}`}
                  />
                  <span className="text-[11px] text-muted capitalize">
                    {emp.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{emp.department}</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>${emp.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined {new Date(emp.joinDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">Last 30 days</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatHours(stats.totalHours)} · {stats.daysWorked} days
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => setEditingEmployee(emp)}
                    className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4 text-muted" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-16 text-muted">
          <UserX className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No employees found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingEmployee) && (
        <EmployeeModal
          employee={editingEmployee}
          onClose={() => {
            setShowAddModal(false);
            setEditingEmployee(null);
          }}
          onSave={(emp) => {
            if (editingEmployee) {
              updateEmployee(editingEmployee.id, emp);
            } else {
              addEmployee({
                ...emp,
                id: generateId(),
              } as Employee);
            }
            setShowAddModal(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
}

function EmployeeModal({
  employee,
  onClose,
  onSave,
}: {
  employee: Employee | null;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
}) {
  const [name, setName] = useState(employee?.name || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [role, setRole] = useState<Employee["role"]>(employee?.role || "employee");
  const [department, setDepartment] = useState(employee?.department || departments[0]);
  const [hourlyRate, setHourlyRate] = useState(employee?.hourlyRate || 45);
  const [status, setStatus] = useState<Employee["status"]>(employee?.status || "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      email,
      role,
      department,
      hourlyRate,
      status,
      avatar: name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      joinDate: employee?.joinDate || new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {employee ? "Edit Employee" : "Add Employee"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Employee["role"])}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Hourly Rate ($)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as Employee["status"])
                }
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20"
            >
              {employee ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
