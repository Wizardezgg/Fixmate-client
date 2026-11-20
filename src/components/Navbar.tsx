"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  UserCog,
  X,
} from "lucide-react";
import { FixMateLogo } from "@/components/FixMateLogo";
import { useTheme } from "@/components/ThemeProvider";
import { clearCachedApiToken } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import { UserRole } from "@/types";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/about", label: "How It Works" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { data: session, isPending } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: UserRole }
    | undefined;
  const userRole: UserRole = user?.role || "customer";

  const handleSignOut = async () => {
    try {
      clearCachedApiToken();
      await signOut();
      setDropdownOpen(false);
      setMobileOpen(false);
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40">
      <div className="h-16 max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <FixMateLogo />
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? "text-primary font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/services"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container px-3 py-2 rounded-lg transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find a service</span>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {!isPending && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 transition-colors cursor-pointer"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden md:inline text-xs font-semibold text-on-surface max-w-[110px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-60 rounded-xl bg-surface-container-lowest border border-outline-variant/50 shadow-xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-outline-variant/40">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {user.email}
                      </p>
                      <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary">
                        {userRole}
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/${userRole}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <UserCog className="w-4 h-4 text-primary" />
                      <span>Update Profile</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-container text-on-primary transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container-low cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-outline-variant/40 bg-surface-container-lowest px-4 py-4 space-y-3">
          {NAV_LINKS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 px-3 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {!isPending && !user && (
            <div className="pt-2 border-t border-outline-variant/40 flex flex-col gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center rounded-lg border border-outline-variant/60 text-sm font-semibold text-on-surface"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 text-center rounded-lg bg-primary text-on-primary text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}

          {!isPending && user && (
            <div className="pt-2 border-t border-outline-variant/40 space-y-1">
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface-variant">
                <User className="w-4 h-4 text-primary" />
                <span>
                  {user.name} ({userRole})
                </span>
              </div>
              <Link
                href={`/dashboard/${userRole}`}
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container-low"
              >
                Update Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-error hover:bg-error-container/30 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
