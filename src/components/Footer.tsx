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

              {/* Social Links with new X logo */}
              <div className="flex items-center gap-2.5 pt-2">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="FixMate on X"
                  className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="FixMate on GitHub"
                  className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface-variant flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-4 h-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
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
