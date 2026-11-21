"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Calendar,
  Check,
  CreditCard,
  Download,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  BookingStatusBadge,
  PaymentStatusBadge,
} from "@/components/dashboard/StatusBadge";
import { apiRequest } from "@/lib/api";
import { downloadBookingInvoice } from "@/lib/invoice";
import { BookingItem } from "@/types";

const TIMELINE_STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
] as const;

function getTimelineStepIndex(booking: BookingItem): number {
  if (booking.paymentStatus === "paid") return 4;
  if (booking.status === "completed") return 3;
  if (booking.status === "in-progress") return 2;
  if (booking.status === "accepted") return 1;
  return 0;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<string>("all");

  const [cancelTarget, setCancelTarget] = useState<BookingItem | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const [reviewTarget, setReviewTarget] = useState<BookingItem | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: BookingItem[] }>(
        "/api/bookings/my",
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
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    if (filterTab === "all") return bookings;
    if (filterTab === "active") {
      return bookings.filter((b) =>
        ["requested", "accepted", "in-progress"].includes(b.status)
      );
    }
    return bookings.filter((b) => b.status === filterTab);
  }, [bookings, filterTab]);

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await apiRequest(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: "PATCH",
        auth: true,
      });
      toast.success("Booking cancelled.");
      setCancelTarget(null);
      await loadBookings();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Could not cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  const handlePayNow = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      const res = await apiRequest<{ success: boolean; url?: string }>(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          auth: true,
          body: JSON.stringify({ bookingId }),
        }
      );

      if (!res.url) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      window.location.href = res.url;
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to start Stripe Checkout."
      );
      setPayingId(null);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTarget) return;
    if (reviewText.trim().length < 5) {
      toast.error("Please write a short review (at least 5 characters).");
      return;
    }

    setSubmittingReview(true);
    try {
      await apiRequest(`/api/bookings/${reviewTarget._id}/review`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ rating, review: reviewText.trim() }),
      });
      toast.success("Review submitted! Thank you.");
      setReviewTarget(null);
      setReviewText("");
      setRating(5);
      await loadBookings();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <DashboardShell allowedRoles={["customer"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              My Bookings
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Track your repair timeline and pay online once work is completed.
            </p>
          </div>
          <Link
            href="/services"
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            Browse Services
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/40 p-1.5 rounded-xl">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "requested", label: "Requested" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterTab === tab.key
                  ? "bg-primary-container text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 animate-pulse"
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-12 text-center space-y-3">
            <Wrench className="w-10 h-10 text-primary mx-auto opacity-80" />
            <h2 className="font-heading text-lg font-bold text-on-surface">
              No bookings found
            </h2>
            <p className="text-sm text-on-surface-variant">
              When you request a repair service, it will appear here with live
              status tracking.
            </p>
            <Link
              href="/services"
              className="inline-block px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
            >
              Find a Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const isTerminal =
                booking.status === "cancelled" || booking.status === "rejected";
              const activeStep = getTimelineStepIndex(booking);

              return (
                <article
                  key={booking._id}
                  className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5"
                >
                  {/* Top Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="w-20 h-16 rounded-xl object-cover shrink-0 bg-surface-container"
                      />
                      <div className="space-y-1">
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
                          <span>Technician: {booking.technicianName}</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {new Date(booking.preferredDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                      <div className="text-left md:text-right">
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
                          <button
                            type="button"
                            onClick={() => setCancelTarget(booking)}
                            className="px-3.5 py-2 rounded-xl border border-error/40 text-error hover:bg-error-container/30 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Cancel Request
                          </button>
                        )}

                        {booking.status === "completed" &&
                          booking.paymentStatus === "unpaid" && (
                            <button
                              type="button"
                              disabled={payingId === booking._id}
                              onClick={() => handlePayNow(booking._id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>
                                {payingId === booking._id
                                  ? "Redirecting..."
                                  : "Pay Now"}
                              </span>
                            </button>
                          )}

                        {booking.paymentStatus === "paid" && (
                          <>
                            <button
                              type="button"
                              onClick={() => downloadBookingInvoice(booking)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-primary" />
                              <span>PDF Invoice</span>
                            </button>

                            {!booking.rating && (
                              <button
                                type="button"
                                onClick={() => setReviewTarget(booking)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-container text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5" />
                                <span>Leave Review</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Problem Description */}
                  <p className="text-xs sm:text-sm text-on-surface-variant bg-surface-container-low rounded-xl px-4 py-2.5">
                    {booking.problemDescription}
                  </p>

                  {/* 5-Step Job Timeline Tracker */}
                  {!isTerminal && (
                    <div className="pt-1">
                      <div className="grid grid-cols-5 gap-2">
                        {TIMELINE_STEPS.map((step, idx) => {
                          const completed = idx <= activeStep;
                          return (
                            <div
                              key={step.key}
                              className="flex flex-col items-center text-center gap-1.5"
                            >
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  completed
                                    ? "bg-primary text-on-primary"
                                    : "bg-surface-container text-on-surface-variant"
                                }`}
                              >
                                {completed ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                              <span
                                className={`text-[11px] font-medium ${
                                  completed
                                    ? "text-on-surface font-semibold"
                                    : "text-on-surface-variant"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {booking.rating && (
                    <div className="text-xs text-on-surface-variant flex items-center gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                        <Star className="w-3.5 h-3.5 fill-secondary-container text-secondary-container" />
                        Your rating: {booking.rating}/5
                      </span>
                      {booking.review && <span>— &ldquo;{booking.review}&rdquo;</span>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel Repair Request?"
        description={`Are you sure you want to cancel your request for "${cancelTarget?.serviceTitle}"? This cannot be undone.`}
        confirmLabel="Yes, Cancel Request"
        loading={cancelling}
        onConfirm={handleConfirmCancel}
        onClose={() => setCancelTarget(null)}
      />

      {/* Rating & Review Modal */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-on-surface">
                Rate &amp; Review Service
              </h3>
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">
              {reviewTarget.serviceTitle} by {reviewTarget.technicianName}
            </p>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        num <= rating
                          ? "fill-secondary-container text-secondary-container"
                          : "text-outline-variant"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with the repair..."
                className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewTarget(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/50 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
