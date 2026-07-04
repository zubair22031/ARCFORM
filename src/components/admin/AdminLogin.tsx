"use client";

import { useState } from "react";

interface AdminLoginProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        onLogin(data.user);
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-arch-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display text-white mb-2">ARCFORM</h1>
          <p className="text-gray-500 text-sm tracking-wider uppercase">
            Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-arch-gray text-white border border-gray-700 focus:border-arch-accent focus:outline-none transition-colors"
              placeholder="admin@arcform.studio"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-arch-gray text-white border border-gray-700 focus:border-arch-accent focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 border border-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-arch-accent text-white font-medium tracking-wide hover:bg-arch-accent-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-600 text-xs mt-4">
            Default: admin@arcform.studio / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
