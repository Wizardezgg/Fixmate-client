import Link from "next/link";

interface FixMateLogoProps {
  href?: string;
}

export function FixMateLogo({ href = "/" }: FixMateLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 group shrink-0">
      <svg
        viewBox="0 0 40 40"
        className="w-9 h-9 rounded-lg transition-transform group-hover:scale-105 shadow-sm shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="10" fill="#0F172A" />
        {/* Teal wrench-checkmark */}
        <path
          d="M12.2 14.3a4.6 4.6 0 0 0 1.4 5.7l4.6 4.6a1.5 1.5 0 0 0 2.1 0l10.2-10.2a1.4 1.4 0 0 0-2-2l-9.2 9.1-3.6-3.6a4.6 4.6 0 0 0-1.1-5.1 4.4 4.4 0 0 0-5.4-.3l2.6 2.6-1.4 1.4-2.6-2.6a4.5 4.5 0 0 0 .4.4Z"
          fill="#14B8A6"
        />
        {/* Amber 4-point spark */}
        <path
          d="M21 9.5 L22.1 12.4 L25 13.5 L22.1 14.6 L21 17.5 L19.9 14.6 L17 13.5 L19.9 12.4 Z"
          fill="#F59E0B"
        />
      </svg>
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-xl font-bold tracking-tight text-on-surface">
          FixMate
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
      </div>
    </Link>
  );
}
