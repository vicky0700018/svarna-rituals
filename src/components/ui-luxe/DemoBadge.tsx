import { cn } from "@/lib/utils";

export function DemoBadge({ className, label = "Illustrative" }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-gold/50 bg-card/85 px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.2em] text-forest backdrop-blur", className)}>
      {label}
    </span>
  );
}
