"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, Wrench } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";

export default function NotFoundPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/services?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <PublicShell>
      <section className="max-w-4xl mx-auto px-4 lg:px-8 py-14 lg:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full mb-6 text-xs font-semibold text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="uppercase tracking-wider">Error 404</span>
          <span>•</span>
          <span className="text-primary">Signal Disconnected</span>
        </div>

        {/* Repair-Themed Diagnostic SVG Illustration */}
        <div className="w-full max-w-sm p-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-md mb-8">
          <svg
            className="w-full h-auto"
            fill="none"
            viewBox="0 0 320 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 20 100 H 70 L 95 130 H 130"
              stroke="#bcc9c6"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M 300 100 H 250 L 225 70 H 190"
              stroke="#bcc9c6"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle cx="20" cy="100" fill="#00685f" r="4" />
            <circle cx="300" cy="100" fill="#855300" r="4" />

            <g transform="translate(110, 35)">
              <rect fill="#f2f3ff" height="125" rx="14" width="100" x="0" y="0" />
              <rect fill="#131b2e" height="34" rx="6" width="76" x="12" y="14" />
              <text
                fill="#89f5e7"
                fontFamily="monospace"
                fontSize="13"
                fontWeight="700"
                letterSpacing="1.5"
                textAnchor="middle"
                x="50"
                y="32"
              >
                404 Ω
              </text>
              <text
                fill="#ffb59a"
                fontFamily="sans-serif"
                fontSize="7"
                fontWeight="600"
                textAnchor="middle"
                x="50"
                y="43"
              >
                OPEN LOOP
              </text>
              <circle cx="50" cy="74" fill="#ffffff" r="16" />
              <circle cx="50" cy="74" fill="#eaedff" r="11" />
              <line
                stroke="#ba1a1a"
                strokeLinecap="round"
                strokeWidth="2"
                x1="50"
                x2="50"
                y1="74"
                y2="65"
              />
              <circle cx="30" cy="104" fill="#131b2e" r="5" />
              <circle cx="30" cy="104" fill="#ba1a1a" r="2.5" />
              <circle cx="70" cy="104" fill="#131b2e" r="5" />
            </g>

            <g transform="translate(65, 55) rotate(-28)">
              <path
                d="M 18 10 C 14 5 7 4 2 8 C -3 12 -2 19 3 23 L 8 21 C 7 17 9 14 13 13 C 16 12 19 14 20 18 L 24 16 C 24 14 22 11 18 10 Z"
                fill="#00685f"
              />
              <rect fill="#008378" height="10" rx="3" width="72" x="18" y="16" />
              <circle cx="85" cy="21" fill="#00685f" r="5" />
              <circle cx="85" cy="21" fill="#ffffff" r="2" />
            </g>
          </svg>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-on-surface tracking-tight mb-3">
          404 — Circuit Broken &amp; Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-lg mb-8 leading-relaxed">
          Looks like the page you&apos;re looking for has loose wiring or was
          moved. Let&apos;s get you back to a working route.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/services"
            className="h-11 px-6 rounded-xl bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container text-on-surface text-sm font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <Wrench className="w-4 h-4 text-primary" />
            <span>Browse Services</span>
          </Link>
        </div>

        {/* Search Redirect Box */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/50 p-2 rounded-xl shadow-sm flex items-center gap-2"
        >
          <Search className="w-4 h-4 text-primary ml-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repair services..."
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none py-1.5"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>
      </section>
    </PublicShell>
  );
}
