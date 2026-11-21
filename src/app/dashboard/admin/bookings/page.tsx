"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/dashboard/StatusBadge";
import { apiRequest } from "@/lib/api";
import { BookingItem } from "@/types";

const BOOKING_TABS = [
  "All",
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const qs =
        statusFilter !== "All"
          ? `?status=${encodeURIComponent(statusFilter)}`
          : "";
      const res = await apiRequest<{ success: boolean; data: BookingItem[] }>(
        `/api/admin/bookings${qs}`,
        { auth: true }
      );
      setBookings(res.data || []);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  return (
    <DashboardShell allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            All Bookings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Platform-wide monitoring of every repair request and payment state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/40 p-1.5 rounded-xl">
          {BOOKING_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === tab
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CalendarCheck className="w-10 h-10 text-primary mx-auto opacity-80" />
              <p className="text-sm font-medium text-on-surface">
                No bookings found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <th className="py-3.5 px-5 font-semibold">Service</th>
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Technician</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Payment</th>
                    <th className="py-3.5 px-5 font-semibold text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {bookings.map((b) => (
                    <tr
                      key={b._id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-on-surface max-w-xs truncate">
                        {b.serviceTitle}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        <p className="text-on-surface font-medium">
                          {b.customerName}
                        </p>
                        <p className="text-xs">{b.customerEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        <p className="text-on-surface font-medium">
                          {b.technicianName}
                        </p>
                        <p className="text-xs">{b.technicianEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                        {new Date(b.preferredDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <BookingStatusBadge status={b.status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <PaymentStatusBadge status={b.paymentStatus} />
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-on-surface">
                        ${b.finalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
