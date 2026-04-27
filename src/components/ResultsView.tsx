import { useState, useEffect, useRef } from "react";
import { Prediction } from "@/lib/api";
import { getDiseaseInfo, SEVERITY_CONFIG } from "@/lib/diseases";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  AlertTriangle,
  TrendingUp,
  ChevronDown,
  MapPin,
  Stethoscope,
  ShieldAlert,
  Activity,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

/** Animated number that counts up from 0 to target */
function AnimatedPercentage({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const duration = 800;
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(eased * value);
        if (progress < 1) ref.current = requestAnimationFrame(tick);
      };
      ref.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [value, delay]);

  return <>{display.toFixed(1)}%</>;
}

/** Copy results to clipboard as formatted text */
function CopyResultsButton({ predictions }: { predictions: Prediction[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const lines = predictions.map((p, i) => {
      const disease = getDiseaseInfo(p.name);
      const name = disease?.displayName || p.name.replace(/_/g, " ");
      return `${i + 1}. ${name} — ${(p.confidence * 100).toFixed(1)}%`;
    });
    const text = `DermScan Analysis Results\n${"—".repeat(30)}\n${lines.join("\n")}\n\n⚠ This is an AI-generated analysis, not a medical diagnosis.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Results copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      title="Copy results to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

interface ResultsViewProps {
  imageUrl: string;
  predictions: Prediction[];
  onReset: () => void;
}

const RANK_STYLES = [
  {
    badge:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
    bar: "from-amber-500 to-amber-400",
    label: "🥇",
  },
  {
    badge:
      "bg-slate-400/15 text-slate-500 dark:text-slate-400 ring-1 ring-slate-400/20",
    bar: "from-slate-400 to-slate-300",
    label: "🥈",
  },
  {
    badge:
      "bg-orange-600/15 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20",
    bar: "from-orange-500 to-orange-400",
    label: "🥉",
  },
  {
    badge: "bg-primary/10 text-primary ring-1 ring-primary/20",
    bar: "from-primary to-primary/70",
    label: "4",
  },
  {
    badge: "bg-muted text-muted-foreground ring-1 ring-border",
    bar: "from-muted-foreground/40 to-muted-foreground/20",
    label: "5",
  },
];

/** Confidence label based on percentage */
function getConfidenceLabel(confidence: number) {
  const pct = confidence * 100;
  if (pct >= 80) return { text: "Strong Match", color: "text-red-500 dark:text-red-400" };
  if (pct >= 60) return { text: "Likely", color: "text-orange-500 dark:text-orange-400" };
  if (pct >= 30) return { text: "Possible", color: "text-amber-500 dark:text-amber-400" };
  return { text: "Unlikely", color: "text-emerald-500 dark:text-emerald-400" };
}

export function ResultsView({
  imageUrl,
  predictions,
  onReset,
}: ResultsViewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 animate-fade-in-up">
      <Button
        variant="ghost"
        onClick={onReset}
        className="gap-2 rounded-full hover:bg-primary/10"
      >
        <ArrowLeft className="h-4 w-4" /> Try Another Image
      </Button>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl glass-card p-1.5">
          <img
            src={imageUrl}
            alt="Analyzed skin"
            className="h-auto w-full rounded-xl object-cover"
          />
        </div>

        {/* Predictions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Analysis Results
              </h2>
            </div>
            <CopyResultsButton predictions={predictions} />
          </div>

          {predictions.map((p, i) => {
            const style = RANK_STYLES[i] || RANK_STYLES[4];
            const disease = getDiseaseInfo(p.name);
            const isExpanded = expandedIndex === i;
            const confidenceLabel = getConfidenceLabel(p.confidence);

            return (
              <Card
                key={p.name}
                className={`overflow-hidden border-border/50 transition-all duration-300 hover:shadow-md ${
                  isExpanded
                    ? "border-primary/30 shadow-md"
                    : "hover:border-primary/20"
                }`}
                style={{
                  animation: `slide-in 0.4s ease-out ${i * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                {/* Clickable header */}
                <CardContent
                  className="flex items-center gap-4 p-4 cursor-pointer select-none"
                  onClick={() => disease && toggleExpand(i)}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${style.badge}`}
                  >
                    {style.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-medium text-foreground">
                        {disease?.displayName || p.name.replace(/_/g, " ")}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-medium ${confidenceLabel.color}`}
                        >
                          {confidenceLabel.text}
                        </span>
                        <span className="text-sm font-bold tabular-nums text-foreground">
                          <AnimatedPercentage value={p.confidence * 100} delay={i * 150} />
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${style.bar} transition-all duration-1000 ease-out`}
                        style={{
                          width: `${p.confidence * 100}%`,
                          animation: `fade-in-up 0.6s ease-out ${i * 0.15}s forwards`,
                        }}
                      />
                    </div>
                    {/* Category + severity tags */}
                    {disease && (
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {disease.category}
                        </span>
                        {(() => {
                          const sev = SEVERITY_CONFIG[disease.severity];
                          return (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${sev.bg} ${sev.color} ring-1 ${sev.ring}`}
                            >
                              {sev.icon} {sev.label}
                            </span>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  {/* Expand chevron */}
                  {disease && (
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </CardContent>

                {/* Expandable disease detail panel */}
                {disease && (
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-border/50 px-4 pb-5 pt-4 space-y-4">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {disease.description}
                        </p>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {/* Symptoms */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                              <Stethoscope className="h-3.5 w-3.5 text-primary" />
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                Symptoms
                              </h4>
                            </div>
                            <ul className="space-y-1">
                              {disease.symptoms.map((s) => (
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

                          {/* Causes */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5">
                              <Activity className="h-3.5 w-3.5 text-primary" />
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                Common Causes
                              </h4>
                            </div>
                            <ul className="space-y-1">
                              {disease.causes.map((c) => (
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
                            {disease.commonLocations.map((loc) => (
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
                            {disease.whenToSeeDoctor}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 rounded-2xl glass-card p-5 text-sm text-muted-foreground">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </div>
        <p className="leading-relaxed">
          These results are generated by an AI model and are{" "}
          <strong className="text-foreground">not a medical diagnosis</strong>.
          Please consult a qualified dermatologist for professional evaluation.
        </p>
      </div>
    </div>
  );
}
