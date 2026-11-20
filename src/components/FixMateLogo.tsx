import Link from "next/link";
import { Wrench } from "lucide-react";

interface FixMateLogoProps {
  href?: string;
}

export function FixMateLogo({ href = "/" }: FixMateLogoProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 group shrink-0">
      <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container transition-transform group-hover:scale-105 shadow-sm">
        <Wrench className="w-[18px] h-[18px]" strokeWidth={2.2} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-xl font-bold tracking-tight text-on-surface">
          FixMate
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
      </div>
    </Link>
  );
}
