"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Edit2, PlusCircle, Trash2, Wrench, X } from "lucide-react";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ApprovalStatusBadge } from "@/components/dashboard/StatusBadge";
import { apiRequest, uploadImageToImgBB } from "@/lib/api";
import { ServiceCategory, ServiceItem, ServiceMode } from "@/types";

const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function MyServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [editTarget, setEditTarget] = useState<ServiceItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] =
    useState<ServiceCategory>("Smartphone");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editMode, setEditMode] = useState<ServiceMode>("Home Visit");
  const [editArea, setEditArea] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ success: boolean; data: ServiceItem[] }>(
        "/api/services/my",
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
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleToggleAvailability = async (service: ServiceItem) => {
    try {
      await apiRequest(`/api/services/${service._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      toast.success(
        !service.isAvailable
          ? "Service marked available."
          : "Service hidden from public."
      );
      await loadServices();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update availability."
      );
    }
  };

  const openEditModal = (service: ServiceItem) => {
    setEditTarget(service);
    setEditTitle(service.title);
    setEditCategory(service.category);
    setEditPrice(String(service.basePrice));
    setEditDuration(service.estimatedDuration);
    setEditMode(service.serviceMode);
    setEditArea(service.serviceArea);
    setEditDesc(service.description);
    setEditImageFile(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const parsedPrice = Number(editPrice);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast.error("Base price must be a positive number.");
      return;
    }

    setSavingEdit(true);
    try {
      let imageUrl = editTarget.image;
      if (editImageFile) {
        imageUrl = await uploadImageToImgBB(editImageFile);
      }

      await apiRequest(`/api/services/${editTarget._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          title: editTitle.trim(),
          category: editCategory,
          basePrice: parsedPrice,
          estimatedDuration: editDuration.trim(),
          serviceMode: editMode,
          serviceArea: editArea.trim(),
          description: editDesc.trim(),
          image: imageUrl,
        }),
      });

      toast.success("Service updated and sent for admin re-approval.");
      setEditTarget(null);
      await loadServices();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update service."
      );
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/api/services/${deleteTarget._id}`, {
        method: "DELETE",
        auth: true,
      });
      toast.success("Service deleted.");
      setDeleteTarget(null);
      await loadServices();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete service."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardShell allowedRoles={["technician"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
              My Services
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Manage your repair listings, availability, and pricing.
            </p>
          </div>
          <Link
            href="/dashboard/technician/add-service"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Service</span>
          </Link>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-on-surface-variant">
              Loading your services...
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Wrench className="w-10 h-10 text-primary mx-auto opacity-80" />
              <h2 className="font-heading text-lg font-bold text-on-surface">
                No services created yet
              </h2>
              <p className="text-sm text-on-surface-variant">
                Add your first repair service to start receiving customer
                requests.
              </p>
              <Link
                href="/dashboard/technician/add-service"
                className="inline-block px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
              >
                Add a Service
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-surface-container-low text-xs uppercase text-on-surface-variant">
                    <th className="py-3.5 px-5 font-semibold">Service</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Base Price</th>
                    <th className="py-3.5 px-4 font-semibold">Approval</th>
                    <th className="py-3.5 px-4 font-semibold">Available</th>
                    <th className="py-3.5 px-5 font-semibold text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {services.map((srv) => (
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
                              {srv.serviceMode} • {srv.serviceArea}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-on-surface-variant">
                        {srv.category}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-on-surface">
                        ${srv.basePrice}
                      </td>
                      <td className="py-3.5 px-4">
                        <ApprovalStatusBadge status={srv.approvalStatus} />
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(srv)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            srv.isAvailable
                              ? "bg-primary/15 text-primary"
                              : "bg-surface-container text-on-surface-variant"
                          }`}
                        >
                          {srv.isAvailable ? "On" : "Off"}
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(srv)}
                            title="Edit service"
                            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(srv)}
                            title="Delete service"
                            className="p-2 rounded-lg text-on-surface-variant hover:bg-error-container/40 hover:text-error cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete Service?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Service"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-on-surface">
                Edit Service
              </h3>
              <button
                type="button"
                onClick={() => setEditTarget(null)}
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-3 py-2 rounded-lg">
              Note: Editing service details resets approval status to Pending for
              admin review.
            </p>
            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) =>
                      setEditCategory(e.target.value as ServiceCategory)
                    }
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Mode
                  </label>
                  <select
                    value={editMode}
                    onChange={(e) =>
                      setEditMode(e.target.value as ServiceMode)
                    }
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm"
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Base Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Service Area
                </label>
                <input
                  type="text"
                  required
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-on-surface block mb-1">
                  Replace Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditImageFile(e.target.files?.[0] || null)
                  }
                  className="text-xs text-on-surface-variant"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
