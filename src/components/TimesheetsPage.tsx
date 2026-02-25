"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { formatDate, formatHours } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

export default function TimesheetsPage() {
  const { timeEntries, employees, updateTimeEntry, currentUser } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterEmployee, setFilterEmployee] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "manager";

  const filteredEntries = useMemo(() => {
    return timeEntries
      .filter((entry) => {
        if (!isAdmin && entry.employeeId !== currentUser?.id) return false;
        if (filterStatus !== "all" && entry.status !== filterStatus) return false;
        if (filterEmployee !== "all" && entry.employeeId !== filterEmployee)
          return false;

        if (searchQuery) {
          const emp = employees.find((e) => e.id === entry.employeeId);
          const query = searchQuery.toLowerCase();
          return (
            emp?.name.toLowerCase().includes(query) ||
            entry.project.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [timeEntries, filterStatus, filterEmployee, searchQuery, isAdmin, currentUser, employees]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusCounts = useMemo(() => {
    const entries = isAdmin
      ? timeEntries
      : timeEntries.filter((e) => e.employeeId === currentUser?.id);
    return {
      all: entries.length,
      pending: entries.filter((e) => e.status === "pending").length,
      approved: entries.filter((e) => e.status === "approved").length,
      rejected: entries.filter((e) => e.status === "rejected").length,
    };
  }, [timeEntries, isAdmin, currentUser]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "All Entries",
            count: statusCounts.all,
            key: "all",
            color: "bg-gray-100 text-gray-700",
          },
          {
            label: "Pending",
            count: statusCounts.pending,
            key: "pending",
            color: "bg-amber-100 text-amber-700",
          },
          {
            label: "Approved",
            count: statusCounts.approved,
            key: "approved",
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Rejected",
            count: statusCounts.rejected,
            key: "rejected",
            color: "bg-red-100 text-red-700",
          },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setFilterStatus(item.key);
              setCurrentPage(1);
            }}
            className={`p-4 rounded-xl border transition-all ${
              filterStatus === item.key
                ? "border-primary bg-purple-50 shadow-sm"
                : "border-border bg-card hover:border-gray-300"
            }`}
          >
            <p className="text-2xl font-bold text-foreground">{item.count}</p>
            <p className="text-xs text-muted mt-1">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-border flex-1">
          <Search className="w-4 h-4 text-muted mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by name or project..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent text-sm outline-none w-full text-foreground placeholder-muted"
          />
        </div>

        {isAdmin && (
          <select
            value={filterEmployee}
            onChange={(e) => {
              setFilterEmployee(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground"
          >
            <option value="all">All Employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        )}

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-border text-sm text-muted hover:bg-gray-100 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gray-50/50">
                {isAdmin && (
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                    Employee
                  </th>
                )}
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                  Clock In
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                  Clock Out
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                  Break
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                  Total
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                  Project
                </th>
                <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                  Status
                </th>
                {isAdmin && (
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wide px-5 py-3">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedEntries.map((entry) => {
                const emp = employees.find((e) => e.id === entry.employeeId);
                return (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {isAdmin && (
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-[10px] font-bold text-white">
                            {emp?.avatar}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {emp?.name}
                          </span>
                        </div>
                      </td>
                    )}
                    <td className="px-5 py-3 text-sm text-foreground">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground font-mono">
                      {entry.clockIn}
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground font-mono">
                      {entry.clockOut || (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted">
                      {entry.breakMinutes}m
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground">
                      {entry.totalHours != null
                        ? formatHours(entry.totalHours)
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-muted max-w-[150px] truncate">
                      {entry.project}
                    </td>
                    <td className="px-5 py-3">{getStatusBadge(entry.status)}</td>
                    {isAdmin && (
                      <td className="px-5 py-3">
                        {entry.status === "pending" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateTimeEntry(entry.id, {
                                  status: "approved",
                                })
                              }
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateTimeEntry(entry.id, {
                                  status: "rejected",
                                })
                              }
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
              {paginatedEntries.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 9 : 7}
                    className="text-center py-12 text-muted text-sm"
                  >
                    No timesheet entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-gray-50/50">
            <p className="text-sm text-muted">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredEntries.length)} of{" "}
              {filteredEntries.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200 text-foreground"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
