"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";
import { PublicShell } from "@/components/PublicShell";
import { ServiceCard } from "@/components/ServiceCard";
import { apiRequest } from "@/lib/api";
import { PaginationMeta, ServiceCategory, ServiceItem } from "@/types";

const CATEGORIES: ("All" | ServiceCategory)[] = [
  "All",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const SERVICE_MODES = ["All", "Home Visit", "Shop Drop-off"] as const;

function BrowseServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "All";
  const urlMode = searchParams.get("serviceMode") || "All";
  const urlSort = searchParams.get("sort") || "newest";
  const urlPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(urlSearch);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const updateUrlParams = useCallback(
    (updates: Record<string, string | number>) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, val]) => {
        const str = String(val).trim();
        if (!str || str === "All" || (key === "page" && str === "1")) {
          next.delete(key);
        } else {
          next.set(key, str);
        }
      });
      const qs = next.toString();
      router.replace(qs ? `/services?${qs}` : "/services", { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    let active = true;
    setLoading(true);

    const params = new URLSearchParams();
    if (urlSearch) params.set("search", urlSearch);
    if (urlCategory && urlCategory !== "All") params.set("category", urlCategory);
    if (urlMode && urlMode !== "All") params.set("serviceMode", urlMode);
    if (urlSort) params.set("sort", urlSort);
    params.set("page", String(urlPage));
    params.set("limit", "9");

    apiRequest<{
      success: boolean;
      data: ServiceItem[];
      pagination: PaginationMeta;
    }>(`/api/services?${params.toString()}`)
      .then((res) => {
        if (!active) return;
        setServices(res.data || []);
        if (res.pagination) setPagination(res.pagination);
      })
      .catch(() => {
        if (active) setServices([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [urlSearch, urlCategory, urlMode, urlSort, urlPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput, page: 1 });
  };

  const resetFilters = () => {
    setSearchInput("");
    router.replace("/services", { scroll: false });
  };

  const hasActiveFilters =
    Boolean(urlSearch) ||
    urlCategory !== "All" ||
    urlMode !== "All" ||
    urlSort !== "newest";

  return (
    <PublicShell>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin-Approved Repair Services</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
              Browse Repair Services
            </h1>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1">
              Search by device or category, compare starting prices, and pay
              only after completion.
            </p>
          </div>
          <div className="text-sm text-on-surface-variant">
            Showing{" "}
            <strong className="text-on-surface">{pagination.total}</strong>{" "}
            available services
          </div>
        </div>

        {/* Server-Side Filter & Search Bar */}
        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-3"
          >
            {/* Search */}
            <div className="lg:col-span-5 relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-on-surface-variant pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, category, or area..."
                className="w-full h-11 pl-10 pr-24 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="absolute right-1.5 h-8 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold cursor-pointer transition-colors"
              >
                Search
              </button>
            </div>

            {/* Category */}
            <div className="lg:col-span-3">
              <select
                value={urlCategory}
                onChange={(e) =>
                  updateUrlParams({ category: e.target.value, page: 1 })
                }
                aria-label="Filter by category"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none cursor-pointer focus:border-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Mode */}
            <div className="lg:col-span-2">
              <select
                value={urlMode}
                onChange={(e) =>
                  updateUrlParams({ serviceMode: e.target.value, page: 1 })
                }
                aria-label="Filter by service mode"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none cursor-pointer focus:border-primary"
              >
                {SERVICE_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode === "All" ? "All Modes" : mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:col-span-2">
              <select
                value={urlSort}
                onChange={(e) =>
                  updateUrlParams({ sort: e.target.value, page: 1 })
                }
                aria-label="Sort services"
                className="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none cursor-pointer focus:border-primary"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </form>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/30 text-xs">
              <div className="flex flex-wrap items-center gap-2 text-on-surface-variant">
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                <span>Active filters:</span>
                {urlSearch && (
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-medium">
                    &ldquo;{urlSearch}&rdquo;
                  </span>
                )}
                {urlCategory !== "All" && (
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-medium">
                    {urlCategory}
                  </span>
                )}
                {urlMode !== "All" && (
                  <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-medium">
                    {urlMode}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-primary font-semibold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[370px] rounded-2xl bg-surface-container-lowest border border-outline-variant/30 animate-pulse"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-12 text-center">
            <Wrench className="w-10 h-10 text-primary mx-auto mb-3 opacity-80" />
            <h2 className="font-heading text-xl font-bold text-on-surface">
              No matching services found
            </h2>
            <p className="text-sm text-on-surface-variant mt-1 mb-5">
              Try clearing your filters or searching with a different keyword.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* Server-Side Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl">
            <span className="text-xs sm:text-sm text-on-surface-variant">
              Page <strong className="text-on-surface">{pagination.page}</strong>{" "}
              of{" "}
              <strong className="text-on-surface">{pagination.totalPages}</strong>
            </span>

            <nav aria-label="Pagination" className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() => updateUrlParams({ page: pagination.page - 1 })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {Array.from({ length: pagination.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const active = pageNum === pagination.page;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => updateUrlParams({ page: pageNum })}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      active
                        ? "bg-primary text-on-primary"
                        : "text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => updateUrlParams({ page: pagination.page + 1 })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </PublicShell>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface text-sm text-on-surface-variant">
          Loading services...
        </div>
      }
    >
      <BrowseServicesContent />
    </Suspense>
  );
}
