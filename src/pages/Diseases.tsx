import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  getAllDiseases,
  SEVERITY_CONFIG,
  type DiseaseInfo,
} from "@/lib/diseases";
import {
  Search,
  Stethoscope,
  MapPin,
  ShieldAlert,
  ChevronRight,
  X,
  BookOpen,
} from "lucide-react";

/** Extract unique categories from all diseases */
const ALL_DISEASES = getAllDiseases();
const CATEGORIES = [
  "All",
  ...Array.from(new Set(ALL_DISEASES.map((d) => d.category))).sort(),
];

export default function Diseases() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState<DiseaseInfo | null>(
    null
  );

  const filtered = useMemo(() => {
    return ALL_DISEASES.filter((d) => {
      const matchesSearch =
        search === "" ||
        d.displayName.toLowerCase().includes(search.toLowerCase()) ||
        d.symptoms.some((s) =>
          s.toLowerCase().includes(search.toLowerCase())
        );
      const matchesCategory =
        activeCategory === "All" || d.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8 animate-fade-in-up">
        {/* Page header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <BookOpen className="h-4 w-4" />
            23 Conditions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            Disease Library
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Browse all skin conditions our AI model can detect. Tap any card to
            learn more about symptoms, causes, and when to see a doctor.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or symptom…"
            className="w-full rounded-full border border-border bg-card/60 backdrop-blur-sm py-3 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-card/60 text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-center text-sm text-muted-foreground">
          Showing {filtered.length} of {ALL_DISEASES.length} conditions
        </p>

        {/* Disease grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((disease, i) => {
              const sev = SEVERITY_CONFIG[disease.severity];
              return (
                <button
                  key={disease.id}
                  onClick={() => setSelectedDisease(disease)}
                  className="group text-left glass-card p-5 space-y-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
                  style={{
                    animation: `fade-in-up 0.4s ease-out ${i * 0.04}s forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {disease.displayName}
                    </h3>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {disease.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sev.bg} ${sev.color} ring-1 ${sev.ring}`}
                    >
                      {sev.icon} {sev.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {disease.description}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              No conditions match your search.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Disease detail modal */}
      {selectedDisease && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedDisease(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in-up" />

          {/* Modal content */}
          <div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl glass-card p-6 space-y-5 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedDisease(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8">
              <h3 className="text-xl font-bold text-foreground">
                {selectedDisease.displayName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {selectedDisease.category}
                </span>
                {(() => {
                  const sev = SEVERITY_CONFIG[selectedDisease.severity];
                  return (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${sev.bg} ${sev.color} ring-1 ${sev.ring}`}
                    >
                      {sev.icon} {sev.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedDisease.description}
            </p>

            {/* Symptoms & Causes */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="h-3.5 w-3.5 text-primary" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Symptoms
                  </h4>
                </div>
                <ul className="space-y-1">
                  {selectedDisease.symptoms.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                    Common Causes
                  </h4>
                </div>
                <ul className="space-y-1">
                  {selectedDisease.causes.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Common locations */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Common Locations
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedDisease.commonLocations.map((loc) => (
                  <span
                    key={loc}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* When to see a doctor */}
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  When to See a Doctor
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedDisease.whenToSeeDoctor}
              </p>
            </div>

            {/* Action */}
            <div className="pt-2 flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all"
              >
                Analyze Your Skin
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
