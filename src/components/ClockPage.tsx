"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { getElapsedTime } from "@/lib/utils";
import { projects } from "@/lib/data";
import {
  Play,
  Square,
  Coffee,
  PlayCircle,
  Clock,
  Calendar,
  Timer,
} from "lucide-react";

export default function ClockPage() {
  const { clockSession, clockIn, clockOut, toggleBreak, currentUser, timeEntries } =
    useAppStore();
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [elapsed, setElapsed] = useState("00:00:00");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (clockSession && !clockSession.isOnBreak) {
        setElapsed(
          getElapsedTime(clockSession.clockInTime, clockSession.totalBreakMinutes)
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [clockSession]);

  const today = new Date().toISOString().split("T")[0];
  const todayEntries = timeEntries.filter(
    (e) => e.employeeId === currentUser?.id && e.date === today && e.clockOut !== null
  );
  const todayTotal = todayEntries.reduce(
    (sum, e) => sum + (e.totalHours || 0),
    0
  );

  const weekEntries = timeEntries.filter((e) => {
    if (e.employeeId !== currentUser?.id) return false;
    const entryDate = new Date(e.date + "T00:00:00");
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return entryDate >= weekAgo;
  });
  const weekTotal = weekEntries.reduce(
    (sum, e) => sum + (e.totalHours || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Main clock card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Status bar */}
        <div
          className={`h-1.5 transition-colors ${
            clockSession
              ? clockSession.isOnBreak
                ? "bg-amber-400"
                : "bg-green-400"
              : "bg-gray-200"
          }`}
        />

        <div className="p-8 text-center">
          {/* Current time */}
          <p className="text-sm text-muted mb-2">Current Time</p>
          <p className="text-5xl font-mono font-bold text-foreground tracking-tight">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-sm text-muted mt-2">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          {/* Session timer */}
          {clockSession && (
            <div className="mt-8 animate-fade-in">
              <p className="text-sm text-muted mb-1">
                {clockSession.isOnBreak ? "On Break" : "Working Time"}
              </p>
              <p className="text-6xl font-mono font-bold text-primary tracking-tighter">
                {elapsed}
              </p>
              <p className="text-sm text-muted mt-2">
                Project: <span className="font-medium text-foreground">{clockSession.project}</span>
              </p>
              {clockSession.totalBreakMinutes > 0 && (
                <p className="text-xs text-muted mt-1">
                  Break time: {clockSession.totalBreakMinutes} min
                </p>
              )}
            </div>
          )}

          {/* Project selection */}
          {!clockSession && (
            <div className="mt-8 max-w-sm mx-auto">
              <label className="block text-sm font-medium text-foreground mb-2 text-left">
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              >
                {projects.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {!clockSession ? (
              <button
                onClick={() => clockIn(selectedProject)}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 active:scale-100"
              >
                <Play className="w-6 h-6" />
                Clock In
              </button>
            ) : (
              <>
                <button
                  onClick={toggleBreak}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    clockSession.isOnBreak
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  {clockSession.isOnBreak ? (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      Resume Work
                    </>
                  ) : (
                    <>
                      <Coffee className="w-5 h-5" />
                      Take Break
                    </>
                  )}
                </button>
                <button
                  onClick={clockOut}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-rose-600 transition-all shadow-lg shadow-red-500/25"
                >
                  <Square className="w-5 h-5" />
                  Clock Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Today&apos;s Total</p>
              <p className="text-lg font-bold text-foreground">
                {Math.round(todayTotal * 10) / 10}h
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted">This Week</p>
              <p className="text-lg font-bold text-foreground">
                {Math.round(weekTotal * 10) / 10}h
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted">Status</p>
              <p className="text-lg font-bold text-foreground">
                {clockSession
                  ? clockSession.isOnBreak
                    ? "On Break"
                    : "Working"
                  : "Off Clock"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's log */}
      {todayEntries.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-5">
          <h4 className="font-semibold text-foreground mb-4">
            Today&apos;s Completed Sessions
          </h4>
          <div className="space-y-2">
            {todayEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {entry.project}
                  </p>
                  <p className="text-xs text-muted">
                    {entry.clockIn} - {entry.clockOut}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {entry.totalHours}h
                  </p>
                  <p className="text-xs text-muted">
                    {entry.breakMinutes}m break
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
