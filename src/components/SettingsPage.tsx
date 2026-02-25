"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Camera,
  Building2,
  Clock,
  Calendar,
} from "lucide-react";

export default function SettingsPage() {
  const { currentUser, updateEmployee } = useAppStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    clockReminders: true,
    approvalNotifs: true,
    weeklyDigest: false,
    overtimeAlerts: true,
  });

  const [preferences, setPreferences] = useState({
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    weekStart: "sunday",
    defaultBreak: 30,
    autoClockOut: 18,
  });

  const handleSaveProfile = () => {
    if (currentUser) {
      updateEmployee(currentUser.id, { name, email });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveNotifications = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "preferences", label: "Preferences", icon: Palette },
    { key: "company", label: "Company", icon: Building2 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Tab navigation */}
      <div className="bg-card rounded-xl border border-border p-1 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              activeTab === tab.key
                ? "bg-primary text-white shadow-sm"
                : "text-muted hover:bg-gray-50 hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Success toast */}
      {saved && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium animate-fade-in z-50 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Settings saved successfully
        </div>
      )}

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Profile Settings
            </h3>
            <p className="text-sm text-muted mt-1">
              Manage your personal information
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl font-bold text-white">
                {currentUser?.avatar}
              </div>
              <div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-gray-100 transition-colors">
                  <Camera className="w-4 h-4" />
                  Change photo
                </button>
                <p className="text-xs text-muted mt-1.5">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={currentUser?.department || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-sm text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Role
                </label>
                <input
                  type="text"
                  value={currentUser?.role || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-sm text-muted capitalize"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20"
              >
                <Save className="w-4 h-4" />
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === "notifications" && (
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Notification Preferences
            </h3>
            <p className="text-sm text-muted mt-1">
              Control how and when you receive notifications
            </p>
          </div>

          <div className="p-6 space-y-5">
            {[
              {
                key: "emailAlerts" as const,
                label: "Email Alerts",
                desc: "Receive important updates via email",
              },
              {
                key: "clockReminders" as const,
                label: "Clock Reminders",
                desc: "Get reminded to clock in/out",
              },
              {
                key: "approvalNotifs" as const,
                label: "Approval Notifications",
                desc: "Notified when timesheets are approved or rejected",
              },
              {
                key: "weeklyDigest" as const,
                label: "Weekly Digest",
                desc: "Receive a weekly summary of your hours",
              },
              {
                key: "overtimeAlerts" as const,
                label: "Overtime Alerts",
                desc: "Alert when approaching overtime threshold",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    notifications[item.key] ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 bg-white rounded-full absolute top-[3px] transition-transform shadow-sm ${
                      notifications[item.key]
                        ? "translate-x-[22px]"
                        : "translate-x-[3px]"
                    }`}
                    style={{ width: "18px", height: "18px" }}
                  />
                </button>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveNotifications}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20"
              >
                <Save className="w-4 h-4" />
                Save Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences tab */}
      {activeTab === "preferences" && (
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Work Preferences
            </h3>
            <p className="text-sm text-muted mt-1">
              Configure time tracking behavior
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <Globe className="w-3.5 h-3.5 inline mr-1.5" />
                  Timezone
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(e) =>
                    setPreferences((p) => ({ ...p, timezone: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm"
                >
                  <option value="America/New_York">
                    Eastern Time (ET)
                  </option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">
                    Pacific Time (PT)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                  Date Format
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) =>
                    setPreferences((p) => ({
                      ...p,
                      dateFormat: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <Clock className="w-3.5 h-3.5 inline mr-1.5" />
                  Time Format
                </label>
                <select
                  value={preferences.timeFormat}
                  onChange={(e) =>
                    setPreferences((p) => ({
                      ...p,
                      timeFormat: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm"
                >
                  <option value="12h">12 Hour (AM/PM)</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Week Starts On
                </label>
                <select
                  value={preferences.weekStart}
                  onChange={(e) =>
                    setPreferences((p) => ({
                      ...p,
                      weekStart: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm"
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Default Break (minutes)
                </label>
                <input
                  type="number"
                  value={preferences.defaultBreak}
                  onChange={(e) =>
                    setPreferences((p) => ({
                      ...p,
                      defaultBreak: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  min="0"
                  max="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Auto Clock-Out (hour)
                </label>
                <input
                  type="number"
                  value={preferences.autoClockOut}
                  onChange={(e) =>
                    setPreferences((p) => ({
                      ...p,
                      autoClockOut: Number(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  min="12"
                  max="23"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSavePreferences}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-violet-700 transition-all shadow-lg shadow-purple-500/20"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Company tab */}
      {activeTab === "company" && (
        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              Company Information
            </h3>
            <p className="text-sm text-muted mt-1">
              Lavitta Marketing Management details
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value="Lavitta Marketing Management"
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-sm text-muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Industry
                </label>
                <input
                  type="text"
                  value="Marketing & Advertising"
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50 text-sm text-muted"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Overtime Threshold (hours/week)
                </label>
                <input
                  type="number"
                  defaultValue={40}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Pay Period
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm">
                  <option>Bi-Weekly</option>
                  <option>Weekly</option>
                  <option>Semi-Monthly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
