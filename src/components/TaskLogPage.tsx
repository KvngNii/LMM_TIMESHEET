"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { TaskCategory } from "@/lib/types";
import { projects, taskCategories } from "@/lib/data";
import { generateId, formatDate } from "@/lib/utils";
import {
  Plus,
  Clock,
  CheckCircle2,
  Loader2,
  Trash2,
  Edit3,
  X,
  Filter,
  Search,
  ListTodo,
  Timer,
  FolderOpen,
  Tag,
} from "lucide-react";

export default function TaskLogPage() {
  const {
    currentUser,
    taskLogs,
    addTaskLog,
    updateTaskLog,
    deleteTaskLog,
    employees,
  } = useAppStore();

  const isAdmin =
    currentUser?.role === "admin" || currentUser?.role === "manager";

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [category, setCategory] = useState<TaskCategory>("Design");
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [taskStatus, setTaskStatus] = useState<"completed" | "in-progress">(
    "completed"
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [filterEmployee, setFilterEmployee] = useState("all");
  const [filterDate, setFilterDate] = useState("all");

  // Delete confirmation
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const myLogs = useMemo(() => {
    let logs = isAdmin
      ? taskLogs
      : taskLogs.filter((t) => t.employeeId === currentUser?.id);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      logs = logs.filter(
        (t) =>
          t.taskName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q)
      );
    }

    if (filterCategory !== "all") {
      logs = logs.filter((t) => t.category === filterCategory);
    }

    if (filterProject !== "all") {
      logs = logs.filter((t) => t.project === filterProject);
    }

    if (isAdmin && filterEmployee !== "all") {
      logs = logs.filter((t) => t.employeeId === filterEmployee);
    }

    const today = new Date().toISOString().split("T")[0];
    const now = new Date();

    if (filterDate === "today") {
      logs = logs.filter((t) => t.date === today);
    } else if (filterDate === "week") {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      logs = logs.filter((t) => new Date(t.date + "T00:00:00") >= weekAgo);
    } else if (filterDate === "month") {
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      logs = logs.filter((t) => new Date(t.date + "T00:00:00") >= monthAgo);
    }

    return logs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [
    taskLogs,
    currentUser,
    isAdmin,
    searchQuery,
    filterCategory,
    filterProject,
    filterEmployee,
    filterDate,
  ]);

  // Stats
  const today = new Date().toISOString().split("T")[0];
  const todayLogs = taskLogs.filter(
    (t) => t.employeeId === currentUser?.id && t.date === today
  );
  const todayMinutes = todayLogs.reduce((sum, t) => sum + t.duration, 0);
  const todayCompleted = todayLogs.filter(
    (t) => t.status === "completed"
  ).length;
  const todayInProgress = todayLogs.filter(
    (t) => t.status === "in-progress"
  ).length;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekLogs = taskLogs.filter(
    (t) =>
      t.employeeId === currentUser?.id &&
      new Date(t.date + "T00:00:00") >= weekAgo
  );
  const weekMinutes = weekLogs.reduce((sum, t) => sum + t.duration, 0);

  function resetForm() {
    setTaskName("");
    setDescription("");
    setSelectedProject(projects[0]);
    setCategory("Design");
    setDurationHours(0);
    setDurationMinutes(30);
    setTaskStatus("completed");
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser || !taskName.trim()) return;

    const totalMinutes = durationHours * 60 + durationMinutes;
    if (totalMinutes <= 0) return;

    if (editingId) {
      updateTaskLog(editingId, {
        taskName: taskName.trim(),
        description: description.trim(),
        project: selectedProject,
        category,
        duration: totalMinutes,
        status: taskStatus,
      });
    } else {
      addTaskLog({
        id: generateId(),
        employeeId: currentUser.id,
        date: today,
        taskName: taskName.trim(),
        description: description.trim(),
        project: selectedProject,
        duration: totalMinutes,
        category,
        status: taskStatus,
        createdAt: new Date().toISOString(),
      });
    }

    resetForm();
  }

  function startEdit(taskId: string) {
    const task = taskLogs.find((t) => t.id === taskId);
    if (!task) return;
    setTaskName(task.taskName);
    setDescription(task.description);
    setSelectedProject(task.project);
    setCategory(task.category);
    setDurationHours(Math.floor(task.duration / 60));
    setDurationMinutes(task.duration % 60);
    setTaskStatus(task.status);
    setEditingId(taskId);
    setShowForm(true);
  }

  function confirmDelete(taskId: string) {
    deleteTaskLog(taskId);
    setDeletingId(null);
  }

  function formatDuration(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  }

  function getEmployeeName(empId: string) {
    return employees.find((e) => e.id === empId)?.name || "Unknown";
  }

  const categoryColors: Record<TaskCategory, { bg: string; text: string; dot: string }> = {
    Design: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
    Development: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
    Meeting: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    Research: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-500" },
    "Content Creation": { bg: "bg-pink-50", text: "text-pink-700", dot: "bg-pink-500" },
    "Client Communication": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    Strategy: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-500" },
    Review: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
    Admin: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
    Other: { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Task Log</h2>
          <p className="text-sm text-muted mt-1">
            Log specific tasks and track how long they take
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-medium hover:from-primary-dark hover:to-purple-700 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
        >
          <Plus className="w-4 h-4" />
          Log Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Today&apos;s Time</p>
              <p className="text-lg font-bold text-foreground">
                {formatDuration(todayMinutes)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Completed Today</p>
              <p className="text-lg font-bold text-foreground">
                {todayCompleted}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted">In Progress</p>
              <p className="text-lg font-bold text-foreground">
                {todayInProgress}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted">This Week</p>
              <p className="text-lg font-bold text-foreground">
                {formatDuration(weekMinutes)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Task Form */}
      {showForm && (
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-purple-500/5">
            <h3 className="font-semibold text-foreground">
              {editingId ? "Edit Task" : "Log New Task"}
            </h3>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Task Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="What did you work on?"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details about the task..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                />
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Project
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                >
                  {projects.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                >
                  {taskCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Duration <span className="text-danger">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={durationHours}
                      onChange={(e) =>
                        setDurationHours(
                          Math.max(0, parseInt(e.target.value) || 0)
                        )
                      }
                      className="w-16 px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground text-center focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                    <span className="text-sm text-muted">hrs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={durationMinutes}
                      onChange={(e) =>
                        setDurationMinutes(
                          Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                        )
                      }
                      className="w-16 px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground text-center focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                    <span className="text-sm text-muted">min</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Status
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTaskStatus("completed")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      taskStatus === "completed"
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-border bg-white text-muted hover:bg-gray-50"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskStatus("in-progress")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                      taskStatus === "in-progress"
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-border bg-white text-muted hover:bg-gray-50"
                    }`}
                  >
                    <Loader2 className="w-4 h-4" />
                    In Progress
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl text-sm font-medium hover:from-primary-dark hover:to-purple-700 transition-all shadow-lg shadow-primary/25"
              >
                {editingId ? "Update Task" : "Log Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            />
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm text-muted">
              <Filter className="w-4 h-4" />
            </div>

            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            >
              <option value="all">All Categories</option>
              {taskCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            >
              <option value="all">All Projects</option>
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {isAdmin && (
              <select
                value={filterEmployee}
                onChange={(e) => setFilterEmployee(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              >
                <option value="all">All Employees</option>
                {employees
                  .filter((e) => e.status === "active")
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-primary" />
              Task History
            </h3>
            <span className="text-sm text-muted">
              {myLogs.length} task{myLogs.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {myLogs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <ListTodo className="w-8 h-8 text-purple-300" />
            </div>
            <p className="text-muted font-medium">No tasks found</p>
            <p className="text-sm text-muted mt-1">
              Start logging your tasks to track your productivity
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {myLogs.map((task) => {
              const catColor = categoryColors[task.category];
              const isOwner = task.employeeId === currentUser?.id;

              return (
                <div
                  key={task.id}
                  className="px-6 py-4 hover:bg-gray-50/50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    {/* Category indicator */}
                    <div
                      className={`w-10 h-10 rounded-xl ${catColor.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${catColor.dot}`} />
                    </div>

                    {/* Task details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {task.taskName}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-muted mt-0.5 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Duration badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 rounded-lg flex-shrink-0">
                          <Clock className="w-3.5 h-3.5 text-purple-600" />
                          <span className="text-sm font-semibold text-purple-700">
                            {formatDuration(task.duration)}
                          </span>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${catColor.bg} ${catColor.text}`}
                        >
                          <Tag className="w-3 h-3" />
                          {task.category}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs text-muted">
                          <FolderOpen className="w-3 h-3" />
                          {task.project}
                        </span>

                        <span className="text-xs text-muted">
                          {formatDate(task.date)}
                        </span>

                        {isAdmin && !isOwner && (
                          <span className="text-xs text-muted font-medium">
                            {getEmployeeName(task.employeeId)}
                          </span>
                        )}

                        {task.status === "in-progress" ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-dot" />
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {isOwner && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button
                          onClick={() => startEdit(task.id)}
                          className="p-2 rounded-lg hover:bg-purple-50 text-muted hover:text-primary transition-colors"
                          title="Edit task"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {deletingId === task.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => confirmDelete(task.id)}
                              className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1 rounded-lg bg-gray-50 text-muted text-xs font-medium hover:bg-gray-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(task.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-muted hover:text-danger transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
