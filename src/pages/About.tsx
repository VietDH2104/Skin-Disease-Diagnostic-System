import { Link } from "react-router-dom";
import {
  Brain,
  Database,
  ShieldCheck,
  Cpu,
  BarChart3,
  ChevronRight,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";

const TECH_STACK = [
  {
    icon: Brain,
    title: "EfficientNetB3",
    description:
      "Deep learning model pre-trained on ImageNet and fine-tuned on dermatological images for high-accuracy skin condition classification.",
  },
  {
    icon: Database,
    title: "23 Skin Conditions",
    description:
      "Trained to recognize 23 different skin diseases across categories including inflammatory, fungal, viral, autoimmune, and neoplastic conditions.",
  },
  {
    icon: Cpu,
    title: "Real-Time Inference",
    description:
      "Images are processed in seconds using optimized TensorFlow serving, delivering top-5 predictions with confidence scores.",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    description:
      "Each prediction includes a confidence percentage, helping users understand the model's certainty and make informed decisions.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Upload or Capture",
    description: "Take a photo with your camera or upload an existing image of the skin area you want analyzed.",
  },
  {
    step: "2",
    title: "AI Analysis",
    description: "Our EfficientNetB3 model processes your image, comparing it against patterns from thousands of dermatological images.",
  },
  {
    step: "3",
    title: "Get Results",
    description: "Receive the top 5 most likely conditions with confidence scores, severity levels, and detailed information about each condition.",
  },
  {
    step: "4",
    title: "Take Action",
    description: "Use the results as a starting point for discussion with a healthcare professional. Never self-diagnose based solely on AI results.",
  },
];

export default function About() {
  return (
    <main className="flex-1 px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-16 animate-fade-in-up">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <GraduationCap className="h-4 w-4" />
            Thesis Project
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            About DermScan
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            DermScan is an AI-powered skin disease classification system built
            as a thesis project. It uses deep learning to analyze skin images
            and provide preliminary assessments to help users understand
            potential skin conditions.
          </p>
        </div>

        {/* How it works */}
        <section className="space-y-8">
          <h3 className="text-2xl font-bold text-foreground text-center">
            How It Works
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className="glass-card p-5 space-y-3 text-center"
                style={{
                  animation: `fade-in-up 0.4s ease-out ${i * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                  {item.step}
                </div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology */}
        <section className="space-y-8">
          <h3 className="text-2xl font-bold text-foreground text-center">
            Technology
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {TECH_STACK.map((tech, i) => (
              <div
                key={tech.title}
                className="glass-card p-5 flex gap-4"
                style={{
                  animation: `fade-in-up 0.4s ease-out ${i * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <tech.icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">
                    {tech.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section className="space-y-6">
          <h3 className="text-2xl font-bold text-foreground text-center">
            System Architecture
          </h3>
          <div className="glass-card p-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Frontend",
                  tech: "React + Vite",
                  host: "Vercel",
                  color: "text-blue-500",
                },
                {
                  label: "Backend",
                  tech: "FastAPI + TensorFlow",
                  host: "Hugging Face Spaces",
                  color: "text-amber-500",
                },
                {
                  label: "Database",
                  tech: "PostgreSQL",
                  host: "Supabase",
                  color: "text-emerald-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-secondary/50 p-4 text-center space-y-1.5"
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${item.color}`}
                  >
                    {item.label}
                  </p>
                  <p className="font-medium text-foreground text-sm">
                    {item.tech}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hosted on {item.host}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl glass-card p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                Important Disclaimer
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                DermScan is an <strong className="text-foreground">educational tool</strong> developed
                as a thesis project. It is{" "}
                <strong className="text-foreground">
                  not a substitute for professional medical advice, diagnosis,
                  or treatment
                </strong>
                . Always consult a qualified dermatologist or healthcare
                provider for skin concerns. The AI model's predictions should
                be used as a preliminary reference only.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-4 pb-4">
          <p className="text-muted-foreground">
            Ready to try it out?
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <ShieldCheck className="h-4 w-4" />
              Analyze Your Skin
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/diseases"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            >
              Browse Disease Library
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
