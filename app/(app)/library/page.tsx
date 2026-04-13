"use client";

import { useState, useMemo } from "react";
import {
  CASE_LIBRARY,
  getDailyChallenge,
  getRandomCase,
  getCategories,
  getModalities,
  LibraryCase,
} from "@/lib/case-library";
import { useRouter } from "next/navigation";

const difficultyLabels = ["", "Beginner", "Intermediate", "Advanced"];
const difficultyColors = [
  "",
  "text-green-400 bg-green-400/10",
  "text-yellow-400 bg-yellow-400/10",
  "text-red-400 bg-red-400/10",
];

function CaseCard({ caseData, onSelect }: { caseData: LibraryCase; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left hover:border-gray-600 transition group w-full"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-gray-200 font-medium text-sm group-hover:text-white transition">
          {caseData.title}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${difficultyColors[caseData.difficulty]}`}>
          {difficultyLabels[caseData.difficulty]}
        </span>
      </div>
      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{caseData.description}</p>
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
          {caseData.body_region} — {caseData.modality}
        </span>
        <span className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">
          {caseData.category}
        </span>
      </div>
    </button>
  );
}

export default function LibraryPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [modalityFilter, setModalityFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const dailyChallenge = useMemo(() => getDailyChallenge(), []);
  const categories = useMemo(() => getCategories(), []);
  const modalities = useMemo(() => getModalities(), []);

  const filteredCases = useMemo(() => {
    return CASE_LIBRARY.filter((c) => {
      if (categoryFilter && c.category !== categoryFilter) return false;
      if (modalityFilter && c.modality !== modalityFilter) return false;
      if (difficultyFilter && c.difficulty !== difficultyFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.body_region.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categoryFilter, modalityFilter, difficultyFilter, searchQuery]);

  function selectCase(caseData: LibraryCase) {
    // Store selected case in sessionStorage and navigate to dashboard
    sessionStorage.setItem("selectedCase", JSON.stringify(caseData));
    router.push("/dashboard?case=" + caseData.id);
  }

  function selectRandom() {
    selectCase(getRandomCase());
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-white">📚 Case Library</h1>
        <button
          onClick={selectRandom}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
        >
          🎲 Random Case
        </button>
      </div>

      {/* Daily Challenge */}
      <div className="mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/50 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              Daily Challenge
            </div>
            <h2 className="text-white font-semibold text-lg">{dailyChallenge.title}</h2>
            <p className="text-gray-400 text-sm mt-1">{dailyChallenge.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                {dailyChallenge.body_region} — {dailyChallenge.modality}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${difficultyColors[dailyChallenge.difficulty]}`}>
                {difficultyLabels[dailyChallenge.difficulty]}
              </span>
            </div>
          </div>
          <button
            onClick={() => selectCase(dailyChallenge)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shrink-0 transition"
          >
            Start Challenge
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search cases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-48"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={modalityFilter}
          onChange={(e) => setModalityFilter(e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300"
        >
          <option value="">All Modalities</option>
          {modalities.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(Number(e.target.value))}
          className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300"
        >
          <option value={0}>All Difficulties</option>
          <option value={1}>Beginner</option>
          <option value={2}>Intermediate</option>
          <option value={3}>Advanced</option>
        </select>
        {(categoryFilter || modalityFilter || difficultyFilter || searchQuery) && (
          <button
            onClick={() => {
              setCategoryFilter("");
              setModalityFilter("");
              setDifficultyFilter(0);
              setSearchQuery("");
            }}
            className="text-xs text-gray-400 hover:text-gray-200"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-xs mb-4">
        {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""}
      </p>

      {/* Case grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => (
          <CaseCard key={c.id} caseData={c} onSelect={() => selectCase(c)} />
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No cases match your filters.
        </div>
      )}
    </div>
  );
}
