"use client";

import { useState, useEffect, useCallback } from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  published: boolean;
}

const iconOptions = ["building", "palette", "cube", "map", "leaf", "clipboard"];

export default function ServicesPanel() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await fetch("/api/services?all=true");
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
      await fetch(`/api/services/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
    } else {
      await fetch("/api/services", {
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
    if (!confirm("Delete this service?")) return;
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    fetchItems();
  }

  if (loading) return <div className="text-gray-400">Loading services...</div>;

  if (editing) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-6">
            {editing.id ? "Edit Service" : "New Service"}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <select
                  value={editing.icon || "building"}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none text-sm"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon.charAt(0).toUpperCase() + icon.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
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
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.published ?? true}
                onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                className="rounded"
                id="svc-published"
              />
              <label htmlFor="svc-published" className="text-sm text-gray-700">Published</label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-arch-accent text-white font-medium rounded hover:bg-arch-accent-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Service"}
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
              title: "",
              description: "",
              icon: "building",
              sortOrder: 0,
              published: true,
            })
          }
          className="px-5 py-2.5 bg-arch-accent text-white text-sm font-medium rounded hover:bg-arch-accent-dark transition-colors"
        >
          + Add Service
        </button>
      </div>

      <div className="grid gap-4">
        {items.map((svc) => (
          <div
            key={svc.id}
            className="bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-arch-cream rounded flex items-center justify-center text-lg flex-shrink-0">
              {svc.icon === "building" && "🏛️"}
              {svc.icon === "palette" && "🎨"}
              {svc.icon === "cube" && "📦"}
              {svc.icon === "map" && "🗺️"}
              {svc.icon === "leaf" && "🌿"}
              {svc.icon === "clipboard" && "📋"}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium">{svc.title}</h3>
              <p className="text-sm text-gray-500 truncate">{svc.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setEditing(svc)}
                className="px-3 py-1.5 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(svc.id)}
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
