"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";
import { FixMateLogo } from "@/components/FixMateLogo";
import { signIn, signUp, useSession } from "@/lib/auth-client";
import { UserRole } from "@/types";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [role, setRole] = useState<"customer" | "technician">("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (!isPending && session?.user) {
      const userRole = ((session.user as { role?: UserRole }).role ||
        "customer") as UserRole;
      router.replace(`/dashboard/${userRole}`);
    }
  }, [session, isPending, router]);

  const hasMinLen = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const isPasswordValid = hasMinLen && hasUpper && hasLower;

  const validateForm = (): boolean => {
    const nextErrors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) {
      nextErrors.name = "Full name is required.";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!isPasswordValid) {
      nextErrors.password =
        "Password must be at least 6 characters with 1 uppercase and 1 lowercase letter.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const result = await signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
        role,
      });

      if (result.error) {
        toast.error(result.error.message || "Could not create account.");
        return;
      }

      toast.success("Account created successfully! Welcome to FixMate.");
      router.push(`/dashboard/${role}`);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong during sign up.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
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
            <Link
              href="/sign-in"
              className="text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Sign In
            </Link>
            <Link href="/sign-up" className="text-primary font-semibold">
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Header Context */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-heading text-lg font-bold text-on-surface">
                FixMate
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-surface-container-high text-primary font-semibold">
                Account Portal
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-on-surface pt-1">
              Create your FixMate account
            </h1>
            <p className="text-sm text-on-surface-variant">
              Book verified repair technicians or offer your repair services. Pay only
              after work is completed.
            </p>
          </div>

          {/* Role Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-on-surface block">
              Select your role
            </label>
            <div
              role="radiogroup"
              aria-label="Account Role"
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <button
                type="button"
                role="radio"
                aria-checked={role === "customer"}
                onClick={() => setRole("customer")}
                className={`text-left p-4 rounded-xl transition-all flex flex-col justify-between cursor-pointer border ${
                  role === "customer"
                    ? "border-primary ring-2 ring-primary/20 bg-primary-fixed/15"
                    : "border-outline-variant/50 bg-surface-container-low hover:bg-surface-container"
                }`}
              >
                <div className="flex items-start justify-between w-full mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      role === "customer"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="font-heading text-sm font-semibold text-on-surface">
                    I&apos;m a Customer
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                    Book certified repairs, track progress, &amp; pay after completion.
                  </p>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={role === "technician"}
                onClick={() => setRole("technician")}
                className={`text-left p-4 rounded-xl transition-all flex flex-col justify-between cursor-pointer border ${
                  role === "technician"
                    ? "border-primary ring-2 ring-primary/20 bg-primary-fixed/15"
                    : "border-outline-variant/50 bg-surface-container-low hover:bg-surface-container"
                }`}
              >
                <div className="flex items-start justify-between w-full mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      role === "technician"
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container-highest text-on-surface"
                    }`}
                  >
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      role === "technician"
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-transparent"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="font-heading text-sm font-semibold text-on-surface">
                    I&apos;m a Technician
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                    List repair services, manage jobs, &amp; receive guaranteed payouts.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="full-name"
                className="text-xs font-semibold text-on-surface block"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 text-on-surface-variant pointer-events-none" />
                <input
                  id="full-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder="e.g., Alex Chen"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder:text-on-surface-variant/60 text-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-error font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
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
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder:text-on-surface-variant/60 text-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-on-surface"
                >
                  Password
                </label>
                <span className="text-xs text-on-surface-variant">
                  Min 6 characters
                </span>
              </div>
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
                  className="w-full h-11 pl-10 pr-11 rounded-lg bg-surface-container-low border border-outline-variant/50 text-on-surface placeholder:text-on-surface-variant/60 text-sm focus:outline-none focus:border-primary focus:bg-surface-container-lowest transition-all"
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

              {/* Live Validation Checklist */}
              <div className="pt-1.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <PasswordRuleBadge valid={hasMinLen} label="Min 6 chars" />
                <PasswordRuleBadge valid={hasUpper} label="1 uppercase" />
                <PasswordRuleBadge valid={hasLower} label="1 lowercase" />
              </div>
            </div>

            {/* Terms */}
            <div className="pt-1 flex items-start gap-2.5">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 rounded accent-primary cursor-pointer"
              />
              <label
                htmlFor="terms"
                className="text-xs text-on-surface-variant cursor-pointer leading-normal"
              >
                I agree to FixMate&apos;s{" "}
                <Link href="/about" className="text-primary font-semibold hover:underline">
                  Terms of Service
                </Link>{" "}
                and pay-after-completion repair policy.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !agreed}
              className="w-full h-11 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span>{submitting ? "Creating Account..." : "Create Account"}</span>
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full h-px bg-outline-variant/50" />
              <span className="absolute px-3 bg-surface-container-lowest text-xs text-on-surface-variant">
                Or continue with
              </span>
            </div>

            {/* Google Social Auth */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full h-11 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 text-on-surface font-semibold text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                  fill="#4285F4"
                />
                <path
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.15C3.25 21.31 7.31 24 12 24z"
                  fill="#34A853"
                />
                <path
                  d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.39l4-3.15z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.61l4 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                  fill="#EA4335"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Trust Note */}
          <div className="rounded-lg bg-surface-container-low p-3 flex items-center gap-2.5 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>Zero upfront charges — pay online only after your repair is completed.</span>
          </div>

          {/* Switch to Sign In */}
          <div className="text-center pt-1 text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-primary font-semibold hover:underline ml-1"
            >
              Sign In
            </Link>
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

function PasswordRuleBadge({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors ${
        valid
          ? "bg-primary-container text-on-primary-container"
          : "bg-surface-container-low text-on-surface-variant"
      }`}
    >
      {valid ? (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <Circle className="w-3.5 h-3.5 shrink-0 opacity-60" />
      )}
      <span>{label}</span>
    </div>
  );
}
