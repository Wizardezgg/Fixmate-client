"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CreditCard, Receipt } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { apiRequest } from "@/lib/api";
import { PaymentItem } from "@/types";

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest<{ success: boolean; data: PaymentItem[] }>("/api/payments/my", {
      auth: true,
    })
      .then((res) => {
        if (active) setPayments(res.data || []);
      })
      .catch((err: unknown) => {
        toast.error(
          err instanceof Error ? err.message : "Failed to load payment history."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalSpent = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <DashboardShell allowedRoles={["customer"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              Payment History
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              All completed Stripe transactions for your repair bookings.
            </p>
          </div>
          <div className="px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-sm">
            <span className="text-on-surface-variant">Total Paid: </span>
            <strong className="font-heading text-primary">
              ${totalSpent.toFixed(2)}
            </strong>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">
              Loading payment history...
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Receipt className="w-10 h-10 text-primary mx-auto opacity-80" />
              <h2 className="font-heading text-lg font-bold text-on-surface">
                No payments recorded yet
              </h2>
              <p className="text-sm text-on-surface-variant">
                Once a technician completes your job and you pay via Stripe,
                your receipt will appear here.
              </p>
              <Link
                href="/dashboard/customer/bookings"
                className="inline-block px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
              >
                Go to My Bookings
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <th className="py-3.5 px-5 font-semibold">Service</th>
                    <th className="py-3.5 px-4 font-semibold">Technician</th>
                    <th className="py-3.5 px-4 font-semibold">Amount</th>
                    <th className="py-3.5 px-4 font-semibold">
                      Transaction ID
                    </th>
                    <th className="py-3.5 px-5 font-semibold text-right">
                      Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="py-3.5 px-5 font-semibold text-on-surface">
                        {payment.serviceTitle}
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {payment.technicianName}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-primary">
                        ${Number(payment.amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <code className="px-2 py-0.5 rounded bg-surface-container text-xs font-mono text-on-surface-variant">
                          {payment.transactionId}
                        </code>
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-on-surface-variant">
                        <span className="inline-flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-primary" />
                          {new Date(payment.paidAt).toLocaleString()}
                        </span>
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
