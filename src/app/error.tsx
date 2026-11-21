"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 text-center shadow-md space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-error-container text-error flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-xl font-bold text-on-surface">
          Something went wrong
        </h1>
        <p className="text-sm text-on-surface-variant">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-outline-variant/60 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
