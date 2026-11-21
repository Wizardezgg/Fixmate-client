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
  CheckCircle2,
  ClipboardList,
  DollarSign,
  PlusCircle,
  Wrench,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BookingStatusBadge } from "@/components/dashboard/StatusBadge";
import { apiRequest } from "@/lib/api";
import { BookingItem, ServiceItem } from "@/types";

export default function TechnicianOverviewPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<{ success: boolean; data: ServiceItem[] }>("/api/services/my", {
        auth: true,
      }),
      apiRequest<{ success: boolean; data: BookingItem[] }>(
        "/api/bookings/technician",
        { auth: true }
      ),
    ])
      .then(([srvRes, bkgRes]) => {
        if (!active) return;
        setServices(srvRes.data || []);
        setBookings(bkgRes.data || []);
      })
      .catch(() => {
        if (!active) return;
        setServices([]);
        setBookings([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalServices = services.length;
    const approvedServices = services.filter(
      (s) => s.approvalStatus === "approved"
    ).length;
    const pendingRequests = bookings.filter(
      (b) => b.status === "requested"
    ).length;
    const totalEarnings = bookings
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + (Number(b.finalAmount) || 0), 0);
    const pendingPayout = bookings
      .filter((b) => b.status === "completed" && b.paymentStatus === "unpaid")
      .reduce((sum, b) => sum + (Number(b.finalAmount) || 0), 0);
    return {
      totalServices,
      approvedServices,
      pendingRequests,
      totalEarnings,
      pendingPayout,
    };
  }, [services, bookings]);

  const chartData = useMemo(() => {
    const counts = {
      Requested: 0,
      Accepted: 0,
      "In Progress": 0,
      Completed: 0,
    };
    bookings.forEach((b) => {
      if (b.status === "requested") counts.Requested += 1;
      else if (b.status === "accepted") counts.Accepted += 1;
      else if (b.status === "in-progress") counts["In Progress"] += 1;
      else if (b.status === "completed") counts.Completed += 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [bookings]);

  return (
    <DashboardShell allowedRoles={["technician"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              Technician Overview
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Manage your repair listings and track incoming customer requests.
            </p>
          </div>
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add a Service</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Services"
            value={loading ? "—" : stats.totalServices}
            subtext="Repair services you have created"
            icon={<Wrench className="w-5 h-5" />}
          />
          <StatsCard
            label="Approved Services"
            value={loading ? "—" : stats.approvedServices}
            subtext="Live on public marketplace"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <StatsCard
            label="Pending Requests"
            value={loading ? "—" : stats.pendingRequests}
            subtext="Awaiting your acceptance"
            icon={<ClipboardList className="w-5 h-5" />}
            accent="secondary"
          />
          <StatsCard
            label="Total Revenue"
            value={loading ? "—" : `$${stats.totalEarnings.toFixed(2)}`}
            subtext={
              stats.pendingPayout > 0
                ? `$${stats.pendingPayout.toFixed(2)} awaiting customer payment`
                : "Settled from paid jobs"
            }
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-base font-bold text-on-surface mb-1">
              Job Pipeline Breakdown
            </h2>
            <p className="text-xs text-on-surface-variant mb-4">
              Live count of your customer repair requests
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

          <div className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-base font-bold text-on-surface">
                Latest Requests
              </h2>
              <Link
                href="/dashboard/technician/requests"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Manage all</span>
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
                <ClipboardList className="w-8 h-8 text-primary mx-auto opacity-80" />
                <p className="text-sm font-medium text-on-surface">
                  No repair requests yet
                </p>
                <p className="text-xs text-on-surface-variant">
                  Once customers book your approved services, requests will
                  appear here.
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
                        {b.customerName} • ${b.finalAmount}
                      </p>
                    </div>
                    <BookingStatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
