"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  User,
  Verified,
  Wrench,
  Zap,
} from "lucide-react";
import { FixMateLogo } from "@/components/FixMateLogo";
import { clearCachedApiToken } from "@/lib/api";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import { UserRole } from "@/types";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const { data: session, isPending } = useSession();

  const [viewMode, setViewMode] = useState<"customer" | "technician">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (!isPending && session?.user) {
      const userRole = ((session.user as { role?: UserRole }).role ||
        "customer") as UserRole;
      const safeRedirect =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : `/dashboard/${userRole}`;
      router.replace(safeRedirect);
    }
  }, [session, isPending, redirectParam, router]);

  const validate = (): boolean => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      clearCachedApiToken();
      const result = await signIn.email({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (result.error) {
        toast.error(result.error.message || "Invalid email or password.");
        return;
      }

      const freshSession = await authClient.getSession();
      const userRole = ((
        freshSession.data?.user as { role?: UserRole } | undefined
      )?.role || "customer") as UserRole;

      toast.success("Signed in successfully!");
      const safeRedirect =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : `/dashboard/${userRole}`;
      router.push(safeRedirect);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to sign in. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const safeRedirect =
        redirectParam && redirectParam.startsWith("/")
          ? redirectParam
          : "/dashboard/customer";
      await signIn.social({
        provider: "google",
        callbackURL: safeRedirect,
      });
    } catch {
      toast.error("Google sign-in is currently unavailable.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-surface">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40">
        <div className="h-16 max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <FixMateLogo />
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/services"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Browse Services
            </Link>
            <Link href="/sign-in" className="text-primary font-semibold">
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content with Subtle Grid Underlay */}
      <main className="relative flex-grow flex items-center justify-center px-4 py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg
            className="w-full h-full text-outline-variant/40"
            height="100%"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                height="48"
                id="fixmate-grid-pattern"
                patternUnits="userSpaceOnUse"
                width="48"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
                <circle cx="48" cy="48" fill="currentColor" opacity="0.6" r="1" />
              </pattern>
            </defs>
            <rect fill="url(#fixmate-grid-pattern)" height="100%" width="100%" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-xl mx-auto">
          <div className="w-full bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/40 p-6 sm:p-10">
            {/* Role Context Switcher */}
            <div className="flex items-center justify-center mb-6">
              <div className="inline-flex items-center p-1 rounded-lg bg-surface-container-low border border-outline-variant/40 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setViewMode("customer")}
                  className={`flex-1 sm:flex-initial px-5 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    viewMode === "customer"
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("technician")}
                  className={`flex-1 sm:flex-initial px-5 py-2 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    viewMode === "technician"
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Technician</span>
                </button>
              </div>
            </div>

            {/* Header Context */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-container text-on-primary-container mb-3 shadow-sm">
                <Wrench className="w-5 h-5" />
              </div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-on-surface mb-1">
                {viewMode === "technician"
                  ? "Technician Portal Sign In"
                  : "Welcome back to FixMate"}
              </h1>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                {viewMode === "technician"
                  ? "Sign in to manage your repair services, accept customer requests, and update job progress."
                  : "Sign in to track active repair requests, view job timelines, and pay after completion."}
              </p>
            </div>

            {/* Friendly Role Notice */}
            <div className="mb-5 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 flex items-center gap-2.5 text-xs text-on-surface">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>
                {viewMode === "technician"
                  ? "You'll be routed automatically to your Technician Dashboard after sign in."
                  : "Pay-after-service protection: settle invoices online only after your device is fixed."}
              </span>
            </div>

            {/* Google Social Auth */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-11 px-4 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/50 text-sm font-semibold flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px bg-outline-variant/50 flex-grow" />
              <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">
                Or continue with email
              </span>
              <div className="h-px bg-outline-variant/50 flex-grow" />
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-on-surface block"
                >
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 absolute left-3.5 text-on-surface-variant pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="name@example.com"
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-error font-medium">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-on-surface block"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 absolute left-3.5 text-on-surface-variant pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 text-on-surface-variant hover:text-on-surface p-1 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-error font-medium">{errors.password}</p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe((prev) => !prev)}
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                      rememberMe
                        ? "bg-primary border-primary text-on-primary"
                        : "bg-surface-container-low border-outline-variant text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-on-surface">
                    Remember me for 30 days
                  </span>
                </label>
                <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  Encrypted session
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
              >
                <span>{submitting ? "Signing In..." : "Sign In to Account"}</span>
                {!submitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Bottom Account Link */}
            <div className="pt-5 mt-6 text-center text-sm text-on-surface-variant border-t border-outline-variant/40">
              <span>Don&apos;t have an account yet?</span>
              <Link
                href="/sign-up"
                className="text-primary font-semibold hover:underline ml-1.5"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Trust Badges Strip */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <Verified className="w-4 h-4 text-primary" />
              <span>Verified Technicians</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" />
              <span>Pay After Completion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-primary" />
              <span>Live Job Tracking</span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <div>© {new Date().getFullYear()} FixMate. All rights reserved.</div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/about" className="hover:text-on-surface transition-colors">
              How It Works
            </Link>
            <Link href="/services" className="hover:text-on-surface transition-colors">
              Services
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface-variant text-sm">
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
