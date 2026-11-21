import { Wrench } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface gap-3">
      <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center animate-pulse shadow-sm">
        <Wrench className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-on-surface-variant">
        Loading FixMate...
      </p>
    </div>
  );
}
