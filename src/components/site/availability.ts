import type { Availability } from "@/lib/types";

export const AVAILABILITY: Record<Availability, { label: string; dot: string }> = {
  "in-stock": { label: "In Stock", dot: "bg-success" },
  "low-stock": { label: "Few Left", dot: "bg-warning" },
  "out-of-stock": { label: "Sold Out", dot: "bg-destructive" },
  "coming-soon": { label: "Coming Soon", dot: "bg-sage" },
};
