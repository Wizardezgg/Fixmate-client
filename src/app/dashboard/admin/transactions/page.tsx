"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DollarSign, Receipt } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { apiRequest } from "@/lib/api";
import { PaymentItem } from "@/types";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest<{
      success: boolean;
      data: PaymentItem[];
      totalRevenue: number;
    }>("/api/admin/payments", { auth: true })
      .then((res) => {
        if (!active) return;
        setPayments(res.data || []);
        setTotalRevenue(res.totalRevenue || 0);
      })
      .catch((err: unknown) => {
        toast.error(
          err instanceof Error ? err.message : "Failed to load transactions."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardShell allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            Transactions &amp; Revenue
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            All verified Stripe Checkout payments processed on FixMate.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <StatsCard
            label="Total Platform Revenue"
            value={loading ? "—" : `$${totalRevenue.toFixed(2)}`}
            subtext="Sum of all settled Stripe payments"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            label="Total Transactions"
            value={loading ? "—" : payments.length}
            subtext="Completed & paid bookings"
            icon={<Receipt className="w-5 h-5" />}
            accent="secondary"
          />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">
              Loading transactions...
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Receipt className="w-10 h-10 text-primary mx-auto opacity-80" />
              <p className="text-sm font-medium text-on-surface">
                No transactions recorded yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <th className="py-3.5 px-5 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Technician</th>
                    <th className="py-3.5 px-4 font-semibold">Service</th>
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
                  {payments.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <p className="font-semibold text-on-surface">
                          {p.customerName}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {p.customerEmail}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-on-surface">
                          {p.technicianName}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {p.technicianEmail}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-on-surface">
                        {p.serviceTitle}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-primary">
                        ${Number(p.amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <code className="px-2 py-0.5 rounded bg-surface-container text-xs font-mono text-on-surface-variant">
                          {p.transactionId}
                        </code>
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-on-surface-variant">
                        {new Date(p.paidAt).toLocaleString()}
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
