"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, CheckSquare, XCircle } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ApprovalStatusBadge } from "@/components/dashboard/StatusBadge";
import { apiRequest } from "@/lib/api";
import { ApprovalStatus, ServiceItem } from "@/types";

const APPROVAL_TABS = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "All", label: "All" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const qs =
        statusFilter !== "All"
          ? `?approvalStatus=${encodeURIComponent(statusFilter)}`
          : "";
      const res = await apiRequest<{ success: boolean; data: ServiceItem[] }>(
        `/api/admin/services${qs}`,
        { auth: true }
      );
      setServices(res.data || []);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleApproval = async (
    serviceId: string,
    approvalStatus: Exclude<ApprovalStatus, "pending">
  ) => {
    setUpdatingId(serviceId);
    try {
      await apiRequest(`/api/admin/services/${serviceId}/approval`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(`Service ${approvalStatus}.`);
      await loadServices();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update service status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardShell allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            Service Approval
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Review technician-submitted services before they appear on public
            pages.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-lowest border border-outline-variant/40 p-1.5 rounded-xl">
          {APPROVAL_TABS.map((tab) => (
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

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CheckSquare className="w-10 h-10 text-primary mx-auto opacity-80" />
              <p className="text-sm font-medium text-on-surface">
                No services in &ldquo;{statusFilter}&rdquo; queue
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <th className="py-3.5 px-5 font-semibold">Service</th>
                    <th className="py-3.5 px-4 font-semibold">Technician</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-5 font-semibold text-right">
                      Moderation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {services.map((srv) => {
                    const busy = updatingId === srv._id;
                    return (
                      <tr
                        key={srv._id}
                        className="hover:bg-surface-container-low/50 transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={srv.image}
                              alt={srv.title}
                              className="w-14 h-10 rounded-lg object-cover shrink-0 bg-surface-container"
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-on-surface truncate max-w-xs">
                                {srv.title}
                              </p>
                              <p className="text-xs text-on-surface-variant">
                                {srv.category} • {srv.serviceMode}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant">
                          <p className="font-medium text-on-surface">
                            {srv.technicianName}
                          </p>
                          <p className="text-xs">{srv.technicianEmail}</p>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-on-surface">
                          ${srv.basePrice}
                        </td>
                        <td className="py-3.5 px-4">
                          <ApprovalStatusBadge status={srv.approvalStatus} />
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            {srv.approvalStatus !== "approved" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  handleApproval(srv._id, "approved")
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold cursor-pointer disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}
                            {srv.approvalStatus !== "rejected" && (
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() =>
                                  handleApproval(srv._id, "rejected")
                                }
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-error-container text-error hover:bg-error hover:text-white text-xs font-semibold cursor-pointer disabled:opacity-50 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
