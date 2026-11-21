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
  CheckSquare,
  DollarSign,
  Users,
  Wrench,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { apiRequest } from "@/lib/api";
import { BookingItem, PaymentItem, ServiceItem, UserProfile } from "@/types";

export default function AdminOverviewPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<{ success: boolean; data: UserProfile[] }>(
        "/api/admin/users",
        { auth: true }
      ),
      apiRequest<{ success: boolean; data: ServiceItem[] }>(
        "/api/admin/services",
        { auth: true }
      ),
      apiRequest<{ success: boolean; data: BookingItem[] }>(
        "/api/admin/bookings",
        { auth: true }
      ),
      apiRequest<{
        success: boolean;
        data: PaymentItem[];
        totalRevenue: number;
      }>("/api/admin/payments", { auth: true }),
    ])
      .then(([uRes, sRes, bRes, pRes]) => {
        if (!active) return;
        setUsers(uRes.data || []);
        setServices(sRes.data || []);
        setBookings(bRes.data || []);
        setTotalRevenue(pRes.totalRevenue || 0);
      })
      .catch(() => {
        if (!active) return;
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalTechnicians = users.filter((u) => u.role === "technician").length;
    const pendingServices = services.filter(
      (s) => s.approvalStatus === "pending"
    ).length;
    return { totalUsers, totalTechnicians, pendingServices };
  }, [users, services]);

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
      else counts.Cancelled += 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [bookings]);

  return (
    <DashboardShell allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              Admin Overview
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Monitor users, service approvals, platform bookings, and Stripe
              revenue.
            </p>
          </div>
          <Link
            href="/dashboard/admin/services"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Review Pending Services</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Total Users"
            value={loading ? "—" : stats.totalUsers}
            subtext="Registered platform accounts"
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            label="Total Technicians"
            value={loading ? "—" : stats.totalTechnicians}
            subtext="Active repair specialists"
            icon={<Wrench className="w-5 h-5" />}
          />
          <StatsCard
            label="Pending Services"
            value={loading ? "—" : stats.pendingServices}
            subtext="Awaiting admin moderation"
            icon={<CheckSquare className="w-5 h-5" />}
            accent="secondary"
          />
          <StatsCard
            label="Total Revenue"
            value={loading ? "—" : `$${totalRevenue.toFixed(2)}`}
            subtext="Settled via Stripe Checkout"
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm">
            <h2 className="font-heading text-base font-bold text-on-surface mb-1">
              Platform Bookings Overview
            </h2>
            <p className="text-xs text-on-surface-variant mb-4">
              Distribution of all repair jobs across statuses
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

          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-heading text-base font-bold text-on-surface">
              Quick Admin Actions
            </h2>
            <div className="space-y-2.5">
              <Link
                href="/dashboard/admin/services"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span className="text-sm font-semibold text-on-surface">
                  Service Approval Queue ({stats.pendingServices})
                </span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
              <Link
                href="/dashboard/admin/users"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span className="text-sm font-semibold text-on-surface">
                  Manage Users &amp; Roles ({stats.totalUsers})
                </span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
              <Link
                href="/dashboard/admin/bookings"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span className="text-sm font-semibold text-on-surface">
                  All Bookings ({bookings.length})
                </span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
              <Link
                href="/dashboard/admin/transactions"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                <span className="text-sm font-semibold text-on-surface">
                  Transactions &amp; Revenue
                </span>
                <ArrowRight className="w-4 h-4 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
