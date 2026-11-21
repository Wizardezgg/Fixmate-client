import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { FixMateLogo } from "@/components/FixMateLogo";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <FixMateLogo />
            <p className="text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Verified Technicians. Transparent Job Tracking. Pay online only
              after your repair is completed.
            </p>
            <div className="inline-flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 max-w-sm">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">
                  Pay-After-Service Protection
                </span>
                <span className="text-xs text-on-surface-variant">
                  Zero upfront fees on every repair booking
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-on-surface mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  Browse Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-on-surface-variant hover:text-primary transition-colors"
                >
                  Become a Technician
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-on-surface mb-4">
              Popular Categories
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[
                "Smartphone",
                "Laptop & PC",
                "AC",
                "Refrigerator",
                "TV",
                "Washing Machine",
                "Electrical",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/services?category=${encodeURIComponent(cat)}`}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-on-surface mb-4">
              Contact Us
            </h3>
            <div className="flex flex-col gap-3 text-sm text-on-surface-variant">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>support@fixmate.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="FixMate on Facebook"
                  className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="FixMate on Instagram"
                  className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4 fill-none stroke-current"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <p>© 2026 FixMate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-on-surface transition-colors">
              How It Works
            </Link>
            <Link href="/services" className="hover:text-on-surface transition-colors">
              Services
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
