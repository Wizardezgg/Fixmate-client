"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  CreditCard,
  Lock,
  Search,
  ShieldCheck,
  UserCheck,
  Wrench,
} from "lucide-react";
import { PublicShell } from "@/components/PublicShell";

const STEPS = [
  {
    step: "STAGE 01",
    num: "1",
    title: "Find a Local Specialist",
    description:
      "Search approved repair services by device category, service mode (Home Visit or Shop Drop-off), and transparent starting price.",
    badge: "Admin-Approved Listings",
    icon: Search,
  },
  {
    step: "STAGE 02",
    num: "2",
    title: "Send a Repair Request",
    description:
      "Choose your preferred date, share your address and problem description, and submit with zero upfront payment.",
    badge: "Zero Upfront Fee",
    icon: CalendarCheck,
  },
  {
    step: "STAGE 03",
    num: "3",
    title: "Track Live Job Progress",
    description:
      "Follow every stage in real time: Requested → Accepted → In Progress → Completed, with full transparency.",
    badge: "Step-by-Step Pipeline",
    icon: Wrench,
  },
  {
    step: "STAGE 04",
    num: "4",
    title: "Verify & Pay After Completion",
    description:
      "Once your device is repaired and marked Completed, pay securely online via Stripe Checkout.",
    badge: "Stripe Protected",
    icon: CreditCard,
  },
];

const FAQS = [
  {
    q: "How does FixMate's pay-after-completion model work?",
    a: "You never pay when submitting a repair request. Only after the technician completes the repair and sets the final amount does the Pay Now button unlock in your dashboard via Stripe Checkout.",
  },
  {
    q: "Can I cancel a repair request?",
    a: "Yes. As long as your booking status is still 'Requested', you can cancel it directly from My Bookings at no cost.",
  },
  {
    q: "How are services verified before appearing on FixMate?",
    a: "Every service created by a technician starts in 'Pending' status and must be reviewed and approved by an admin before becoming visible to customers.",
  },
  {
    q: "What happens if a technician edits an existing service?",
    a: "To maintain quality and pricing accuracy, any edited service automatically returns to 'Pending' status for admin re-approval.",
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <PublicShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Transparent Repair Platform</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight leading-tight">
                Reliable Device &amp; Appliance Repairs.{" "}
                <span className="text-primary">Zero Upfront Risk.</span>
              </h1>

              <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                FixMate connects customers with skilled technicians through a
                structured, trackable workflow. Every job moves through clear
                milestones, and payment happens only after the work is
                completed.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors shadow-sm"
                >
                  <span>Browse Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/50 text-on-surface hover:bg-surface-container text-sm font-semibold transition-colors"
                >
                  <Wrench className="w-4 h-4 text-primary" />
                  <span>Join as a Technician</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        Structured Job Pipeline
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        Requested → Accepted → In Progress → Completed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-surface-container">
                    <span className="text-[11px] font-semibold uppercase text-on-surface-variant block">
                      Payment Timing
                    </span>
                    <span className="font-heading text-base font-bold text-on-surface mt-1 block">
                      After Completion
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container">
                    <span className="text-[11px] font-semibold uppercase text-on-surface-variant block">
                      Service Modes
                    </span>
                    <span className="font-heading text-base font-bold text-on-surface mt-1 block">
                      Home &amp; Drop-off
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/10 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-xs text-on-surface leading-relaxed">
                    Payments are processed securely with{" "}
                    <strong>Stripe Checkout</strong> only after your technician
                    marks the job completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Model */}
      <section className="py-14 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              How It Works
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface mt-1">
              The 4-Step FixMate Repair Model
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.num}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary text-on-primary font-heading font-bold flex items-center justify-center">
                        {s.num}
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold uppercase">
                        {s.step}
                      </span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-surface-container-low text-primary flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-on-surface mb-2">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-outline-variant/30 text-xs font-semibold text-primary">
                    {s.badge}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 space-y-2">
            <UserCheck className="w-7 h-7 text-primary" />
            <h3 className="font-heading text-base font-bold text-on-surface">
              Admin-Moderated Listings
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Every service goes through admin approval before customers can
              book it, ensuring clear pricing and accurate descriptions.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 space-y-2">
            <ShieldCheck className="w-7 h-7 text-primary" />
            <h3 className="font-heading text-base font-bold text-on-surface">
              Role-Protected Workflows
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Customers, Technicians, and Admins each have dedicated dashboards
              with server-enforced permissions and status transitions.
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-6 space-y-2">
            <CreditCard className="w-7 h-7 text-secondary" />
            <h3 className="font-heading text-base font-bold text-on-surface">
              Pay Only After Completion
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              No upfront deposits. Stripe Checkout is unlocked strictly after
              the technician finishes the repair.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-14 bg-surface-container-low">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 space-y-6">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Clarity &amp; Transparency
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-heading text-sm font-semibold text-on-surface cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-primary shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-on-surface-variant leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
