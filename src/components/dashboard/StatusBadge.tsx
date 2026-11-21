import { ApprovalStatus, BookingStatus, PaymentStatus } from "@/types";

const BOOKING_STYLES: Record<BookingStatus, string> = {
  requested: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  accepted:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  "in-progress":
    "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  cancelled:
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const BOOKING_LABELS: Record<BookingStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  "in-progress": "In Progress",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        BOOKING_STYLES[status] || BOOKING_STYLES.requested
      }`}
    >
      {BOOKING_LABELS[status] || status}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        status === "paid"
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
      }`}
    >
      {status === "paid" ? "Paid" : "Unpaid"}
    </span>
  );
}

export function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  const style =
    status === "approved"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
      : status === "rejected"
        ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300";

  const label =
    status === "approved"
      ? "Approved"
      : status === "rejected"
        ? "Rejected"
        : "Pending";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
