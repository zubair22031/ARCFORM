"use client";

import { useState, useEffect } from "react";

const settingsFields = [
  { key: "site_name", label: "Site Name", type: "text" },
  { key: "site_tagline", label: "Tagline", type: "text" },
  { key: "hero_title", label: "Hero Title", type: "textarea" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "textarea" },
  { key: "about_title", label: "About Title", type: "text" },
  { key: "about_text", label: "About Text", type: "textarea" },
  { key: "about_stat_1_number", label: "Stat 1 Number", type: "text" },
  { key: "about_stat_1_label", label: "Stat 1 Label", type: "text" },
  { key: "about_stat_2_number", label: "Stat 2 Number", type: "text" },
  { key: "about_stat_2_label", label: "Stat 2 Label", type: "text" },
  { key: "about_stat_3_number", label: "Stat 3 Number", type: "text" },
  { key: "about_stat_3_label", label: "Stat 3 Label", type: "text" },
  { key: "contact_email", label: "Contact Email", type: "text" },
  { key: "contact_phone", label: "Contact Phone", type: "text" },
  { key: "contact_address", label: "Contact Address", type: "textarea" },
  { key: "footer_text", label: "Footer Text", type: "text" },
];

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return <div className="text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-6">
          {settingsFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={settings[field.key] || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none transition-colors text-sm resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={settings[field.key] || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, [field.key]: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded focus:border-arch-accent focus:outline-none transition-colors text-sm"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-arch-accent text-white font-medium rounded hover:bg-arch-accent-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saved && (
            <span className="text-green-600 text-sm">✓ Settings saved successfully!</span>
          )}
        </div>
      </div>
    </div>
  );
}
