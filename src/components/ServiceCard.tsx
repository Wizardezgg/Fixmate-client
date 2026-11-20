import Link from "next/link";
import { Home, MapPin, Star, Store, Wrench } from "lucide-react";
import { ServiceItem } from "@/types";

export function ServiceCard({ service }: { service: ServiceItem }) {
  const isHomeVisit = service.serviceMode === "Home Visit";

  return (
    <article className="h-full flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/40 shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Uniform 16:9 Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-surface-container shrink-0">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md text-on-surface text-xs font-semibold">
            {service.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
              isHomeVisit
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-on-surface"
            }`}
          >
            {isHomeVisit ? (
              <Home className="w-3.5 h-3.5" />
            ) : (
              <Store className="w-3.5 h-3.5" />
            )}
            <span>{service.serviceMode}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{service.serviceArea}</span>
            </span>
            {service.reviewCount && service.reviewCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-on-surface font-semibold shrink-0">
                <Star className="w-3.5 h-3.5 fill-secondary-container text-secondary-container" />
                {service.averageRating} ({service.reviewCount})
              </span>
            ) : (
              <span className="text-xs text-on-surface-variant shrink-0">
                {service.estimatedDuration}
              </span>
            )}
          </div>

          <h3 className="font-heading text-base font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 min-h-[2.75rem]">
            {service.title}
          </h3>
        </div>

        {/* Technician Row */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-surface-container-low">
          <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-on-surface truncate">
            {service.technicianName}
          </span>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-on-surface-variant block">
              Starting at
            </span>
            <span className="font-heading text-xl font-bold text-on-surface">
              ${service.basePrice}
            </span>
          </div>
          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
