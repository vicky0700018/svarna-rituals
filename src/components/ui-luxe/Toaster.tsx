import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[100] flex w-[min(92vw,26rem)] -translate-x-1/2 flex-col gap-2" aria-live="polite">
      {toasts.map((t) => {
        const Icon = t.type === "error" ? XCircle : t.type === "info" ? Info : CheckCircle2;
        return (
          <div key={t.id} className={cn("pointer-events-auto flex items-start gap-3 rounded-2xl border bg-card px-4 py-3 text-sm shadow-lift animate-pop-in", t.type === "error" && "border-destructive/40")}>
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", t.type === "error" ? "text-destructive" : "text-gold")} />
            <p className="flex-1 text-foreground">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-muted-foreground hover:text-forest">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
