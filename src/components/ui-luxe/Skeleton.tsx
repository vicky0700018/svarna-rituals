import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("rounded-2xl bg-secondary animate-shimmer", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[4/5]" />
      <Skeleton className="mt-5 h-3 w-20" />
      <Skeleton className="mt-3 h-6 w-3/4" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-6 h-9 w-full rounded-full" />
    </div>
  );
}
