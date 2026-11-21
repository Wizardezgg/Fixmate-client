"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, ClipboardList, MapPin, Phone, X } from "lucide-react";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/dashboard/StatusBadge";
import { apiRequest } from "@/lib/api";
import { BookingItem, BookingStatus } from "@/types";

const STATUS_TABS = [
  { key: "All", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
];

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const [rejectTarget, setRejectTarget] = useState<BookingItem | null>(null);
  const [completeTarget, setCompleteTarget] = useState<BookingItem | null>(
    null
  );
  const [finalAmountInput, setFinalAmountInput] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const qs =
        statusFilter !== "All"
          ? `?status=${encodeURIComponent(statusFilter)}`
          : "";
      const res = await apiRequest<{ success: boolean; data: BookingItem[] }>(
        `/api/bookings/technician${qs}`,
        { auth: true }
      );
      setBookings(res.data || []);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load repair requests."
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateJobStatus = async (
    bookingId: string,
    status: BookingStatus,
    finalAmount?: number
  ) => {
    setUpdatingId(bookingId);
    try {
      await apiRequest(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status, finalAmount }),
      });
      toast.success(`Job marked as '${status}'.`);
      await loadRequests();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update job status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenCompleteModal = (booking: BookingItem) => {
    setCompleteTarget(booking);
    setFinalAmountInput(String(booking.basePrice));
  };

  const handleConfirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTarget) return;
    const parsed = Number(finalAmountInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Please enter a valid final amount greater than 0.");
      return;
    }

    await updateJobStatus(completeTarget._id, "completed", parsed);
    setCompleteTarget(null);
  };

  return (
    <DashboardShell allowedRoles={["technician"]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            Manage Requests
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Accept incoming repair jobs, update progress, and set final amounts
            upon completion.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/40 p-1.5 rounded-xl">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === tab.key
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-36 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-12 text-center space-y-2">
            <ClipboardList className="w-10 h-10 text-primary mx-auto opacity-80" />
            <h2 className="font-heading text-lg font-bold text-on-surface">
              No repair requests found
            </h2>
            <p className="text-sm text-on-surface-variant">
              Requests matching this filter will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const busy = updatingId === booking._id;
              return (
                <article
                  key={booking._id}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <BookingStatusBadge status={booking.status} />
                        {booking.status === "completed" && (
                          <PaymentStatusBadge status={booking.paymentStatus} />
                        )}
                      </div>
                      <h3 className="font-heading text-base font-bold text-on-surface">
                        {booking.serviceTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                        <span className="font-semibold text-on-surface">
                          Customer: {booking.customerName}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-primary" />
                          {booking.customerPhone}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {booking.address}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {new Date(booking.preferredDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] text-on-surface-variant block">
                          {booking.status === "completed"
                            ? "Final Amount"
                            : "Base Price"}
                        </span>
                        <span className="font-heading text-xl font-bold text-on-surface">
                          ${booking.finalAmount}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {booking.status === "requested" && (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => setRejectTarget(booking)}
                              className="px-3.5 py-2 rounded-xl border border-error/40 text-error hover:bg-error-container/30 text-xs font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                updateJobStatus(booking._id, "accepted")
                              }
                              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold cursor-pointer"
                            >
                              Accept
                            </button>
                          </>
                        )}

                        {booking.status === "accepted" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              updateJobStatus(booking._id, "in-progress")
                            }
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
                          >
                            Start Work
                          </button>
                        )}

                        {booking.status === "in-progress" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleOpenCompleteModal(booking)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-on-surface-variant bg-surface-container-low rounded-xl px-4 py-2.5">
                    {booking.problemDescription}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      <ConfirmModal
        open={Boolean(rejectTarget)}
        title="Reject Repair Request?"
        description={`Are you sure you want to reject "${rejectTarget?.serviceTitle}" from ${rejectTarget?.customerName}?`}
        confirmLabel="Reject Request"
        loading={Boolean(updatingId)}
        onConfirm={async () => {
          if (!rejectTarget) return;
          await updateJobStatus(rejectTarget._id, "rejected");
          setRejectTarget(null);
        }}
        onClose={() => setRejectTarget(null)}
      />

      {/* Complete Job Final Amount Modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-on-surface">
                Complete Job &amp; Set Final Amount
              </h3>
              <button
                type="button"
                onClick={() => setCompleteTarget(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">
              Service: <strong>{completeTarget.serviceTitle}</strong> (Base: $
              {completeTarget.basePrice})
            </p>
            <form onSubmit={handleConfirmComplete} className="space-y-4">
              <div>
                <label
                  htmlFor="final-amt"
                  className="text-xs font-semibold text-on-surface block mb-1.5"
                >
                  Final Amount ($ USD)
                </label>
                <input
                  id="final-amt"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={finalAmountInput}
                  onChange={(e) => setFinalAmountInput(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-base font-bold text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompleteTarget(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={Boolean(updatingId)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {updatingId ? "Saving..." : "Confirm Completed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
