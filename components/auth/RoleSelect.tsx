"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserRole } from "@/lib/types";

export function RoleSelect() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    if (!selected) return;
    if (!user) {
      toast.error("Not logged in. Please sign in first.");
      router.push("/login");
      return;
    }
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ role: selected })
      .eq("id", user.id);

    if (error) {
      console.error("Role update error:", error);
      toast.error("Failed to save role. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">What describes you best?</h1>
        <p className="text-gray-400 mt-2">This helps us customize your experience</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setSelected("practitioner")}
          className={`w-full p-4 rounded-lg border text-left transition ${
            selected === "practitioner"
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 bg-gray-900 hover:border-gray-500"
          }`}
        >
          <div className="font-medium text-white">⚡ Practicing Radiologist</div>
          <div className="text-gray-400 text-sm mt-1">
            I read images professionally and want a second pair of eyes
          </div>
        </button>

        <button
          onClick={() => setSelected("student")}
          className={`w-full p-4 rounded-lg border text-left transition ${
            selected === "student"
              ? "border-purple-500 bg-purple-500/10"
              : "border-gray-700 bg-gray-900 hover:border-gray-500"
          }`}
        >
          <div className="font-medium text-white">📚 Resident / Student</div>
          <div className="text-gray-400 text-sm mt-1">
            I&apos;m learning to read images and want AI tutoring
          </div>
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selected || loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
