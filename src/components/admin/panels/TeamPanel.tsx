"use client";

import { useState, useEffect, useCallback } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string | null;
  sortOrder: number;
  published: boolean;
}

export default function TeamPanel() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/team?all=true");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);

    if (editing.id) {
      await fetch(`/api/team/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    }

    setSaving(false);
    setEditing(null);
    fetchItems();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this team member?")) return;
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    fetchItems();
  }

  if (loading) return <div className="text-gray-400">Loading team...</div>;

  if (editing) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6">
            {editing.id ? "Edit Team Member" : "New Team Member"}
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={editing.role || ""}
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={editing.bio || ""}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (optional)</label>
              <input
                type="url"
                value={editing.imageUrl || ""}
                onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <input
                  type="number"
                  value={editing.sortOrder ?? 0}
                  onChange={(e) =>
                    setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                />
              </div>
              <div className="flex items-end pb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.published ?? true}
                    onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                    className="rounded"
                    id="team-published"
                  />
                  <label htmlFor="team-published" className="text-sm text-gray-700">Published</label>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-arch-accent text-white font-medium rounded hover:bg-arch-accent-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Member"}
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
          onClick={() =>
            setEditing({
              name: "",
              role: "",
              bio: "",
              imageUrl: "",
              sortOrder: 0,
              published: true,
            })
          }
          className="px-5 py-2.5 bg-arch-accent text-white text-sm font-medium rounded hover:bg-arch-accent-dark transition-colors"
        >
          + Add Team Member
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-arch-cream rounded-full flex items-center justify-center text-lg font-display text-arch-accent flex-shrink-0">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{member.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    member.published
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {member.published ? "Published" : "Hidden"}
                </span>
              </div>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setEditing(member)}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
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
