"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Upload, Wrench } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { apiRequest, uploadImageToImgBB } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { ServiceCategory, ServiceMode } from "@/types";

const CATEGORIES: ServiceCategory[] = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function AddServicePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as { name?: string; email?: string } | undefined;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("Smartphone");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [serviceMode, setServiceMode] = useState<ServiceMode>("Home Visit");
  const [serviceArea, setServiceArea] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = Number(basePrice);
    if (
      !title.trim() ||
      !description.trim() ||
      !estimatedDuration.trim() ||
      !serviceArea.trim()
    ) {
      toast.error("Please fill in all service fields.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      toast.error("Base price must be a positive number.");
      return;
    }

    if (!imageFile) {
      toast.error("Please select a service banner image.");
      return;
    }

    setSubmitting(true);
    try {
      const imageUrl = await uploadImageToImgBB(imageFile);

      await apiRequest("/api/services", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          image: imageUrl,
          basePrice: parsedPrice,
          estimatedDuration: estimatedDuration.trim(),
          serviceMode,
          serviceArea: serviceArea.trim(),
        }),
      });

      toast.success("Service created and waiting for admin approval.");
      router.push("/dashboard/technician/my-services");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create service."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell allowedRoles={["technician"]}>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            Add a Repair Service
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Submit a new service listing. New services remain pending until
            approved by an admin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* Read-only Technician Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-low">
            <div>
              <span className="text-[11px] font-semibold uppercase text-on-surface-variant flex items-center gap-1">
                <Lock className="w-3 h-3" /> Technician Name
              </span>
              <p className="text-sm font-semibold text-on-surface mt-0.5">
                {user?.name || ""}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase text-on-surface-variant flex items-center gap-1">
                <Lock className="w-3 h-3" /> Technician Email
              </span>
              <p className="text-sm font-semibold text-on-surface mt-0.5">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="srv-title"
                className="text-xs font-semibold text-on-surface block"
              >
                Service Title
              </label>
              <input
                id="srv-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., iPhone Screen Replacement"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="srv-cat"
                className="text-xs font-semibold text-on-surface block"
              >
                Category
              </label>
              <select
                id="srv-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="srv-mode"
                className="text-xs font-semibold text-on-surface block"
              >
                Service Mode
              </label>
              <select
                id="srv-mode"
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value as ServiceMode)}
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="Home Visit">Home Visit</option>
                <option value="Shop Drop-off">Shop Drop-off</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="srv-price"
                className="text-xs font-semibold text-on-surface block"
              >
                Base Price ($ USD)
              </label>
              <input
                id="srv-price"
                type="number"
                min="1"
                step="0.01"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="45"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="srv-duration"
                className="text-xs font-semibold text-on-surface block"
              >
                Estimated Duration
              </label>
              <input
                id="srv-duration"
                type="text"
                required
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="e.g., 2-3 hours"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="srv-area"
                className="text-xs font-semibold text-on-surface block"
              >
                Service Area
              </label>
              <input
                id="srv-area"
                type="text"
                required
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="e.g., Dhanmondi, Dhaka"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label
                htmlFor="srv-desc"
                className="text-xs font-semibold text-on-surface block"
              >
                Service Description
              </label>
              <textarea
                id="srv-desc"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is included in this repair service..."
                className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary resize-y"
              />
            </div>

            {/* File Input for ImgBB */}
            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-on-surface block">
                Service Banner Image (ImgBB Upload)
              </label>
              <label className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-outline-variant/60 bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors text-center">
                <Upload className="w-7 h-7 text-primary mb-2" />
                <span className="text-sm font-semibold text-on-surface">
                  {imageFile ? imageFile.name : "Choose an image file"}
                </span>
                <span className="text-xs text-on-surface-variant mt-1">
                  PNG, JPG, or WebP
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="mt-3 relative aspect-video max-w-sm rounded-xl overflow-hidden border border-outline-variant/40">
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary text-sm font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Wrench className="w-4 h-4" />
              <span>{submitting ? "Publishing..." : "Submit Service"}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardShell>
  );
}
