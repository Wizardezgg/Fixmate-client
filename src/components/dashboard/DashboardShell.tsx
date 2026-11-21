"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarCheck,
  CheckSquare,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Receipt,
  ShieldCheck,
  Sun,
  UserCog,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { FixMateLogo } from "@/components/FixMateLogo";
import { useTheme } from "@/components/ThemeProvider";
import { clearCachedApiToken } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ROLE_NAV: Record<UserRole, NavItem[]> = {
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/customer/bookings",
      label: "My Bookings",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/customer/payments",
      label: "Payment History",
      icon: CreditCard,
    },
  ],
  technician: [
    { href: "/dashboard/technician", label: "Overview", icon: LayoutDashboard },
    {
      href: "/dashboard/technician/add-service",
      label: "Add a Service",
      icon: PlusCircle,
    },
    {
      href: "/dashboard/technician/my-services",
      label: "My Services",
      icon: Wrench,
    },
    {
      href: "/dashboard/technician/requests",
      label: "Manage Requests",
      icon: ClipboardList,
    },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    {
      href: "/dashboard/admin/services",
      label: "Service Approval",
      icon: CheckSquare,
    },
    {
      href: "/dashboard/admin/bookings",
      label: "All Bookings",
      icon: CalendarCheck,
    },
    {
      href: "/dashboard/admin/transactions",
      label: "Transactions",
      icon: Receipt,
    },
  ],
};

interface DashboardShellProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function DashboardShell({
  children,
  allowedRoles,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { data: session, isPending } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: UserRole }
    | undefined;
  const userRole: UserRole = user?.role || "customer";

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      router.replace(`/dashboard/${userRole}`);
    }
  }, [isPending, user, userRole, allowedRoles, pathname, router]);

  if (isPending || !user || (allowedRoles && !allowedRoles.includes(userRole))) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-3">
        <div className="w-11 h-11 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center animate-pulse">
          <Wrench className="w-5 h-5 animate-spin" />
        </div>
        <p className="text-sm font-medium text-on-surface-variant">
          Verifying workspace session...
        </p>
      </div>
    );
  }

  const navItems = ROLE_NAV[userRole] || ROLE_NAV.customer;

  const handleSignOut = async () => {
    clearCachedApiToken();
    await signOut();
    toast.success("Signed out successfully.");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 w-64 bg-surface-container-lowest border-r border-outline-variant/40 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-outline-variant/30">
            <FixMateLogo />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-4 pt-5 pb-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Workspace
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">
                {userRole}
              </span>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/dashboard/profile"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/dashboard/profile"
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <UserCog className="w-4 h-4 shrink-0" />
                <span>Update Profile</span>
              </Link>
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant/30 space-y-1 bg-surface-container-low/50">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-error hover:bg-error-container/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/40 px-4 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
              <span>FixMate</span>
              <span>/</span>
              <span className="text-on-surface font-semibold capitalize">
                {userRole} Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            <div className="h-5 w-px bg-outline-variant/50" />

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity"
            >
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-on-surface leading-tight">
                  {user.name}
                </span>
                <span className="text-[11px] text-primary font-medium capitalize leading-tight inline-flex items-center justify-end gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {userRole}
                </span>
              </div>
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Avatar"}
                  className="w-9 h-9 rounded-full object-cover border border-outline-variant/40"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
