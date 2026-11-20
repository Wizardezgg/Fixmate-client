"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronRight,
  CreditCard,
  Laptop,
  Search,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Tv,
  UserCheck,
  WashingMachine,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { ServiceCard } from "@/components/ServiceCard";
import { apiRequest } from "@/lib/api";
import { ServiceCategory, ServiceItem } from "@/types";

const CATEGORIES: {
  name: ServiceCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { name: "Smartphone", label: "Smartphone", icon: Smartphone },
  { name: "Laptop & PC", label: "Laptop & PC", icon: Laptop },
  { name: "AC", label: "AC & Climate", icon: Wind },
  { name: "Refrigerator", label: "Refrigerator", icon: Snowflake },
  { name: "TV", label: "TV & Audio", icon: Tv },
  { name: "Washing Machine", label: "Washing Machine", icon: WashingMachine },
  { name: "Electrical", label: "Electrical", icon: Zap },
];

const STEPS = [
  {
    step: "Step 01",
    title: "Find a Service",
    description:
      "Browse verified repair listings by device category, service mode, and transparent starting price.",
    icon: Search,
  },
  {
    step: "Step 02",
    title: "Send a Request",
    description:
      "Pick your preferred date, share your address and issue details, and submit with zero upfront fee.",
    icon: CalendarCheck,
  },
  {
    step: "Step 03",
    title: "Technician Fixes It",
    description:
      "Track live job progress from Requested to Accepted, In Progress, and Completed.",
    icon: Wrench,
  },
  {
    step: "Step 04",
    title: "Pay After Completion",
    description:
      "Inspect your repaired device first, then pay securely online via Stripe Checkout.",
    icon: CreditCard,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest<{ success: boolean; data: ServiceItem[] }>("/api/services/featured")
      .then((res) => {
        if (active) setFeaturedServices(res.data || []);
      })
      .catch(() => {
        if (active) setFeaturedServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    const qs = params.toString();
    router.push(qs ? `/services?${qs}` : "/services");
  };

  return (
    <PublicShell>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy & Search */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-surface-container-high px-3.5 py-1.5 text-xs font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>Pay-After-Service Repair Platform</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-[1.15]">
                Broken Device?{" "}
                <span className="text-primary">Get It Fixed</span> by Verified
                Technicians.
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Book trusted pros for smartphones, laptops, AC units, and home
                appliances. Track every step live and pay online only after the
                work is completed.
              </p>

              {/* Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="mt-2 w-full rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-2.5 shadow-lg flex flex-col md:flex-row gap-2.5"
              >
                <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-surface-container-low px-3.5 py-2.5">
                  <Search className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search device or issue (e.g. iPhone screen, AC)"
                    className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Category"
                  className="md:w-44 rounded-xl bg-surface-container-low px-3.5 py-2.5 text-sm text-on-surface outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary px-6 py-3 text-sm font-semibold transition-colors shadow-sm cursor-pointer shrink-0"
                >
                  <span>Browse Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Trust Pills */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-medium text-on-surface">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  Verified Technicians
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Step-by-Step Tracking
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5">
                  <CreditCard className="w-4 h-4 text-secondary" />
                  Pay After Completion
                </span>
              </div>
            </div>

            {/* Right Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900&q=80"
                  alt="Certified technician repairing electronics"
                  className="w-full h-[360px] lg:h-[410px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-surface-container-lowest/95 backdrop-blur-md p-3.5 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface">
                        Verified Repair Network
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        Home Visit &amp; Shop Drop-off
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-semibold">
                    Zero Upfront Fee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Service Categories
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                Popular Categories
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              <span>View all services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/services?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col items-center text-center rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-4 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 transition-all"
                >
                  <div className="mb-3 w-12 h-12 rounded-xl bg-surface-container text-primary group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-heading text-xs sm:text-sm font-semibold text-on-surface">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* DYNAMIC FEATURED SERVICES */}
      <section className="py-14 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Latest Approved Listings
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                Featured Repair Services
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-container transition-colors"
            >
              <span>Explore all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[370px] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 animate-pulse"
                />
              ))}
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-10 text-center">
              <Wrench className="w-10 h-10 text-primary mx-auto mb-3 opacity-80" />
              <h3 className="font-heading text-lg font-bold text-on-surface">
                No approved services available yet
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 mb-5">
                Technicians can add repair services from their dashboard and
                admins can approve them to appear here.
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors"
              >
                Join as a Technician
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW FIXMATE WORKS */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Simple &amp; Transparent
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface mt-1">
              How FixMate Works
            </h2>
            <p className="text-sm text-on-surface-variant mt-2">
              Every job follows a clear status pipeline — and you only pay after
              your repair is marked completed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm"
                >
                  <span className="px-3 py-0.5 rounded-full bg-primary text-on-primary text-[11px] font-bold mb-4">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-on-surface mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US + CTA */}
      <section className="py-14 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-on-surface">
                  Admin-Approved Services
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Every technician listing is reviewed before appearing on the
                  public marketplace.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-on-surface">
                  Live Status Pipeline
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Know exactly when your job is Requested, Accepted, In Progress,
                  or Completed.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-on-surface">
                  Pay Only After Completion
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Stripe Checkout unlocks only once the technician finishes the
                  repair and sets the final amount.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-primary-container via-primary to-primary-container p-8 sm:p-10 text-on-primary flex flex-col lg:flex-row items-center justify-between gap-6 shadow-lg">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold">
                Ready to book a trusted repair?
              </h2>
              <p className="text-sm sm:text-base text-on-primary/90 mt-1">
                Explore verified services or create your FixMate account in
                seconds.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/services"
                className="px-6 py-3 rounded-xl bg-surface-container-lowest text-primary font-semibold text-sm hover:bg-surface-container-low transition-colors shadow-sm"
              >
                Browse Services
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-on-primary font-semibold text-sm transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
