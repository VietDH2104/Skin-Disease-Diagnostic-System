import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ShieldCheck, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/diseases", label: "Disease Library" },
  { to: "/about", label: "About" },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full opacity-20 animate-float"
          style={{
            background:
              "radial-gradient(circle, hsl(168 76% 46% / 0.35), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 h-[600px] w-[600px] rounded-full opacity-15 animate-float"
          style={{
            background:
              "radial-gradient(circle, hsl(199 89% 48% / 0.3), transparent 70%)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/3 right-1/3 h-[400px] w-[400px] rounded-full opacity-10 animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, hsl(142 71% 45% / 0.3), transparent 70%)",
          }}
        />
      </div>

      {/* Gradient accent line */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg, hsl(168 76% 46%), hsl(199 89% 48%), hsl(142 71% 45%), hsl(168 76% 46%))",
          backgroundSize: "200% 100%",
          animation: "gradient-shift 4s ease infinite",
        }}
      />

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
              <ShieldCheck className="h-5 w-5" />
              <div className="absolute -inset-1 rounded-xl bg-primary/20 animate-pulse-glow -z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                DermScan
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
                AI Skin Analysis
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-48 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col px-6 pb-4 gap-1">
            {NAV_LINKS.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      {children}

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} DermScan · AI-powered skin analysis for
          educational purposes only
        </p>
      </footer>
    </div>
  );
}
