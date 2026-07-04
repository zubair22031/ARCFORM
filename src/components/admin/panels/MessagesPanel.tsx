"use client";

import { useState, useEffect } from "react";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-400">Loading messages...</div>;

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Messages Yet</h3>
        <p className="text-gray-500 text-sm">
          Contact form submissions will appear here.
        </p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="max-w-3xl">
        <button
          onClick={() => setSelected(null)}
          className="mb-4 text-sm text-arch-accent hover:text-arch-accent-dark flex items-center gap-1"
        >
          ← Back to messages
        </button>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">{selected.name}</h3>
              <p className="text-sm text-gray-500">{selected.email}</p>
              {selected.phone && (
                <p className="text-sm text-gray-500">{selected.phone}</p>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(selected.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {selected.subject && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-700">Subject:</span>{" "}
              <span className="text-sm text-gray-600">{selected.subject}</span>
            </div>
          )}
          <div className="bg-gray-50 rounded p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {selected.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {messages.map((msg) => (
        <button
          key={msg.id}
          onClick={() => setSelected(msg)}
          className="bg-white rounded-lg shadow-sm border p-4 text-left hover:border-arch-accent transition-colors w-full"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm">{msg.name}</h3>
                {!msg.read && (
                  <span className="w-2 h-2 rounded-full bg-arch-accent flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500">{msg.email}</p>
              {msg.subject && (
                <p className="text-sm text-gray-700 mt-1">{msg.subject}</p>
              )}
              <p className="text-xs text-gray-400 mt-1 truncate">{msg.message}</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
              {new Date(msg.createdAt).toLocaleDateString()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
