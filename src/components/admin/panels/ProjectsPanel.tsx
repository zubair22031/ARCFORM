"use client";

import { useState, useEffect, useCallback } from "react";

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  client: string | null;
  location: string | null;
  year: string | null;
  published: boolean;
  sortOrder: number;
}

const emptyProject: Omit<Project, "id" | "slug"> = {
  title: "",
  description: "",
  category: "Architecture",
  imageUrl: "",
  client: "",
  location: "",
  year: "",
  published: false,
  sortOrder: 0,
};

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects?all=true");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);

    if (editing.id) {
      await fetch(`/api/projects/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    }

    setSaving(false);
    setEditing(null);
    fetchProjects();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  }

  async function togglePublish(proj: Project) {
    await fetch(`/api/projects/${proj.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !proj.published }),
    });
    fetchProjects();
  }

  if (loading) return <div className="text-gray-400">Loading projects...</div>;

  if (editing) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6">
            {editing.id ? "Edit Project" : "New Project"}
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editing.title || ""}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={editing.description || ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={editing.category || ""}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="text"
                  value={editing.year || ""}
                  onChange={(e) => setEditing({ ...editing, year: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <input
                  type="text"
                  value={editing.client || ""}
                  onChange={(e) => setEditing({ ...editing, client: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editing.location || ""}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={editing.imageUrl || ""}
                onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
              />
              {editing.imageUrl && (
                <img src={editing.imageUrl} alt="" className="mt-2 h-32 object-cover rounded" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <input
                type="number"
                value={editing.sortOrder ?? 0}
                onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.published ?? false}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="rounded"
                id="published"
              />
              <label htmlFor="published" className="text-sm text-gray-700">Published</label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-arch-accent text-white font-medium rounded hover:bg-arch-accent-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
            <button
              onClick={() => setEditing(null)}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setEditing({ ...emptyProject })}
          className="px-5 py-2.5 bg-arch-accent text-white text-sm font-medium rounded hover:bg-arch-accent-dark transition-colors"
        >
          + Add Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4"
          >
            {proj.imageUrl && (
              <img
                src={proj.imageUrl}
                alt={proj.title}
                className="w-20 h-14 object-cover rounded flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{proj.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    proj.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {proj.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {proj.category} · {proj.location} · {proj.year}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => togglePublish(proj)}
                className="px-3 py-1.5 text-xs border rounded hover:bg-gray-50 transition-colors"
              >
                {proj.published ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => setEditing(proj)}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(proj.id)}
                className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
