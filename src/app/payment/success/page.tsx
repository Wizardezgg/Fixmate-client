"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { apiRequest } from "@/lib/api";
import { PaymentItem } from "@/types";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg("Missing Stripe session ID.");
      setLoading(false);
      return;
    }

    let active = true;
    apiRequest<{ success: boolean; data: PaymentItem }>(
      `/api/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
      { auth: true }
    )
      .then((res) => {
        if (!active) return;
        setPayment(res.data);
        toast.success("Payment verified and recorded!");
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg =
          err instanceof Error ? err.message : "Could not verify payment.";
        setErrorMsg(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sessionId]);

  return (
    <PublicShell>
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 text-center shadow-md space-y-5">
          {loading ? (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
              <h1 className="font-heading text-xl font-bold text-on-surface">
                Verifying your payment...
              </h1>
              <p className="text-sm text-on-surface-variant">
                Please wait while we confirm your Stripe transaction.
              </p>
            </>
          ) : errorMsg ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-error-container text-error flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h1 className="font-heading text-xl font-bold text-on-surface">
                Payment Verification Issue
              </h1>
              <p className="text-sm text-on-surface-variant">{errorMsg}</p>
              <Link
                href="/dashboard/customer/bookings"
                className="inline-block px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors"
              >
                Back to My Bookings
              </Link>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-on-surface">
                Payment Successful!
              </h1>
              <p className="text-sm text-on-surface-variant">
                Thank you! Your payment for{" "}
                <strong className="text-on-surface">
                  {payment?.serviceTitle}
                </strong>{" "}
                has been confirmed.
              </p>

              <div className="bg-surface-container-low rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Amount Paid</span>
                  <strong className="text-on-surface text-sm">
                    ${payment?.amount.toFixed(2)} USD
                  </strong>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-on-surface-variant shrink-0">
                    Transaction ID
                  </span>
                  <code className="font-mono text-on-surface truncate">
                    {payment?.transactionId}
                  </code>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/dashboard/customer/bookings"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors"
                >
                  Back to My Bookings
                </Link>
                <Link
                  href="/dashboard/customer/payments"
                  className="flex-1 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface hover:bg-surface-container-low text-sm font-semibold transition-colors"
                >
                  Payment History
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PublicShell>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface text-sm text-on-surface-variant">
          Loading payment confirmation...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
