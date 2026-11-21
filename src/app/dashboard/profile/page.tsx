"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Save, Upload } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { apiRequest, uploadImageToImgBB } from "@/lib/api";
import { authClient, useSession } from "@/lib/auth-client";
import { UserProfile } from "@/types";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest<{ success: boolean; data: UserProfile }>("/api/users/profile", {
      auth: true,
    })
      .then((res) => {
        if (!active || !res.data) return;
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
        setArea(res.data.area || "");
        setBio(res.data.bio || "");
        setEmail(res.data.email || "");
        setRole(res.data.role || "customer");
        setImage(res.data.image || "");
      })
      .catch(() => {
        if (!active || !session?.user) return;
        const u = session.user as {
          name?: string;
          email?: string;
          role?: string;
          image?: string | null;
        };
        setName(u.name || "");
        setEmail(u.email || "");
        setRole(u.role || "customer");
        setImage(u.image || "");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session?.user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSaving(true);
    try {
      let finalImage = image;
      if (imageFile) {
        finalImage = await uploadImageToImgBB(imageFile);
      }

      await apiRequest("/api/users/profile", {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          bio: bio.trim(),
          ...(finalImage ? { image: finalImage } : {}),
        }),
      });

      // Refresh BetterAuth user session so Navbar & Top Bar update immediately
      await authClient.updateUser({
        name: name.trim(),
        ...(finalImage ? { image: finalImage } : {}),
      });

      toast.success("Profile updated successfully!");
      setImageFile(null);
      router.refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-on-surface">
            Update Profile
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Keep your contact information, service area, and profile photo up to
            date.
          </p>
        </div>

        {loading ? (
          <div className="h-72 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 animate-pulse" />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            {/* Avatar Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {image ? (
                <img
                  src={image}
                  alt={name || "Profile"}
                  className="w-20 h-20 rounded-2xl object-cover border border-outline-variant/40 shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-heading text-2xl font-bold shrink-0">
                  {(name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-primary" />
                  <span>Upload New Photo (ImgBB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-on-surface-variant">
                  PNG, JPG, or WebP. Updates your avatar across FixMate.
                </p>
              </div>
            </div>

            {/* Read-Only Email & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-container-low">
              <div>
                <span className="text-[11px] font-semibold uppercase text-on-surface-variant flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Email
                </span>
                <p className="text-sm font-semibold text-on-surface mt-0.5">
                  {email}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase text-on-surface-variant flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Role
                </span>
                <p className="text-sm font-semibold text-primary capitalize mt-0.5">
                  {role}
                </p>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="prof-name"
                  className="text-xs font-semibold text-on-surface block"
                >
                  Full Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="prof-phone"
                  className="text-xs font-semibold text-on-surface block"
                >
                  Phone Number
                </label>
                <input
                  id="prof-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 17..."
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label
                  htmlFor="prof-area"
                  className="text-xs font-semibold text-on-surface block"
                >
                  City / Area
                </label>
                <input
                  id="prof-area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g., Mirpur, Dhaka"
                  className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label
                  htmlFor="prof-bio"
                  className="text-xs font-semibold text-on-surface block"
                >
                  Bio / Experience
                </label>
                <textarea
                  id="prof-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell customers about your repair skills and experience..."
                  className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Profile"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardShell>
  );
}
