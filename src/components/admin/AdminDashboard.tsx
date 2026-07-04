"use client";

import { useState } from "react";
import SettingsPanel from "./panels/SettingsPanel";
import ProjectsPanel from "./panels/ProjectsPanel";
import ServicesPanel from "./panels/ServicesPanel";
import TeamPanel from "./panels/TeamPanel";
import MessagesPanel from "./panels/MessagesPanel";

interface Props {
  user: { name: string; email: string };
  onLogout: () => void;
}

const tabs = [
  { key: "settings", label: "Site Settings", icon: "⚙️" },
  { key: "projects", label: "Projects", icon: "🏗️" },
  { key: "services", label: "Services", icon: "📐" },
  { key: "team", label: "Team", icon: "👥" },
  { key: "messages", label: "Messages", icon: "✉️" },
];

export default function AdminDashboard({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-arch-black text-white transform transition-transform md:translate-x-0 md:static md:flex md:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-800">
          <a href="/" className="text-xl font-display tracking-wider text-arch-accent">
            ARCFORM
          </a>
          <p className="text-gray-500 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-6 py-3 flex items-center gap-3 text-sm transition-colors ${
                activeTab === tab.key
                  ? "bg-arch-gray text-arch-accent border-l-2 border-arch-accent"
                  : "text-gray-400 hover:text-white hover:bg-arch-gray/50"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800">
          <div className="text-sm text-gray-400 mb-3">
            Signed in as <span className="text-white">{user.name}</span>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              className="flex-1 py-2 text-center text-xs bg-arch-gray text-gray-300 hover:text-white transition-colors"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 text-center text-xs bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-arch-black">
            {tabs.find((t) => t.key === activeTab)?.label}
          </h1>
          <div />
        </header>

        {/* Panel content */}
        <div className="p-6">
          {activeTab === "settings" && <SettingsPanel />}
          {activeTab === "projects" && <ProjectsPanel />}
          {activeTab === "services" && <ServicesPanel />}
          {activeTab === "team" && <TeamPanel />}
          {activeTab === "messages" && <MessagesPanel />}
        </div>
      </main>
    </div>
  );
}
