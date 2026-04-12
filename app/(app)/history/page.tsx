"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { CaseList } from "@/components/cases/CaseList";
import { Case } from "@/lib/types";

export default function HistoryPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchCases() {
      try {
        const res = await fetch(`/api/cases?user_id=${user!.id}`);
        if (res.ok) {
          const data = await res.json();
          setCases(data);
        }
      } catch (err) {
        console.error("Failed to fetch cases:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCases();
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-bold text-white mb-6">Case History</h1>
      <CaseList cases={cases} loading={loading} />
    </div>
  );
}
