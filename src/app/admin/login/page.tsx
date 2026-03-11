"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-950 border border-gray-800 rounded-lg p-8"
      >
        <div className="flex justify-center mb-8">
          <Image
            src="https://cdn.prod.website-files.com/68bb521cef57ca737a668ec0/68bb524747c79869428f76b1_invictus_logo_extra_bold.svg"
            alt="Invictus"
            width={180}
            height={48}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm focus:outline-none focus:border-white mb-4 text-white placeholder-gray-600"
        />

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2 bg-white hover:bg-gray-200 disabled:opacity-30 rounded text-sm font-medium transition-colors text-black"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
