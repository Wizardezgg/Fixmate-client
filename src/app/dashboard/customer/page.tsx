"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  Plus,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/dashboard/StatusBadge";
import { apiRequest } from "@/lib/api";
import { BookingItem } from "@/types";

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest<{ success: boolean; data: BookingItem[] }>("/api/bookings/my", {
      auth: true,
    })
      .then((res) => {
        if (active) setBookings(res.data || []);
      })
      .catch(() => {
        if (active) setBookings([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = bookings.length;
    const activeJobs = bookings.filter((b) =>
      ["requested", "accepted", "in-progress"].includes(b.status)
    ).length;
    const completedJobs = bookings.filter((b) => b.status === "completed").length;
    return { total, activeJobs, completedJobs };
  }, [bookings]);

  const chartData = useMemo(() => {
    const counts = {
      Requested: 0,
      Accepted: 0,
      "In Progress": 0,
      Completed: 0,
      Cancelled: 0,
    };
    bookings.forEach((b) => {
      if (b.status === "requested") counts.Requested += 1;
      else if (b.status === "accepted") counts.Accepted += 1;
      else if (b.status === "in-progress") counts["In Progress"] += 1;
      else if (b.status === "completed") counts.Completed += 1;
      else if (b.status === "cancelled" || b.status === "rejected")
        counts.Cancelled += 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [bookings]);

  return (
    <DashboardShell allowedRoles={["customer"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              Customer Overview
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Track your repair requests, active jobs, and completed services.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Request New Repair</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            label="Total Requests"
            value={loading ? "—" : stats.total}
            subtext="All repair requests submitted"
            icon={<ClipboardList className="w-5 h-5" />}
          />
          <StatsCard
            label="Active Jobs"
            value={loading ? "—" : stats.activeJobs}
            subtext="Requested, accepted, or in progress"
            icon={<Clock className="w-5 h-5" />}
            accent="secondary"
          />
          <StatsCard
            label="Completed Jobs"
            value={loading ? "—" : stats.completedJobs}
            subtext="Repairs finished by technicians"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
        </div>

        {/* Chart + Recent Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-base font-bold text-on-surface mb-1">
              Bookings by Status
            </h2>
            <p className="text-xs text-on-surface-variant mb-4">
              Live breakdown of your repair requests
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00685f" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-base font-bold text-on-surface">
                  Recent Bookings
                </h2>
                <Link
                  href="/dashboard/customer/bookings"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-16 rounded-xl bg-surface-container-low animate-pulse"
                    />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-10 text-center space-y-2">
                  <CalendarCheck className="w-8 h-8 text-primary mx-auto opacity-80" />
                  <p className="text-sm font-medium text-on-surface">
                    No bookings yet
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Browse approved services and submit your first repair
                    request.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 4).map((b) => (
                    <div
                      key={b._id}
                      className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {b.serviceTitle}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">
                          {b.technicianName} • ${b.finalAmount}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <BookingStatusBadge status={b.status} />
                        {b.status === "completed" && (
                          <PaymentStatusBadge status={b.paymentStatus} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
