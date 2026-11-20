"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  Lock,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  Store,
  User,
  Wrench,
} from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { apiRequest } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { ServiceItem, UserRole } from "@/types";

export default function ServiceDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const user = session?.user as
    | { name?: string; email?: string; role?: UserRole }
    | undefined;
  const userRole: UserRole | undefined = user?.role;

  useEffect(() => {
    if (!params?.id) return;
    let active = true;
    setLoading(true);

    apiRequest<{ success: boolean; data: ServiceItem }>(
      `/api/services/${params.id}`
    )
      .then((res) => {
        if (!active) return;
        setService(res.data);
        setNotFoundState(false);
      })
      .catch(() => {
        if (!active) return;
        setNotFoundState(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params?.id]);

  const handleRequestClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=/services/${params.id}`);
      return;
    }
    if (userRole !== "customer") {
      toast.error("Only customers can request a repair.");
      return;
    }
    setShowRequestForm(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    if (!customerPhone.trim() || !address.trim() || !preferredDate) {
      toast.error("Please fill in phone, address, and preferred date.");
      return;
    }
    if (problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/bookings", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: customerPhone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      toast.success("Repair request submitted!");
      setBookingSuccess(true);
      setShowRequestForm(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit repair request.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PublicShell>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
          <div className="h-96 rounded-2xl bg-surface-container-low animate-pulse" />
        </div>
      </PublicShell>
    );
  }

  if (notFoundState || !service) {
    return (
      <PublicShell>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-container text-primary flex items-center justify-center mx-auto">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-on-surface">
            Service Not Found
          </h1>
          <p className="text-sm text-on-surface-variant">
            This repair service does not exist or is currently unavailable.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse Services</span>
          </Link>
        </div>
      </PublicShell>
    );
  }

  const isHomeVisit = service.serviceMode === "Home Visit";

  return (
    <PublicShell>
      {/* Breadcrumb Bar */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/30 py-3">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
          <nav className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/services"
              className="hover:text-primary transition-colors"
            >
              Browse Services
            </Link>
            <span>/</span>
            <Link
              href={`/services?category=${encodeURIComponent(service.category)}`}
              className="hover:text-primary transition-colors"
            >
              {service.category}
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold truncate max-w-xs">
              {service.title}
            </span>
          </nav>
          <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Pay Only After Completion
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 shadow-sm">
              <div className="aspect-video w-full">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface text-xs font-semibold">
                    {service.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-semibold">
                    {isHomeVisit ? (
                      <Home className="w-3.5 h-3.5" />
                    ) : (
                      <Store className="w-3.5 h-3.5" />
                    )}
                    {service.serviceMode}
                  </span>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white max-w-xl leading-tight">
                    {service.title}
                  </h1>
                  <div className="rounded-xl bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2.5 text-right shadow-md">
                    <span className="text-[11px] text-on-surface-variant block">
                      Starting Price
                    </span>
                    <span className="font-heading text-2xl font-bold text-primary">
                      ${service.basePrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Spec Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] uppercase text-on-surface-variant block">
                    Duration
                  </span>
                  <span className="text-sm font-semibold text-on-surface truncate block">
                    {service.estimatedDuration}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-xl flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] uppercase text-on-surface-variant block">
                    Service Area
                  </span>
                  <span className="text-sm font-semibold text-on-surface truncate block">
                    {service.serviceArea}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-xl flex items-center gap-3">
                {isHomeVisit ? (
                  <Home className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Store className="w-5 h-5 text-primary shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-[11px] uppercase text-on-surface-variant block">
                    Mode
                  </span>
                  <span className="text-sm font-semibold text-on-surface truncate block">
                    {service.serviceMode}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant/40 p-4 rounded-xl flex items-center gap-3">
                <Star className="w-5 h-5 text-secondary-container fill-secondary-container shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] uppercase text-on-surface-variant block">
                    Rating
                  </span>
                  <span className="text-sm font-semibold text-on-surface truncate block">
                    {service.reviewCount && service.reviewCount > 0
                      ? `${service.averageRating} (${service.reviewCount})`
                      : "New Service"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 space-y-3">
              <h2 className="font-heading text-lg font-bold text-on-surface">
                What This Service Includes
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Customer Reviews */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold text-on-surface">
                  Customer Reviews
                </h2>
                <span className="text-xs font-semibold text-on-surface-variant">
                  {service.reviews?.length || 0} verified review(s)
                </span>
              </div>

              {!service.reviews || service.reviews.length === 0 ? (
                <p className="text-sm text-on-surface-variant">
                  No customer reviews yet for this service.
                </p>
              ) : (
                <div className="space-y-3">
                  {service.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-surface-container-low space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-on-surface">
                          {rev.customerName}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: rev.rating }).map((_, s) => (
                            <Star
                              key={s}
                              className="w-3.5 h-3.5 fill-secondary-container text-secondary-container"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-on-surface-variant">
                        {rev.review}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT STICKY COLUMN (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* Technician Summary Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                {service.technician?.image ? (
                  <img
                    src={service.technician.image}
                    alt={service.technician.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-primary text-on-primary flex items-center justify-center font-heading text-xl font-bold shrink-0">
                    {service.technicianName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[11px] uppercase font-semibold text-primary block">
                    Verified Technician
                  </span>
                  <h3 className="font-heading text-base font-bold text-on-surface truncate">
                    {service.technician?.name || service.technicianName}
                  </h3>
                  <p className="text-xs text-on-surface-variant truncate">
                    {service.technician?.area || service.serviceArea}
                  </p>
                </div>
              </div>

              {service.technician?.bio && (
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-3">
                  {service.technician.bio}
                </p>
              )}
            </div>

            {/* Repair Request Box */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold text-on-surface">
                  Book This Service
                </h3>
                <span className="font-heading text-xl font-bold text-primary">
                  ${service.basePrice}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex items-start gap-2.5 text-xs text-on-surface-variant">
                <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong className="text-on-surface">
                    Zero Upfront Payment.
                  </strong>{" "}
                  You pay online only after the technician completes the repair.
                </span>
              </div>

              {bookingSuccess ? (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 space-y-3 text-center">
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h4 className="font-heading text-sm font-bold text-on-surface">
                      Request Submitted!
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Track your job status in My Bookings.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/customer/bookings"
                    className="block w-full py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors"
                  >
                    Go to My Bookings
                  </Link>
                </div>
              ) : !sessionLoading &&
                user &&
                userRole !== "customer" ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled
                    className="w-full h-11 rounded-xl bg-surface-container text-on-surface-variant text-sm font-semibold opacity-60 cursor-not-allowed"
                  >
                    Request Repair
                  </button>
                  <p className="text-xs text-center text-error font-medium">
                    Only customers can request a repair.
                  </p>
                </div>
              ) : !showRequestForm ? (
                <button
                  type="button"
                  onClick={handleRequestClick}
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors shadow-sm cursor-pointer"
                >
                  Request Repair
                </button>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface block">
                      Customer Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 absolute left-3 text-on-surface-variant" />
                      <input
                        type="text"
                        readOnly
                        value={user?.name || ""}
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container text-xs text-on-surface-variant cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-on-surface block">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={user?.email || ""}
                      className="w-full h-10 px-3 rounded-lg bg-surface-container text-xs text-on-surface-variant cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="req-phone"
                      className="text-xs font-semibold text-on-surface block"
                    >
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 absolute left-3 text-on-surface-variant" />
                      <input
                        id="req-phone"
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+880 17..."
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="req-address"
                      className="text-xs font-semibold text-on-surface block"
                    >
                      Service / Pickup Address
                    </label>
                    <input
                      id="req-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House, Road, Area"
                      className="w-full h-10 px-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="req-date"
                      className="text-xs font-semibold text-on-surface block"
                    >
                      Preferred Date
                    </label>
                    <div className="relative flex items-center">
                      <Calendar className="w-4 h-4 absolute left-3 text-on-surface-variant pointer-events-none" />
                      <input
                        id="req-date"
                        type="date"
                        required
                        min={todayStr}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="req-problem"
                        className="text-xs font-semibold text-on-surface"
                      >
                        Problem Description
                      </label>
                      <span className="text-[11px] text-on-surface-variant">
                        {problemDescription.trim().length}/20 min
                      </span>
                    </div>
                    <textarea
                      id="req-problem"
                      rows={3}
                      required
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      placeholder="Describe the issue with your device (minimum 20 characters)..."
                      className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant/50 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      className="px-4 h-10 rounded-xl border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 h-10 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-60 text-on-primary text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
