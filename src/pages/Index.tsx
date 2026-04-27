import { useState, useEffect, useMemo } from "react";
import { ImageCapture } from "@/components/ImageCapture";
import { ImageUpload } from "@/components/ImageUpload";
import { ResultsView } from "@/components/ResultsView";
import { analyzeImage, type Prediction } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  X,
  Sparkles,
  Zap,
  Lock,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

type AppState = "idle" | "preview" | "loading" | "results" | "error";

const LOADING_STEPS = [
  { label: "Uploading image", delay: 0 },
  { label: "Preprocessing", delay: 800 },
  { label: "Running AI analysis", delay: 2000 },
  { label: "Generating results", delay: 4000 },
];

function LoadingSteps() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = LOADING_STEPS.map((step, i) =>
      setTimeout(() => setActiveStep(i), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-xs space-y-6 animate-fade-in-up">
      {/* Spinner */}
      <div className="flex justify-center">
        <div className="relative">
          <div
            className="h-16 w-16 rounded-full animate-spin-slow"
            style={{
              background:
                "conic-gradient(from 0deg, hsl(168 76% 46%), hsl(199 89% 48%), hsl(142 71% 45%), transparent)",
              padding: "3px",
            }}
          >
            <div className="h-full w-full rounded-full bg-background" />
          </div>
          <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-spin text-primary" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2.5">
        {LOADING_STEPS.map((step, i) => {
          const isDone = i < activeStep;
          const isCurrent = i === activeStep;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-500 ${
                isCurrent
                  ? "bg-primary/10 text-primary"
                  : isDone
                  ? "text-primary/60"
                  : "text-muted-foreground/40"
              }`}
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                {isDone ? (
                  <Check className="h-4 w-4" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>
              <span className={`text-sm font-medium ${isCurrent ? "" : ""}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [error, setError] = useState("");

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  const handleImage = (f: File) => {
    setFile(f);
    setState("preview");
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setState("loading");
    setError("");
    try {
      const result = await analyzeImage(file);
      setPredictions(result.predictions);
      setState("results");
    } catch (e: any) {
      const msg = e.message || "Something went wrong";
      setError(msg);
      setState("error");
      toast.error("Analysis failed", {
        description: msg,
      });
    }
  };

  const reset = () => {
    setFile(null);
    setPredictions([]);
    setState("idle");
    setError("");
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      {/* ── Idle State ── */}
      {state === "idle" && (
        <div className="w-full max-w-2xl space-y-10 animate-fade-in-up">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-2">
              <Sparkles className="h-4 w-4" />
              Powered by Deep Learning
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient leading-tight">
              Analyze Your Skin
            </h2>
            <p className="mx-auto max-w-lg text-lg text-muted-foreground leading-relaxed">
              Capture or upload a photo for instant AI-powered skin condition
              analysis with confidence scores
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { icon: Zap, label: "Fast Results" },
              { icon: Sparkles, label: "AI Powered" },
              { icon: Lock, label: "Private & Secure" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur-sm px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>

          {/* Input cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ImageCapture onCapture={handleImage} />
            <ImageUpload onSelect={handleImage} />
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Not a substitute for professional medical advice
          </p>
        </div>
      )}

      {/* ── Preview State ── */}
      {state === "preview" && previewUrl && (
        <div className="w-full max-w-md space-y-6 text-center animate-fade-in-up">
          <div className="relative mx-auto overflow-hidden rounded-2xl glass-card p-1.5">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-auto w-full rounded-xl object-cover"
            />
            <button
              onClick={reset}
              className="absolute right-4 top-4 rounded-full bg-foreground/60 p-2 text-background transition-all hover:bg-foreground/80 hover:scale-110"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={reset}
              className="rounded-full px-6"
            >
              Choose Different
            </Button>
            <Button
              onClick={handleAnalyze}
              className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Analyze
            </Button>
          </div>
        </div>
      )}

      {/* ── Loading State ── */}
      {state === "loading" && (
        <LoadingSteps />
      )}

      {/* ── Results State ── */}
      {state === "results" && previewUrl && (
        <ResultsView
          imageUrl={previewUrl}
          predictions={predictions}
          onReset={reset}
        />
      )}

      {/* ── Error State ── */}
      {state === "error" && (
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="glass-card p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Analysis Failed</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={reset}
                className="rounded-full"
              >
                Start Over
              </Button>
              <Button onClick={handleAnalyze} className="rounded-full">
                Retry
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;
