import Link from "next/link";
import { XCircle } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";

export default function PaymentCancelPage() {
  return (
    <PublicShell>
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 text-center shadow-md space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-on-surface">
            Payment Cancelled
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            No charges were made. Your booking remains completed and unpaid —
            you can try paying again whenever you&apos;re ready.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/customer/bookings"
              className="inline-block px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors"
            >
              Try Again in My Bookings
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
