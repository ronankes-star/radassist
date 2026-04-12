"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile, signOut } = useAuth();

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen bg-gray-950">
        <nav className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-blue-400 font-bold text-base"
            >
              ⚡ RadAssist
            </Link>
            <Link
              href="/history"
              className="text-gray-400 hover:text-gray-200 text-sm"
            >
              Case History
            </Link>
            <Link
              href="/progress"
              className="text-gray-400 hover:text-gray-200 text-sm"
            >
              Progress
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs">
              {profile?.display_name || "User"}
            </span>
            <button
              onClick={signOut}
              className="text-gray-500 hover:text-gray-300 text-xs"
            >
              Sign Out
            </button>
          </div>
        </nav>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </AuthGuard>
  );
}
